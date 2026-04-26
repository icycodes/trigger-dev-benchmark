import os
import shutil
import subprocess
import pytest
from pathlib import Path

def test_node_available():
    assert shutil.which("node") is not None, "Node.js is not installed."
    assert shutil.which("npm") is not None, "npm is not installed."

def test_trigger_project_env_vars():
    assert "TRIGGER_PROJECT_REF" in os.environ, "TRIGGER_PROJECT_REF environment variable is missing."
    assert "TRIGGER_SECRET_KEY" in os.environ, "TRIGGER_SECRET_KEY environment variable is missing."
    assert "TRIGGER_CREDENTIAL_CONFIG_JSON" in os.environ, "TRIGGER_CREDENTIAL_CONFIG_JSON environment variable is missing."

def test_trial_id_exists():
    trial_id_path = Path("/logs/trial_id")
    assert trial_id_path.exists(), "/logs/trial_id file is missing."
    assert trial_id_path.read_text().strip() != "", "trial_id is empty."

def test_working_directory_exists():
    # The task description says the project path is /home/user/ai-workflow
    # We should ensure the parent directory exists at least, or the dir itself if it's supposed to be there.
    # In this task, the user is expected to initialize it, but we can check if /home/user is writable.
    assert os.path.isdir("/home/user"), "/home/user directory does not exist."
