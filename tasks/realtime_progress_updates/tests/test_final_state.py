import os
import pytest

PROJECT_DIR = "/home/user/realtime_progress_updates-app"

def test_update_metadata_exists():
    trigger_dir = os.path.join(PROJECT_DIR, "trigger")
    found_update = False
    
    for filename in os.listdir(trigger_dir):
        if filename.endswith(".ts") or filename.endswith(".js"):
            with open(os.path.join(trigger_dir, filename), "r") as f:
                content = f.read()
                if "updateMetadata" in content and "progress" in content:
                    found_update = True
                    
    assert found_update, "ctx.run.updateMetadata({ progress: ... }) not found."
