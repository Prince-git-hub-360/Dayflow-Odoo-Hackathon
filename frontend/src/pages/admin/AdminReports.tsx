import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Users, PieChart as PieChartIcon, IndianRupee } from 'lucide-react';
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
import { useTheme } from '../../context/ThemeContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const AdminReports: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const { data: analytics, isLoading } = useQuery<AnalyticsReport>({
    queryKey: ['adminAnalyticsReport'],
    queryFn: async () => {
      const res = await api.get('/reports/analytics');
      return res.data;
    },
  });

  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#cbd5e1';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Analytics & Organizational Reports
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Real-time backend data visualization for attendance trends, leave distribution, department statistics, and payroll.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : analytics ? (
        <div className="space-y-8">
          {/* Top Row: Attendance Trend Line Chart */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> 14-Day Attendance Performance Trends
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.attendance_trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="date" stroke={textColor} fontSize={12} />
                  <YAxis stroke={textColor} fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: '0.75rem',
                      color: tooltipText,
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
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6">
                <PieChartIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Leave Application Type Breakdown
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
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                        borderRadius: '0.75rem',
                        color: tooltipText,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Department Headcount Bar Chart */}
            <Card className="p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Department Workforce Distribution
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.department_stats}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="department" stroke={textColor} fontSize={11} />
                    <YAxis stroke={textColor} fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                        borderRadius: '0.75rem',
                        color: tooltipText,
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
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6">
              <IndianRupee className="w-5 h-5 text-amber-600 dark:text-amber-400" /> Organization Monthly Payroll Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Basic Salary</p>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  ₹{analytics.payroll_overview.total_basic.toLocaleString('en-IN')}
                </h4>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Allowances</p>
                <h4 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  +₹{analytics.payroll_overview.total_allowances.toLocaleString('en-IN')}
                </h4>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Deductions</p>
                <h4 className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                  -₹{analytics.payroll_overview.total_deductions.toLocaleString('en-IN')}
                </h4>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30">
                <p className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold uppercase">Total Net Disbursement</p>
                <h4 className="text-xl font-extrabold text-indigo-950 dark:text-white mt-1">
                  ₹{analytics.payroll_overview.total_net.toLocaleString('en-IN')}
                </h4>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
};
