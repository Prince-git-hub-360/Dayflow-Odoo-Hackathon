import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  FileText,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

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

  useEffect(() => {
    if (myAttendance && myAttendance.length > 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      const todayRec = myAttendance.find((a: any) => a.date === todayStr);
      if (todayRec && todayRec.check_in && !todayRec.check_out) {
        setIsCheckedIn(true);
        setCheckInTime(new Date(todayRec.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        setIsCheckedIn(false);
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card rounded-2xl p-8 border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/60 via-white to-purple-50/40 dark:from-indigo-900/30 dark:via-slate-900/50 dark:to-purple-900/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="info">Employee Portal</Badge>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">ID: {user?.employee_id}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {user?.employee_profile?.first_name || 'Employee'}! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm font-medium">
              {user?.employee_profile?.job_title || 'Software Engineer'} • {user?.employee_profile?.department?.name || 'Engineering'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Daily Attendance Widget
              </p>
              <p className="text-xs text-slate-900 dark:text-slate-200 font-bold">
                {isCheckedIn ? `Checked in at ${checkInTime}` : 'Not checked in yet today'}
              </p>
              {feedback && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-semibold">{feedback}</p>
              )}
            </div>
            {isCheckedIn ? (
              <Button
                variant="danger"
                size="sm"
                onClick={handleCheckOut}
                isLoading={actionLoading}
              >
                Check Out
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleCheckIn}
                isLoading={actionLoading}
              >
                Check In Now
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hoverable>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Attendance Rate
            </p>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {summaryLoading ? '...' : `${summary?.attendance_rate || 0}%`}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Past 30 days performance</p>
        </Card>

        <Card hoverable>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Days Present
            </p>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {summaryLoading ? '...' : summary?.present_days || 0}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Full working days logged</p>
        </Card>

        <Card hoverable>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Leaves Applied
            </p>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {myLeaves ? myLeaves.length : 0}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Total requests submitted</p>
        </Card>

        <Card hoverable>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Net Monthly Salary
            </p>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {myPayroll ? `$${Number(myPayroll.net_salary).toLocaleString()}` : '$0'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Active payslip structure</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Recent Leave Applications
            </h2>
            <Link
              to="/leaves"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Apply for Leave <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card>
            {myLeaves && myLeaves.length > 0 ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
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
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                        {leave.start_date} to {leave.end_date}
                      </p>
                      {leave.admin_comment && (
                        <p className="text-xs text-indigo-600 dark:text-indigo-300 italic mt-0.5 font-medium">
                          HR Comment: "{leave.admin_comment}"
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{new Date(leave.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6 font-medium">No leave requests found.</p>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Quick Shortcuts</h2>
          <div className="space-y-3">
            <Link to="/attendance">
              <Card hoverable className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200">Attendance Log</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">View 30-day attendance calendar</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Card>
            </Link>

            <Link to="/payroll">
              <Card hoverable className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200">Salary & Payslips</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Inspect basic salary & allowances</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Card>
            </Link>

            <Link to="/profile">
              <Card hoverable className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200">Personal Profile</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Update phone, address & avatar</p>
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
