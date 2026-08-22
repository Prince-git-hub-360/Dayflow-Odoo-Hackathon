import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const AdminShowcase: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#131926]/95 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* LEFT: Content */}
          <div className="lg:col-span-6 space-y-5 order-2 lg:order-1">
            <Badge variant="warning">FOR HR & ADMIN</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Run your workforce <br className="hidden sm:inline" />
              with clarity.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Give HR teams a centralized view of people, attendance, leave, payroll, and reports. Stay in control of organizational policy with structured role permissions.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-800 dark:text-slate-200 font-semibold">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                Searchable employee directory with department filters
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                Org-wide attendance monitoring & date range filters
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                Leave approval inbox (Approve / Reject + reviewer notes)
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                Full payroll management & salary structure updates
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                Interactive Recharts analytics & system audit trail
              </li>
            </ul>

            <div className="pt-2">
              <Button
                variant="primary"
                onClick={() => navigate('/login')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore HR & Admin Controls
              </Button>
            </div>
          </div>

          {/* RIGHT: Product Mockup UI Representation */}
          <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
            <Card className="p-5 border-purple-200/80 dark:border-purple-500/30 bg-slate-50 dark:bg-[#0B0F17]/90 shadow-md">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300 uppercase">
                    HR Command Center Preview
                  </span>
                </div>
                <Badge variant="warning">ADMIN MODE</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 font-bold uppercase text-[9px]">Total Workforce</p>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">124</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 font-bold uppercase text-[9px]">Present Today</p>
                  <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">108</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 font-bold uppercase text-[9px]">Pending Leaves</p>
                  <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">7 Requests</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 font-bold uppercase text-[9px]">On Leave</p>
                  <p className="text-lg font-extrabold text-sky-600 dark:text-sky-400 mt-0.5">8 Staff</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
