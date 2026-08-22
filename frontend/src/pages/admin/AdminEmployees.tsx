import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Building2,
  Plane,
  Grid,
  List,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Employee, Department } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminEmployees: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isDeptModalOpen, setIsDeptModalOpen] = useState<boolean>(false);
  const [newDeptName, setNewDeptName] = useState<string>('');
  const [newDeptDesc, setNewDeptDesc] = useState<string>('');

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { data: employees, isLoading, refetch: refetchEmployees } = useQuery<Employee[]>({
    queryKey: ['adminEmployeesList', searchTerm, selectedDepartment],
    queryFn: async () => {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedDepartment) params.department_id = selectedDepartment;
      const res = await api.get('/employees/', { params });
      return res.data;
    },
  });

  const { data: departments, refetch: refetchDepts } = useQuery<Department[]>({
    queryKey: ['adminDepartmentsList'],
    queryFn: async () => {
      const res = await api.get('/employees/departments/all');
      return res.data;
    },
  });

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName) return;
    try {
      await api.post('/employees/departments/all', {
        name: newDeptName,
        description: newDeptDesc,
      });
      setIsDeptModalOpen(false);
      setNewDeptName('');
      setNewDeptDesc('');
      refetchDepts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/employees/${deleteTarget.id}`);
      setDeleteTarget(null);
      refetchEmployees();
      queryClient.invalidateQueries({ queryKey: ['adminAnalyticsDashboard'] });
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete employee account.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Employee Directory
            </h1>
            <Badge variant={user?.role === 'ADMIN' ? 'danger' : 'warning'}>
              {user?.role === 'ADMIN' ? 'FULL ADMIN SCOPE' : 'HR WORKSPACE'}
            </Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            {user?.role === 'HR'
              ? 'Displaying employees only. HR staff accounts are managed exclusively by System Admin.'
              : 'Full administrative control over all organization Employees and HR Managers.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid Card View"
            >
              <Grid className="w-4 h-4" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span>Table</span>
            </button>
          </div>

          <Button
            variant="secondary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsDeptModalOpen(true)}
          >
            Add Department
          </Button>
        </div>
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or title..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pl-10 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full md:w-48 font-medium"
          >
            <option value="">All Departments</option>
            {departments?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {isLoading ? (
        <LoadingSpinner />
      ) : employees?.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 font-medium">
          No employees found in the directory.
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees?.map((emp, idx) => {
            const mockStatus = idx % 3 === 0 ? 'PRESENT' : idx % 3 === 1 ? 'ON_LEAVE' : 'ABSENT';
            const empName = `${emp.first_name} ${emp.last_name}`;
            const canDelete =
              user?.role === 'ADMIN'
                ? emp.user_id !== user.id
                : emp.user?.role === 'EMPLOYEE' && emp.user_id !== user?.id;

            return (
              <Card
                key={emp.id}
                className="p-5 border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 transition-all duration-200 hover:shadow-xl relative flex flex-col items-center text-center space-y-3 bg-white dark:bg-[#131926] group"
              >
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {mockStatus === 'PRESENT' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Present
                    </span>
                  ) : mockStatus === 'ON_LEAVE' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 px-2 py-0.5 rounded-full">
                      <Plane className="w-3 h-3 text-sky-500" />
                      Leave
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-2 py-0.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Absent
                    </span>
                  )}
                </div>

                <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border-2 border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform mt-2">
                  {emp.first_name[0]}
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {empName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{emp.job_title}</p>
                  <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                    {emp.user?.employee_id || `EMP00${emp.id}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 flex-wrap justify-center">
                  <Badge variant="info">
                    <Building2 className="w-3 h-3 mr-1 inline" />
                    {emp.department?.name || 'Unassigned'}
                  </Badge>
                  <Badge variant="neutral">{emp.user?.role || 'EMPLOYEE'}</Badge>
                </div>

                <div className="pt-3 w-full border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold">
                  <Link
                    to={`/admin/employees/${emp.id}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ id: emp.id, name: empName })}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Terminate / Remove Employee Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Joined</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-sm">
                {employees?.map((emp) => {
                  const empName = `${emp.first_name} ${emp.last_name}`;
                  const canDelete =
                    user?.role === 'ADMIN'
                      ? emp.user_id !== user.id
                      : emp.user?.role === 'EMPLOYEE' && emp.user_id !== user?.id;

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
                            {emp.first_name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{empName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{emp.job_title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {emp.user?.employee_id || `EMP00${emp.id}`}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="info">{emp.department?.name || 'Unassigned'}</Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="neutral">{emp.user?.role || 'EMPLOYEE'}</Badge>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {emp.joining_date}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <Link to={`/admin/employees/${emp.id}`}>
                          <Button variant="ghost" size="sm">
                            View Profile
                          </Button>
                        </Link>
                        {canDelete && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setDeleteTarget({ id: emp.id, name: empName })}
                            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        title="Add New Department"
      >
        <form onSubmit={handleCreateDepartment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Department Name
            </label>
            <input
              type="text"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              placeholder="e.g. Finance, Marketing, Engineering"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Description (Optional)
            </label>
            <textarea
              value={newDeptDesc}
              onChange={(e) => setNewDeptDesc(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
              placeholder="Brief description of department scope..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsDeptModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Department</Button>
          </div>
        </form>
      </Modal>

      {/* Delete / Terminate Employee Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Employee Account Termination"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-center gap-3 text-rose-800 dark:text-rose-400 text-xs font-semibold">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>
              Warning: Terminating <strong>{deleteTarget?.name}</strong> will remove their user account, attendance logs, and leave records from Dayflow HRMS.
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Are you sure you want to permanently delete this account? This action cannot be reversed.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              isLoading={isDeleting}
              onClick={handleDeleteEmployee}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Permanently Terminate Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
