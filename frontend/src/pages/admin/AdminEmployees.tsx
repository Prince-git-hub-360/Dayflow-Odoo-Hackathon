import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Search, Filter, Plus, ChevronRight, Building2 } from 'lucide-react';
import { api } from '../../services/api';
import type { Employee, Department } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminEmployees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isDeptModalOpen, setIsDeptModalOpen] = useState<boolean>(false);
  const [newDeptName, setNewDeptName] = useState<string>('');
  const [newDeptDesc, setNewDeptDesc] = useState<string>('');

  const { data: employees, isLoading } = useQuery<Employee[]>({
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Employee Directory
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            View, search, and manage all organization staff profiles and department assignments.
          </p>
        </div>

        <Button
          variant="secondary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsDeptModalOpen(true)}
        >
          Add New Department
        </Button>
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

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
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
                {employees?.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-400 shrink-0">
                          {emp.first_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">
                            {emp.first_name} {emp.last_name}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{emp.job_title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-700 dark:text-slate-300 font-bold">
                      {emp.user?.employee_id || `EMP00${emp.id}`}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="info">
                        <Building2 className="w-3 h-3 mr-1 inline" />
                        {emp.department?.name || 'Unassigned'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          emp.user?.role === 'ADMIN'
                            ? 'danger'
                            : emp.user?.role === 'HR'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {emp.user?.role || 'EMPLOYEE'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">
                      {emp.joining_date}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link to={`/admin/employees/${emp.id}`}>
                        <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        title="Add New Department"
      >
        <form onSubmit={handleCreateDepartment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
              Department Name
            </label>
            <input
              type="text"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
              placeholder="e.g. Artificial Intelligence Labs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
              Description
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
    </div>
  );
};
