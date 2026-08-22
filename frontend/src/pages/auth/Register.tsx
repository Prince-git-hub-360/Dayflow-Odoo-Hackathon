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
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex flex-col justify-center py-6 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Top Bar Navigation */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <ThemeSelector />
      </div>

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 pt-8 sm:pt-0">
        <Link to="/" className="flex items-center justify-center gap-3 mb-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">Dayflow</span>
        </Link>
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Create Account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
          Join your organization on Dayflow HRMS
        </p>
      </div>

      {/* Form Card Container */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl z-10 px-4">
        <div className="glass-card rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95">
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-center gap-2.5 text-rose-700 dark:text-rose-400 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Select Your Role (Required by Dayflow Spec)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setValue('role', 'EMPLOYEE')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
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
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
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
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    selectedRole === 'ADMIN'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/30'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>System Admin</span>
                </button>
              </div>
            </div>

            {/* Grid Row 1: First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  {...register('first_name')}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-medium"
                  placeholder="John"
                />
                {errors.first_name && (
                  <p className="mt-0.5 text-[11px] font-semibold text-rose-500">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register('last_name')}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-medium"
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
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Employee ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('employee_id')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 pl-9 font-medium"
                    placeholder="EMP999"
                  />
                  <BadgeCheck className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
                {errors.employee_id && (
                  <p className="mt-0.5 text-[11px] font-semibold text-rose-500">{errors.employee_id.message}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Job Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('job_title')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 pl-9 font-medium"
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
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Work Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 pl-9 font-medium"
                  placeholder="john@dayflow.com"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
              {errors.email && (
                <p className="mt-0.5 text-[11px] font-semibold text-rose-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Min. 6 characters
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 pl-9 pr-10 font-medium"
                  placeholder="••••••••"
                />
                <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
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
              className="w-full py-2.5 mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-500 font-medium">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
