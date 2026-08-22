import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Left Column: Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1">
              Dayflow <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 inline" />
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Human Resource Management, Simplified. One unified platform for employee management, attendance, leave, payroll, and workforce insights.
          </p>
        </div>

        {/* Column 1: Product */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
            Product
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <li>
              <button
                onClick={() => onNavigateSection('features')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Features
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateSection('solutions')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Solutions
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateSection('how-it-works')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                How It Works
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateSection('security')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Security
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: Demo Quick Login */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
            Quick Demo Shortcuts
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <li>
              <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Employee Portal Sign In
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                HR Manager Sign In
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                System Admin Sign In
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Account */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
            Account
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <li>
              <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Create Account
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200/80 dark:border-slate-800/80 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
        © 2026 Dayflow. All rights reserved.
      </div>
    </footer>
  );
};
