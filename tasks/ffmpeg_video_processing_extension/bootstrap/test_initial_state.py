import os
import shutil
import pytest

def test_node_available():
    assert shutil.which("node") is not None, "Node.js binary not found in PATH."
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_trigger_env_vars():
    assert "TRIGGER_PROJECT_REF" in os.environ, "TRIGGER_PROJECT_REF environment variable is not set."
    assert "TRIGGER_SECRET_KEY" in os.environ, "TRIGGER_SECRET_KEY environment variable is not set."
    assert "TRIGGER_CREDENTIAL_CONFIG_JSON" in os.environ, "TRIGGER_CREDENTIAL_CONFIG_JSON environment variable is not set."

def test_trial_id_exists():
    assert os.path.exists("/logs/trial_id"), "/logs/trial_id file not found."

def test_ffmpeg_available():
    # We need ffmpeg/ffprobe for verification later, so check if they are in the environment
    assert shutil.which("ffmpeg") is not None, "ffmpeg binary not found in PATH."
    assert shutil.which("ffprobe") is not None, "ffprobe binary not found in PATH."
