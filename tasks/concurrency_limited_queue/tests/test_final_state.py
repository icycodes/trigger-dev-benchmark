import pytest
import subprocess
import os
import re
import json
import time
from datetime import datetime
from xprocess import ProcessStarter

PROJECT_DIR = "/home/user/concurrency-task"

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
        pattern = "Local worker ready"
        max_read_lines = 1000
        timeout = 180
        terminate_on_interrupt = True

    xprocess.ensure(Starter.name, Starter)

    yield

    # --- TEARDOWN ---
    info = xprocess.getinfo(Starter.name)
    info.terminate()

def parse_iso(dt_str):
    # Trigger.dev returns ISO strings like 2024-05-24T12:00:00.000Z
    # We can use datetime.fromisoformat but need to handle the Z
    return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))

def test_concurrency_limit(start_trigger_dev):
    # Trigger the tasks
    result = subprocess.run(
      ["npm", "run", "run-task"],
      cwd=PROJECT_DIR,
      capture_output=True,
      text=True
    )

    # Find run ids in result.stdout
    # Format: Run IDs: <id1>, <id2>, <id3>
    match = re.search(r"Run IDs: ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+)", result.stdout)
    assert match, f"Run IDs not found in the trigger result, stdout: {result.stdout}"
    run_ids = [match.group(1), match.group(2), match.group(3)]

    trigger_secret_key = os.environ.get("TRIGGER_SECRET_KEY")
    run_details = []

    for run_id in run_ids:
        # Poll for completion
        for _ in range(60): # 5 minutes max
            run_result = subprocess.run(
              ["curl", "-s", "-H", f"Authorization: Bearer {trigger_secret_key}", f"https://api.trigger.dev/api/v3/runs/{run_id}"],
              capture_output=True,
              text=True
            )
            assert run_result.returncode == 0
            data = json.loads(run_result.stdout)
            if data["status"] == "COMPLETED":
                run_details.append(data)
                break
            elif data["status"] in ["FAILED", "CRASHED", "CANCELED", "TIMED_OUT"]:
                assert False, f"Run {run_id} failed with status {data['status']}"
            time.sleep(5)
        else:
            assert False, f"Run {run_id} did not complete in time"

    # Verify no overlap
    # Sort runs by startedAt
    sorted_runs = sorted(run_details, key=lambda x: parse_iso(x["startedAt"]))
    
    for i in range(len(sorted_runs) - 1):
        current_run = sorted_runs[i]
        next_run = sorted_runs[i+1]
        
        current_finished = parse_iso(current_run["finishedAt"])
        next_started = parse_iso(next_run["startedAt"])
        
        assert current_finished <= next_started, \
            f"Overlap detected between run {current_run['id']} (finished at {current_finished}) and run {next_run['id']} (started at {next_started})"

    print("Concurrency limit verification passed: no overlaps detected.")
