from datetime import date, timedelta
from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_hr_or_admin
from app.models.user import User, UserRole
from app.models.employee import Employee
from app.models.department import Department
from app.models.attendance import Attendance, AttendanceStatus
from app.models.leave import LeaveRequest, LeaveStatus, LeaveType
from app.models.payroll import Payroll

router = APIRouter(prefix="/reports", tags=["Reports & Analytics"])


@router.get("/analytics")
async def get_analytics_dashboard(
    current_user: User = Depends(require_hr_or_admin),
    db: AsyncSession = Depends(get_db),
):
    today = date.today()

    # 1. Employee Count
    emp_stmt = select(func.count(Employee.id))
    emp_res = await db.execute(emp_stmt)
    total_employees = emp_res.scalar() or 0

    # 2. Today's Attendance Counts
    att_stmt = select(Attendance.status, func.count(Attendance.id)).where(
        Attendance.date == today
    ).group_by(Attendance.status)
    att_res = await db.execute(att_stmt)
    today_att_map = {status: count for status, count in att_res.all()}

    present_today = today_att_map.get(AttendanceStatus.PRESENT, 0) + today_att_map.get(AttendanceStatus.HALF_DAY, 0)
    absent_today = today_att_map.get(AttendanceStatus.ABSENT, 0)
    on_leave_today = today_att_map.get(AttendanceStatus.LEAVE, 0)

    # 3. Pending Leave Requests
    leave_stmt = select(func.count(LeaveRequest.id)).where(
        LeaveRequest.status == LeaveStatus.PENDING
    )
    leave_res = await db.execute(leave_stmt)
    pending_leaves = leave_res.scalar() or 0

    # 4. Attendance Trends (Past 14 Days)
    fourteen_days_ago = today - timedelta(days=13)
    trend_stmt = (
        select(Attendance.date, Attendance.status, func.count(Attendance.id))
        .where(Attendance.date >= fourteen_days_ago)
        .group_by(Attendance.date, Attendance.status)
        .order_by(Attendance.date.asc())
    )
    trend_res = await db.execute(trend_stmt)
    trend_raw = trend_res.all()

    # Build daily dictionary for 14 days
    date_map = {}
    curr = fourteen_days_ago
    while curr <= today:
        date_str = curr.strftime("%b %d")
        date_map[curr] = {"date": date_str, "present": 0, "absent": 0, "leave": 0}
        curr += timedelta(days=1)

    for d, st, cnt in trend_raw:
        if d in date_map:
            if st in (AttendanceStatus.PRESENT, AttendanceStatus.HALF_DAY):
                date_map[d]["present"] += cnt
            elif st == AttendanceStatus.ABSENT:
                date_map[d]["absent"] += cnt
            elif st == AttendanceStatus.LEAVE:
                date_map[d]["leave"] += cnt

    attendance_trends = list(date_map.values())

    # 5. Leave Type Distribution
    leave_type_stmt = (
        select(LeaveRequest.leave_type, func.count(LeaveRequest.id))
        .group_by(LeaveRequest.leave_type)
    )
    leave_type_res = await db.execute(leave_type_stmt)
    leave_dist = [
        {"type": l_type.value, "count": count}
        for l_type, count in leave_type_res.all()
    ]

    # 6. Department Stats
    dept_stmt = (
        select(
            Department.name,
            func.count(Employee.id).label("employee_count"),
        )
        .outerjoin(Employee, Department.id == Employee.department_id)
        .group_by(Department.name)
    )
    dept_res = await db.execute(dept_stmt)
    department_stats = [
        {"department": dept_name, "employees": count}
        for dept_name, count in dept_res.all()
    ]

    # 7. Payroll Overview
    pay_stmt = select(
        func.sum(Payroll.basic_salary).label("total_basic"),
        func.sum(Payroll.allowances).label("total_allowances"),
        func.sum(Payroll.deductions).label("total_deductions"),
        func.sum(Payroll.net_salary).label("total_net"),
    )
    pay_res = await db.execute(pay_stmt)
    pay_row = pay_res.one_or_none()

    payroll_overview = {
        "total_basic": float(pay_row.total_basic or 0),
        "total_allowances": float(pay_row.total_allowances or 0),
        "total_deductions": float(pay_row.total_deductions or 0),
        "total_net": float(pay_row.total_net or 0),
    }

    return {
        "summary": {
            "total_employees": total_employees,
            "present_today": present_today,
            "absent_today": absent_today,
            "on_leave_today": on_leave_today,
            "pending_leave_requests": pending_leaves,
        },
        "attendance_trends": attendance_trends,
        "leave_distribution": leave_dist,
        "department_stats": department_stats,
        "payroll_overview": payroll_overview,
    }
