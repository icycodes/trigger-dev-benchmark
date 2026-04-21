import os
import pytest

PROJECT_DIR = "/home/user/retry-project"

def test_task_retry_config():
    task_file = os.path.join(PROJECT_DIR, "trigger/unreliable-fetch.ts")
    assert os.path.exists(task_file), f"{task_file} not found."
    
    with open(task_file, "r") as f:
        content = f.read()
    
    assert "maxAttempts: 5" in content or "maxAttempts:5" in content
    assert "minTimeoutInMs: 1000" in content or "minTimeoutInMs:1000" in content
    assert "factor: 2" in content or "factor:2" in content

def test_retry_fetch_usage():
    task_file = os.path.join(PROJECT_DIR, "trigger/unreliable-fetch.ts")
    with open(task_file, "r") as f:
        content = f.read()
    
    assert "retry.fetch" in content, "retry.fetch not found."
    assert "500-599" in content, "Retry on status 500-599 not found."
    assert "strategy: \"backoff\"" in content or "strategy:'backoff'" in content or "strategy: \"backoff\"" in content
