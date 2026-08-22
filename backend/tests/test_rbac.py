import pytest


@pytest.mark.asyncio
async def test_rbac_and_object_level_authorization(client):
    # 1. Login as standard Employee (emp1_test@dayflow.com)
    res_emp = await client.post(
        "/api/v1/auth/login",
        json={"email": "emp1_test@dayflow.com", "password": "Pass@123"},
    )
    assert res_emp.status_code == 200
    emp1_token = res_emp.json()["access_token"]
    emp1_headers = {"Authorization": f"Bearer {emp1_token}"}

    # 2. Employee attempting to access Admin endpoint (/api/v1/employees/) -> Should be 403 Forbidden
    res_admin_ep = await client.get("/api/v1/employees/", headers=emp1_headers)
    assert res_admin_ep.status_code == 403

    # 3. Employee attempting to access Employee 2's payroll (/api/v1/payroll/4) -> Should be 403 Forbidden
    res_other_pay = await client.get("/api/v1/payroll/4", headers=emp1_headers)
    assert res_other_pay.status_code == 403

    # 4. Login as HR User (hr_test@dayflow.com)
    res_hr = await client.post(
        "/api/v1/auth/login",
        json={"email": "hr_test@dayflow.com", "password": "Pass@123"},
    )
    assert res_hr.status_code == 200
    hr_token = res_hr.json()["access_token"]
    hr_headers = {"Authorization": f"Bearer {hr_token}"}

    # 5. HR user accessing employee list -> Allowed (200 OK)
    res_hr_list = await client.get("/api/v1/employees/", headers=hr_headers)
    assert res_hr_list.status_code == 200
    assert len(res_hr_list.json()) >= 4
