import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  DollarSign,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminDashboard: React.FC = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['adminAnalyticsDashboard'],
    queryFn: async () => {
      const res = await api.get('/reports/analytics');
      return res.data;
    },
  });

  const { data: pendingLeaves } = useQuery({
    queryKey: ['pendingLeavesAdmin'],
    queryFn: async () => {
      const res = await api.get('/leaves/all', { params: { status: 'PENDING' } });
      return res.data;
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card rounded-2xl p-8 border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-50/60 via-white to-indigo-50/40 dark:from-purple-950/40 dark:via-slate-900/50 dark:to-indigo-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="warning" className="mb-2">
              HR & Administrative Control Center
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Organization Command Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm font-medium">
              Real-time monitoring of attendance, leave approvals, workforce metrics, and payroll.
            </p>
          </div>
          <Link to="/admin/reports">
            <button className="px-4 py-2.5 rounded-xl bg-purple-100 dark:bg-purple-600/20 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 hover:bg-purple-200 dark:hover:bg-purple-600/30 font-bold text-xs transition-all flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> View Advanced Analytics
            </button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card hoverable className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Total Employees</p>
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              {analytics?.summary?.total_employees || 0}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Active workforce</p>
          </Card>

          <Card hoverable className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Present Today</p>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              {analytics?.summary?.present_today || 0}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">On-duty staff</p>
          </Card>

          <Card hoverable className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Absent Today</p>
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              {analytics?.summary?.absent_today || 0}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Unexcused absences</p>
          </Card>

          <Card hoverable className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">On Leave</p>
              <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              {analytics?.summary?.on_leave_today || 0}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Approved leaves</p>
          </Card>

          <Card hoverable className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Pending Review</p>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              {analytics?.summary?.pending_leave_requests || 0}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Action required</p>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" /> Pending Leave Requests Inbox
            </h2>
            <Link
              to="/admin/leaves"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Review All Requests <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="p-0 overflow-hidden">
            {pendingLeaves && pendingLeaves.length > 0 ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {pendingLeaves.slice(0, 5).map((leave: any) => (
                  <div key={leave.id} className="p-5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-200 text-sm">
                          {leave.employee?.first_name} {leave.employee?.last_name}
                        </span>
                        <Badge variant="info">{leave.leave_type}</Badge>
                        <Badge variant="warning">PENDING</Badge>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                        {leave.start_date} to {leave.end_date} • Reason: "{leave.remarks || 'N/A'}"
                      </p>
                    </div>
                    <Link to="/admin/leaves">
                      <button className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-600/30 text-xs font-bold border border-indigo-200 dark:border-indigo-500/30 transition-all">
                        Review
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8 font-medium">
                No pending leave requests requiring review.
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Administrative Hub</h2>
          <div className="space-y-3">
            <Link to="/admin/employees">
              <Card hoverable className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200">Employee Directory</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Manage all staff profiles & departments</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Card>
            </Link>

            <Link to="/admin/payroll">
              <Card hoverable className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200">Payroll Management</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Update salaries & allowances</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Card>
            </Link>

            <Link to="/admin/audit-logs">
              <Card hoverable className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200">System Audit Trail</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Inspect historical administrative actions</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
