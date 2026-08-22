import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Shield, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeSelector } from '../ui/ThemeSelector';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onNavigateSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateSection }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(id);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#0B0F17]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* LEFT: Dayflow Logo */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-indigo-500/40 rounded-xl">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              Dayflow <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 inline" />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 -mt-1">
              HR Management Platform
            </span>
          </div>
        </Link>

        {/* CENTER: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          <button
            onClick={() => handleNavClick('features')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('solutions')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
          >
            Solutions
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('security')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
          >
            Security
          </button>
        </nav>

        {/* RIGHT: Theme Selector & CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeSelector />

          {user ? (
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate(user.role === 'EMPLOYEE' ? '/dashboard' : '/admin/dashboard')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Go to Workspace ({user.role})
            </Button>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu & Theme Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeSelector />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] px-4 py-5 space-y-4 animate-fade-in shadow-xl">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('features')}
              className="block w-full text-left py-2 px-3 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('solutions')}
              className="block w-full text-left py-2 px-3 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl"
            >
              Solutions
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="block w-full text-left py-2 px-3 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('security')}
              className="block w-full text-left py-2 px-3 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl"
            >
              Security
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            {user ? (
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate(user.role === 'EMPLOYEE' ? '/dashboard' : '/admin/dashboard')}
              >
                Go to Workspace ({user.role})
              </Button>
            ) : (
              <>
                <Button variant="secondary" className="w-full" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button variant="primary" className="w-full" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
