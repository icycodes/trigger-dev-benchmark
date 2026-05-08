import pytest
import subprocess
import os
import socket
import time
import json
import re
from xprocess import ProcessStarter
from pochi_verifier import PochiVerifier

PROJECT_DIR = "/home/user/realtime-dashboard"

@pytest.fixture(scope="session")
def browser_verifier():
    yield PochiVerifier()

def wait_for_port(port, timeout=120):
    start_time = time.time()
    while time.time() - start_time < timeout:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            if sock.connect_ex(('localhost', port)) == 0:
                return True
        time.sleep(5)
    return False

@pytest.fixture(scope="session")
def start_trigger_dev(xprocess):
    """
    Starts the `npx trigger.dev@latest dev` service using xprocess. 
    """
    # Create the Trigger.dev config file before executing the first `npx trigger.dev` command
    trigger_credential_config_json = os.environ.get("TRIGGER_CREDENTIAL_CONFIG_JSON")
    cmd = f'mkdir -p ~/.config/trigger && printf "%s" \'{trigger_credential_config_json}\' > ~/.config/trigger/config.json && chmod 600 ~/.config/trigger/config.json && npx trigger.dev@latest whoami'
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

@pytest.fixture(scope="session")
def start_app(xprocess):
    """
    Starts the Next.js app using xprocess. Confirms readiness via port check.
    """
    class Starter(ProcessStarter):
        name = "start_app"
        args = ["npm", "run", "dev"]
        env = os.environ.copy()
        popen_kwargs = {
            "cwd": PROJECT_DIR,
            "text": True,
        }
        timeout = 180
        terminate_on_interrupt = True

        def startup_check(self):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                return s.connect_ex(("localhost", 3000)) == 0

    xprocess.ensure(Starter.name, Starter)
    yield
    info = xprocess.getinfo(Starter.name)
    info.terminate()

def test_realtime_dashboard(start_trigger_dev, start_app, browser_verifier):
    reason = "The application should have a dashboard that triggers a task and displays real-time progress using Trigger.dev React hooks."
    truth = "Navigate to http://localhost:3000. Verify that a 'Start Task' button is visible. Click the button and verify that a progress indicator appears. Wait for the progress to complete and verify that 'Task Completed!' is displayed along with the final result."

    result = browser_verifier.verify(
        reason=reason,
        truth=truth,
        use_browser_agent=True,
        trajectory_dir="/logs/verifier/pochi/test_realtime_dashboard"
    )
    assert result.status == "pass", f"Browser verification failed: {result.reason}"
