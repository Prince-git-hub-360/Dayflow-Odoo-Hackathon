import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  CalendarDays,
  FileText,
  IndianRupee,
  Bell,
  Users,
  ShieldCheck,
  BarChart3,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isEmployee = user?.role === 'EMPLOYEE';

  const employeeLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'My Profile', icon: UserCheck },
    { to: '/attendance', label: 'Attendance Log', icon: CalendarDays },
    { to: '/leaves', label: 'Leave Requests', icon: FileText },
    { to: '/payroll', label: 'Payroll & Payslip', icon: IndianRupee },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/employees', label: 'Employee Directory', icon: Users },
    { to: '/admin/attendance', label: 'Org Attendance', icon: CalendarDays },
    { to: '/admin/leaves', label: 'Leave Approvals', icon: FileText },
    { to: '/admin/payroll', label: 'Payroll Management', icon: IndianRupee },
    { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { to: '/admin/audit-logs', label: 'Audit Trail', icon: ShieldCheck },
  ];

  const links = isEmployee ? employeeLinks : adminLinks;

  const displayName = user?.employee_profile?.first_name
    ? `${user.employee_profile.first_name} ${user.employee_profile.last_name || ''}`
    : user?.email
    ? user.email.split('@')[0]
    : 'User';

  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="w-64 glass-card border-r border-slate-200 dark:border-slate-800/80 h-screen max-h-screen sticky top-0 overflow-y-auto flex flex-col justify-between p-4 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-xl z-40 shrink-0">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-2 border-b border-slate-200 dark:border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-300 bg-clip-text text-transparent">
              Dayflow
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              {isEmployee ? 'Employee Self-Service' : 'HR & Admin Hub'}
            </p>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
            {avatarInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">
              {displayName}
            </p>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
              {user?.employee_profile?.job_title || `${user?.role || 'Employee'}`}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
            Main Menu
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Fixed Sticky Log Out Button */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-2 mt-auto">
        <div className="px-3">
          <Badge variant={user?.role === 'ADMIN' ? 'danger' : user?.role === 'HR' ? 'warning' : 'neutral'} size="sm">
            ROLE: {user?.role}
          </Badge>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};
