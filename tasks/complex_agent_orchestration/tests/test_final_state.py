import os
import pytest

PROJECT_DIR = "/home/user/agent-project"

def test_agent_orchestration_logic():
    task_file = os.path.join(PROJECT_DIR, "trigger/agent.ts")
    assert os.path.exists(task_file), f"{task_file} not found."
    
    with open(task_file, "r") as f:
        content = f.read()
    
    assert "queue(" in content
    assert "concurrencyLimit: 2" in content or "concurrencyLimit:2" in content
    assert "triggerAndWait" in content
    assert "depth > 2" in content or "depth >= 3" in content or "depth > 2" in content
    assert "insufficient" in content
    assert "researchAgent" in content
    assert "searchTask" in content
