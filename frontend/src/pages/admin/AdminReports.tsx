import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Users, PieChart as PieChartIcon, DollarSign } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { api } from '../../services/api';
import type { AnalyticsReport } from '../../types';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const AdminReports: React.FC = () => {
  const { data: analytics, isLoading } = useQuery<AnalyticsReport>({
    queryKey: ['adminAnalyticsReport'],
    queryFn: async () => {
      const res = await api.get('/reports/analytics');
      return res.data;
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" /> Analytics & Organizational Reports
        </h1>
        <p className="text-sm text-slate-400">
          Real-time backend data visualization for attendance trends, leave distribution, department statistics, and payroll.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : analytics ? (
        <div className="space-y-8">
          {/* Top Row: Attendance Trend Line Chart */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-indigo-400" /> 14-Day Attendance Performance Trends
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.attendance_trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="present"
                    name="Present"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="absent"
                    name="Absent"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="leave"
                    name="On Leave"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Second Row: Leave Distribution Pie Chart & Department Headcount Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Leave Type Distribution */}
            <Card className="p-6">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-6">
                <PieChartIcon className="w-5 h-5 text-emerald-400" /> Leave Application Type Breakdown
              </h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.leave_distribution}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry: any) => `${entry.type}: ${entry.count}`}
                    >
                      {analytics.leave_distribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Department Headcount Bar Chart */}
            <Card className="p-6">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-purple-400" /> Department Workforce Distribution
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.department_stats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="department" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                      }}
                    />
                    <Bar dataKey="employees" name="Employees" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Bottom Row: Payroll Overview Cards */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-amber-400" /> Organization Monthly Payroll Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold uppercase">Total Basic Salary</p>
                <h4 className="text-xl font-bold text-slate-100 mt-1">
                  ${analytics.payroll_overview.total_basic.toLocaleString()}
                </h4>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold uppercase">Total Allowances</p>
                <h4 className="text-xl font-bold text-emerald-400 mt-1">
                  +${analytics.payroll_overview.total_allowances.toLocaleString()}
                </h4>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold uppercase">Total Deductions</p>
                <h4 className="text-xl font-bold text-rose-400 mt-1">
                  -${analytics.payroll_overview.total_deductions.toLocaleString()}
                </h4>
              </div>
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                <p className="text-xs text-indigo-300 font-semibold uppercase">Total Net Disbursement</p>
                <h4 className="text-xl font-extrabold text-white mt-1">
                  ${analytics.payroll_overview.total_net.toLocaleString()}
                </h4>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
};
