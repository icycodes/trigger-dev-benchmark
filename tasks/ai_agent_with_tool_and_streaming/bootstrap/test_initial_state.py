import os
import shutil
import subprocess
import pytest
from pathlib import Path

PROJECT_DIR = "/home/user/ai-agent-task"
TRIAL_ID_FILE = "/logs/trial_id"

def test_trigger_dev_cli_available():
    # Verify npx is available as it's used to run trigger.dev
    assert shutil.which("npx") is not None, "npx binary not found in PATH."

def test_working_directory_exists():
    assert os.path.isdir(PROJECT_DIR), f"Working directory {PROJECT_DIR} does not exist."

def test_trial_id_file_exists():
    assert os.path.isfile(TRIAL_ID_FILE), f"Trial ID file {TRIAL_ID_FILE} does not exist."

def test_environment_variables_present():
    assert "TRIGGER_PROJECT_REF" in os.environ, "TRIGGER_PROJECT_REF environment variable is missing."
    assert "TRIGGER_SECRET_KEY" in os.environ, "TRIGGER_SECRET_KEY environment variable is missing."
    assert "TRIGGER_CREDENTIAL_CONFIG_JSON" in os.environ, "TRIGGER_CREDENTIAL_CONFIG_JSON environment variable is missing."
    assert "OPENAI_API_KEY" in os.environ, "OPENAI_API_KEY environment variable is missing."
