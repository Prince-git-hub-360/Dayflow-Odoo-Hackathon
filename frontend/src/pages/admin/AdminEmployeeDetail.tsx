import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CalendarDays, FileText, Mail, Phone, MapPin, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Employee, Attendance, LeaveRequest, Payroll } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminEmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { data: employee, isLoading } = useQuery<Employee>({
    queryKey: ['adminEmployeeDetail', id],
    queryFn: async () => {
      const res = await api.get(`/employees/${id}`);
      return res.data;
    },
  });

  const { data: attendanceList } = useQuery<Attendance[]>({
    queryKey: ['adminEmployeeAttendance', id],
    queryFn: async () => {
      const res = await api.get('/attendance/', { params: { employee_id: id } });
      return res.data;
    },
  });

  const { data: leavesList } = useQuery<LeaveRequest[]>({
    queryKey: ['adminEmployeeLeaves', id],
    queryFn: async () => {
      const res = await api.get('/leaves/all', { params: { employee_id: id } });
      return res.data;
    },
  });

  const { data: payroll } = useQuery<Payroll>({
    queryKey: ['adminEmployeePayroll', id],
    queryFn: async () => {
      const res = await api.get(`/payroll/${id}`);
      return res.data;
    },
  });

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await api.delete(`/employees/${id}`);
      queryClient.invalidateQueries({ queryKey: ['adminEmployeesList'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalyticsDashboard'] });
      navigate('/admin/employees');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete =
    user?.role === 'ADMIN'
      ? employee?.user_id !== user.id
      : employee?.user?.role === 'EMPLOYEE' && employee?.user_id !== user?.id;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/admin/employees">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Directory
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : employee ? (
        <div className="space-y-8">
          <Card className="p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl font-extrabold text-white">
                  {employee.first_name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {employee.first_name} {employee.last_name}
                    </h1>
                    <Badge variant="info">{employee.job_title}</Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-4 font-medium">
                    <span>ID: {employee.user?.employee_id}</span>
                    <span>Department: {employee.department?.name || 'Unassigned'}</span>
                    <span>Joined: {employee.joining_date}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={employee.user?.role === 'ADMIN' ? 'danger' : employee.user?.role === 'HR' ? 'warning' : 'neutral'} size="md">
                  Role: {employee.user?.role || 'EMPLOYEE'}
                </Badge>

                {canDelete && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setIsDeleteModalOpen(true)}
                    leftIcon={<Trash2 className="w-4 h-4" />}
                  >
                    Terminate Account
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Confirm Employee Account Termination"
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-center gap-3 text-rose-800 dark:text-rose-400 text-xs font-semibold">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>
                  Warning: Terminating <strong>{employee.first_name} {employee.last_name}</strong> will remove their user account, attendance logs, and leave records from Dayflow HRMS.
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Are you sure you want to permanently delete this account? This action cannot be reversed.
              </p>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  isLoading={isDeleting}
                  onClick={handleDelete}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Permanently Terminate Account
                </Button>
              </div>
            </div>
          </Modal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <Card>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                  Contact Information
                </h3>
                <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{employee.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{employee.phone || 'No phone provided'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{employee.address || 'No address provided'}</span>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                  Payroll Structure
                </h3>
                {payroll ? (
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 font-medium">
                      <span className="text-slate-600 dark:text-slate-400">Basic Salary</span>
                      <span className="font-bold text-slate-900 dark:text-slate-200">₹{Number(payroll.basic_salary).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 font-medium">
                      <span className="text-slate-600 dark:text-slate-400">Allowances</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">+₹{Number(payroll.allowances).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 font-medium">
                      <span className="text-slate-600 dark:text-slate-400">Deductions</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">-₹{Number(payroll.deductions).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pt-2 text-sm font-extrabold">
                      <span className="text-indigo-600 dark:text-indigo-400">Net Take-Home</span>
                      <span className="text-slate-900 dark:text-white">₹{Number(payroll.net_salary).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 font-medium">No payroll record found.</p>
                )}
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-slate-200 text-sm flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Recent Attendance History
                  </h3>
                  <span className="text-xs text-slate-500 font-bold">{attendanceList?.length || 0} Records</span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-400 uppercase font-bold">
                      <tr>
                        <th className="py-2.5 px-4">Date</th>
                        <th className="py-2.5 px-4">Check In</th>
                        <th className="py-2.5 px-4">Check Out</th>
                        <th className="py-2.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                      {attendanceList?.slice(0, 7).map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-300">{att.date}</td>
                          <td className="py-3 px-4 text-slate-700 dark:text-slate-400 font-medium">
                            {att.check_in ? new Date(att.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                          </td>
                          <td className="py-3 px-4 text-slate-700 dark:text-slate-400 font-medium">
                            {att.check_out ? new Date(att.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={att.status === 'PRESENT' ? 'success' : 'warning'}>
                              {att.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-slate-200 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Leave Applications
                  </h3>
                  <span className="text-xs text-slate-500 font-bold">{leavesList?.length || 0} Applications</span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-400 uppercase font-bold">
                      <tr>
                        <th className="py-2.5 px-4">Type</th>
                        <th className="py-2.5 px-4">Dates</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Comment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                      {leavesList?.map((leave) => (
                        <tr key={leave.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-300">{leave.leave_type}</td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-700 dark:text-slate-400">{leave.start_date} → {leave.end_date}</td>
                          <td className="py-3 px-4">
                            <Badge variant={leave.status === 'APPROVED' ? 'success' : leave.status === 'REJECTED' ? 'danger' : 'warning'}>
                              {leave.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400 truncate max-w-xs font-medium">{leave.admin_comment || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-slate-500 font-medium">Employee not found.</p>
      )}
    </div>
  );
};
