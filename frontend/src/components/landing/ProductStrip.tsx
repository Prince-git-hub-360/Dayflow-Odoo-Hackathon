import React from 'react';
import { UserCheck, CalendarDays, FileText, DollarSign, BarChart3 } from 'lucide-react';

export const ProductStrip: React.FC = () => {
  const items = [
    { label: 'Employee Management', icon: <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> },
    { label: 'Attendance', icon: <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> },
    { label: 'Leave Management', icon: <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" /> },
    { label: 'Payroll', icon: <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" /> },
    { label: 'Analytics', icon: <BarChart3 className="w-4 h-4 text-sky-600 dark:text-sky-400" /> },
  ];

  return (
    <section className="border-y border-slate-200/80 dark:border-slate-800/80 bg-slate-100/70 dark:bg-slate-900/50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-6 text-center">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            {item.icon}
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
