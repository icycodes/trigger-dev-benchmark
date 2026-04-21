import os
import pytest

PROJECT_DIR = "/home/user/complex_media_pipeline-app"

def test_pipeline_logic_exists():
    trigger_dir = os.path.join(PROJECT_DIR, "trigger")
    found_try_catch = False
    found_triggers = 0
    
    for filename in os.listdir(trigger_dir):
        if filename.endswith(".ts") or filename.endswith(".js"):
            with open(os.path.join(trigger_dir, filename), "r") as f:
                content = f.read()
                if "try" in content and "catch" in content:
                    found_try_catch = True
                found_triggers += content.count("triggerAndWait")
                    
    assert found_try_catch, "Error handling (try-catch) not found."
    assert found_triggers >= 3, f"Expected at least 3 sub-task triggers, found {found_triggers}."
