import os
import shutil
import subprocess
import pytest

PROJECT_DIR = "/home/user/trigger-approval"

def test_node_available():
    assert shutil.which("node") is not None, "Node.js binary not found in PATH."
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_trigger_project_ref_env_var():
    assert "TRIGGER_PROJECT_REF" in os.environ, "TRIGGER_PROJECT_REF environment variable is missing."
    assert os.environ["TRIGGER_PROJECT_REF"].startswith("proj_"), "TRIGGER_PROJECT_REF should start with 'proj_'."

def test_trigger_secret_key_env_var():
    assert "TRIGGER_SECRET_KEY" in os.environ, "TRIGGER_SECRET_KEY environment variable is missing."
    assert os.environ["TRIGGER_SECRET_KEY"].startswith("tr_"), "TRIGGER_SECRET_KEY should start with 'tr_'."

def test_trigger_credential_config_env_var():
    assert "TRIGGER_CREDENTIAL_CONFIG_JSON" in os.environ, "TRIGGER_CREDENTIAL_CONFIG_JSON environment variable is missing."
    try:
        import json
        json.loads(os.environ["TRIGGER_CREDENTIAL_CONFIG_JSON"])
    except Exception as e:
        pytest.fail(f"TRIGGER_CREDENTIAL_CONFIG_JSON is not valid JSON: {e}")

def test_trial_id_file_exists():
    assert os.path.isfile("/logs/trial_id"), "Trial ID file /logs/trial_id does not exist."

def test_project_dir_exists():
    # The task description specifies the project path
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."
