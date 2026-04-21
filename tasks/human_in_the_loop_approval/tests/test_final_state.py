import os
import pytest

PROJECT_DIR = "/home/user/approval-project"

def test_approval_logic():
    task_file = os.path.join(PROJECT_DIR, "trigger/approval.ts")
    assert os.path.exists(task_file), f"{task_file} not found."
    
    with open(task_file, "r") as f:
        content = f.read()
    
    assert "wait.createToken" in content
    assert "timeout: \"1h\"" in content or "timeout:\"1h\"" in content
    assert "wait.forToken" in content
    assert "approved: true" in content or "approved:true" in content
