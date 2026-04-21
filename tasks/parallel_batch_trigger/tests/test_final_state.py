import os
import pytest

PROJECT_DIR = "/home/user/batch-project"

def test_batch_trigger_implementation():
    task_file = os.path.join(PROJECT_DIR, "trigger/tasks.ts")
    assert os.path.exists(task_file), f"{task_file} not found."
    
    with open(task_file, "r") as f:
        content = f.read()
    
    assert "batch.triggerByTaskAndWait" in content or "batch.triggerAndWait" in content
    assert "Promise.all" not in content or "Promise.all" in content and "triggerAndWait" not in content # Promise.all shouldn't be used with triggerAndWait
    assert "unwrap()" in content or ".ok" in content
    assert "childTask" in content
    assert "parentTask" in content
