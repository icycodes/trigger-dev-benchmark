import os
import shutil
import subprocess
import pytest

PROJECT_DIR = "/home/user/ai-pipeline"

def test_trigger_dev_cli_available():
    # Check if npx is available to run trigger.dev
    assert shutil.which("npx") is not None, "npx not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_trial_id_exists():
    assert os.path.isfile("/logs/trial_id"), "/logs/trial_id file is missing."

def test_env_vars_exist():
    assert "TRIGGER_PROJECT_REF" in os.environ, "TRIGGER_PROJECT_REF env var is missing."
    assert "TRIGGER_SECRET_KEY" in os.environ, "TRIGGER_SECRET_KEY env var is missing."
    assert "TRIGGER_CREDENTIAL_CONFIG_JSON" in os.environ, "TRIGGER_CREDENTIAL_CONFIG_JSON env var is missing."
