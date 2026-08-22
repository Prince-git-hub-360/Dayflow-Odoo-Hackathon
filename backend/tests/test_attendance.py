# pyrefly: ignore [missing-import]
import pytest


@pytest.mark.asyncio
async def test_attendance_workflow(client):
    # Login as emp1
    res = await client.post(
        "/api/v1/auth/login",
        json={"email": "emp1_test@dayflow.com", "password": "Pass@123"},
    )
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Check in
    res_in = await client.post("/api/v1/attendance/check-in", headers=headers)
    assert res_in.status_code == 200
    att_data = res_in.json()
    assert att_data["status"] == "PRESENT"
    assert att_data["check_in"] is not None

    # 2. Duplicate check-in -> 409 Conflict
    res_dup = await client.post("/api/v1/attendance/check-in", headers=headers)
    assert res_dup.status_code == 409

    # 3. Check out
    res_out = await client.post("/api/v1/attendance/check-out", headers=headers)
    assert res_out.status_code == 200
    assert res_out.json()["check_out"] is not None

    # 4. View own attendance history
    res_hist = await client.get("/api/v1/attendance/me", headers=headers)
    assert res_hist.status_code == 200
    assert len(res_hist.json()) >= 1
