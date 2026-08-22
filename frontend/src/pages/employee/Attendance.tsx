import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import type { Attendance } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const EmployeeAttendance: React.FC = () => {
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { data: attendanceList, isLoading, refetch } = useQuery<Attendance[]>({
    queryKey: ['myAttendanceRecords'],
    queryFn: async () => {
      const res = await api.get('/attendance/me');
      return res.data;
    },
  });

  const { data: summary, refetch: refetchSummary } = useQuery({
    queryKey: ['myAttendanceSummary'],
    queryFn: async () => {
      const res = await api.get('/attendance/me/summary');
      return res.data;
    },
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceList?.find((a) => a.date === todayStr);
  const isCheckedIn = !!(todayRecord && todayRecord.check_in && !todayRecord.check_out);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      await api.post('/attendance/check-in');
      setFeedback('Successfully checked in for today!');
      refetch();
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
      refetch();
      refetchSummary();
    } catch (err: any) {
      setFeedback(err.response?.data?.detail || 'Check-out failed.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Daily Attendance Log
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Log your daily working hours and review your monthly attendance statistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isCheckedIn ? (
            <Button variant="danger" onClick={handleCheckOut} isLoading={actionLoading}>
              Check Out Now
            </Button>
          ) : (
            <Button variant="primary" onClick={handleCheckIn} isLoading={actionLoading}>
              Check In Now
            </Button>
          )}
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-3 text-indigo-800 dark:text-indigo-300 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Rate</p>
          <h4 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {summary?.attendance_rate || 0}%
          </h4>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Present</p>
          <h4 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {summary?.present_days || 0}
          </h4>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Absent</p>
          <h4 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {summary?.absent_days || 0}
          </h4>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Half Day</p>
          <h4 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {summary?.half_days || 0}
          </h4>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">On Leave</p>
          <h4 className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
            {summary?.leave_days || 0}
          </h4>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">30-Day Attendance Record</h3>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Total Records: {attendanceList?.length || 0}</span>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Check In (UTC)</th>
                  <th className="py-3.5 px-6">Check Out (UTC)</th>
                  <th className="py-3.5 px-6">Hours Worked</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-sm">
                {attendanceList?.map((rec) => {
                  let hours = '-';
                  if (rec.check_in && rec.check_out) {
                    const diff =
                      new Date(rec.check_out).getTime() - new Date(rec.check_in).getTime();
                    hours = `${(diff / (1000 * 60 * 60)).toFixed(1)} hrs`;
                  }
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-slate-200">{rec.date}</td>
                      <td className="py-4 px-6 text-slate-800 dark:text-slate-300 font-medium">
                        {rec.check_in
                          ? new Date(rec.check_in).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '--:--'}
                      </td>
                      <td className="py-4 px-6 text-slate-800 dark:text-slate-300 font-medium">
                        {rec.check_out
                          ? new Date(rec.check_out).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '--:--'}
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-mono text-xs font-medium">{hours}</td>
                      <td className="py-4 px-6">
                        <Badge
                          variant={
                            rec.status === 'PRESENT'
                              ? 'success'
                              : rec.status === 'ABSENT'
                              ? 'danger'
                              : rec.status === 'HALF_DAY'
                              ? 'warning'
                              : 'info'
                          }
                        >
                          {rec.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
