import pytest


@pytest.mark.asyncio
async def test_payroll_security(client):
    # 1. Employee login
    res_emp = await client.post(
        "/api/v1/auth/login",
        json={"email": "emp1_test@dayflow.com", "password": "Pass@123"},
    )
    emp_token = res_emp.json()["access_token"]
    emp_headers = {"Authorization": f"Bearer {emp_token}"}

    # 2. Employee views own payroll
    res_me = await client.get("/api/v1/payroll/me", headers=emp_headers)
    assert res_me.status_code == 200
    assert float(res_me.json()["basic_salary"]) == 60000.0

    # 3. Employee attempts to update own salary -> Should be 403 Forbidden
    res_up = await client.patch(
        "/api/v1/payroll/3",
        json={"basic_salary": 999999, "allowances": 0, "deductions": 0},
        headers=emp_headers,
    )
    assert res_up.status_code == 403

    # 4. HR login
    res_hr = await client.post(
        "/api/v1/auth/login",
        json={"email": "hr_test@dayflow.com", "password": "Pass@123"},
    )
    hr_token = res_hr.json()["access_token"]
    hr_headers = {"Authorization": f"Bearer {hr_token}"}

    # 5. HR updates Employee salary
    res_hr_up = await client.patch(
        "/api/v1/payroll/3",
        json={"basic_salary": 75000, "allowances": 8000, "deductions": 3000},
        headers=hr_headers,
    )
    assert res_hr_up.status_code == 200
    updated_pay = res_hr_up.json()
    assert float(updated_pay["basic_salary"]) == 75000.0
    assert float(updated_pay["net_salary"]) == 80000.0
