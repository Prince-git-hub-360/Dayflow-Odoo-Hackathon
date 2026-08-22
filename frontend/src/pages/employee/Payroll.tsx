import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, ShieldAlert, Award, TrendingDown, Wallet, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import type { Payroll } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const EmployeePayroll: React.FC = () => {
  const { data: payroll, isLoading } = useQuery<Payroll>({
    queryKey: ['myPayroll'],
    queryFn: async () => {
      const res = await api.get('/payroll/me');
      return res.data;
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-indigo-400" /> Payroll & Salary Details
        </h1>
        <p className="text-sm text-slate-400">
          Official read-only view of your current salary structure and payslip breakdown.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-3 text-indigo-300 text-xs">
        <ShieldAlert className="w-5 h-5 shrink-0 text-indigo-400" />
        <span>
          <strong>Read-Only Notice:</strong> Salary structures are strictly managed by HR/Admin.
          Any unauthorized modification attempts on this endpoint will be rejected by the backend with HTTP 403 Forbidden.
        </span>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : payroll ? (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-8 border border-slate-800 bg-gradient-to-tr from-indigo-950/60 via-slate-900/60 to-purple-950/40 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Total Monthly Net Take-Home
                </p>
                <h2 className="text-4xl font-extrabold text-white mt-2">
                  ${Number(payroll.net_salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h2>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Effective Date: {payroll.effective_from}
                </p>
              </div>

              <Badge variant="success" size="md" className="py-2 px-4 text-sm font-bold">
                Active Payslip Structure
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Basic Salary</p>
                  <h4 className="text-xl font-bold text-slate-100">
                    ${Number(payroll.basic_salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h4>
                </div>
              </div>
              <p className="text-xs text-slate-500">Base monthly compensation</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Allowances</p>
                  <h4 className="text-xl font-bold text-emerald-400">
                    +${Number(payroll.allowances).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h4>
                </div>
              </div>
              <p className="text-xs text-slate-500">Medical, housing & travel perks</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Deductions</p>
                  <h4 className="text-xl font-bold text-rose-400">
                    -${Number(payroll.deductions).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h4>
                </div>
              </div>
              <p className="text-xs text-slate-500">Taxes, health insurance & retirement</p>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-slate-400 text-sm">No payroll record found. Please contact HR.</p>
        </Card>
      )}
    </div>
  );
};
