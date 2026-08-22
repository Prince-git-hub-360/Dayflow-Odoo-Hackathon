import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Sparkles,
  KeyRound,
  Mail,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Shield,
  Clock,
  FileText,
  IndianRupee,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ThemeSelector } from '../../components/ui/ThemeSelector';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'USER_NOT_FOUND' | 'INCORRECT_PASSWORD' | 'GENERIC' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Forgot Password Modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [resetPassword, setResetPassword] = useState<string>('');
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    setErrorType(null);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail || '';
      if (status === 404 || detail.toLowerCase().includes('not found')) {
        setErrorType('USER_NOT_FOUND');
        setErrorMessage('User account not found in Dayflow HRMS.');
      } else if (status === 401 || detail.toLowerCase().includes('incorrect') || detail.toLowerCase().includes('password')) {
        setErrorType('INCORRECT_PASSWORD');
        setErrorMessage('Incorrect password. Please verify your credentials or reset password.');
      } else {
        setErrorType('GENERIC');
        setErrorMessage(detail || 'Log in failed. Invalid credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true, shouldDirty: true });
    setValue('password', pass, { shouldValidate: true, shouldDirty: true });
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetPassword) return;
    setResetLoading(true);
    setResetFeedback(null);
    try {
      const res = await api.post('/auth/reset-password', {
        email: resetEmail,
        password: resetPassword,
      });
      setResetFeedback(res.data.message || 'Password successfully reset!');
      setTimeout(() => {
        setIsResetModalOpen(false);
        setValue('email', resetEmail);
        setValue('password', resetPassword);
      }, 1500);
    } catch (err: any) {
      setResetFeedback(err.response?.data?.detail || 'Failed to reset password. Verify email.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors duration-200">
      {/* Top Header Strip */}
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
        {/* LEFT COLUMN: BRAND SHOWCASE & PLATFORM VALUE PROPOSITION (6 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-8 pr-0 lg:pr-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>MODERN HR MANAGEMENT PLATFORM</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Human Resource <br />
              Management,{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Simplified.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl">
              One unified platform for employee onboarding, live daily attendance tracking, atomic leave approval workflows, and INR payroll management.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">Real-Time Attendance</h3>
              <p className="text-[11px] text-slate-500 font-medium">One-click check-in/out with live duration tracking.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">Atomic Leave Workflow</h3>
              <p className="text-[11px] text-slate-500 font-medium">Multi-type leave approval inbox with HR comments.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <IndianRupee className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">INR Payroll Engine</h3>
              <p className="text-[11px] text-slate-500 font-medium">Transparent monthly payslips and CTC breakdowns in ₹.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">Enterprise RBAC</h3>
              <p className="text-[11px] text-slate-500 font-medium">Role isolation between Employee, HR, and Admin.</p>
            </div>
          </div>

          {/* Quick Evaluator Shortcuts */}
          <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              ⚡ Hackathon Evaluator Quick Demo Shortcuts
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('john@dayflow.com', 'User@123')}
                className="py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Employee</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('hr@dayflow.com', 'HR@123')}
                className="py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 hover:border-amber-500 text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>HR Manager</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@dayflow.com', 'Admin@123')}
                className="py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 hover:border-rose-500 text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: AUTHENTICATION FORM CARD (6 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 space-y-6">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white mb-3 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Log in to Dayflow
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                Enter your registered work credentials to access your workspace.
              </p>
            </div>

            {/* DYNAMIC ERROR ALERT BANNER */}
            {errorMessage && (
              <div
                className={`p-4 rounded-2xl border space-y-2 animate-fade-in ${
                  errorType === 'USER_NOT_FOUND'
                    ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                    : errorType === 'INCORRECT_PASSWORD'
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                    : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs font-semibold">
                    <p className="font-extrabold uppercase tracking-wider">
                      {errorType === 'USER_NOT_FOUND'
                        ? 'USER NOT FOUND'
                        : errorType === 'INCORRECT_PASSWORD'
                        ? 'INCORRECT PASSWORD'
                        : 'AUTHENTICATION ERROR'}
                    </p>
                    <p>{errorMessage}</p>
                  </div>
                </div>

                {/* Specific Action Link per Error Type */}
                {errorType === 'USER_NOT_FOUND' && (
                  <div className="pt-2 border-t border-rose-200 dark:border-rose-800/60 flex justify-end">
                    <Link
                      to="/register"
                      className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>Create Account Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {errorType === 'INCORRECT_PASSWORD' && (
                  <div className="pt-2 border-t border-amber-200 dark:border-amber-800/60 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(errors.email?.message ? '' : (document.querySelector('input[type="email"]') as HTMLInputElement)?.value || '');
                        setIsResetModalOpen(true);
                      }}
                      className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Forgot Password? Reset Here</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 pl-10 font-medium transition-all"
                    placeholder="name@company.com"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsResetModalOpen(true)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 pl-10 pr-10 font-medium transition-all"
                    placeholder="••••••••"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full py-3 text-sm font-bold shadow-lg shadow-indigo-600/25"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Log in to Dashboard
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline">
                Register Here
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* RESET PASSWORD MODAL */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Account Password"
      >
        <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Enter your registered email address and new password below to reset your Dayflow HRMS credentials.
          </p>

          {resetFeedback && (
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{resetFeedback}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Registered Email
            </label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              placeholder="name@company.com"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={resetLoading} leftIcon={<Lock className="w-4 h-4" />}>
              Save New Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Footer copyright */}
      <div className="max-w-7xl w-full mx-auto text-center text-xs text-slate-500 font-medium z-10 pt-4">
        © 2026 Dayflow HRMS. All rights reserved.
      </div>
    </div>
  );
};
