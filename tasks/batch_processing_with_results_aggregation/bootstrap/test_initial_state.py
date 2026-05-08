import os
import shutil
import subprocess
import pytest

def test_node_available():
    assert shutil.which("node") is not None, "Node.js is not installed."
    assert shutil.which("npm") is not None, "npm is not installed."

def test_trigger_env_vars():
    assert "TRIGGER_PROJECT_REF" in os.environ, "TRIGGER_PROJECT_REF environment variable is missing."
    assert "TRIGGER_SECRET_KEY" in os.environ, "TRIGGER_SECRET_KEY environment variable is missing."
    assert "TRIGGER_CREDENTIAL_CONFIG_JSON" in os.environ, "TRIGGER_CREDENTIAL_CONFIG_JSON environment variable is missing."

def test_logs_dir_and_trial_id():
    assert os.path.exists("/logs/trial_id"), "/logs/trial_id file is missing."
    with open("/logs/trial_id", "r") as f:
        trial_id = f.read().strip()
    assert trial_id, "trial_id is empty."
