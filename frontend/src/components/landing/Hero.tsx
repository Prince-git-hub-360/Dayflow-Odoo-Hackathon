import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            MODERN HR MANAGEMENT
          </span>
        </div>

        {/* Primary Editorial Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-slate-900 dark:text-white">
          Human Resource <br className="hidden sm:inline" />
          Management,{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
            Simplified.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
          Manage employees, attendance, leave, payroll and everyday HR operations from one intelligent workspace.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-lg shadow-indigo-600/25 px-8"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8"
          >
            Explore Platform
          </Button>
        </div>

        {/* Trust Statement */}
        <div className="pt-2 text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Built for employees, HR teams and modern organizations.</span>
        </div>
      </div>
    </section>
  );
};
