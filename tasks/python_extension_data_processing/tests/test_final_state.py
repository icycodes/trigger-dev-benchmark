import pytest
import subprocess
import os
import re
import json
from time import sleep
from xprocess import ProcessStarter

PROJECT_DIR = "/home/user/python-task"

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

def test_python_extension_task(start_trigger_dev):
    # Trigger the task 
    result = subprocess.run(
      ["npm", "run", "run-task"],
      cwd=PROJECT_DIR,
      capture_output=True,
      text=True
    )

    # Find run id in result.stdout
    run_id_match = re.search(r"Run ID: ([a-zA-Z0-9_]+)", result.stdout)
    assert run_id_match, f"Run ID not found in the trigger result, stdout: {result.stdout}, stderr: {result.stderr}"
    run_id = run_id_match.group(1)

    # Example of checking run result logic
    trigger_secret_key = os.environ.get("TRIGGER_SECRET_KEY")
    for _ in range(20): # Increase range to 20 for potentially slower python builds
        run_result = subprocess.run(
          ["curl", "-s", "-H", f"Authorization: Bearer {trigger_secret_key}", f"https://api.trigger.dev/api/v3/runs/{run_id}"],
          capture_output=True,
          text=True
        )
        assert run_result.returncode == 0, f"Retrieve run result failed with code {run_result.returncode}"
        run_result_json = json.loads(run_result.stdout)
        assert "status" in run_result_json, f"Run status is missing in {run_result_json}"
        run_status = run_result_json["status"]
        
        if run_status == "COMPLETED":
            assert "output" in run_result_json, f"Run output is missing in {run_result_json}"
            output = run_result_json["output"]
            # The output should be the average of [10, 20, 30, 40, 50] which is 30
            # Depending on how the user implements it, it might be a number or a string or an object
            # Our truth says "contains the correct average: 30"
            output_str = str(output)
            assert "30" in output_str, f"The output average is not correct, output: {output}"
            break
        elif run_status in ["FAILED", "CRASHED", "CANCELED", "EXPIRED", "TIMED_OUT", "SYSTEM_FAILURE"]:
            assert False, f"Run failed with status: {run_status}. Response: {run_result_json}"
            break
        else:
            # Sleep for 5 seconds before checking again
            sleep(5)
    else:
        assert False, "Run did not complete after 100 seconds"

def test_requirements_file_exists():
    req_path = os.path.join(PROJECT_DIR, "requirements.txt")
    assert os.path.isfile(req_path), "requirements.txt not found"
    with open(req_path) as f:
        content = f.read()
    assert "numpy" in content.lower(), "numpy not found in requirements.txt"

def test_python_script_exists():
    script_path = os.path.join(PROJECT_DIR, "scripts/process.py")
    assert os.path.isfile(script_path), "scripts/process.py not found"
    with open(script_path) as f:
        content = f.read()
    assert "numpy" in content, "numpy not imported in scripts/process.py"
    assert "mean" in content, "mean function not used in scripts/process.py"
