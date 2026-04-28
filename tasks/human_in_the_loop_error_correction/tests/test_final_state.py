import pytest
import subprocess
import os
import re
import json
import time
from xprocess import ProcessStarter

PROJECT_DIR = "/home/user/resilient-pipeline"
TOKEN_FILE = os.path.join(PROJECT_DIR, "waitpoint_token.txt")

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
        timeout = 180
        terminate_on_interrupt = True

    xprocess.ensure(Starter.name, Starter)
    yield
    info = xprocess.getinfo(Starter.name)
    info.terminate()

def test_human_in_the_loop_error_correction(start_trigger_dev):
    # 1. Start Pipeline
    result = subprocess.run(
        ["npm", "run", "run-pipeline"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"run-pipeline failed: {result.stderr}"
    
    # Find run id in result.stdout
    run_id_match = re.search(r"Run ID: ([a-zA-Z0-9_]+)", result.stdout)
    assert run_id_match, f"Run ID not found in the trigger result, stdout: {result.stdout}"
    run_id = run_id_match.group(1)

    # 2. Verify Waitpoint Token File
    # Wait for the token file to be created (max 30 seconds)
    for _ in range(12):
        if os.path.exists(TOKEN_FILE):
            break
        time.sleep(5)
    else:
        pytest.fail(f"Waitpoint token file {TOKEN_FILE} was not created.")

    with open(TOKEN_FILE, "r") as f:
        token = f.read().strip()
    assert token, "Waitpoint token is empty."

    # 3. Check Run Status (should be WAITING or EXECUTING)
    trigger_secret_key = os.environ.get("TRIGGER_SECRET_KEY")
    run_result = subprocess.run(
        ["curl", "-s", "-H", f"Authorization: Bearer {trigger_secret_key}", f"https://api.trigger.dev/api/v3/runs/{run_id}"],
        capture_output=True,
        text=True
    )
    assert run_result.returncode == 0
    run_data = json.loads(run_result.stdout)
    # status could be EXECUTING while it's paused on wait.forToken
    assert run_data["status"] in ["EXECUTING", "WAITING", "PENDING_VERSION", "QUEUED"], f"Unexpected run status: {run_data['status']}"

    # 4. Complete Waitpoint
    complete_result = subprocess.run(
        ["npm", "run", "complete-waitpoint"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert complete_result.returncode == 0, f"complete-waitpoint failed: {complete_result.stderr}"

    # 5. Verify Final Completion and Result
    for _ in range(15):
        run_result = subprocess.run(
            ["curl", "-s", "-H", f"Authorization: Bearer {trigger_secret_key}", f"https://api.trigger.dev/api/v3/runs/{run_id}"],
            capture_output=True,
            text=True
        )
        assert run_result.returncode == 0
        run_data = json.loads(run_result.stdout)
        
        if run_data["status"] == "COMPLETED":
            assert "output" in run_data, "Run output is missing."
            assert run_data["output"] == {"result": "Processed: fixed data"}, f"Unexpected output: {run_data['output']}"
            break
        elif run_data["status"] in ["FAILED", "CRASHED", "CANCELED", "EXPIRED", "TIMED_OUT", "SYSTEM_FAILURE"]:
            pytest.fail(f"Run failed with status: {run_data['status']}")
        
        time.sleep(5)
    else:
        pytest.fail("Run did not complete after waitpoint completion.")
