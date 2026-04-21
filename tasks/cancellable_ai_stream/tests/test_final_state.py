import os
import pytest

PROJECT_DIR = "/home/user/stream-project"

def test_cancellable_stream_logic():
    task_file = os.path.join(PROJECT_DIR, "trigger/ai.ts")
    assert os.path.exists(task_file), f"{task_file} not found."
    
    with open(task_file, "r") as f:
        content = f.read()
    
    assert "streams.define" in content
    assert "streams.input" in content
    assert ".on(" in content
    assert ".append(" in content
    assert "wait.for" in content
    assert "10" in content # Loop count
