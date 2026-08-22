import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Set up your workforce',
      desc: 'Users securely log in with role-based JWT authentication as Employee, HR, or Admin.',
      color: 'text-indigo-600 dark:text-indigo-400',
      hoverBorder: 'hover:border-indigo-500/50',
    },
    {
      step: '02',
      title: 'Manage everyday HR operations',
      desc: 'Employees log daily check-ins, apply for leaves, and inspect their active payslip structure.',
      color: 'text-emerald-600 dark:text-emerald-400',
      hoverBorder: 'hover:border-emerald-500/50',
    },
    {
      step: '03',
      title: 'Track attendance, leave and payroll',
      desc: 'HR/Admin officers approve or reject leave applications and adjust employee pay structures.',
      color: 'text-purple-600 dark:text-purple-400',
      hoverBorder: 'hover:border-purple-500/50',
    },
    {
      step: '04',
      title: 'Make better decisions with insights',
      desc: 'Real-time in-app notifications and system audit logs keep the entire organization aligned.',
      color: 'text-amber-600 dark:text-amber-400',
      hoverBorder: 'hover:border-amber-500/50',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-16">
        <Badge variant="warning">STEP-BY-STEP PROCESS</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Simple for everyone.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
          Get started in minutes with clean role-based onboarding and streamlined HR workflows.
        </p>
      </div>

      {/* 4-Step Timeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((s, idx) => (
          <Card
            key={idx}
            hoverable
            className={`p-6 relative border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131926] ${s.hoverBorder} transition-all duration-200 shadow-sm`}
          >
            <span className={`text-3xl font-extrabold ${s.color}`}>{s.step}</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2.5">
              {s.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium">
              {s.desc}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
};
