import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Shield, User, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

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

  const fillDemoCreds = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-xl shadow-indigo-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
          Sign in to Dayflow
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Enterprise Human Resource Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="glass-card rounded-2xl p-8 shadow-2xl border border-slate-800">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all pl-10"
                  placeholder="name@dayflow.com"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...register('password')}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all pl-10"
                  placeholder="••••••••"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-400">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
              Evaluator Demo Quick Fill
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCreds('john@dayflow.com', 'User@123')}
                className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-center transition-all group"
              >
                <User className="w-4 h-4 text-sky-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] font-bold text-slate-200">Employee</p>
                <p className="text-[9px] text-slate-500 truncate">john@dayflow.com</p>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCreds('hr@dayflow.com', 'HR@123')}
                className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-center transition-all group"
              >
                <Shield className="w-4 h-4 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] font-bold text-slate-200">HR Manager</p>
                <p className="text-[9px] text-slate-500 truncate">hr@dayflow.com</p>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCreds('admin@dayflow.com', 'Admin@123')}
                className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-center transition-all group"
              >
                <Sparkles className="w-4 h-4 text-rose-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] font-bold text-slate-200">Admin</p>
                <p className="text-[9px] text-slate-500 truncate">admin@dayflow.com</p>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-400 hover:underline">
              Create an Employee Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
