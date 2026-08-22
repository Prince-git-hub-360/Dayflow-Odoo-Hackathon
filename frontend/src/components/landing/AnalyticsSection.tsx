import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../context/ThemeContext';

export const AnalyticsSection: React.FC = () => {
  const { resolvedTheme } = useTheme();

  const attendanceData = [
    { name: 'Mon', Present: 118, Absent: 6 },
    { name: 'Tue', Present: 122, Absent: 2 },
    { name: 'Wed', Present: 120, Absent: 4 },
    { name: 'Thu', Present: 115, Absent: 9 },
    { name: 'Fri', Present: 112, Absent: 12 },
  ];

  const departmentData = [
    { name: 'Engineering', value: 45, color: '#6366f1' },
    { name: 'Human Resources', value: 15, color: '#8b5cf6' },
    { name: 'Sales & Marketing', value: 30, color: '#10b981' },
    { name: 'Finance & Operations', value: 20, color: '#f59e0b' },
    { name: 'Customer Support', value: 14, color: '#38bdf8' },
  ];

  const isDark = resolvedTheme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridBorderColor = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-16">
        <Badge variant="info">WORKFORCE INSIGHTS</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          From HR data <br />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
            to better decisions.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
          Monitor weekly check-in consistency, department headcount allocation, and leave trends with theme-responsive Recharts analytics.
        </p>
      </div>

      {/* Analytics Chart Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart 1: Weekly Attendance Bar Chart */}
        <Card className="lg:col-span-7 p-6 space-y-4 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131926] shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Weekly Attendance Breakdown
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Daily Present vs Absent Staff</p>
              </div>
            </div>
            <Badge variant="success">96.5% AVG</Badge>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke={textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={textColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: gridBorderColor,
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="Present" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Absent" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Department Headcount Pie Chart */}
        <Card className="lg:col-span-5 p-6 space-y-4 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131926] shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <PieChartIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Department Distribution
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">124 Total Workforce Staff</p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: gridBorderColor,
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </section>
  );
};
