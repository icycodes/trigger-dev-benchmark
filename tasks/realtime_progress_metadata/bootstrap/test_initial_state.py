import os
import pytest

def test_trial_id_exists():
    assert os.path.exists("/logs/trial_id"), "trial_id file not found."
