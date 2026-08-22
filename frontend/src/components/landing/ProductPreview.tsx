import React, { useState, useEffect } from 'react';
import {
  Clock,
  FileText,
  DollarSign,
  Users,
  CalendarDays,
  LayoutDashboard,
  Award,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export const ProductPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employee' | 'admin'>('employee');
  const [liveTime, setLiveTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLiveTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
          ' UTC'
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      {/* Tab Selector Pill Bar */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab('employee')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'employee'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Employee Portal View
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'admin'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          HR & Admin Command Center View
        </button>
      </div>

      {/* Browser Mockup Window Container */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#131926]/95 relative overflow-hidden transition-all duration-300">
        {/* macOS Window Controls Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-2 text-[11px] font-mono text-slate-400">
              dayflow-hrms.app / {activeTab === 'employee' ? 'dashboard' : 'admin/dashboard'}
            </span>
          </div>
          <Badge variant="success" size="sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping inline-block" />
            LIVE SYSTEM ACTIVE
          </Badge>
        </div>

        {/* Inner App Canvas Layout (Sidebar + Main Workspace) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 min-h-[360px]">
          {/* Mini Sidebar Preview (Hidden on small mobile) */}
          <div className="hidden md:block md:col-span-3 bg-slate-50 dark:bg-[#0B0F17]/90 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2">
              Workspace Menu
            </div>
            <nav className="space-y-1">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-900">
                <CalendarDays className="w-4 h-4" />
                <span>Attendance</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-900">
                <FileText className="w-4 h-4" />
                <span>Leaves</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-900">
                <DollarSign className="w-4 h-4" />
                <span>Payroll</span>
              </div>
              {activeTab === 'admin' && (
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-900">
                  <Users className="w-4 h-4" />
                  <span>Employees</span>
                </div>
              )}
            </nav>
          </div>

          {/* Main Dashboard Canvas View */}
          <div className="col-span-1 md:col-span-9 space-y-4">
            {/* Header Strip */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  {activeTab === 'employee' ? 'Welcome back, John Doe' : 'HR Manager Command Center'}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  {activeTab === 'employee'
                    ? 'Software Engineer • Tech Department'
                    : 'System Overview • Organization Live Stats'}
                </p>
              </div>
              <Badge variant={activeTab === 'employee' ? 'info' : 'warning'}>
                {activeTab === 'employee' ? 'EMP001' : 'ADMIN ROLE'}
              </Badge>
            </div>

            {/* Content View per Tab */}
            {activeTab === 'employee' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Stat Card 1: Attendance */}
                <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase">
                      Daily Attendance
                    </span>
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-between">
                    <span>Checked In</span>
                    <span className="font-mono text-[10px]">{liveTime || '09:00:00 UTC'}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    Attendance Rate: <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">96.5%</strong>
                  </p>
                </div>

                {/* Stat Card 2: Leave Request */}
                <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase">
                      Leave Status
                    </span>
                    <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs text-slate-900 dark:text-slate-100 font-bold flex items-center justify-between">
                    <span>Paid Vacation</span>
                    <Badge variant="success">APPROVED</Badge>
                  </div>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-300 italic font-semibold">
                    "Approved by HR Manager"
                  </p>
                </div>

                {/* Stat Card 3: Payslip Summary */}
                <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase">
                      Payroll Visibility
                    </span>
                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                    <p className="text-[9px] uppercase text-purple-800 dark:text-purple-300 font-bold">Net Monthly Pay</p>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white">$116,000.00</p>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-500 inline" /> Read-Only View
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Total Staff</p>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">124</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Present Today</p>
                  <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">108</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Pending Review</p>
                  <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">7 Leaves</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-500">On Leave</p>
                  <p className="text-xl font-extrabold text-sky-600 dark:text-sky-400 mt-1">8 Staff</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
