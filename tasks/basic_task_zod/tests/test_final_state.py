import os
import subprocess
import json
import pytest
import pathlib

PROJECT_DIR = "/home/user/trigger-app"

def get_trial_id():
    with open("/logs/trial_id", "r") as f:
        return f.read().strip()

def test_task_file_exists():
    # The user might name it basic-task.ts as suggested or something else, 
    # but we should check the trigger directory.
    trigger_dir = os.path.join(PROJECT_DIR, "trigger")
    assert os.path.isdir(trigger_dir), f"Trigger directory {trigger_dir} not found."
    
    files = os.listdir(trigger_dir)
    assert len(files) > 0, "No files found in trigger directory."

def test_task_content():
    trial_id = get_trial_id()
    expected_id = f"basic-zod-task-{trial_id}"
    
    trigger_dir = os.path.join(PROJECT_DIR, "trigger")
    found_id = False
    found_zod = False
    found_retry = False
    
    for filename in os.listdir(trigger_dir):
        if filename.endswith(".ts") or filename.endswith(".js"):
            with open(os.path.join(trigger_dir, filename), "r") as f:
                content = f.read()
                if expected_id in content:
                    found_id = True
                if "z.object" in content or "zod" in content:
                    found_zod = True
                if "maxAttempts: 3" in content or "maxAttempts:3" in content:
                    found_retry = True
                    
    assert found_id, f"Task ID {expected_id} not found in any trigger file."
    assert found_zod, "Zod validation (z.object) not found in trigger files."
    assert found_retry, "Retry strategy 'maxAttempts: 3' not found."

def test_package_json_dependencies():
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(package_json_path), "package.json not found."
    
    with open(package_json_path, "r") as f:
        data = json.load(f)
        deps = data.get("dependencies", {})
        dev_deps = data.get("devDependencies", {})
        
        assert "@trigger.dev/sdk" in deps or "@trigger.dev/sdk" in dev_deps, "@trigger.dev/sdk not installed."
        assert "zod" in deps or "zod" in dev_deps, "zod not installed."
