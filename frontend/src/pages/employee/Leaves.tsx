import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText, Plus, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import type { LeaveRequest } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const leaveSchema = z
  .object({
    leave_type: z.enum(['PAID', 'SICK', 'UNPAID']),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    remarks: z.string().max(500, 'Remarks cannot exceed 500 characters').optional(),
  })
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    message: 'End date cannot be earlier than start date',
    path: ['end_date'],
  });

type LeaveFormValues = z.infer<typeof leaveSchema>;

export const EmployeeLeaves: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { data: leaves, isLoading, refetch } = useQuery<LeaveRequest[]>({
    queryKey: ['myLeaves'],
    queryFn: async () => {
      const res = await api.get('/leaves/me');
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      leave_type: 'PAID',
    },
  });

  const onSubmit = async (data: LeaveFormValues) => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await api.post('/leaves/', data);
      setFeedback('Leave request successfully submitted!');
      setIsModalOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ['myLeaves'] });
      queryClient.invalidateQueries({ queryKey: ['pendingLeavesAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalyticsDashboard'] });
      refetch();
    } catch (err: any) {
      setFeedback(err.response?.data?.detail || 'Failed to submit leave request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Leave Management
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Submit new leave requests and track review status from HR.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Apply for Leave
        </Button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-3 text-indigo-800 dark:text-indigo-300 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">My Leave History</h3>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Total Applications: {leaves?.length || 0}</span>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <th className="py-3.5 px-6">Leave Type</th>
                  <th className="py-3.5 px-6">Date Range</th>
                  <th className="py-3.5 px-6">Remarks</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">HR Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-sm">
                {leaves?.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-slate-200">
                      {leave.leave_type} Leave
                    </td>
                    <td className="py-4 px-6 text-slate-800 dark:text-slate-300 font-mono text-xs font-semibold">
                      {leave.start_date} → {leave.end_date}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400 text-xs max-w-xs truncate font-medium">
                      {leave.remarks || '-'}
                    </td>
                    <td className="py-4 px-6">
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
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {leave.admin_comment ? (
                        <span className="text-indigo-600 dark:text-indigo-300 italic">"{leave.admin_comment}"</span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apply for Leave"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
              Leave Type
            </label>
            <select
              {...register('leave_type')}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
            >
              <option value="PAID">Paid Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="UNPAID">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                Start Date
              </label>
              <input
                type="date"
                {...register('start_date')}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
              />
              {errors.start_date && (
                <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.start_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                End Date
              </label>
              <input
                type="date"
                {...register('end_date')}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
              />
              {errors.end_date && (
                <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.end_date.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
              Reason / Remarks
            </label>
            <textarea
              {...register('remarks')}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
              placeholder="State the reason for your leave request..."
            />
            {errors.remarks && (
              <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.remarks.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
