import os
import shutil
import subprocess
import pytest

PROJECT_DIR = "/home/user/delayed_notification-app"

def test_node_installed():
    assert shutil.which("node") is not None, "Node.js is not installed."

def test_npm_installed():
    assert shutil.which("npm") is not None, "npm is not installed."

def test_trial_id_exists():
    assert os.path.isfile("/logs/trial_id"), "/logs/trial_id file is missing."

def test_trigger_env_vars():
    assert "TRIGGER_PROJECT_REF" in os.environ, "TRIGGER_PROJECT_REF env var is missing."
    assert "TRIGGER_SECRET_KEY" in os.environ, "TRIGGER_SECRET_KEY env var is missing."
