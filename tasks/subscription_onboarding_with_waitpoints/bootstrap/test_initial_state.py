import subprocess

def test_node_installed():
    result = subprocess.run(["node", "--version"], capture_output=True, text=True)
    assert result.returncode == 0
    assert "v24" in result.stdout or "v22" in result.stdout or "v20" in result.stdout

def test_npm_installed():
    result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
    assert result.returncode == 0

def test_pochi_cli_installed():
    result = subprocess.run(["pochi", "--version"], capture_output=True, text=True)
    assert result.returncode == 0

def test_agent_browser_installed():
    result = subprocess.run(["agent-browser", "--version"], capture_output=True, text=True)
    assert result.returncode == 0

def test_home_user_exists():
    import os
    assert os.path.exists("/home/user")
