import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Sparkles,
  KeyRound,
  Mail,
  BadgeCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
  Shield,
  Briefcase,
  Users,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { ThemeSelector } from '../../components/ui/ThemeSelector';

const registerSchema = z.object({
  employee_id: z.string().min(2, 'Employee ID is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  job_title: z.string().min(1, 'Job title is required'),
  role: z.enum(['EMPLOYEE', 'HR', 'ADMIN']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'EMPLOYEE',
      job_title: 'Software Engineer',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await registerAuth(data);
      navigate('/login');
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.detail || 'Registration failed. Email or Employee ID may already exist.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors duration-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between z-20 max-w-7xl w-full mx-auto mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white/90 dark:bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing</span>
        </Link>
        <ThemeSelector />
      </div>

      {/* TWO-COLUMN SPLIT CONTAINER */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 my-auto">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: ONBOARDING & ROLE CAPABILITIES (5 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-6 pr-0 lg:pr-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>ONBOARDING WORKSPACE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Join Your Organization on Dayflow.
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Create your account to unlock personalized attendance tracking, leave applications, payslip access, and workforce directories.
            </p>
          </div>

          {/* Role Preview Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Role Access Preview ({selectedRole})
            </h3>

            {selectedRole === 'EMPLOYEE' && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                  <UserCheck className="w-4 h-4" />
                  <span>Employee Portal Access</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 font-medium pl-6 list-disc">
                  <li>Daily check-in / check-out with time tracking.</li>
                  <li>Submit leave requests & view approval status.</li>
                  <li>Access personal monthly payslips in ₹.</li>
                  <li>Update personal contact info & profile.</li>
                </ul>
              </div>
            )}

            {selectedRole === 'HR' && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>HR Command Center Access</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 font-medium pl-6 list-disc">
                  <li>Manage employee directory & department assignments.</li>
                  <li>Review, approve, or reject employee leave applications.</li>
                  <li>Overseational attendance logs & leave trends.</li>
                  <li>Note: HR accounts are managed by System Admin.</li>
                </ul>
              </div>
            )}

            {selectedRole === 'ADMIN' && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold">
                  <Shield className="w-4 h-4" />
                  <span>Full Admin Control Center</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 font-medium pl-6 list-disc">
                  <li>Full administrative authority over Employees and HR.</li>
                  <li>Configure CTC payroll structure & allowances in ₹.</li>
                  <li>Create new departments & manage audit trail logs.</li>
                  <li>Edit, update, and manage all organization accounts.</li>
                </ul>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-3 text-xs font-semibold text-indigo-900 dark:text-indigo-300">
            <CheckCircle className="w-5 h-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span>Registration automatically initializes your profile and INR salary record in the database.</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: REGISTRATION FORM CARD (7 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 w-full max-w-xl mx-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 space-y-5">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white mb-2 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Create Your Dayflow Account
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Fill in your details below to register on Dayflow HRMS.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-center gap-2.5 text-rose-700 dark:text-rose-400 text-xs font-semibold animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Role Selector Tabs */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Your Account Role <span className="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setValue('role', 'EMPLOYEE')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedRole === 'EMPLOYEE'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Employee</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('role', 'HR')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedRole === 'HR'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/30'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>HR Manager</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('role', 'ADMIN')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedRole === 'ADMIN'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/30'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {/* Grid Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    First Name <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('first_name')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
                    placeholder="John"
                  />
                  {errors.first_name && (
                    <p className="mt-0.5 text-[11px] font-semibold text-rose-500">{errors.first_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Last Name <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('last_name')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
                    placeholder="Doe"
                  />
                  {errors.last_name && (
                    <p className="mt-0.5 text-[11px] font-semibold text-rose-500">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              {/* Grid Row 2: Employee ID & Job Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Employee ID <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register('employee_id')}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 pl-9 font-medium"
                      placeholder="EMP999"
                    />
                    <BadgeCheck className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                  {errors.employee_id && (
                    <p className="mt-0.5 text-[11px] font-semibold text-rose-500">{errors.employee_id.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Job Title <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register('job_title')}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 pl-9 font-medium"
                      placeholder="Software Engineer"
                    />
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                  {errors.job_title && (
                    <p className="mt-0.5 text-[11px] font-semibold text-rose-500">{errors.job_title.message}</p>
                  )}
                </div>
              </div>

              {/* Grid Row 3: Work Email & Password */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Work Email Address <span className="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 pl-9 font-medium"
                    placeholder="john@company.com"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
                {errors.email && (
                  <p className="mt-0.5 text-[11px] font-semibold text-rose-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Password <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    Min. 6 characters
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 pl-9 pr-10 font-medium"
                    placeholder="••••••••"
                  />
                  <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-0.5 text-[11px] font-semibold text-rose-500">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full py-2.5 mt-2 text-sm font-bold shadow-lg shadow-indigo-600/25"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Complete Registration
              </Button>
            </form>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline">
                Log in Here
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto text-center text-xs text-slate-500 font-medium z-10 pt-4">
        © 2026 Dayflow HRMS. All rights reserved.
      </div>
    </div>
  );
};
