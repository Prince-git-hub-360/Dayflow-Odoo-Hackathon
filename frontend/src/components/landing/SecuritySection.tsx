import React from 'react';
import { ShieldCheck, Lock, KeyRound, FileCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const SecuritySection: React.FC = () => {
  const capabilities = [
    {
      title: 'Role-Based Access Control (RBAC)',
      desc: 'Granular permissions separating Employee, HR Manager, and System Admin access levels across all endpoints.',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: 'Protected Employee Information',
      desc: 'Object-level authorization ensures employees only view their own attendance, leaves, and payslip data.',
      icon: <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      title: 'Secure Authentication',
      desc: 'Bcrypt password hashing and stateless OAuth2 JWT access tokens protect user accounts from unauthorized access.',
      icon: <KeyRound className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    },
    {
      title: 'Controlled Administrative Access',
      desc: 'Immutable system audit trail logs all salary structure modifications, leave approvals, and account creation events.',
      icon: <FileCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    },
  ];

  return (
    <section id="security" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-16">
        <Badge variant="info">ENTERPRISE SECURITY</Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Built with security in mind.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
          Dayflow protects sensitive employee profiles, attendance logs, and salary structures with strict backend security controls.
        </p>
      </div>

      {/* Security Capability Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {capabilities.map((cap, idx) => (
          <Card
            key={idx}
            className="p-6 space-y-3.5 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131926] shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              {cap.icon}
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{cap.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {cap.desc}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
};
