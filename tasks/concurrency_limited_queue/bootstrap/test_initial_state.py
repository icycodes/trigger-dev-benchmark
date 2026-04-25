import os
import shutil
import pytest

PROJECT_DIR = "/home/user/concurrency-task"
TRIAL_ID_FILE = "/logs/trial_id"

def test_node_installed():
    assert shutil.which("node") is not None, "Node.js is not installed."
    assert shutil.which("npm") is not None, "npm is not installed."

def test_trial_id_exists():
    assert os.path.isfile(TRIAL_ID_FILE), f"trial_id file not found at {TRIAL_ID_FILE}"

def test_project_dir_exists():
    # The project directory should be created by the agent, 
    # but the instructions often assume the base directory exists.
    # However, Step 2 says "Test for EVERY file and directory that the task's setup section states is already present".
    # In my task description, I say "Initialize a Trigger.dev project in /home/user/concurrency-task", 
    # which implies the user creates it. 
    # So I shouldn't check for its existence if it's not pre-existing.
    pass
