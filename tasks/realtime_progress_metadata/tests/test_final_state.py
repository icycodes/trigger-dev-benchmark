import os
import pytest

PROJECT_DIR = "/home/user/progress-project"

def test_metadata_updates():
    task_file = os.path.join(PROJECT_DIR, "trigger/progress.ts")
    assert os.path.exists(task_file), f"{task_file} not found."
    
    with open(task_file, "r") as f:
        content = f.read()
    
    assert "metadata.set" in content
    assert "progress" in content
    assert "metadata.append" in content
    assert "logs" in content
    assert "wait.for" in content
    assert "10" in content # Loop count
