import os
import shutil
import pytest

def test_node_npm_available():
    assert shutil.which("node") is not None, "node binary not found in PATH."
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_trigger_dev_env_vars():
    assert "TRIGGER_PROJECT_REF" in os.environ, "TRIGGER_PROJECT_REF environment variable is not set."
    assert "TRIGGER_SECRET_KEY" in os.environ, "TRIGGER_SECRET_KEY environment variable is not set."
    assert "TRIGGER_CREDENTIAL_CONFIG_JSON" in os.environ, "TRIGGER_CREDENTIAL_CONFIG_JSON environment variable is not set."

def test_chrome_available():
    chrome_path = "/usr/bin/google-chrome-stable"
    assert os.path.isfile(chrome_path), f"Chrome binary not found at {chrome_path}. Puppeteer requires it."
