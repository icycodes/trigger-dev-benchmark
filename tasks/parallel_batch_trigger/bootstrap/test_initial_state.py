import os
import shutil
import pytest

def test_node_available():
    assert shutil.which("node") is not None, "Node.js not found."

def test_trial_id_exists():
    assert os.path.exists("/logs/trial_id"), "trial_id file not found."
