import os
import subprocess
import json
import time
import re
import pytest
from xprocess import ProcessStarter

PROJECT_DIR = "/home/user/trigger-sync"

@pytest.fixture(scope="session")
def start_trigger_dev(xprocess):
    """
    Starts the `npx trigger.dev@latest dev` service using xprocess. 
    """
    # Create the Trigger.dev config file
    cmd = 'mkdir -p ~/.config/trigger && printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json && chmod 600 ~/.config/trigger/config.json && npx trigger.dev@latest whoami'
    subprocess.run(
        cmd,
        shell=True,
        check=False,
        text=True,
        capture_output=True,
        executable="/bin/bash"
    )

    class Starter(ProcessStarter):
        name = "start_trigger_dev"
        args = ["npx", "trigger.dev@latest", "dev", "--skip-update-check", "--skip-telemetry"]
        env = os.environ.copy()
        popen_kwargs = {
            "cwd": PROJECT_DIR,
            "text": True,
        }
        pattern = "Local worker ready"
        max_read_lines = 1000
        timeout = 180
        terminate_on_interrupt = True

    xprocess.ensure(Starter.name, Starter)
    yield
    info = xprocess.getinfo(Starter.name)
    info.terminate()

def test_scheduled_sync_execution(start_trigger_dev):
    # Trigger the task manually
    result = subprocess.run(
        ["npm", "run", "run-task"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"npm run run-task failed: {result.stderr}"
    
    # Find run id in result.stdout
    run_id_match = re.search(r"Run ID: ([a-zA-Z0-9_]+)", result.stdout)
    assert run_id_match, f"Run ID not found in the trigger result: {result.stdout}"
    run_id = run_id_match.group(1)

    # Check run result via API
    trigger_secret_key = os.environ.get("TRIGGER_SECRET_KEY")
    for _ in range(20):
        run_result = subprocess.run(
            ["curl", "-s", "-H", f"Authorization: Bearer {trigger_secret_key}", f"https://api.trigger.dev/api/v3/runs/{run_id}"],
            capture_output=True,
            text=True
        )
        assert run_result.returncode == 0
        run_result_json = json.loads(run_result.stdout)
        assert "status" in run_result_json, "Run status is missing"
        run_status = run_result_json["status"]
        
        if run_status == "COMPLETED":
            # Verify output - jsonplaceholder todos count is 200
            output = run_result_json.get("output")
            # The task should return the count of items
            assert output is not None, "Run output is empty"
            # Flexible check for count or message containing 200
            output_str = json.dumps(output)
            assert "200" in output_str, f"Expected count 200 in output, got: {output_str}"
            break
        elif run_status in ["FAILED", "CRASHED", "CANCELED", "EXPIRED", "TIMED_OUT", "SYSTEM_FAILURE"]:
            assert False, f"Run failed with status: {run_status}. Error: {run_result_json.get('error')}"
            break
        else:
            time.sleep(5)
    else:
        assert False, "Run did not complete after 100 seconds"
