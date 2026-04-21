import os
import pytest

PROJECT_DIR = "/home/user/human_in_the_loop_approval-app"

def test_wait_for_token_exists():
    trigger_dir = os.path.join(PROJECT_DIR, "trigger")
    found_token = False
    
    for filename in os.listdir(trigger_dir):
        if filename.endswith(".ts") or filename.endswith(".js"):
            with open(os.path.join(trigger_dir, filename), "r") as f:
                content = f.read()
                if 'wait.forToken("manager-approval")' in content or "wait.forToken('manager-approval')" in content:
                    found_token = True
                    
    assert found_token, "wait.forToken('manager-approval') not found."
