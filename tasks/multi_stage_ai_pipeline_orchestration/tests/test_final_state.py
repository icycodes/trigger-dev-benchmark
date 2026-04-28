import os
import subprocess
import json
import time
import socket
import pytest
import re
from xprocess import ProcessStarter

PROJECT_DIR = "/home/user/ai-pipeline"

@pytest.fixture(scope="session")
def start_trigger_dev(xprocess):
    """
    Starts the `npx trigger.dev@latest dev` service using xprocess. 
    """
    # Configure CLI Credentials
    cred_config = os.environ.get("TRIGGER_CREDENTIAL_CONFIG_JSON")
    cmd = f'mkdir -p ~/.config/trigger && printf "%s" \'{cred_config}\' > ~/.config/trigger/config.json && chmod 600 ~/.config/trigger/config.json'
    subprocess.run(cmd, shell=True, check=True, executable="/bin/bash")
    
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

def test_pipeline_execution(start_trigger_dev):
    # 1. Trigger the task
    result = subprocess.run(
        ["npm", "run", "run-task"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Failed to trigger task: {result.stderr}"
    
    # 2. Extract Run ID
    run_id_match = re.search(r"Run ID: ([a-zA-Z0-9_]+)", result.stdout)
    assert run_id_match, f"Run ID not found in output: {result.stdout}"
    run_id = run_id_match.group(1)
    
    # 3. Poll API for completion
    trigger_secret_key = os.environ.get("TRIGGER_SECRET_KEY")
    headers = {"Authorization": f"Bearer {trigger_secret_key}"}
    
    max_attempts = 30
    for i in range(max_attempts):
        api_result = subprocess.run(
            ["curl", "-s", "-H", f"Authorization: Bearer {trigger_secret_key}", f"https://api.trigger.dev/api/v3/runs/{run_id}"],
            capture_output=True,
            text=True
        )
        assert api_result.returncode == 0, "API call failed"
        run_data = json.loads(api_result.stdout)
        status = run_data.get("status")
        
        if status == "COMPLETED":
            output = run_data.get("output")
            assert output is not None, "Output is missing"
            assert "originalSummary" in output, "originalSummary missing in output"
            assert isinstance(output["originalSummary"], str) and len(output["originalSummary"]) > 0
            
            translations = output.get("translations")
            assert isinstance(translations, list), "translations should be an array"
            assert len(translations) == 3, f"Expected 3 translations, got {len(translations)}"
            
            expected_langs = {"Spanish", "French", "German"}
            actual_langs = {t["language"] for t in translations}
            assert actual_langs == expected_langs, f"Expected languages {expected_langs}, got {actual_langs}"
            
            for t in translations:
                assert "translation" in t, f"Translation missing for {t['language']}"
                assert isinstance(t["translation"], str) and len(t["translation"]) > 0
            return
        
        if status in ["FAILED", "CANCELED", "CRASHED", "TIMED_OUT"]:
            pytest.fail(f"Run failed with status: {status}. Data: {run_data}")
            
        time.sleep(10)
    
    pytest.fail(f"Task did not complete within {max_attempts * 10} seconds")
