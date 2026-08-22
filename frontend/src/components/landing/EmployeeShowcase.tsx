import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, User, Clock, FileText, IndianRupee } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const EmployeeShowcase: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="solutions" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#131926]/95 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* LEFT: Product Mockup UI Representation */}
          <div className="lg:col-span-6 space-y-4">
            <Card className="p-5 border-indigo-200/80 dark:border-indigo-500/30 bg-slate-50 dark:bg-[#0B0F17]/90 shadow-md">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-400 uppercase">
                    Employee Portal Preview
                  </span>
                </div>
                <Badge variant="info">JOHN DOE (EMP001)</Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">Attendance Rate</span>
                  </div>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">96.5% (22 Days Present)</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-500" />
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">Paid Vacation Leave</span>
                  </div>
                  <Badge variant="success">APPROVED</Badge>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-amber-500" />
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">Net Take-Home Payslip</span>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white">₹1,16,000.00 / mo</span>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT: Content & Bullet Points */}
          <div className="lg:col-span-6 space-y-5">
            <Badge variant="info">FOR EMPLOYEES</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Everything your employees need, <br className="hidden sm:inline" />
              in one place.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Empower your workforce with intuitive self-service. Log daily attendance, apply for leave in seconds, inspect payslips, and receive instant status updates.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-800 dark:text-slate-200 font-semibold">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                Personal profile management (phone, address, avatar)
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                One-click check-in & check-out daily attendance widget
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                Leave application tracking with reviewer comments
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                Read-only payslip breakdown with net salary visibility
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                Real-time in-app status notifications
              </li>
            </ul>

            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Employee Experience
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
