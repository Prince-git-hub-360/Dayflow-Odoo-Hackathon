import pytest


@pytest.mark.asyncio
async def test_leave_management_workflow(client):
    # 1. Employee login
    res_emp = await client.post(
        "/api/v1/auth/login",
        json={"email": "emp1_test@dayflow.com", "password": "Pass@123"},
    )
    emp_token = res_emp.json()["access_token"]
    emp_headers = {"Authorization": f"Bearer {emp_token}"}

    # 2. Submit Leave Request
    leave_payload = {
        "leave_type": "PAID",
        "start_date": "2026-09-01",
        "end_date": "2026-09-05",
        "remarks": "Vacation test",
    }
    res_leave = await client.post(
        "/api/v1/leaves/", json=leave_payload, headers=emp_headers
    )
    assert res_leave.status_code == 201
    leave_data = res_leave.json()
    assert leave_data["status"] == "PENDING"
    leave_id = leave_data["id"]

    # 3. HR login
    res_hr = await client.post(
        "/api/v1/auth/login",
        json={"email": "hr_test@dayflow.com", "password": "Pass@123"},
    )
    hr_token = res_hr.json()["access_token"]
    hr_headers = {"Authorization": f"Bearer {hr_token}"}

    # 4. HR Approve Leave
    review_payload = {"status": "APPROVED", "admin_comment": "Approved by HR test"}
    res_review = await client.patch(
        f"/api/v1/leaves/{leave_id}/review",
        json=review_payload,
        headers=hr_headers,
    )
    assert res_review.status_code == 200
    assert res_review.json()["status"] == "APPROVED"

    # 5. Check Employee Notifications
    res_notif = await client.get("/api/v1/notifications/", headers=emp_headers)
    assert res_notif.status_code == 200
    notifs = res_notif.json()
    assert any("APPROVED" in n["title"] for n in notifs)
