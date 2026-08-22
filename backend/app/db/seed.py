import asyncio
from datetime import date, datetime, timedelta, timezone
from sqlalchemy import select
from app.db.database import engine, Base, AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.department import Department
from app.models.employee import Employee
from app.models.attendance import Attendance, AttendanceStatus
from app.models.leave import LeaveRequest, LeaveType, LeaveStatus
from app.models.payroll import Payroll
from app.models.notification import Notification, NotificationType
from app.models.audit_log import AuditLog
import app.db.base


async def seed_data():
    print("Initializing Database Tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if users already seeded
        res = await session.execute(select(User))
        existing_users = res.scalars().all()
        if existing_users:
            print("Database already seeded. Skipping...")
            return

        print("Seeding Departments...")
        depts = [
            Department(name="Engineering", description="Software development & system engineering"),
            Department(name="Human Resources", description="Talent acquisition & employee relations"),
            Department(name="Product Management", description="Product design & feature planning"),
            Department(name="Sales & Marketing", description="Business growth & client outreach"),
        ]
        session.add_all(depts)
        await session.flush()

        eng_dept = depts[0]
        hr_dept = depts[1]
        prod_dept = depts[2]
        sales_dept = depts[3]

        print("Seeding Users & Employee Profiles...")
        # 1. Admin User
        admin_user = User(
            employee_id="ADM001",
            email="admin@dayflow.com",
            password_hash=get_password_hash("Admin@123"),
            role=UserRole.ADMIN,
        )
        session.add(admin_user)
        await session.flush()

        admin_emp = Employee(
            user_id=admin_user.id,
            first_name="Alexander",
            last_name="Wright",
            phone="+1 (555) 019-2831",
            address="100 Enterprise Way, Suite 500, San Francisco, CA",
            job_title="Chief Operations Officer & Admin",
            department_id=eng_dept.id,
            joining_date=date(2023, 1, 15),
        )
        session.add(admin_emp)

        # 2. HR User
        hr_user = User(
            employee_id="HRM001",
            email="hr@dayflow.com",
            password_hash=get_password_hash("HR@123"),
            role=UserRole.HR,
        )
        session.add(hr_user)
        await session.flush()

        hr_emp = Employee(
            user_id=hr_user.id,
            first_name="Samantha",
            last_name="Reed",
            phone="+1 (555) 018-9922",
            address="450 Corporate Blvd, Oakland, CA",
            job_title="Senior HR Manager",
            department_id=hr_dept.id,
            joining_date=date(2023, 3, 10),
        )
        session.add(hr_emp)

        # 3. Employee 1 (John Doe - Demo Employee)
        emp1_user = User(
            employee_id="EMP001",
            email="john@dayflow.com",
            password_hash=get_password_hash("User@123"),
            role=UserRole.EMPLOYEE,
        )
        session.add(emp1_user)
        await session.flush()

        emp1 = Employee(
            user_id=emp1_user.id,
            first_name="John",
            last_name="Doe",
            phone="+1 (555) 014-4321",
            address="742 Evergreen Terrace, San Jose, CA",
            job_title="Senior Full Stack Engineer",
            department_id=eng_dept.id,
            joining_date=date(2023, 6, 1),
        )
        session.add(emp1)

        # 4. Employee 2 (Sarah Connor)
        emp2_user = User(
            employee_id="EMP002",
            email="sarah@dayflow.com",
            password_hash=get_password_hash("User@123"),
            role=UserRole.EMPLOYEE,
        )
        session.add(emp2_user)
        await session.flush()

        emp2 = Employee(
            user_id=emp2_user.id,
            first_name="Sarah",
            last_name="Connor",
            phone="+1 (555) 017-8811",
            address="1204 Cyberdyne Way, Palo Alto, CA",
            job_title="Product Manager",
            department_id=prod_dept.id,
            joining_date=date(2023, 8, 15),
        )
        session.add(emp2)

        # 5. Employee 3 (Mike Ross)
        emp3_user = User(
            employee_id="EMP003",
            email="mike@dayflow.com",
            password_hash=get_password_hash("User@123"),
            role=UserRole.EMPLOYEE,
        )
        session.add(emp3_user)
        await session.flush()

        emp3 = Employee(
            user_id=emp3_user.id,
            first_name="Mike",
            last_name="Ross",
            phone="+1 (555) 012-7744",
            address="88 Pearson Specter Ave, San Francisco, CA",
            job_title="Account Executive",
            department_id=sales_dept.id,
            joining_date=date(2024, 1, 10),
        )
        session.add(emp3)

        # 6. Employee 4 (Emily Watson)
        emp4_user = User(
            employee_id="EMP004",
            email="emily@dayflow.com",
            password_hash=get_password_hash("User@123"),
            role=UserRole.EMPLOYEE,
        )
        session.add(emp4_user)
        await session.flush()

        emp4 = Employee(
            user_id=emp4_user.id,
            first_name="Emily",
            last_name="Watson",
            phone="+1 (555) 016-3399",
            address="350 Innovation Way, Berkeley, CA",
            job_title="Frontend UI/UX Specialist",
            department_id=eng_dept.id,
            joining_date=date(2024, 2, 1),
        )
        session.add(emp4)

        await session.flush()
        employees = [admin_emp, hr_emp, emp1, emp2, emp3, emp4]

        print("Seeding Payroll Structures...")
        payrolls = [
            Payroll(employee_id=admin_emp.id, basic_salary=140000, allowances=15000, deductions=5000, net_salary=150000),
            Payroll(employee_id=hr_emp.id, basic_salary=95000, allowances=8000, deductions=3000, net_salary=100000),
            Payroll(employee_id=emp1.id, basic_salary=110000, allowances=10000, deductions=4000, net_salary=116000),
            Payroll(employee_id=emp2.id, basic_salary=105000, allowances=9000, deductions=3500, net_salary=110500),
            Payroll(employee_id=emp3.id, basic_salary=85000, allowances=12000, deductions=2500, net_salary=94500),
            Payroll(employee_id=emp4.id, basic_salary=90000, allowances=7000, deductions=2800, net_salary=94200),
        ]
        session.add_all(payrolls)

        print("Seeding 30 Days of Historical Attendance...")
        today = date.today()
        for emp in employees:
            for i in range(30, 0, -1):
                past_date = today - timedelta(days=i)
                # Skip weekends
                if past_date.weekday() in (5, 6):
                    continue

                status = AttendanceStatus.PRESENT
                if (i + emp.id) % 9 == 0:
                    status = AttendanceStatus.ABSENT
                elif (i + emp.id) % 13 == 0:
                    status = AttendanceStatus.HALF_DAY
                elif (i + emp.id) % 17 == 0:
                    status = AttendanceStatus.LEAVE

                in_time = None
                out_time = None
                if status in (AttendanceStatus.PRESENT, AttendanceStatus.HALF_DAY):
                    in_dt = datetime.combine(past_date, datetime.min.time()).replace(
                        hour=9, minute=0, tzinfo=timezone.utc
                    )
                    out_dt = datetime.combine(past_date, datetime.min.time()).replace(
                        hour=17 if status == AttendanceStatus.PRESENT else 13,
                        minute=0,
                        tzinfo=timezone.utc,
                    )
                    in_time = in_dt
                    out_time = out_dt

                att = Attendance(
                    employee_id=emp.id,
                    date=past_date,
                    check_in=in_time,
                    check_out=out_time,
                    status=status,
                )
                session.add(att)

        print("Seeding Leave Requests...")
        leaves = [
            LeaveRequest(
                employee_id=emp1.id,
                leave_type=LeaveType.PAID,
                start_date=today + timedelta(days=5),
                end_date=today + timedelta(days=7),
                remarks="Annual family vacation request",
                status=LeaveStatus.PENDING,
            ),
            LeaveRequest(
                employee_id=emp2.id,
                leave_type=LeaveType.SICK,
                start_date=today - timedelta(days=10),
                end_date=today - timedelta(days=9),
                remarks="Doctor appointment and recovery",
                status=LeaveStatus.APPROVED,
                admin_comment="Approved with medical certificate.",
                reviewed_by=hr_user.id,
                reviewed_at=datetime.now(timezone.utc) - timedelta(days=11),
            ),
            LeaveRequest(
                employee_id=emp3.id,
                leave_type=LeaveType.UNPAID,
                start_date=today - timedelta(days=15),
                end_date=today - timedelta(days=12),
                remarks="Personal leave for travel",
                status=LeaveStatus.REJECTED,
                admin_comment="Project deployment sprint in progress.",
                reviewed_by=admin_user.id,
                reviewed_at=datetime.now(timezone.utc) - timedelta(days=16),
            ),
        ]
        session.add_all(leaves)

        print("Seeding Notifications...")
        notifs = [
            Notification(
                user_id=emp1_user.id,
                title="Welcome to Dayflow HRMS",
                message="Your employee account is fully active. Use the dashboard to log attendance.",
                notification_type=NotificationType.GENERAL,
                is_read=True,
            ),
            Notification(
                user_id=emp1_user.id,
                title="Leave Application Received",
                message="Your Paid Leave request for next week is currently PENDING review by HR.",
                notification_type=NotificationType.LEAVE_SUBMITTED,
                is_read=False,
            ),
            Notification(
                user_id=emp2_user.id,
                title="Leave Request Approved",
                message="Your Sick Leave request has been APPROVED by Samantha Reed.",
                notification_type=NotificationType.LEAVE_APPROVED,
                is_read=False,
            ),
        ]
        session.add_all(notifs)

        print("Seeding Audit Logs...")
        audits = [
            AuditLog(
                actor_user_id=admin_user.id,
                action="SYSTEM_INITIALIZED",
                entity_type="System",
                metadata_json={"env": "hackathon_demo"},
            ),
            AuditLog(
                actor_user_id=hr_user.id,
                action="LEAVE_APPROVED",
                entity_type="LeaveRequest",
                entity_id=2,
                metadata_json={"employee": "Sarah Connor", "type": "SICK"},
            ),
        ]
        session.add_all(audits)

        await session.commit()
        print("SEED DATA SUCCESSFULLY CREATED!")


if __name__ == "__main__":
    asyncio.run(seed_data())
