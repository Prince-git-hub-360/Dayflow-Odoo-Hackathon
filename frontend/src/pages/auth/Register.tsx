import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, KeyRound, Mail, BadgeCheck, AlertCircle, ArrowRight } from 'lucide-react';
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
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await registerAuth({ ...data, role: 'EMPLOYEE' });
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
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-6 right-6 z-20">
        <ThemeSelector />
      </div>

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link to="/" className="flex items-center justify-center gap-3 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </Link>
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Create Employee Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Join your organization on Dayflow HRMS
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg z-10 px-4">
        <div className="glass-card rounded-2xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  {...register('first_name')}
                  className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="John"
                />
                {errors.first_name && (
                  <p className="mt-1 text-xs text-rose-500">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register('last_name')}
                  className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="Doe"
                />
                {errors.last_name && (
                  <p className="mt-1 text-xs text-rose-500">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Employee ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register('employee_id')}
                  className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pl-10"
                  placeholder="EMP999"
                />
                <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              </div>
              {errors.employee_id && (
                <p className="mt-1 text-xs text-rose-500">{errors.employee_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Job Title
              </label>
              <input
                type="text"
                {...register('job_title')}
                className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="Software Engineer"
              />
              {errors.job_title && (
                <p className="mt-1 text-xs text-rose-500">{errors.job_title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pl-10"
                  placeholder="john@dayflow.com"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...register('password')}
                  className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pl-10"
                  placeholder="••••••••"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3 mt-4"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
