import pytest
import subprocess
import os
import re
import json
from time import sleep
from xprocess import ProcessStarter

PROJECT_DIR = "/home/user/ai-agent-task"

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

def test_ai_agent_task_execution(start_trigger_dev):
    # Trigger the task 
    result = subprocess.run(
      ["npm", "run", "run-task"],
      cwd=PROJECT_DIR,
      capture_output=True,
      text=True
    )

    assert result.returncode == 0, f"Trigger script failed with code {result.returncode}, stderr: {result.stderr}"

    # Find run id in result.stdout
    run_id_match = re.search(r"Run ID: ([a-zA-Z0-9_]+)", result.stdout)
    assert run_id_match, f"Run ID not found in the trigger result, stdout: {result.stdout}"
    run_id = run_id_match.group(1)

    # Verify that the output contains some streamed chunks (non-empty)
    # The trigger script is expected to print chunks as they arrive.
    assert len(result.stdout.strip()) > 50, f"Streamed output seems too short or missing, stdout: {result.stdout}"

    # Check run result logic via API
    trigger_secret_key = os.environ.get("TRIGGER_SECRET_KEY")
    for _ in range(20): # AI tasks can take a while
        run_result = subprocess.run(
          ["curl", "-s", "-H", f"Authorization: Bearer {trigger_secret_key}", f"https://api.trigger.dev/api/v3/runs/{run_id}"],
          capture_output=True,
          text=True
        )
        assert run_result.returncode == 0, f"Retrieve run result failed with code {run_result.returncode}"
        
        try:
            run_result_json = json.loads(run_result.stdout)
        except json.JSONDecodeError:
            assert False, f"Failed to parse run result JSON: {run_result.stdout}"
            
        assert "status" in run_result_json, f"Run status is missing in {run_result_json}"
        run_status = run_result_json["status"]
        
        if run_status == "COMPLETED":
            # Verify that the output is non-empty and contains expected info
            assert "output" in run_result_json, f"Run output is missing in {run_result_json}"
            # The AI response should be somewhere in the logs or metadata if not explicitly in output
            # But the task is expected to return something or at least complete.
            break
        elif run_status in ["FAILED", "CRASHED", "CANCELED", "EXPIRED", "TIMED_OUT", "SYSTEM_FAILURE"]:
            assert False, f"Run failed with status: {run_status}, error: {run_result_json.get('error')}"
            break
        else:
            # Sleep for 10 seconds before checking again
            sleep(10)
    else:
        assert False, f"Run {run_id} did not complete after 200 seconds"

def test_weather_tool_called(start_trigger_dev):
    # This test checks if the weather tool was actually called by inspecting the run events/logs
    # We can use the run_id from the previous test or just rely on the overall task success
    # For now, we assume if the task completed and produced output, it worked.
    # A more robust check would be to list runs of the weather task.
    
    trial_id_path = "/logs/trial_id"
    with open(trial_id_path, "r") as f:
        trial_id = f.read().strip()
    
    weather_task_id = f"weatherTask-{trial_id}"
    trigger_secret_key = os.environ.get("TRIGGER_SECRET_KEY")
    
    # List runs for the weather task
    list_runs_result = subprocess.run(
        ["curl", "-s", "-H", f"Authorization: Bearer {trigger_secret_key}", f"https://api.trigger.dev/api/v1/runs?filter%5BtaskIdentifier%5D={weather_task_id}"],
        capture_output=True,
        text=True
    )
    assert list_runs_result.returncode == 0
    runs_json = json.loads(list_runs_result.stdout)
    
    # Verify at least one run of the weather task exists and was successful
    assert len(runs_json.get("data", [])) > 0, f"No runs found for weather task {weather_task_id}"
    assert runs_json["data"][0]["status"] == "COMPLETED", f"Weather task run was not successful: {runs_json['data'][0]['status']}"
