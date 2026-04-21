import os
import pytest

PROJECT_DIR = "/home/user/concurrency_controlled_queue-app"

def test_queue_concurrency_exists():
    trigger_dir = os.path.join(PROJECT_DIR, "trigger")
    found_queue = False
    found_concurrency_key = False
    
    for filename in os.listdir(trigger_dir):
        if filename.endswith(".ts") or filename.endswith(".js"):
            with open(os.path.join(trigger_dir, filename), "r") as f:
                content = f.read()
                if "queue({" in content and "concurrencyLimit: 1" in content:
                    found_queue = True
                if "concurrencyKey" in content:
                    found_concurrency_key = True
                    
    assert found_queue, "Queue with concurrencyLimit: 1 not found."
    assert found_concurrency_key, "concurrencyKey not found in task definition."
