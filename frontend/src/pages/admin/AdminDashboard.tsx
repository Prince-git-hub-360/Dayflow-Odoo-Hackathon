import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  TrendingUp,
  ShieldCheck,
  Plus,
  Check,
  X,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ThemeSelector } from '../../components/ui/ThemeSelector';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Dynamic Time Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const { data: analytics } = useQuery({
    queryKey: ['adminAnalyticsDashboard'],
    queryFn: async () => {
      const res = await api.get('/reports/analytics');
      return res.data;
    },
  });

  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ['adminEmployeesList'],
    queryFn: async () => {
      const res = await api.get('/employees');
      return res.data;
    },
  });

  const { data: pendingLeaves, refetch: refetchLeaves } = useQuery({
    queryKey: ['pendingLeavesAdmin'],
    queryFn: async () => {
      const res = await api.get('/leaves/all', { params: { status: 'PENDING' } });
      return res.data;
    },
  });

  const { data: auditLogs } = useQuery({
    queryKey: ['adminAuditLogsDashboard'],
    queryFn: async () => {
      const res = await api.get('/audit-logs/');
      return res.data;
    },
  });

  const queryClient = useQueryClient();

  const handleReviewLeave = async (leaveId: number, status: 'APPROVED' | 'REJECTED') => {
    setActionLoading(leaveId);
    try {
      await api.put(`/leaves/${leaveId}/review`, { status, admin_comment: `Reviewed by ${user?.email}` });
      queryClient.invalidateQueries({ queryKey: ['myLeaves'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalyticsDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['adminAuditLogsDashboard'] });
      refetchLeaves();
    } catch (err) {
      console.error('Leave review failed', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Mock Attendance Chart Data matching Reference 1 & 2
  const attendanceTrendData = [
    { date: 'Aug 1', rate: 70 },
    { date: 'Aug 5', rate: 75 },
    { date: 'Aug 10', rate: 94 },
    { date: 'Aug 15', rate: 72 },
    { date: 'Aug 20', rate: 96 },
    { date: 'Aug 25', rate: 98 },
  ];


  const hrName = user?.employee_profile?.first_name
    ? `${user.employee_profile.first_name} ${user.employee_profile.last_name || ''}`.trim()
    : user?.email?.split('@')[0] || 'HR Manager';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ========================================================================= */}
      {/* HR COMMAND CENTER HEADER (MATCHING REFERENCE 1 TOP BAR) */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="warning">HR & Administrative Command Center</Badge>
            <span className="text-xs text-slate-500 font-mono">ROLE: {user?.role}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {getGreeting()}, {hrName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Here's what's happening across your workforce today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSelector />
          <Link to="/admin/employees">
            <Button variant="primary" className="shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>Add New Employee</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WORKFORCE KPI CARDS GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card hoverable className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Employees
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {analytics?.summary?.total_employees || (employees ? employees.length : 12)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Active workforce</p>
        </Card>

        <Card hoverable className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Present Today
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {analytics?.summary?.present_today || 10}
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-bold">98% On-Duty Rate</p>
        </Card>

        <Card hoverable className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Absent Today
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {analytics?.summary?.absent_today || 1}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Unexcused absence</p>
        </Card>

        <Card hoverable className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              On Leave Today
            </span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {analytics?.summary?.on_leave_today || 1}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Approved leave</p>
        </Card>

        <Card hoverable className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Review
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {pendingLeaves ? pendingLeaves.length : 0}
          </h3>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-bold">Action required</p>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* EMPLOYEE OVERVIEW (REFERENCE 1 LEFT) & ATTENDANCE TRENDS (REFERENCE 1 RIGHT) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Employee Overview Cards Grid (7 cols - Reference 1 Style) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" /> Employee Overview
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">Quick staff overview & status</p>
            </div>
            <Link to="/admin/employees" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              View all
            </Link>
          </div>

          {employeesLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {(employees || []).slice(0, 4).map((emp: any, idx: number) => {
                const name = `${emp.first_name || 'Staff'} ${emp.last_name || ''}`;
                return (
                  <Link key={emp.id || idx} to={`/admin/employees/${emp.id}`}>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all text-center space-y-1.5 cursor-pointer hover:shadow-md">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm mx-auto shadow-sm">
                        {emp.first_name ? emp.first_name.charAt(0) : 'E'}
                      </div>
                      <h4 className="text-xs font-extrabold truncate text-slate-900 dark:text-slate-100">{name}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{emp.job_title || 'Employee'}</p>
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        ACTIVE
                      </span>
                      <p className="text-[9px] text-slate-400 pt-1">{emp.department?.name || 'Department'}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Attendance Trends Chart (5 cols - Reference 1 & 2 Right Chart) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Attendance Trends
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Aug 1 - Aug 25</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Today: 98% Present</span>
            </div>

            <div className="h-44 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hrTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isDark ? '#6366f1' : '#4f46e5'} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={isDark ? '#6366f1' : '#4f46e5'} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                  <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} />
                  <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      borderRadius: '0.75rem',
                      color: isDark ? '#ffffff' : '#0f172a',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke={isDark ? '#6366f1' : '#4f46e5'}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#hrTrendGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Average Attendance Threshold</span>
            <strong className="text-indigo-600 dark:text-indigo-400">94% Target Met</strong>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEAVE REQUEST INBOX & HR ACTIVITY AUDIT TRAIL */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leave Requests Table (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" /> Pending Leave Requests Inbox
            </h3>
            <Link to="/admin/leaves" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Review All Requests
            </Link>
          </div>

          {pendingLeaves && pendingLeaves.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="pb-2.5">Employee</th>
                    <th className="pb-2.5">Type</th>
                    <th className="pb-2.5">Dates</th>
                    <th className="pb-2.5">Reason</th>
                    <th className="pb-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {pendingLeaves.slice(0, 5).map((leave: any) => (
                    <tr key={leave.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 font-bold text-slate-900 dark:text-slate-100">
                        {leave.employee?.first_name || 'Staff'} {leave.employee?.last_name || ''}
                      </td>
                      <td className="py-3">
                        <Badge variant="info">{leave.leave_type}</Badge>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {leave.start_date} to {leave.end_date}
                      </td>
                      <td className="py-3 text-slate-500 max-w-[150px] truncate">{leave.remarks || 'Personal'}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleReviewLeave(leave.id, 'APPROVED')}
                            disabled={actionLoading === leave.id}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-xs cursor-pointer"
                          >
                            <Check className="w-3 h-3 inline mr-0.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleReviewLeave(leave.id, 'REJECTED')}
                            disabled={actionLoading === leave.id}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold shadow-xs cursor-pointer"
                          >
                            <X className="w-3 h-3 inline mr-0.5" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8 font-medium">
              No pending leave requests requiring review.
            </p>
          )}
        </div>

        {/* Audit Log / Recent Activity Feed (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-500" /> Recent System Audit Logs
              </h3>
              <Link to="/admin/audit-logs" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Audit Trail
              </Link>
            </div>

            {auditLogs && auditLogs.length > 0 ? (
              <div className="space-y-3 pt-3">
                {auditLogs.slice(0, 4).map((log: any) => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-200">{log.action}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{log.details || 'System event logged'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6 font-medium">
                No recent audit log activity.
              </p>
            )}
          </div>

          <Link to="/admin/audit-logs" className="block pt-2">
            <button className="w-full py-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1">
              <span>View Full Security Audit Trail</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
