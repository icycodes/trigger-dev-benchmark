import os
import pytest

PROJECT_DIR = "/home/user/cron-project"

def test_scheduled_task_config():
    task_file = os.path.join(PROJECT_DIR, "trigger/cleanup.ts")
    assert os.path.exists(task_file), f"{task_file} not found."
    
    with open(task_file, "r") as f:
        content = f.read()
    
    assert "schedules.task" in content
    assert "0 0 * * *" in content
    assert "timestamp" in content
    assert "lastTimestamp" in content
