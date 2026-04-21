import os
import pytest

PROJECT_DIR = "/home/user/sequential_orchestration-app"

def get_trial_id():
    with open("/logs/trial_id", "r") as f:
        return f.read().strip()

def test_trigger_and_wait_exists():
    trial_id = get_trial_id()
    expected_parent_id = f"parent-task-{trial_id}"
    expected_sub_id = f"sub-task-1-{trial_id}"
    trigger_dir = os.path.join(PROJECT_DIR, "trigger")
    
    found_parent_id = False
    found_sub_id = False
    found_trigger = False
    found_unwrap = False
    
    for filename in os.listdir(trigger_dir):
        if filename.endswith(".ts") or filename.endswith(".js"):
            with open(os.path.join(trigger_dir, filename), "r") as f:
                content = f.read()
                if expected_parent_id in content:
                    found_parent_id = True
                if expected_sub_id in content:
                    found_sub_id = True
                if ".triggerAndWait(" in content:
                    found_trigger = True
                if ".unwrap()" in content:
                    found_unwrap = True
                    
    assert found_parent_id, f"Parent Task ID {expected_parent_id} not found."
    assert found_sub_id, f"Sub-Task ID {expected_sub_id} not found."
    assert found_trigger, "triggerAndWait() not found."
    assert found_unwrap, ".unwrap() not found."
