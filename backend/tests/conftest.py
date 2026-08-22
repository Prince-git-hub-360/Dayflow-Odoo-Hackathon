import pytest
import pytest_asyncio
import asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.db.database import Base, get_db
from app.main import app
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.employee import Employee
from app.models.department import Department
from app.models.payroll import Payroll

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine_test = create_async_engine(TEST_DATABASE_URL, echo=False)
TestingSessionLocal = async_sessionmaker(
    bind=engine_test, class_=AsyncSession, expire_on_commit=False
)


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def db_session():
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestingSessionLocal() as session:
        # Seed test data
        dept = Department(name="Engineering", description="Test Tech")
        session.add(dept)
        await session.flush()

        # Admin user
        admin = User(
            employee_id="ADM_TEST",
            email="admin_test@dayflow.com",
            password_hash=get_password_hash("Pass@123"),
            role=UserRole.ADMIN,
        )
        session.add(admin)
        await session.flush()
        admin_emp = Employee(
            user_id=admin.id,
            first_name="Admin",
            last_name="Test",
            job_title="Admin Lead",
            department_id=dept.id,
        )
        session.add(admin_emp)

        # HR user
        hr = User(
            employee_id="HR_TEST",
            email="hr_test@dayflow.com",
            password_hash=get_password_hash("Pass@123"),
            role=UserRole.HR,
        )
        session.add(hr)
        await session.flush()
        hr_emp = Employee(
            user_id=hr.id,
            first_name="HR",
            last_name="Test",
            job_title="HR Lead",
            department_id=dept.id,
        )
        session.add(hr_emp)

        # Employee 1
        emp1 = User(
            employee_id="EMP_TEST1",
            email="emp1_test@dayflow.com",
            password_hash=get_password_hash("Pass@123"),
            role=UserRole.EMPLOYEE,
        )
        session.add(emp1)
        await session.flush()
        emp1_profile = Employee(
            user_id=emp1.id,
            first_name="Employee",
            last_name="One",
            job_title="Dev 1",
            department_id=dept.id,
        )
        session.add(emp1_profile)
        await session.flush()
        pay1 = Payroll(
            employee_id=emp1_profile.id,
            basic_salary=60000,
            allowances=5000,
            deductions=2000,
            net_salary=63000,
        )
        session.add(pay1)

        # Employee 2
        emp2 = User(
            employee_id="EMP_TEST2",
            email="emp2_test@dayflow.com",
            password_hash=get_password_hash("Pass@123"),
            role=UserRole.EMPLOYEE,
        )
        session.add(emp2)
        await session.flush()
        emp2_profile = Employee(
            user_id=emp2.id,
            first_name="Employee",
            last_name="Two",
            job_title="Dev 2",
            department_id=dept.id,
        )
        session.add(emp2_profile)

        await session.commit()
        yield session

    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def client(db_session):
    async def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()
