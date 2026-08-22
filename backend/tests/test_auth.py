import pytest


@pytest.mark.asyncio
async def test_register_and_login(client):
    # 1. Successful Register
    reg_payload = {
        "employee_id": "NEW001",
        "email": "newuser@dayflow.com",
        "password": "Password@123",
        "first_name": "New",
        "last_name": "User",
        "job_title": "Engineer",
        "role": "EMPLOYEE",
    }
    res = await client.post("/api/v1/auth/register", json=reg_payload)
    assert res.status_code == 201
    data = res.json()
    assert data["email"] == "newuser@dayflow.com"
    assert data["role"] == "EMPLOYEE"

    # 2. Duplicate Registration Conflict
    res_dup = await client.post("/api/v1/auth/register", json=reg_payload)
    assert res_dup.status_code == 409

    # 3. Successful Login
    login_payload = {"email": "newuser@dayflow.com", "password": "Password@123"}
    res_login = await client.post("/api/v1/auth/login", json=login_payload)
    assert res_login.status_code == 200
    tokens = res_login.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens

    # 4. Invalid Login Credentials
    res_bad = await client.post(
        "/api/v1/auth/login",
        json={"email": "newuser@dayflow.com", "password": "WrongPassword"},
    )
    assert res_bad.status_code == 401

    # 5. Access Protected Endpoint /auth/me
    token = tokens["access_token"]
    res_me = await client.get(
        "/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert res_me.status_code == 200
    assert res_me.json()["email"] == "newuser@dayflow.com"
