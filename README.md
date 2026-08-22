# ⚡ Dayflow HRMS — Modern Human Resource Management System
> *Every workday, perfectly aligned.*

Dayflow HRMS is an enterprise-grade, full-stack Human Resource Management System designed to streamline core HR operations, automate attendance tracking, streamline atomic leave workflows, provide transparent INR payroll calculations, and enforce robust role-based access control (RBAC).

---

## 🌟 Key Features & Capabilities

### 🔐 1. Secure Authentication & Role Governance
- **Enterprise RBAC**: Role isolation between **Employee**, **HR Manager**, and **System Admin**.
- **Intuitive Auth Flow**: Differentiated status code handling (User Not Found vs Incorrect Password) with direct registration CTAs and instant password reset functionality.

### ⚡ 2. Real-Time Time & Attendance Tracking
- **One-Click Shift Clock-In/Out**: Real-time timer counter tracking live shift duration.
- **Attendance Status Management**: Supports `PRESENT`, `ABSENT`, `HALF_DAY`, and `LEAVE` statuses.
- **Visual Attendance Trends**: Real-time attendance rate counters and interactive historical trend charts.

### 🌴 3. Atomic Leave Management Workflow
- **Multi-Type Leave Applications**: Supports `PAID`, `SICK`, and `UNPAID` leaves with date range validation (`end_date >= start_date`).
- **HR Review Inbox**: Single-click approval/rejection workflow with custom HR review comments.
- **Real-Time Cross-Role Sync**: Status updates reflect instantly across employee and admin dashboards.

### 💰 4. INR Payroll & CTC Calculation Engine
- **Transparent Payslips**: Itemized salary breakdown in **₹ (en-IN)** including Basic Salary, Allowances, Deductions, and Net Take-Home.
- **Admin Payroll Control**: Ability for HR/Admin to update salary structures across the organization.
- **Automatic Net Salary Computation**: Real-time formula calculation ensuring 100% accuracy.

### 👤 5. Employee Self-Service (ESS) Profile Vault
- **Direct Photo Upload**: Instant avatar image upload with client-side preview.
- **Indian Statutory Identifiers**: Secure storage for PAN Card, Aadhaar Card, UAN (EPF), and ESI numbers.
- **Direct Credit Details**: Bank Account Number and IFSC Code management for automated payroll transfers.
- **Protected HR Fields**: Administrative governance locking Job Title, Department, Base CTC, and Employee ID.

### 📊 6. Analytics, Audit Logs & Reports
- **Executive Dashboard**: Comprehensive workforce analytics and department statistics.
- **Security Audit Trail**: Tracks all major administrative actions for full compliance.
- **Downloadable Payslips**: One-click PDF generation for monthly salary slips.

---

## 🔑 Evaluator Demo Credentials

For testing and evaluation, the following pre-configured demo accounts are available:

| Role | Work Email Address | Password | Workspace Scope |
| :--- | :--- | :--- | :--- |
| **Employee** | `kumariafprince@gmail.com` | `User@123` | Self-Service Dashboard, Attendance Check-In/Out, Apply Leave, View Payslips, Edit Profile. |
| **HR Manager** | `rahulbhojpur4299@gmail.com` | `HR@123` | Employee Directory (Employees only), Org Attendance, Review Leave Inbox, Department Management. |
| **System Admin** | `admin@dayflow.com` | `Admin@123` | Full Governance over Employees & HR, Account Termination, CTC Payroll Control, Audit Trail. |

---

## 🛠️ Tech Stack & System Architecture

- **Backend**: Python 3.10+, FastAPI, Async SQLAlchemy ORM, SQLite, Pydantic v2, JWT Authentication.
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, TanStack React Query v5, React Hook Form, Zod.
- **Icons & UI Components**: Lucide React Icons, Recharts, Custom Glassmorphism Theme System.

---

## 🚀 Quick Setup & Installation Guide

### **Prerequisites**
- **Python**: v3.10 or higher
- **Node.js**: v18.0 or higher
- **Git**: Installed

---

### **1. Backend Setup**
```bash
# Navigate to backend folder
cd backend

# Create and activate virtual environment
python -m venv .venv

# Windows PowerShell:
.\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI Uvicorn dev server
uvicorn app.main:app --reload --port 8000
```
> 🌐 Backend API Documentation (Swagger): `http://localhost:8000/docs`

---

### **2. Frontend Setup**
Open a new terminal window:
```bash
# Navigate to frontend folder
cd frontend

# Install Node modules
npm install

# Start Vite development server
npm run dev
```
> 💻 Web Application Interface: `http://localhost:5173`

---

## 🎯 Business Impact & Value Proposition

1. **Decentralized Data Management**: Reduces administrative overhead by empowering employees through self-service profile and leave management.
2. **Statutory & Tax Compliance**: Built-in support for Indian statutory IDs (PAN, Aadhaar, UAN) ensures seamless payroll audits.
3. **Complete Security & Governance**: Role-based permissions guarantee sensitive salary data and employee records remain strictly protected.

---

Designed & developed with precision for the **Odoo Hackathon**.