import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, CheckCircle2, XCircle, Filter } from 'lucide-react';
import { api } from '../../services/api';
import type { LeaveRequest } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminLeaves: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [adminComment, setAdminComment] = useState<string>('');
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { data: leaves, isLoading, refetch } = useQuery<LeaveRequest[]>({
    queryKey: ['adminLeavesList', statusFilter],
    queryFn: async () => {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/leaves/all', { params });
      return res.data;
    },
  });

  const handleReview = async (newStatus: 'APPROVED' | 'REJECTED') => {
    if (!selectedLeave) return;
    setIsReviewing(true);
    setFeedback(null);
    try {
      await api.patch(`/leaves/${selectedLeave.id}/review`, {
        status: newStatus,
        admin_comment: adminComment,
      });
      setFeedback(`Leave request successfully ${newStatus.toLowerCase()}!`);
      setSelectedLeave(null);
      setAdminComment('');
      refetch();
    } catch (err: any) {
      setFeedback(err.response?.data?.detail || 'Review action failed.');
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Organization Leave Approvals
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          Review, approve, or reject employee leave applications with comments.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none w-48 font-medium"
          >
            <option value="">All Applications</option>
            <option value="PENDING">PENDING REVIEW</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Total: {leaves?.length || 0}</span>
      </Card>

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-6">Leave Type</th>
                  <th className="py-3.5 px-6">Date Range</th>
                  <th className="py-3.5 px-6">Remarks</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-sm">
                {leaves?.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-slate-200">
                      {leave.employee?.first_name} {leave.employee?.last_name}
                      <span className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                        {leave.employee?.department?.name || 'Engineering'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="info">{leave.leave_type}</Badge>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-700 dark:text-slate-300 font-semibold">
                      {leave.start_date} → {leave.end_date}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate font-medium">
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
                    <td className="py-4 px-6 text-right">
                      {leave.status === 'PENDING' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setSelectedLeave(leave)}
                        >
                          Review Application
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-500 italic font-medium">
                          Reviewed
                        </span>
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
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        title="Review Leave Application"
      >
        {selectedLeave && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <p>
                <strong className="text-slate-900 dark:text-slate-200">Applicant:</strong>{' '}
                {selectedLeave.employee?.first_name} {selectedLeave.employee?.last_name}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-slate-200">Leave Type:</strong> {selectedLeave.leave_type}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-slate-200">Dates:</strong> {selectedLeave.start_date} to {selectedLeave.end_date}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-slate-200">Remarks:</strong> "{selectedLeave.remarks || 'None'}"
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                HR Reviewer Comment (Optional)
              </label>
              <textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
                placeholder="Enter feedback or approval notes..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="danger"
                onClick={() => handleReview('REJECTED')}
                isLoading={isReviewing}
                leftIcon={<XCircle className="w-4 h-4" />}
              >
                Reject Request
              </Button>
              <Button
                variant="primary"
                onClick={() => handleReview('APPROVED')}
                isLoading={isReviewing}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Approve Request
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
