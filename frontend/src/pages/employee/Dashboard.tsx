import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Clock,
  FileText,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Activity,
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
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ThemeSelector } from '../../components/ui/ThemeSelector';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [durationText, setDurationText] = useState<string>('0h 0m');
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Dynamic Time Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ['myAttendanceSummary'],
    queryFn: async () => {
      const res = await api.get('/attendance/me/summary');
      return res.data;
    },
  });

  const { data: myAttendance, refetch: refetchAttendance } = useQuery({
    queryKey: ['myAttendanceRecords'],
    queryFn: async () => {
      const res = await api.get('/attendance/me');
      return res.data;
    },
  });

  const { data: myLeaves } = useQuery({
    queryKey: ['myLeaves'],
    queryFn: async () => {
      const res = await api.get('/leaves/me');
      return res.data;
    },
  });

  const { data: myPayroll } = useQuery({
    queryKey: ['myPayroll'],
    queryFn: async () => {
      const res = await api.get('/payroll/me');
      return res.data;
    },
  });

  // Calculate Check-in Status & Working Duration
  useEffect(() => {
    if (myAttendance && myAttendance.length > 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      const todayRec = myAttendance.find((a: any) => a.date === todayStr);
      if (todayRec && todayRec.check_in && !todayRec.check_out) {
        setIsCheckedIn(true);
        const checkInDate = new Date(todayRec.check_in);
        setCheckInTime(checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        const updateDuration = () => {
          const diffMs = new Date().getTime() - checkInDate.getTime();
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          setDurationText(`${hours}h ${mins}m`);
        };
        updateDuration();
        const interval = setInterval(updateDuration, 60000);
        return () => clearInterval(interval);
      } else {
        setIsCheckedIn(false);
        setDurationText('0h 0m');
      }
    }
  }, [myAttendance]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      await api.post('/attendance/check-in');
      setFeedback('Successfully checked in!');
      refetchAttendance();
      refetchSummary();
    } catch (err: any) {
      setFeedback(err.response?.data?.detail || 'Check-in failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      await api.post('/attendance/check-out');
      setFeedback('Successfully checked out!');
      refetchAttendance();
      refetchSummary();
    } catch (err: any) {
      setFeedback(err.response?.data?.detail || 'Check-out failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Prepare Attendance Chart Data
  const chartData = (myAttendance || []).slice(0, 7).reverse().map((rec: any) => ({
    day: new Date(rec.date).toLocaleDateString([], { weekday: 'short' }),
    hours: rec.hours_worked || (rec.check_in ? 8 : 0),
    rate: 95,
  }));

  // Default Fallback Chart Data if empty
  const displayChartData = chartData.length > 0 ? chartData : [
    { day: 'Mon', hours: 8, rate: 95 },
    { day: 'Tue', hours: 8.5, rate: 98 },
    { day: 'Wed', hours: 7.8, rate: 92 },
    { day: 'Thu', hours: 8.2, rate: 96 },
    { day: 'Fri', hours: 8.0, rate: 95 },
    { day: 'Sat', hours: 0, rate: 0 },
    { day: 'Sun', hours: 0, rate: 0 },
  ];

  const displayName = user?.employee_profile?.first_name
    ? `${user.employee_profile.first_name} ${user.employee_profile.last_name || ''}`.trim()
    : user?.email
    ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
    : 'Employee';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ========================================================================= */}
      {/* TOP HEADER & DASHBOARD COMMAND STRIP */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Personal Workspace
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: {user?.employee_id || 'EMP-001'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {getGreeting()}, {displayName}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Here's your workday status, attendance analytics, and payroll at a glance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSelector />
          <Link to="/profile">
            <div className="flex items-center gap-3 p-1.5 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                {displayName.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{displayName}</p>
                <p className="text-[10px] text-slate-500">{user?.role}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TODAY'S WORKDAY HERO BANNER CARD (REFERENCE 2 DARK GLASS IN DARK MODE) */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800/80 shadow-xl transition-all">
        {/* Glow Effects in Dark Mode */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              TODAY'S WORKDAY TRACKER
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {isCheckedIn ? 'Status: Currently Logged In' : 'Status: Ready for Shift'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {user?.employee_profile?.job_title || 'Software Engineer'} • {user?.employee_profile?.department?.name || 'Engineering'} Department
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-0.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Check-In Time</p>
                <p className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                  {isCheckedIn ? checkInTime : '-- : --'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-0.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Working Duration</p>
                <p className="font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                  {durationText}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-0.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Shift Schedule</p>
                <p className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                  09:00 AM - 05:30 PM
                </p>
              </div>
            </div>

            {feedback && (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> {feedback}
              </p>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center w-full max-w-sm space-y-4 shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Attendance Status</p>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {isCheckedIn ? 'Shift In Progress' : 'Not Checked In Yet'}
                </p>
              </div>

              {isCheckedIn ? (
                <Button
                  variant="danger"
                  className="w-full py-3 text-sm font-bold shadow-lg shadow-rose-600/20 cursor-pointer"
                  onClick={handleCheckOut}
                  isLoading={actionLoading}
                >
                  CHECK OUT NOW
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="w-full py-3 text-sm font-bold shadow-lg shadow-indigo-600/30 cursor-pointer"
                  onClick={handleCheckIn}
                  isLoading={actionLoading}
                >
                  CHECK IN NOW
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* QUICK STATS KPI CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card hoverable className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Attendance Rate
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {summaryLoading ? '...' : `${summary?.attendance_rate || 0}%`}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-1">
            <span className="text-emerald-500 font-bold">+2.4%</span> vs last month
          </p>
        </Card>

        <Card hoverable className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Present Days
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {summaryLoading ? '...' : summary?.present_days || 0} Days
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Logged in 30-day window</p>
        </Card>

        <Card hoverable className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Leave Requests
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {myLeaves ? myLeaves.length : 0} Submitted
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Total leave applications</p>
        </Card>

        <Card hoverable className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Net Take-Home Salary
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {myPayroll ? `₹${Number(myPayroll.net_salary).toLocaleString('en-IN')}` : '₹0'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Monthly net pay structure</p>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* WORKDAY TIMELINE & ATTENDANCE ANALYTICS CHART */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Workday Attendance Timeline (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" /> Workday Timeline
            </h3>
            <span className="text-xs font-bold text-slate-400">{new Date().toLocaleDateString()}</span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            <div className="relative flex items-start gap-3">
              <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Shift Check-In</p>
                <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {isCheckedIn ? checkInTime : '09:00 AM (Scheduled)'}
                </p>
                <p className="text-[10px] text-slate-400">Recorded on Dayflow HRMS</p>
              </div>
            </div>

            <div className="relative flex items-start gap-3">
              <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-white dark:border-slate-900" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Midday Break</p>
                <p className="text-[11px] font-mono text-slate-500">01:00 PM - 02:00 PM</p>
                <p className="text-[10px] text-slate-400">Standard 60 min lunch break</p>
              </div>
            </div>

            <div className="relative flex items-start gap-3">
              <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Shift Check-Out</p>
                <p className="text-[11px] font-mono text-slate-500">05:30 PM (Scheduled)</p>
                <p className="text-[10px] text-slate-400">End of daily working hours</p>
              </div>
            </div>
          </div>

          <Link to="/attendance" className="block pt-2">
            <button className="w-full py-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1">
              <span>View 30-Day Attendance Logs</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Attendance Analytics Area Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-500" /> Weekly Hours & Productivity Trend
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Logged hours over the last 7 shifts</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                Avg 95% Rate
              </span>
            </div>

            <div className="h-48 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="empChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isDark ? '#818cf8' : '#4f46e5'} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={isDark ? '#818cf8' : '#4f46e5'} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                  <XAxis dataKey="day" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} />
                  <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={11} domain={[0, 10]} />
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
                    dataKey="hours"
                    stroke={isDark ? '#818cf8' : '#4f46e5'}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#empChartGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Standard Goal: 40 hrs/week</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">On Track</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEAVE OVERVIEW & PAYROLL CARD GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Leave Applications (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" /> Recent Leave Applications
            </h3>
            <Link
              to="/leaves"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Apply for Leave <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myLeaves && myLeaves.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {myLeaves.slice(0, 4).map((leave: any) => (
                <div key={leave.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-200">
                        {leave.leave_type} Leave
                      </span>
                      <Badge
                        variant={
                          leave.status === 'APPROVED'
                            ? 'success'
                            : leave.status === 'REJECTED'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {leave.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {leave.start_date} to {leave.end_date}
                    </p>
                    {leave.admin_comment && (
                      <p className="text-xs text-indigo-600 dark:text-indigo-300 italic mt-0.5 font-medium">
                        HR Comment: "{leave.admin_comment}"
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(leave.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8 font-medium">
              No leave requests submitted yet.
            </p>
          )}
        </div>

        {/* Payroll Card (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-500" /> Payroll Summary
              </h3>
              <Badge variant="info">ACTIVE PAYSLIP</Badge>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 mt-4 space-y-2">
              <p className="text-[10px] font-extrabold uppercase text-purple-700 dark:text-purple-300 tracking-wider">
                Current Estimated Net Monthly Salary
              </p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {myPayroll ? `₹${Number(myPayroll.net_salary).toLocaleString('en-IN')}` : '₹0'}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-purple-200/60 dark:border-purple-800/40">
                <span>Base Salary: ₹{myPayroll ? Number(myPayroll.base_salary).toLocaleString('en-IN') : '0'}</span>
                <span>Allowances: ₹{myPayroll ? Number(myPayroll.allowances).toLocaleString('en-IN') : '0'}</span>
              </div>
            </div>
          </div>

          <Link to="/payroll">
            <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1 cursor-pointer">
              <span>Inspect Detailed Payslip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
