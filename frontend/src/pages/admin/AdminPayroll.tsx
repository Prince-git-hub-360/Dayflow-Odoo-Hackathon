import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, Edit, Save, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import type { Payroll } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminPayroll: React.FC = () => {
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
  const [basicSalary, setBasicSalary] = useState<number>(0);
  const [allowances, setAllowances] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { data: payrolls, isLoading, refetch } = useQuery<Payroll[]>({
    queryKey: ['adminPayrollList'],
    queryFn: async () => {
      const res = await api.get('/payroll/');
      return res.data;
    },
  });

  const openUpdateModal = (p: Payroll) => {
    setSelectedPayroll(p);
    setBasicSalary(Number(p.basic_salary));
    setAllowances(Number(p.allowances));
    setDeductions(Number(p.deductions));
  };

  const handleUpdatePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayroll) return;
    setIsUpdating(true);
    setFeedback(null);
    try {
      await api.patch(`/payroll/${selectedPayroll.employee_id}`, {
        basic_salary: basicSalary,
        allowances: allowances,
        deductions: deductions,
      });
      setFeedback('Payroll structure successfully updated!');
      setSelectedPayroll(null);
      refetch();
    } catch (err: any) {
      setFeedback(err.response?.data?.detail || 'Payroll update failed.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Organization Payroll Control
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          Set and update basic salaries, allowances, and tax deductions across all employees.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-6">Basic Salary</th>
                  <th className="py-3.5 px-6">Allowances</th>
                  <th className="py-3.5 px-6">Deductions</th>
                  <th className="py-3.5 px-6">Net Take-Home</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-sm">
                {payrolls?.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-slate-200">
                      {p.employee?.first_name} {p.employee?.last_name}
                      <span className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                        {p.employee?.job_title}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono font-semibold text-slate-800 dark:text-slate-300">
                      ${Number(p.basic_salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                      +${Number(p.allowances).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6 font-mono font-extrabold text-rose-600 dark:text-rose-400">
                      -${Number(p.deductions).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6 font-mono font-extrabold text-slate-900 dark:text-white">
                      ${Number(p.net_salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Edit className="w-3.5 h-3.5" />}
                        onClick={() => openUpdateModal(p)}
                      >
                        Edit Pay
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={!!selectedPayroll}
        onClose={() => setSelectedPayroll(null)}
        title="Update Salary Structure"
      >
        {selectedPayroll && (
          <form onSubmit={handleUpdatePayroll} className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <p className="font-bold text-slate-900 dark:text-slate-200">
                Employee: {selectedPayroll.employee?.first_name} {selectedPayroll.employee?.last_name}
              </p>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Department: {selectedPayroll.employee?.department?.name || 'Engineering'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                Basic Salary ($)
              </label>
              <input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                required
                min="0"
                step="500"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                Allowances ($)
              </label>
              <input
                type="number"
                value={allowances}
                onChange={(e) => setAllowances(Number(e.target.value))}
                min="0"
                step="100"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                Deductions ($)
              </label>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
                min="0"
                step="100"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
              />
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-300">Calculated Net Salary:</span>
              <span className="text-base font-extrabold text-indigo-700 dark:text-indigo-300">
                ${(basicSalary + allowances - deductions).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button variant="ghost" type="button" onClick={() => setSelectedPayroll(null)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isUpdating} leftIcon={<Save className="w-4 h-4" />}>
                Save Salary Structure
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
