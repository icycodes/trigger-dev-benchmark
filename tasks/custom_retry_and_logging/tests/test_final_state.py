import os
import subprocess
import json
import re
import time
import pytest
from xprocess import ProcessStarter

PROJECT_DIR = "/home/user/trigger-retry-lab"

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
        # Trigger.dev prints the message "Local worker ready" when initialization is done.
        pattern = "Local worker ready"
        max_read_lines = 2000
        timeout = 300
        terminate_on_interrupt = True

    xprocess.ensure(Starter.name, Starter)

    yield

    # --- TEARDOWN ---
    info = xprocess.getinfo(Starter.name)
    info.terminate()

def test_trigger_dev_retry_and_logging(start_trigger_dev):
    # Trigger the task 
    result = subprocess.run(
      ["npm", "run", "run-task"],
      cwd=PROJECT_DIR,
      capture_output=True,
      text=True
    )
    assert result.returncode == 0, f"Failed to trigger task: {result.stderr}"

    # Find run id in result.stdout
    run_id_match = re.search(r"Run ID: ([a-zA-Z0-9_]+)", result.stdout)
    assert run_id_match, f"Run ID not found in the trigger result, stdout: {result.stdout}"
    run_id = run_id_match.group(1)

    trigger_secret_key = os.environ.get("TRIGGER_SECRET_KEY")
    
    # Poll for completion
    max_checks = 30
    check_interval = 10
    
    for i in range(max_checks):
        run_result = subprocess.run(
          ["curl", "-s", "-H", f"Authorization: Bearer {trigger_secret_key}", f"https://api.trigger.dev/api/v3/runs/{run_id}"],
          capture_output=True,
          text=True
        )
        assert run_result.returncode == 0, f"Retrieve run result failed with code {run_result.returncode}"
        
        try:
            run_result_json = json.loads(run_result.stdout)
        except json.JSONDecodeError:
            pytest.fail(f"Failed to parse API response: {run_result.stdout}")
            
        assert "status" in run_result_json, f"Run status is missing in {run_result_json}"
        run_status = run_result_json["status"]
        
        if run_status == "COMPLETED":
            output = run_result_json.get("output")
            assert output is not None, "Run completed but output is missing"
            assert output.get("status") == "success", f"Expected status 'success', got {output.get('status')}"
            assert output.get("userId") == "user_123", f"Expected userId 'user_123', got {output.get('userId')}"
            assert output.get("attempt") == 3, f"Expected task to succeed on attempt 3, but got attempt {output.get('attempt')}"
            return
        elif run_status in ["FAILED", "CRASHED", "CANCELED", "EXPIRED", "TIMED_OUT", "SYSTEM_FAILURE"]:
            pytest.fail(f"Run failed with status: {run_status}. Response: {run_result.stdout}")
        
        time.sleep(check_interval)
    
    pytest.fail(f"Run did not complete within timeout. Last status: {run_status}")
