import os
import shutil
import subprocess
import pytest

def test_node_binary_available():
    assert shutil.which("node") is not None, "node binary not found in PATH."

def test_npm_binary_available():
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_npx_binary_available():
    assert shutil.which("npx") is not None, "npx binary not found in PATH."

def test_python_binary_available():
    assert shutil.which("python3") is not None, "python3 binary not found in PATH."

def test_pip_binary_available():
    assert shutil.which("pip3") is not None, "pip3 binary not found in PATH."

def test_home_directory_exists():
    assert os.path.isdir("/home/user"), "/home/user directory does not exist."
