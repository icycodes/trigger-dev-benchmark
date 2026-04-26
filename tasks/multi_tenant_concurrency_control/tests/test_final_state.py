import pytest
import subprocess
import os
import re
import json
import time
from datetime import datetime
from xprocess import ProcessStarter

PROJECT_DIR = "/home/user/multi-tenant-task"

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

def parse_date(date_str):
    return datetime.fromisoformat(date_str.replace('Z', '+00:00'))

def test_multi_tenant_concurrency(start_trigger_dev):
    # Trigger the tasks
    result = subprocess.run(
        ["npm", "run", "run-task"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Triggering tasks failed: {result.stderr}"

    # Find run ids in result.stdout
    # Expected format: Run IDs: <id_A1>, <id_A2>, <id_B1>, <id_B2>
    match = re.search(r"Run IDs: ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+)", result.stdout)
    assert match, f"Run IDs not found in expected format. stdout: {result.stdout}"
    
    run_ids = {
        "A1": match.group(1),
        "A2": match.group(2),
        "B1": match.group(3),
        "B2": match.group(4)
    }

    trigger_secret_key = os.environ.get("TRIGGER_SECRET_KEY")
    run_details = {}

    # Wait for all runs to complete
    max_retries = 30 # 30 * 5s = 150s
    completed_runs = set()
    
    for i in range(max_retries):
        for key, run_id in run_ids.items():
            if key in completed_runs:
                continue
                
            res = subprocess.run(
                ["curl", "-s", "-H", f"Authorization: Bearer {trigger_secret_key}", f"https://api.trigger.dev/api/v3/runs/{run_id}"],
                capture_output=True,
                text=True
            )
            if res.returncode != 0:
                continue
                
            data = json.loads(res.stdout)
            if data.get("status") == "COMPLETED":
                run_details[key] = data
                completed_runs.add(key)
        
        if len(completed_runs) == 4:
            break
        time.sleep(5)
    else:
        assert False, f"Not all runs completed in time. Completed: {completed_runs}"

    # Verify Sequential Execution for User A (A2 starts after A1 finishes)
    a1_end = parse_date(run_details["A1"]["finishedAt"])
    a2_start = parse_date(run_details["A2"]["startedAt"])
    assert a2_start >= a1_end, f"User A runs were not sequential. A1 ended at {a1_end}, A2 started at {a2_start}"

    # Verify Sequential Execution for User B (B2 starts after B1 finishes)
    b1_end = parse_date(run_details["B1"]["finishedAt"])
    b2_start = parse_date(run_details["B2"]["startedAt"])
    assert b2_start >= b1_end, f"User B runs were not sequential. B1 ended at {b1_end}, B2 started at {b2_start}"

    # Verify Parallel Execution between User A and User B
    # A1 and B1 should overlap (since they have different concurrency keys)
    a1_start = parse_date(run_details["A1"]["startedAt"])
    b1_start = parse_date(run_details["B1"]["startedAt"])
    
    # One should start before the other ends
    overlap = (a1_start < b1_end and b1_start < a1_end)
    assert overlap, f"Runs for different users did not run in parallel. A1: {a1_start}-{a1_end}, B1: {b1_start}-{b1_end}"

    # Check output
    for key in ["A1", "A2", "B1", "B2"]:
        output = run_details[key].get("output")
        assert output, f"Run {key} has no output"
        assert "userId" in output
        assert "jobId" in output
        assert output["jobId"] == key
