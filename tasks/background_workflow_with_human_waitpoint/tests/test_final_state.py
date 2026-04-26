import os
import subprocess
import json
import time
import re
import pytest
from xprocess import ProcessStarter

PROJECT_DIR = "/home/user/trigger-approval"

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

def test_human_approval_workflow_success(start_trigger_dev):
    """
    Priority 1: Trigger task, capture token, complete token via script/API, verify run completion.
    """
    # 1. Trigger the workflow
    trigger_result = subprocess.run(
        ["npm", "run", "trigger-workflow"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert trigger_result.returncode == 0, f"Trigger script failed: {trigger_result.stderr}"
    
    # 2. Parse Run ID and Token ID
    run_id_match = re.search(r"Run ID: ([a-zA-Z0-9_]+)", trigger_result.stdout)
    token_id_match = re.search(r"Token ID: ([a-zA-Z0-9_]+)", trigger_result.stdout)
    
    assert run_id_match, f"Run ID not found in output: {trigger_result.stdout}"
    assert token_id_match, f"Token ID not found in output: {trigger_result.stdout}"
    
    run_id = run_id_match.group(1)
    token_id = token_id_match.group(1)
    
    # 3. Complete the token (Approve)
    complete_result = subprocess.run(
        ["npm", "run", "complete-approval", token_id],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert complete_result.returncode == 0, f"Completion script failed: {complete_result.stderr}"
    
    # 4. Poll for run completion
    trigger_secret_key = os.environ.get("TRIGGER_SECRET_KEY")
    max_attempts = 12
    for i in range(max_attempts):
        run_info = subprocess.run(
            ["curl", "-s", "-H", f"Authorization: Bearer {trigger_secret_key}", f"https://api.trigger.dev/api/v3/runs/{run_id}"],
            capture_output=True,
            text=True
        )
        assert run_info.returncode == 0, "Failed to fetch run info"
        data = json.loads(run_info.stdout)
        status = data.get("status")
        
        if status == "COMPLETED":
            output = data.get("output", {})
            assert output.get("approved") is True, f"Expected approved: True, got {output}"
            return
        elif status in ["FAILED", "CRASHED", "CANCELED", "TIMED_OUT"]:
            pytest.fail(f"Run ended with status: {status}")
        
        time.sleep(10)
    
    pytest.fail("Run did not complete within timeout")

def test_project_files_exist():
    """Priority 3: Check that the required source files were created."""
    assert os.path.isfile(os.path.join(PROJECT_DIR, "src/trigger/workflow.ts")), "workflow.ts missing"
    assert os.path.isfile(os.path.join(PROJECT_DIR, "trigger.config.ts")), "trigger.config.ts missing"
