import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  CalendarDays, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  Trash2, 
  AlertTriangle,
  Edit3,
  IndianRupee,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Employee, Attendance, LeaveRequest, Payroll, Department } from '../../types';
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

  // Edit Employee Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editFirstName, setEditFirstName] = useState<string>('');
  const [editLastName, setEditLastName] = useState<string>('');
  const [editJobTitle, setEditJobTitle] = useState<string>('');
  const [editDeptId, setEditDeptId] = useState<number | string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [editJoiningDate, setEditJoiningDate] = useState<string>('');
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

  // Edit Salary Modal State
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState<boolean>(false);
  const [basicSalary, setBasicSalary] = useState<number | string>(0);
  const [allowances, setAllowances] = useState<number | string>(0);
  const [deductions, setDeductions] = useState<number | string>(0);
  const [isSavingSalary, setIsSavingSalary] = useState<boolean>(false);

  const { data: employee, isLoading, refetch: refetchEmployee } = useQuery<Employee>({
    queryKey: ['adminEmployeeDetail', id],
    queryFn: async () => {
      const res = await api.get(`/employees/${id}`);
      return res.data;
    },
  });

  const { data: departments } = useQuery<Department[]>({
    queryKey: ['adminDepartmentsList'],
    queryFn: async () => {
      const res = await api.get('/employees/departments/all');
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

  const { data: payroll, refetch: refetchPayroll } = useQuery<Payroll>({
    queryKey: ['adminEmployeePayroll', id],
    queryFn: async () => {
      const res = await api.get(`/payroll/${id}`);
      return res.data;
    },
  });

  const openEditModal = () => {
    if (!employee) return;
    setEditFirstName(employee.first_name || '');
    setEditLastName(employee.last_name || '');
    setEditJobTitle(employee.job_title || '');
    setEditDeptId(employee.department_id || '');
    setEditPhone(employee.phone || '');
    setEditAddress(employee.address || '');
    setEditJoiningDate(employee.joining_date || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSavingEdit(true);
    try {
      await api.patch(`/employees/${id}`, {
        first_name: editFirstName,
        last_name: editLastName,
        job_title: editJobTitle,
        department_id: editDeptId ? Number(editDeptId) : null,
        phone: editPhone,
        address: editAddress,
        joining_date: editJoiningDate,
      });
      setIsEditModalOpen(false);
      refetchEmployee();
      queryClient.invalidateQueries({ queryKey: ['adminEmployeesList'] });
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update employee details.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const openSalaryModal = () => {
    setBasicSalary(payroll?.basic_salary || 50000);
    setAllowances(payroll?.allowances || 5000);
    setDeductions(payroll?.deductions || 2000);
    setIsSalaryModalOpen(true);
  };

  const handleSaveSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSavingSalary(true);
    try {
      await api.patch(`/payroll/${id}`, {
        basic_salary: Number(basicSalary),
        allowances: Number(allowances),
        deductions: Number(deductions),
      });
      setIsSalaryModalOpen(false);
      refetchPayroll();
      queryClient.invalidateQueries({ queryKey: ['adminAnalyticsDashboard'] });
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update payroll structure.');
    } finally {
      setIsSavingSalary(false);
    }
  };

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
    <div className="space-y-8 animate-fade-in pb-12">
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
          <Card className="p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg">
                  {employee.first_name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {employee.first_name} {employee.last_name}
                    </h1>
                    <Badge variant="info">{employee.job_title}</Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-4 font-medium">
                    <span>ID: {employee.user?.employee_id}</span>
                    <span>Department: {employee.department?.name || 'Unassigned'}</span>
                    <span>Joined: {employee.joining_date}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant={employee.user?.role === 'ADMIN' ? 'danger' : employee.user?.role === 'HR' ? 'warning' : 'neutral'} size="md">
                  Role: {employee.user?.role || 'EMPLOYEE'}
                </Badge>

                <Button variant="outline" size="sm" onClick={openEditModal} leftIcon={<Edit3 className="w-4 h-4" />}>
                  Edit Profile
                </Button>

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                    Contact Information
                  </h3>
                  <button onClick={openEditModal} className="text-xs font-bold text-indigo-600 hover:underline">Edit</button>
                </div>
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
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-emerald-600" /> Payroll Structure
                  </h3>
                  <button onClick={openSalaryModal} className="text-xs font-bold text-indigo-600 hover:underline">Edit</button>
                </div>
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

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Employee">
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} className="w-full border rounded-lg p-2" required />
            <input type="text" placeholder="Last Name" value={editLastName} onChange={(e) => setEditLastName(e.target.value)} className="w-full border rounded-lg p-2" required />
          </div>
          <input type="text" placeholder="Job Title" value={editJobTitle} onChange={(e) => setEditJobTitle(e.target.value)} className="w-full border rounded-lg p-2" />
          <select value={editDeptId} onChange={(e) => setEditDeptId(e.target.value)} className="w-full border rounded-lg p-2">
             <option value="">Select Department</option>
             {departments?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <input type="text" placeholder="Phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full border rounded-lg p-2" />
          <textarea placeholder="Address" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="w-full border rounded-lg p-2" />
          <Button type="submit" isLoading={isSavingEdit}>Save Changes</Button>
        </form>
      </Modal>

      {/* Edit Salary Modal */}
      <Modal isOpen={isSalaryModalOpen} onClose={() => setIsSalaryModalOpen(false)} title="Update Salary">
        <form onSubmit={handleSaveSalary} className="space-y-4">
          <input type="number" placeholder="Basic Salary" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} className="w-full border rounded-lg p-2" />
          <input type="number" placeholder="Allowances" value={allowances} onChange={(e) => setAllowances(e.target.value)} className="w-full border rounded-lg p-2" />
          <input type="number" placeholder="Deductions" value={deductions} onChange={(e) => setDeductions(e.target.value)} className="w-full border rounded-lg p-2" />
          <Button type="submit" isLoading={isSavingSalary}>Update Payroll</Button>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Employee Account Termination"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-center gap-3 text-rose-800 dark:text-rose-400 text-xs font-semibold">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>
              Warning: Terminating <strong>{employee?.first_name} {employee?.last_name}</strong> will remove their user account, attendance logs, and leave records from Dayflow HRMS.
            </span>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button type="button" variant="danger" isLoading={isDeleting} onClick={handleDelete} leftIcon={<Trash2 className="w-4 h-4" />}>
              Permanently Terminate Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
