import os
import pytest

PROJECT_DIR = "/home/user/delayed_notification-app"

def get_trial_id():
    with open("/logs/trial_id", "r") as f:
        return f.read().strip()

def test_wait_for_exists():
    trial_id = get_trial_id()
    expected_id = f"delayed-notify-{trial_id}"
    trigger_dir = os.path.join(PROJECT_DIR, "trigger")
    
    found_id = False
    found_wait = False
    
    for filename in os.listdir(trigger_dir):
        if filename.endswith(".ts") or filename.endswith(".js"):
            with open(os.path.join(trigger_dir, filename), "r") as f:
                content = f.read()
                if expected_id in content:
                    found_id = True
                if "wait.for({ seconds: 10 })" in content or "wait.for({seconds:10})" in content:
                    found_wait = True
                    
    assert found_id, f"Task ID {expected_id} not found."
    assert found_wait, "wait.for({ seconds: 10 }) not found."
