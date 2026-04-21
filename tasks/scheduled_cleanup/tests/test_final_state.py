import os
import json
import pytest

PROJECT_DIR = "/home/user/scheduled_cleanup-app"

def get_trial_id():
    with open("/logs/trial_id", "r") as f:
        return f.read().strip()

def test_scheduled_task_exists():
    trial_id = get_trial_id()
    expected_id = f"cleanup-task-{trial_id}"
    trigger_dir = os.path.join(PROJECT_DIR, "trigger")
    
    found_id = False
    found_cron = False
    
    for filename in os.listdir(trigger_dir):
        if filename.endswith(".ts") or filename.endswith(".js"):
            with open(os.path.join(trigger_dir, filename), "r") as f:
                content = f.read()
                if expected_id in content:
                    found_id = True
                if "0 * * * *" in content:
                    found_cron = True
                    
    assert found_id, f"Task ID {expected_id} not found."
    assert found_cron, "Cron schedule '0 * * * *' not found."
