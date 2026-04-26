import os
import subprocess
import json
import re
import time
import pytest
from xprocess import ProcessStarter

PROJECT_DIR = "/home/user/ai-approval-task"

@pytest.fixture(scope="session")
def start_trigger_dev(xprocess):
    """Starts the `npx trigger.dev@latest dev` service using xprocess."""
    # Setup CLI credentials
    cmd = 'mkdir -p ~/.config/trigger && printf "%s" "$TRIGGER_CREDENTIAL_CONFIG_JSON" > ~/.config/trigger/config.json && chmod 600 ~/.config/trigger/config.json && npx trigger.dev@latest whoami'
    subprocess.run(cmd, shell=True, check=False, text=True, capture_output=True, executable="/bin/bash")
    
    # Ensure no existing processes
    subprocess.run(["pkill", "-f", "npx trigger.dev"], check=False)

    class Starter(ProcessStarter):
        name = "start_trigger_dev"
        args = ["npx", "trigger.dev@latest", "dev", "--skip-update-check", "--skip-telemetry"]
        env = os.environ.copy()
        popen_kwargs = {"cwd": PROJECT_DIR, "text": True}
        pattern = "Local worker ready"
        timeout = 180
        terminate_on_interrupt = True

    xprocess.ensure(Starter.name, Starter)
    yield
    info = xprocess.getinfo(Starter.name)
    info.terminate()

def test_ai_approval_workflow(start_trigger_dev):
    # 1. Trigger the task
    trigger_result = subprocess.run(
        ["npm", "run", "trigger-task"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert trigger_result.returncode == 0, f"Triggering task failed: {trigger_result.stderr}"
    
    # Extract Run ID and Token
    run_id_match = re.search(r"Run ID: ([a-zA-Z0-9_]+)", trigger_result.stdout)
    token_match = re.search(r"Token: ([a-zA-Z0-9_]+)", trigger_result.stdout)
    
    assert run_id_match, f"Run ID not found in output: {trigger_result.stdout}"
    assert token_match, f"Token not found in output: {trigger_result.stdout}"
    
    run_id = run_id_match.group(1)
    token = token_match.group(1)
    
    trigger_secret_key = os.environ.get("TRIGGER_SECRET_KEY")
    
    # 2. Check that the run is executing and eventually paused
    # We'll wait a bit for it to reach the waitpoint
    time.sleep(10)
    
    # 3. Approve the task
    approve_result = subprocess.run(
        ["npm", "run", "approve-task", token],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert approve_result.returncode == 0, f"Approving task failed: {approve_result.stderr}"
    
    # 4. Verify completion and output
    for _ in range(12): # Wait up to 60 seconds
        run_status_result = subprocess.run(
            ["curl", "-s", "-H", f"Authorization: Bearer {trigger_secret_key}", f"https://api.trigger.dev/api/v3/runs/{run_id}"],
            capture_output=True,
            text=True
        )
        assert run_status_result.returncode == 0
        run_data = json.loads(run_status_result.stdout)
        status = run_data.get("status")
        
        if status == "COMPLETED":
            output = run_data.get("output", {})
            assert output.get("approved") is True, f"Task completed but 'approved' flag is missing or false: {output}"
            return
        elif status in ["FAILED", "CRASHED", "CANCELED", "TIMED_OUT"]:
            pytest.fail(f"Task failed with status: {status}")
        
        time.sleep(5)
    
    pytest.fail("Task did not complete within timeout.")
