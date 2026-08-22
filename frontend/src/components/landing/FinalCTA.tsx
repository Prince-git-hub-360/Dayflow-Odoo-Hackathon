import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const FinalCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <div className="glass-card rounded-3xl p-10 sm:p-16 border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#131926]/95 shadow-2xl relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Bring HR into one <br className="hidden sm:inline" />
            connected workspace.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Give employees and HR teams a simpler way to manage the work that keeps your organization moving.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto shadow-xl shadow-indigo-600/25 px-8"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8"
            >
              Log in
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
