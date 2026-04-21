import os
import pytest

PROJECT_DIR = "/home/user/ai_agent_refinement_loop-app"

def test_ai_tool_exists():
    trigger_dir = os.path.join(PROJECT_DIR, "trigger")
    found_ai_tool = False
    
    for filename in os.listdir(trigger_dir):
        if filename.endswith(".ts") or filename.endswith(".js"):
            with open(os.path.join(trigger_dir, filename), "r") as f:
                content = f.read()
                if "ai.tool" in content:
                    found_ai_tool = True
                    
    assert found_ai_tool, "ai.tool integration not found."
