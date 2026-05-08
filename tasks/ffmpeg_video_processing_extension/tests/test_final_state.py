import pytest
import subprocess
import os
import re
import json
import time
from xprocess import ProcessStarter

PROJECT_DIR = "/home/user/ffmpeg-task"

@pytest.fixture(scope="session")
def start_trigger_dev(xprocess):
    """
    Starts the `npx trigger.dev@latest dev` service using xprocess. 
    """
    # Create the Trigger.dev config file before executing the first `npx trigger.dev` command
    # This is normally done by the agent, but we ensure credentials are set up for the worker
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

    # --- TEARDOWN ---
    info = xprocess.getinfo(Starter.name)
    info.terminate()

def test_ffmpeg_task_execution(start_trigger_dev):
    # Trigger the task 
    result = subprocess.run(
      ["npm", "run", "run-task"],
      cwd=PROJECT_DIR,
      capture_output=True,
      text=True
    )

    # Find run id in result.stdout
    run_id_match = re.search(r"Run ID: ([a-zA-Z0-9_]+)", result.stdout)
    assert run_id_match, f"Run ID not found in the trigger result. stdout: {result.stdout}, stderr: {result.stderr}"
    run_id = run_id_match.group(1)

    trigger_secret_key = os.environ.get("TRIGGER_SECRET_KEY")
    
    # Poll for completion
    completed = False
    for _ in range(24): # 2 minutes total (24 * 5s)
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
            completed = True
            break
        elif run_status in ["FAILED", "CRASHED", "CANCELED", "EXPIRED", "TIMED_OUT", "SYSTEM_FAILURE"]:
            pytest.fail(f"Run failed with status: {run_status}. Response: {run_result_json}")
        else:
            time.sleep(5)
    
    assert completed, "Run did not complete within the timeout period."

def test_output_file_exists():
    output_file = os.path.join(PROJECT_DIR, "output/audio.wav")
    assert os.path.isfile(output_file), f"Output file {output_file} was not created."
    assert os.path.getsize(output_file) > 0, f"Output file {output_file} is empty."

def test_output_file_format():
    output_file = os.path.join(PROJECT_DIR, "output/audio.wav")
    # Use ffprobe to check format
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "stream=channels,sample_rate", "-of", "json", output_file],
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"ffprobe failed: {result.stderr}"
    data = json.loads(result.stdout)
    
    stream = data["streams"][0]
    # In my task description I specified mono (1 channel) and 44100 Hz
    assert int(stream["channels"]) == 1, f"Expected 1 channel, got {stream['channels']}"
    assert int(stream["sample_rate"]) == 44100, f"Expected 44100 Hz, got {stream['sample_rate']}"

def test_trigger_config_contains_ffmpeg():
    config_path = os.path.join(PROJECT_DIR, "trigger.config.ts")
    with open(config_path, "r") as f:
        content = f.read()
    assert "ffmpeg()" in content, "trigger.config.ts does not seem to include the ffmpeg extension."
    assert "@trigger.dev/build/extensions/core" in content, "trigger.config.ts does not import from the correct extension package."
