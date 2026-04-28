import pytest
import subprocess
import os
import re
import json
import time
from xprocess import ProcessStarter

PROJECT_DIR = "/home/user/approval-workflow"

@pytest.fixture(scope="session")
def start_trigger_dev(xprocess):
    """
    Starts the `npx trigger.dev@latest dev` service using xprocess. 
    """
    # Create the Trigger.dev config file before executing the first `npx trigger.dev` command
    cmd = 'mkdir -p ~/.config/trigger && printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json && chmod 600 ~/.config/trigger/config.json && npx trigger.dev@latest whoami'
    subprocess.run(
        cmd,
        shell=True,
        check=False,
        text=True,
        capture_output=True,
        executable="/bin/bash"
    )
    # Kill process if it's already running
    subprocess.run(["pkill", "-f", "npx trigger.dev"], check=False)

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

def test_human_approval_workflow(start_trigger_dev):
    # 1. Trigger the task
    result = subprocess.run(
        ["npm", "run", "run-task"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"npm run run-task failed: {result.stderr}"

    # Find run id in result.stdout
    run_id_match = re.search(r"Run ID: ([a-zA-Z0-9_]+)", result.stdout)
    assert run_id_match, f"Run ID not found in the trigger result, stdout: {result.stdout}"
    run_id = run_id_match.group(1)

    # 2. Wait for approval_url.txt
    approval_url_path = os.path.join(PROJECT_DIR, "approval_url.txt")
    for _ in range(30):
        if os.path.exists(approval_url_path):
            break
        time.sleep(2)
    else:
        pytest.fail("approval_url.txt was not created in time")

    with open(approval_url_path, "r") as f:
        approval_url = f.read().strip()

    # 3. Complete the waitpoint
    # The URL from wait.createToken().url can be POSTed to directly
    complete_result = subprocess.run(
        ["curl", "-X", "POST", "-H", "Content-Type: application/json", "-d", '{"approved": true}', approval_url],
        capture_output=True,
        text=True
    )
    assert complete_result.returncode == 0, f"Failed to complete waitpoint: {complete_result.stderr}"

    # 4. Verify run output
    trigger_secret_key = os.environ.get("TRIGGER_SECRET_KEY")
    for _ in range(12):
        run_result = subprocess.run(
            ["curl", "-s", "-H", f"Authorization: Bearer {trigger_secret_key}", f"https://api.trigger.dev/api/v3/runs/{run_id}"],
            capture_output=True,
            text=True
        )
        assert run_result.returncode == 0, f"Retrieve run result failed: {run_result.stderr}"
        run_result_json = json.loads(run_result.stdout)
        run_status = run_result_json.get("status")

        if run_status == "COMPLETED":
            output = run_result_json.get("output")
            assert output == {"status": "deployed", "version": "v1.0.0"}, f"Unexpected output: {output}"
            break
        elif run_status in ["FAILED", "CRASHED", "CANCELED", "EXPIRED", "TIMED_OUT", "SYSTEM_FAILURE"]:
            pytest.fail(f"Run failed with status: {run_status}")
        else:
            time.sleep(5)
    else:
        pytest.fail("Run did not complete after polling")
