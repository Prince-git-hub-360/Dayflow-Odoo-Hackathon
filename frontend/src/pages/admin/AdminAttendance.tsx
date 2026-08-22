import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Filter } from 'lucide-react';
import { api } from '../../services/api';
import type { Attendance } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminAttendance: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: attendanceList, isLoading } = useQuery<Attendance[]>({
    queryKey: ['adminOrgAttendance', startDate, endDate, statusFilter],
    queryFn: async () => {
      const params: any = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/attendance/', { params });
      return res.data;
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Organization Attendance Monitor
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          Monitor attendance logs, check-in timestamps, and absences across all employees.
        </p>
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none w-full md:w-48 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="PRESENT">PRESENT</option>
            <option value="ABSENT">ABSENT</option>
            <option value="HALF_DAY">HALF DAY</option>
            <option value="LEAVE">ON LEAVE</option>
          </select>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <th className="py-3.5 px-6">Employee ID</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Check In (UTC)</th>
                  <th className="py-3.5 px-6">Check Out (UTC)</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-sm">
                {attendanceList?.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-indigo-700 dark:text-indigo-400 font-extrabold">
                      EMP#{att.employee_id}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-slate-200">{att.date}</td>
                    <td className="py-4 px-6 text-slate-800 dark:text-slate-300 font-medium">
                      {att.check_in
                        ? new Date(att.check_in).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '--:--'}
                    </td>
                    <td className="py-4 px-6 text-slate-800 dark:text-slate-300 font-medium">
                      {att.check_out
                        ? new Date(att.check_out).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '--:--'}
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          att.status === 'PRESENT'
                            ? 'success'
                            : att.status === 'ABSENT'
                            ? 'danger'
                            : att.status === 'HALF_DAY'
                            ? 'warning'
                            : 'info'
                        }
                      >
                        {att.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
