import os
import shutil
import pytest
from pathlib import Path

def test_node_installed():
    assert shutil.which("node") is not None, "Node.js is not installed."
    assert shutil.which("npm") is not None, "npm is not installed."

def test_trial_id_exists():
    assert os.path.exists("/logs/trial_id"), "trial_id file not found at /logs/trial_id."

def test_home_user_exists():
    assert os.path.exists("/home/user"), "/home/user directory does not exist."
