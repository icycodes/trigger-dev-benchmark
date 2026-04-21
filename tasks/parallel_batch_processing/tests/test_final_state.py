import os
import pytest

PROJECT_DIR = "/home/user/parallel_batch_processing-app"

def get_trial_id():
    with open("/logs/trial_id", "r") as f:
        return f.read().strip()

def test_batch_trigger_exists():
    trial_id = get_trial_id()
    trigger_dir = os.path.join(PROJECT_DIR, "trigger")
    
    found_batch = False
    found_promise_all = False
    
    for filename in os.listdir(trigger_dir):
        if filename.endswith(".ts") or filename.endswith(".js"):
            with open(os.path.join(trigger_dir, filename), "r") as f:
                content = f.read()
                if "batch.triggerByTaskAndWait" in content:
                    found_batch = True
                if "Promise.all" in content and "triggerAndWait" in content:
                    found_promise_all = True
                    
    assert found_batch, "batch.triggerByTaskAndWait not found."
    assert not found_promise_all, "Promise.all should not be used with triggerAndWait in V4."
