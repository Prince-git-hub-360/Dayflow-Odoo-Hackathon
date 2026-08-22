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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.detail || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true, shouldDirty: true });
    setValue('password', pass, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Top Navigation */}
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
        <Link to="/" className="flex items-center justify-center gap-3 mb-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </Link>
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Log in to Dayflow
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          Access your employee portal or administrative dashboard
        </p>
      </div>

      {/* Login Card Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="glass-card rounded-2xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-center gap-3 text-rose-700 dark:text-rose-400 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 pl-10 font-medium transition-all"
                  placeholder="name@dayflow.com"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                Password
              </label>
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
                  title={showPassword ? 'Hide password' : 'Show password'}
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
              className="w-full py-3"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Log in
            </Button>
          </form>

          {/* Evaluator Quick Fill Bar */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-center mb-3">
              ⚡ Evaluator Quick Demo Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('john@dayflow.com', 'User@123')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-[11px] font-bold text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Employee</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('hr@dayflow.com', 'HR@123')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/50 text-[11px] font-bold text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>HR Manager</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@dayflow.com', 'Admin@123')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-[11px] font-bold text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Shield className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
