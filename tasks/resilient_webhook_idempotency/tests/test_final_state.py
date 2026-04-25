import pytest
import subprocess
import os
import re
import json
from time import sleep
from xprocess import ProcessStarter

PROJECT_DIR = "/home/user/webhook-task"

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

    class Starter(ProcessStarter):
        name = "start_trigger_dev"
        args = ["npx", "trigger.dev@latest", "dev", "--skip-update-check", "--skip-telemetry"]
        env = os.environ.copy()
        popen_kwargs = {
            "cwd": PROJECT_DIR,
            "text": True,
        }
        # Use a pattern to detect when startup is finished.
        # Trigger.dev prints the message "Local worker ready" when initialization is done.
        pattern = "Local worker ready"
        # Maximum output lines to wait for the pattern.
        max_read_lines = 1000
        # Maximum seconds to wait for the pattern.
        timeout = 180
        # Terminate the start_trigger_dev process on exit.
        terminate_on_interrupt = True

    xprocess.ensure(Starter.name, Starter)

    yield

    # --- TEARDOWN ---
    info = xprocess.getinfo(Starter.name)
    info.terminate()

def test_webhook_idempotency(start_trigger_dev):
    # Trigger the task twice via the npm script
    result = subprocess.run(
      ["npm", "run", "run-task"],
      cwd=PROJECT_DIR,
      capture_output=True,
      text=True
    )

    # Find run ids in result.stdout
    # Expecting output like "Run ID 1: run_abc123" and "Run ID 2: run_def456"
    # or like "Run 1 ID: run_abc123" and "Run 2 ID: run_def456"
    run_ids = re.findall(r"Run\s*(?:\d*\s*)?ID\s*(?:\d*)?:\s*([a-zA-Z0-9_]+)", result.stdout)
    assert len(run_ids) >= 2, f"Expected at least 2 Run IDs in output, got: {result.stdout}"
    
    run_id1 = run_ids[0]
    run_id2 = run_ids[1]

    trigger_secret_key = os.environ.get("TRIGGER_SECRET_KEY")
    
    def get_run_details(run_id):
        for _ in range(20): # Increased wait time for background jobs
            run_result = subprocess.run(
              ["curl", "-s", "-H", f"Authorization: Bearer {trigger_secret_key}", f"https://api.trigger.dev/api/v3/runs/{run_id}"],
              capture_output=True,
              text=True
            )
            assert run_result.returncode == 0
            data = json.loads(run_result.stdout)
            if data.get("status") == "COMPLETED":
                return data
            if data.get("status") in ["FAILED", "CRASHED", "CANCELED", "EXPIRED", "TIMED_OUT", "SYSTEM_FAILURE"]:
                pytest.fail(f"Run {run_id} failed with status: {data.get('status')}")
            sleep(5)
        pytest.fail(f"Run {run_id} did not complete in time")

    run1_data = get_run_details(run_id1)
    run2_data = get_run_details(run_id2)

    assert run1_data["output"] is not None, "Run 1 output is empty"
    assert run2_data["output"] is not None, "Run 2 output is empty"

    # Verify idempotency: both should have the exact same processedAt timestamp
    # because the second run should have returned the cached result of the first.
    processed_at1 = run1_data["output"]["processedAt"]
    processed_at2 = run2_data["output"]["processedAt"]

    assert processed_at1 == processed_at2, \
        f"Idempotency failed: Run 1 processed at {processed_at1}, Run 2 processed at {processed_at2}. They should be identical."
    
    assert run1_data["output"]["amount"] == 100, f"Expected amount 100, got {run1_data['output']['amount']}"
    assert run2_data["output"]["amount"] == 100, f"Expected amount 100, got {run2_data['output']['amount']}"
