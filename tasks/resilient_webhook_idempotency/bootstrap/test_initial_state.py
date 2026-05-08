import os
import shutil
import subprocess
import pytest

def test_node_available():
    assert shutil.which("node") is not None, "Node.js binary not found in PATH."

def test_npm_available():
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_trigger_project_ref_env_var():
    assert "TRIGGER_PROJECT_REF" in os.environ, "TRIGGER_PROJECT_REF environment variable is missing."

def test_trigger_secret_key_env_var():
    assert "TRIGGER_SECRET_KEY" in os.environ, "TRIGGER_SECRET_KEY environment variable is missing."

def test_trigger_credential_config_json_env_var():
    assert "TRIGGER_CREDENTIAL_CONFIG_JSON" in os.environ, "TRIGGER_CREDENTIAL_CONFIG_JSON environment variable is missing."

def test_trial_id_file_exists():
    assert os.path.isfile("/logs/trial_id"), "/logs/trial_id file is missing."
