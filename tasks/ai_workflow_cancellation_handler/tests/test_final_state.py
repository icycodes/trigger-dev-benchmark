import pytest
import subprocess
import os
import re
import json
import time
from pathlib import Path
from xprocess import ProcessStarter

PROJECT_DIR = "/home/user/ai-workflow"
STATUS_FILE = os.path.join(PROJECT_DIR, "status.json")

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

def test_ai_workflow_cancellation(start_trigger_dev):
    """Verify that the task handles cancellation via the onCancel hook."""
    # 1. Trigger the task
    result = subprocess.run(
        ["npm", "run", "run-task"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Triggering task failed: {result.stderr}"
    
    # 2. Extract Run ID
    run_id_match = re.search(r"Run ID: ([a-zA-Z0-9_]+)", result.stdout)
    assert run_id_match, f"Run ID not found in output: {result.stdout}"
    run_id = run_id_match.group(1)

    # 3. Wait 2 seconds and then cancel
    time.sleep(2)
    cancel_result = subprocess.run(
        ["npm", "run", "cancel-task", "--", run_id],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert cancel_result.returncode == 0, f"Cancelling task failed: {cancel_result.stderr}"

    # 4. Wait for onCancel hook and check status file
    # We poll the status file for up to 10 seconds
    for _ in range(10):
        if os.path.exists(STATUS_FILE):
            with open(STATUS_FILE, "r") as f:
                data = json.load(f)
                if data.get("status") == "cancelled":
                    break
        time.sleep(2)
    else:
        assert False, f"Status file did not reflect 'cancelled' state. Content: {Path(STATUS_FILE).read_text() if os.path.exists(STATUS_FILE) else 'File not found'}"

def test_ai_workflow_completion(start_trigger_dev):
    """Verify that the task completes successfully when not cancelled."""
    # 1. Trigger the task
    result = subprocess.run(
        ["npm", "run", "run-task"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Triggering task failed: {result.stderr}"
    
    # 2. Extract Run ID
    run_id_match = re.search(r"Run ID: ([a-zA-Z0-9_]+)", result.stdout)
    assert run_id_match, f"Run ID not found in output: {result.stdout}"
    
    # 3. Wait for completion (simulated task takes 20s)
    # We poll the status file for up to 30 seconds
    for _ in range(15):
        if os.path.exists(STATUS_FILE):
            with open(STATUS_FILE, "r") as f:
                data = json.load(f)
                if data.get("status") == "completed":
                    break
        time.sleep(2)
    else:
        assert False, f"Status file did not reflect 'completed' state. Content: {Path(STATUS_FILE).read_text() if os.path.exists(STATUS_FILE) else 'File not found'}"
