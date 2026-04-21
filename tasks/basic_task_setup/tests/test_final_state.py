import os
import pytest
import pathlib

PROJECT_DIR = "/home/user/my-project"

def test_trigger_config_exists():
    assert os.path.exists(os.path.join(PROJECT_DIR, "trigger.config.ts")), "trigger.config.ts not found."

def test_task_file_exists():
    assert os.path.exists(os.path.join(PROJECT_DIR, "trigger/hello-world.ts")), "trigger/hello-world.ts not found."

def test_task_id_and_logic():
    with open("/logs/trial_id", "r") as f:
        trial_id = f.read().strip()
    
    task_file = os.path.join(PROJECT_DIR, "trigger/hello-world.ts")
    with open(task_file, "r") as f:
        content = f.read()
    
    expected_id = f"hello-world-{trial_id}"
    assert expected_id in content, f"Task ID '{expected_id}' not found in {task_file}."
    assert "console.log" in content, "console.log not found in task logic."
    assert "success: true" in content, "Return object missing 'success: true'."
    assert "echoed:" in content, "Return object missing 'echoed' field."
