import React, { useState } from 'react';
import {
  Clock,
  FileText,
  IndianRupee,
  Users,
  Search,
  Plus,
  TrendingUp,
  Bell,
  User,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export const ProductPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employee' | 'admin'>('employee');

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      {/* Interactive View Switcher Tabs */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => setActiveTab('employee')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
            activeTab === 'employee'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Option 1: Employee Dashboard View (Dark Glass)</span>
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
            activeTab === 'admin'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 scale-105'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Option 2: HR Command Center View (Minimal)</span>
        </button>
      </div>

      {/* Browser Frame Outer Wrapper */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0B0F17]/95 relative overflow-hidden transition-all duration-300">
        {/* Browser Top Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              dayflow-hrms.app / {activeTab === 'employee' ? 'employee/dashboard' : 'admin/dashboard'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success" size="sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping inline-block" />
              LIVE SYSTEM ACTIVE
            </Badge>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OPTION 1: FUTURISTIC GLASSMORPHISM DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'employee' && (
          <div className="space-y-6 animate-fade-in p-4 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800/80 shadow-2xl text-slate-900 dark:text-white">
            {/* Top Bar inside Mockup */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  dayflow-hrms.app / employee/dashboard
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="success">LIVE SYSTEM ACTIVE</Badge>
              </div>
            </div>

            {/* Mock Header Greeting */}
            <div className="p-5 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold tracking-tight">Good Morning, Sarah Jenkins</h3>
                <p className="text-xs text-slate-400 font-medium">Software Engineer • Tech Department</p>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search..."
                    readOnly
                    className="bg-slate-800 border border-slate-700 rounded-xl text-xs px-9 py-2 w-48 text-white focus:outline-none"
                  />
                </div>
                <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
                  <Bell className="w-4 h-4" />
                </div>
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                  alt="Sarah Jenkins"
                  className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500"
                />
              </div>
            </div>

            {/* 4 Card Grid matching Option 1 generated mockup */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Card 1: Employee Attendance Tracker (4 cols) */}
              <div className="md:col-span-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-slate-900 dark:text-white space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Employee Attendance Tracker
                  </span>
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-300 tracking-wider">
                    Live Check-in Status
                  </span>
                  <p className="text-base font-extrabold text-indigo-900 dark:text-indigo-200">Checked In - 9:08 AM</p>
                </div>

                <div className="flex flex-col items-center text-center pt-1">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                    alt="Sarah J."
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 mb-2"
                  />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sarah J.</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Shift: 9:00 AM - 5:30 PM</p>
                </div>

                <div className="space-y-2 text-xs border-t border-slate-200 dark:border-slate-800 pt-3">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Check In
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 font-semibold">9:08 AM</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="w-2 h-2 rounded-full bg-slate-400" /> Break
                    </span>
                    <span className="font-mono font-semibold">-- : --</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="w-2 h-2 rounded-full bg-slate-400" /> Check Out
                    </span>
                    <span className="font-mono font-semibold">-- : --</span>
                  </div>
                </div>

                <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm">
                  VIEW TIMELINE
                </button>
              </div>

              {/* Middle Section: Leave Status + Payroll (4 cols) */}
              <div className="md:col-span-4 space-y-5">
                {/* Leave Approval Status */}
                <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-slate-900 dark:text-white space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Leave Approval Status
                    </span>
                    <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Pending Requests (3)</p>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                      <span className="font-medium text-slate-800 dark:text-slate-200">John Doe - Annual (12-14 Oct)</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                        PENDING
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                      <span className="font-medium text-slate-800 dark:text-slate-200">Emily Davis - Sick (5 Oct)</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        APPROVED
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1">
                      <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                        <span className="font-medium">Robert Smith - Annual</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">4 Days</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button className="flex-1 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold">
                          Approve
                        </button>
                        <button className="flex-1 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded text-[10px] font-bold">
                          Deny
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payroll Take-Home Summary */}
                <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-slate-900 dark:text-white space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Payroll Take-Home Summary
                    </span>
                    <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                    <p className="text-[10px] uppercase text-purple-600 dark:text-purple-300 font-bold">Monthly Estimated Net Pay</p>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">₹70,833.00</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                      <span>Gross CTC: ₹85,000.00</span>
                      <span>Deductions: ₹14,167.00</span>
                    </div>
                  </div>

                  <button className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition-colors">
                    View Payslip Details
                  </button>
                </div>
              </div>

              {/* Right Section: Analytics Chart (4 cols) */}
              <div className="md:col-span-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-slate-900 dark:text-white space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Analytics Chart
                    </span>
                    <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Workforce Productivity (Last 7 Days)</p>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">Avg. 94% Efficiency</p>

                  {/* Mock Line Graph */}
                  <div className="h-36 w-full mt-4 flex items-end justify-between gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-800">
                    {[65, 80, 75, 94, 88, 92, 96].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t transition-all duration-300"
                          style={{ height: `${val}%` }}
                        />
                        <span className="text-[9px] text-slate-500">Day {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span>Average Engagement</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">91%</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span>Absenteeism Rate</span>
                    <strong className="text-indigo-600 dark:text-indigo-400 font-bold">2.1%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* OPTION 2: HR COMMAND CENTER (CLEAN MINIMALIST INTERFACE MATCHING GENERATED MOCKUP) */}
        {/* ========================================================================= */}
        {activeTab === 'admin' && (
          <div className="space-y-6 animate-fade-in text-slate-900 dark:text-slate-100">
            {/* Top Command Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-extrabold tracking-tight">
                  Dayflow HRMS Dashboard | Good Morning, HR Manager
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  System Overview • Organization Live Stats
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search employees, reports..."
                    readOnly
                    className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs px-9 py-2 w-56 focus:outline-none"
                  />
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add New Employee</span>
                </button>
              </div>
            </div>

            {/* Top Grid: Employee Overview (Left 7 cols) + Attendance Trends (Right 5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Employee Overview Cards Grid */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Employee Overview
                  </h4>
                  <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View all
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      name: 'Emily Carter',
                      role: 'HR Manager',
                      status: 'ACTIVE',
                      dept: 'HR',
                      loc: 'Bengaluru',
                      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                    },
                    {
                      name: 'David Chen',
                      role: 'Senior Developer',
                      status: 'REMOTE',
                      dept: 'Engineering',
                      loc: 'Hyderabad',
                      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                    },
                    {
                      name: 'Aisha Khan',
                      role: 'Product Designer',
                      status: 'ACTIVE',
                      dept: 'Design',
                      loc: 'Pune',
                      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    },
                    {
                      name: 'Liam O\'Connell',
                      role: 'Marketing Lead',
                      status: 'ACTIVE',
                      dept: 'Marketing',
                      loc: 'Mumbai',
                      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                    },
                  ].map((emp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-1.5"
                    >
                      <img
                        src={emp.img}
                        alt={emp.name}
                        className="w-12 h-12 rounded-full object-cover mx-auto border-2 border-indigo-500"
                      />
                      <h5 className="text-xs font-extrabold truncate">{emp.name}</h5>
                      <p className="text-[10px] text-slate-500 truncate">{emp.role}</p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                          emp.status === 'ACTIVE'
                            ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {emp.status}
                      </span>
                      <p className="text-[9px] text-slate-400 pt-1">{emp.dept} • {emp.loc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance Trends Area Graph */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Attendance Trends
                    </h4>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Today: 98% Present
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Aug 1 - Aug 25 • Avg: 94%</p>

                  {/* Gradient Area Chart Representation */}
                  <div className="h-40 w-full mt-4 relative flex items-end">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Benchmark Line */}
                      <line x1="0" y1="30" x2="300" y2="30" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1" />
                      {/* Area Fill */}
                      <path
                        d="M0,80 Q50,20 100,50 T200,30 T300,40 L300,120 L0,120 Z"
                        fill="url(#chartGradient)"
                      />
                      {/* Area Line */}
                      <path
                        d="M0,80 Q50,20 100,50 T200,30 T300,40"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Aug 1</span>
                  <span>Aug 10</span>
                  <span>Aug 17</span>
                  <span>Aug 25</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Leave Requests Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Leave Requests
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="pb-2.5">Employee Name</th>
                      <th className="pb-2.5">Type</th>
                      <th className="pb-2.5">Dates</th>
                      <th className="pb-2.5">Reason</th>
                      <th className="pb-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {[
                      { name: 'Emily Carter', type: 'Annual', dates: 'Aug 28-31', reason: 'Vacation Trip', status: 'Pending' },
                      { name: 'David Chen', type: 'Sick', dates: 'Aug 26', reason: 'Medical Checkup', status: 'Approved' },
                      { name: 'Aisha Khan', type: 'Annual', dates: 'Sep 10-15', reason: 'Personal Leave', status: 'Pending' },
                      { name: 'Liam O\'Connell', type: 'Annual', dates: 'Sep 1-3', reason: 'Family Event', status: 'Approved' },
                    ].map((req, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                            {req.name.charAt(0)}
                          </div>
                          <span>{req.name}</span>
                        </td>
                        <td className="py-2.5 text-slate-600 dark:text-slate-300">{req.type}</td>
                        <td className="py-2.5 text-slate-600 dark:text-slate-300 font-mono">{req.dates}</td>
                        <td className="py-2.5 text-slate-500">{req.reason}</td>
                        <td className="py-2.5 text-right">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                              req.status === 'Approved'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
