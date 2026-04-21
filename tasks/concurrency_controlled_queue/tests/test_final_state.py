import os
import pytest

PROJECT_DIR = "/home/user/queue-project"

def test_queue_config():
    task_file = os.path.join(PROJECT_DIR, "trigger/critical.ts")
    assert os.path.exists(task_file), f"{task_file} not found."
    
    with open(task_file, "r") as f:
        content = f.read()
    
    assert "queue(" in content
    assert "concurrencyLimit: 1" in content or "concurrencyLimit:1" in content
    assert "critical-queue" in content
    assert "criticalTask" in content
