import os
import pytest

PROJECT_DIR = "/home/user/order-project"

def test_idempotency_logic():
    task_file = os.path.join(PROJECT_DIR, "trigger/orders.ts")
    assert os.path.exists(task_file), f"{task_file} not found."
    
    with open(task_file, "r") as f:
        content = f.read()
    
    assert "idempotencyKeys.create" in content
    assert "idempotencyKey" in content
    assert "chargeCustomer" in content
    assert "processOrder" in content
