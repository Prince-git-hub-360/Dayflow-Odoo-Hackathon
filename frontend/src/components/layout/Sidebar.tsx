import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  CalendarDays,
  FileText,
  DollarSign,
  Bell,
  Users,
  BarChart3,
  ShieldCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const isAdminOrHR = user?.role === 'HR' || user?.role === 'ADMIN';

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, role: 'ALL' },
    { label: 'My Profile', path: '/profile', icon: UserCheck, role: 'ALL' },
    { label: 'Attendance', path: '/attendance', icon: CalendarDays, role: 'ALL' },
    { label: 'Leave Requests', path: '/leaves', icon: FileText, role: 'ALL' },
    { label: 'Payroll & Salary', path: '/payroll', icon: DollarSign, role: 'ALL' },
    { label: 'Notifications', path: '/notifications', icon: Bell, role: 'ALL' },
  ];

  const adminNavItems = [
    { label: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Employees', path: '/admin/employees', icon: Users },
    { label: 'Org Attendance', path: '/admin/attendance', icon: CalendarDays },
    { label: 'Leave Approvals', path: '/admin/leaves', icon: FileText },
    { label: 'Payroll Management', path: '/admin/payroll', icon: DollarSign },
    { label: 'Analytics & Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Audit Trail', path: '/admin/audit-logs', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 glass-card border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-40 bg-slate-950/90">
      <div>
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              Dayflow
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
              Enterprise HRMS
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
          {/* Employee Menu */}
          <div>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Employee Portal
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Admin / HR Menu */}
          {isAdminOrHR && (
            <div>
              <div className="flex items-center justify-between px-3 mb-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                  {user.role} Control
                </p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {user.role}
                </span>
              </div>
              <nav className="space-y-1">
                {adminNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 shrink-0">
              {user?.email[0].toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.email}</p>
              <p className="text-[10px] text-slate-400 capitalize font-medium">{user?.role} Role</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
