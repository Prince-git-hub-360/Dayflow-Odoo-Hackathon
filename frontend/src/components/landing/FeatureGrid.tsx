import React from 'react';
import { UserCheck, CalendarDays, FileText, DollarSign, BarChart3, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const FeatureGrid: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-16">
        <Badge variant="info">CORE HR CAPABILITIES</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Everything HR needs. <br />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
            One connected workspace.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
          Streamline workforce management, attendance tracking, leave requests, and payroll controls into one intuitive enterprise platform.
        </p>
      </div>

      {/* Visual Hierarchy Asymmetric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feature 01: Employee Management (ENLARGED CARD - 2 cols on md) */}
        <Card
          hoverable
          className="md:col-span-2 p-7 space-y-4 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-indigo-500/50 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">01</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Employee Profile Management
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Keep employee information organized and accessible. Manage job titles, department assignments, contact info, and profile pictures. Employees can update phone and address while core employment fields remain protected.
          </p>
        </Card>

        {/* Feature 02: Attendance (Standard) */}
        <Card
          hoverable
          className="p-7 space-y-4 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-emerald-500/50 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">02</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Attendance Tracking
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Track attendance and working patterns with clarity. One-click check-in/out widget with automated status calculation (Present, Half Day, Absent).
          </p>
        </Card>

        {/* Feature 03: Leave Management (Standard) */}
        <Card
          hoverable
          className="p-7 space-y-4 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-purple-500/50 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">03</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Leave Approval Workflows
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Streamline requests, approvals, and leave visibility. Zod date validation for Paid, Sick, and Unpaid leave types with HR reviewer notes.
          </p>
        </Card>

        {/* Feature 04: Payroll Controls (ENLARGED CARD - 2 cols on md) */}
        <Card
          hoverable
          className="md:col-span-2 p-7 space-y-4 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-amber-500/50 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">04</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Payroll Visibility & Controls
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Keep payroll workflows organized and transparent. Employees receive read-only payslip breakdowns (Basic, Allowances, Deductions, Net Pay), while authorized HR/Admin officers update structures safely.
          </p>
        </Card>

        {/* Feature 05: Reports & Analytics (Standard) */}
        <Card
          hoverable
          className="p-7 space-y-4 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-sky-500/50 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">05</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Reports & Analytics
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Turn HR data into actionable insights. Interactive Recharts analytics for department distribution, attendance rates, and leave trends.
          </p>
        </Card>

        {/* Feature 06: Role-Based Access (Standard - spans full on md) */}
        <Card
          hoverable
          className="md:col-span-3 p-7 space-y-3 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-rose-500/50 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">06</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Role-Based Access Control (RBAC)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Give employees, managers, and HR teams the right level of access. Strict backend object-level security prevents unauthorized access across endpoints.
          </p>
        </Card>
      </div>
    </section>
  );
};
