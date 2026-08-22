# ⚡ DAYFLOW HRMS — HUMAN RESOURCE MANAGEMENT SYSTEM
> *Every workday, perfectly aligned.*

![Dayflow HRMS Banner](https://img.shields.io/badge/Dayflow-HRMS_v1.0-6366f1?style=for-the-badge&logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite_3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

---

## 📌 1. INTRODUCTION & PURPOSE

**Dayflow HRMS** is an enterprise-grade, modern Human Resource Management System built to digitize, streamline, and centralize core HR operations. Designed for high performance, intuitive user experience, and seamless cross-role coordination, Dayflow empowers employees with self-service autonomy while granting HR officers and System Administrators complete governance over workforce operations.

### 🌟 Key Functional Pillars
- **Secure Authentication & RBAC**: Differentiated HTTP 404/401 auth logic, instant password resets, and role isolation between **Employee**, **HR Manager**, and **System Admin**.
- **Real-Time Time & Attendance**: One-click check-in/out, shift duration counters, daily/weekly attendance logs, and org-wide attendance dashboards.
- **Atomic Leave Workflow**: Multi-type leave applications (`PAID`, `SICK`, `UNPAID`), date range validations, atomic HR approval/rejection inbox with comments.
- **INR Payroll & CTC Control**: Transparent monthly salary slips, CTC breakdowns in **₹ (en-IN)**, auto-calculated net take-home salary, and administrative salary structure updates.
- **ESS Profile Vault & Photo Upload**: Direct avatar image uploader, personal details, Indian statutory identifiers (**PAN**, **Aadhaar**, **UAN**, **ESI**), bank account info, and emergency contacts.
- **Security Audit Trail & Analytics**: Real-time attendance trends, department analytics, administrative audit logs, and downloadable salary slip reports.

---

## ⚡ 2. EVALUATOR QUICK DEMO CREDENTIALS

For manual testing and evaluation, the following pre-seeded demo accounts are ready for instant 1-click login:

| Role | Work Email Address | Password | Privileges & Workspace Scope |
| :--- | :--- | :--- | :--- |
| **Employee** | `kumariafprince@gmail.com` *(or `john@dayflow.com`)* | `User@123` | Personal Dashboard, Check-In/Out, Apply Leave, View Payslips in ₹, Edit ESS Profile. |
| **HR Manager** | `rahulbhojpur4299@gmail.com` *(or `hr@dayflow.com`)* | `HR@123` | Employee Directory (Employees only), Org Attendance, Review Leave Inbox, Department Control. |
| **System Admin** | `admin@dayflow.com` | `Admin@123` | Full Governance over Employees & HR, Terminate Accounts, CTC Payroll Control, Audit Trail. |

---

## 🛠️ 3. SYSTEM ARCHITECTURE & TECH STACK

### **Backend Stack**
- **Framework**: FastAPI (Python 3.10+) with async/await concurrency.
- **Database**: SQLite with Async SQLAlchemy ORM & Alembic migrations.
- **Authentication**: OAuth2 Password Bearer with JWT Access Tokens & Passlib Password Hashing.
- **Validation**: Pydantic v2 data validation schemas.
- **Testing**: Pytest & pytest-asyncio integration suite.

### **Frontend Stack**
- **Framework**: React 18 with TypeScript & Vite build engine.
- **State Management**: TanStack React Query v5 & React Context API.
- **Styling**: Vanilla CSS, TailwindCSS, & Lucide React Icon System.
- **Forms & Validation**: React Hook Form with Zod schema resolvers.

---

## 🚀 4. LOCAL INSTALLATION & RUNNING GUIDE

### **Prerequisites**
- **Python**: v3.10 or higher
- **Node.js**: v18.0 or higher
- **Git**: Installed

---

### **Step 1: Clone Repository**
```bash
git clone https://github.com/Prince-git-hub-360/Dayflow-Odoo-Hackathon.git
cd Dayflow-Odoo-Hackathon
```

---

### **Step 2: Start Backend Server**
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
# On Windows PowerShell:
.\.venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI Uvicorn Dev Server
uvicorn app.main:app --reload --port 8000
```
> 🌐 Backend API Documentation: `http://localhost:8000/docs`

---

### **Step 3: Start Frontend Server**
Open a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite Development Server
npm run dev
```
> 💻 Web Application UI: `http://localhost:5173`

---

## 📋 5. DETAILED FUNCTIONAL COMPLIANCE MATRIX

### **3.1 Authentication & Authorization**
- ✅ **Sign Up**: Register using Employee ID, Work Email, Password, First/Last Name, Job Title, and Role selection with compulsory red required asterisks (`*`).
- ✅ **Sign In**: Login with differentiated status code errors: **HTTP 404** for *User Not Found* (with direct CTA to Register) and **HTTP 401** for *Incorrect Password*.
- ✅ **Forgot Password**: Interactive Reset Password modal linked to `/api/v1/auth/reset-password`.

### **3.2 Dashboard**
- ✅ **Employee Dashboard**: Time-based greeting banner (`Good Morning, Rahul Bhojpur! 👋`), quick-access status cards, shift clock-in/out widget, and recent leave activity.
- ✅ **Admin / HR Dashboard**: Org-wide employee overview, live attendance rate counter, pending leave approval inbox, and audit logs.

### **3.3 Employee Profile Management**
- ✅ **ESS Profile Vault**: Employees can edit phone, residential address, emergency contact, Indian statutory IDs (PAN, Aadhaar, UAN), bank account info, and upload direct photo avatar files.
- ✅ **Admin Governance**: System Admin & HR can edit all employee attributes (Name, Job Title, Department, Joining Date) via the **Edit Profile** modal.

### **3.4 Attendance Management**
- ✅ **Check-In / Check-Out**: Live attendance status toggle with active shift duration counter.
- ✅ **Attendance Log**: Daily/weekly attendance logs with status indicators (`PRESENT`, `ABSENT`, `HALF_DAY`, `LEAVE`).

### **3.5 Leave & Time-Off Management**
- ✅ **Apply for Leave**: Select leave type (`PAID`, `SICK`, `UNPAID`), date range, and remarks with date validation (`end_date >= start_date`).
- ✅ **Leave Approval Inbox**: HR/Admin review inbox to approve/reject requests with custom review comments.

### **3.6 Payroll / Salary Management**
- ✅ **Employee View**: Read-only access to monthly salary slips in **₹ (en-IN)** format.
- ✅ **Admin Control**: View payroll for all staff (`/admin/payroll`) and update basic salary, allowances, and deductions with auto-computed net take-home salary.

---

## 🧪 6. TESTING & VERIFICATION

To execute the automated backend integration test suite:
```bash
cd backend
python -m pytest tests
```
Output:
```text
collected 5 items

tests\test_attendance.py .                                               [ 20%]
tests\test_auth.py .                                                     [ 40%]
tests\test_leaves.py .                                                   [ 60%]
tests\test_payroll.py .                                                  [ 80%]
tests\test_rbac.py .                                                     [100%]

============================= 5 passed in 36.41s ==============================
```

To run TypeScript static compilation & frontend production bundle build:
```bash
cd frontend
npx tsc --noEmit
npm run build
```

---

## 📄 7. LICENSE & ACKNOWLEDGEMENTS

Created for the **Odoo Hackathon**. Designed & developed with precision to ensure every workday is perfectly aligned.

- **GitHub Repository**: [`https://github.com/Prince-git-hub-360/Dayflow-Odoo-Hackathon.git`](https://github.com/Prince-git-hub-360/Dayflow-Odoo-Hackathon.git)