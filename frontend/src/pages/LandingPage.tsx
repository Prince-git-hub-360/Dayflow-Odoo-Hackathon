import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  UserCheck,
  CalendarDays,
  FileText,
  DollarSign,
  ShieldCheck,
  Bell,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Clock,
  User,
  Shield,
  Layers,
  Award,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ThemeSelector } from '../components/ui/ThemeSelector';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [liveTime, setLiveTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white font-sans relative transition-colors duration-200">
      {/* 1. STICKY GLASSMORPHISM HEADER */}
      <header className="sticky top-0 z-50 w-full glass-card bg-white/90 dark:bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Dayflow Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Dayflow <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 inline" />
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 -mt-0.5">
                HR Management Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Roles & Portals
            </button>
          </nav>

          {/* Right Action CTAs & Theme Selector */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeSelector />

            {user ? (
              <Button
                variant="primary"
                onClick={() => navigate(user.role === 'EMPLOYEE' ? '/dashboard' : '/admin/dashboard')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Go to Workspace ({user.role})
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate('/register')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] px-4 py-6 space-y-4 animate-fade-in shadow-xl">
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Roles & Portals
            </button>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
              {user ? (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate(user.role === 'EMPLOYEE' ? '/dashboard' : '/admin/dashboard')}
                >
                  Go to Workspace
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

      {/* Main Content Body */}
      <main className="overflow-hidden">
        {/* Dynamic Ambient Background Blur Blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-[650px] right-0 w-[550px] h-[550px] bg-gradient-to-l from-purple-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

        {/* 2. HERO SECTION REFINEMENT */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pulsing Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 shadow-sm animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                MODERN HR MANAGEMENT PLATFORM
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
              Human Resource Management,{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                Simplified.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              One unified platform for daily attendance tracking, atomic leave approvals, role-based payroll visibility, and administrative HR controls.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto shadow-xl shadow-indigo-600/30"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => scrollToSection('features')}
                className="w-full sm:w-auto"
              >
                Explore Features
              </Button>
            </div>
          </div>

          {/* 3. INTERACTIVE MOCK WORKSPACE PREVIEW */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#131926]/95 relative z-10 overflow-hidden">
              {/* macOS Window Dots + Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-slate-600 dark:text-slate-400">dayflow-hrms.app / workspace</span>
                </div>
                <Badge variant="success" size="sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping inline-block" />
                  LIVE SYSTEM ACTIVE
                </Badge>
              </div>

              {/* Dashboard Mockup Stat Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Attendance Widget */}
                <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Daily Attendance</span>
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-between">
                    <span>Checked In Today</span>
                    <span className="font-mono text-[11px]">{liveTime || '09:00:00 UTC'}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Monthly Attendance Rate: <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">96.5%</strong>
                  </p>
                </div>

                {/* Card 2: Leave Request Status */}
                <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Leave Requests</span>
                    <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs text-slate-900 dark:text-slate-100 font-bold flex items-center justify-between">
                    <span>Paid Vacation Leave</span>
                    <Badge variant="success">APPROVED</Badge>
                  </div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-300 italic font-semibold">"Approved by HR Manager"</p>
                </div>

                {/* Card 3: Payroll Summary */}
                <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Payroll Visibility</span>
                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                    <p className="text-[10px] uppercase text-purple-800 dark:text-purple-300 font-bold">Monthly Take-Home</p>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white">$116,000.00</p>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-500 inline" /> Read-Only Employee View
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CORE FEATURES GRID */}
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <Badge variant="info">Core Capabilities</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Everything HR Needs. One Simple Workspace.
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base font-medium">
              Dayflow brings essential employee self-service and HR administrative workflows together into one organized, secure platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card hoverable className="space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-indigo-500/50 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Employee Profile Management</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Store and manage employee profiles, job titles, department assignments, and contact info. Employees can update phone and address while core employment fields remain protected.
              </p>
            </Card>

            <Card hoverable className="space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-emerald-500/50 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Attendance Tracking</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Real-time check-in and check-out tracking with automated status calculation (Present, Half Day, Absent). Comprehensive 30-day attendance records for employees and HR.
              </p>
            </Card>

            <Card hoverable className="space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-purple-500/50 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Leave Approval Workflows</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Submit Paid, Sick, or Unpaid leave requests with Zod date validation. HR/Admin can review, approve, or reject requests with reviewer comments.
              </p>
            </Card>

            <Card hoverable className="space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-amber-500/50 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payroll Controls & Visibility</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Employees receive read-only payslip breakdowns (Basic, Allowances, Deductions, Net Pay). Authorized HR/Admin users manage and update pay structures.
              </p>
            </Card>

            <Card hoverable className="space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-rose-500/50 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Role-Based Security (RBAC)</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Centralized backend dependencies enforce object-level security. Employees can only access their own data, while HR/Admin manage organizational operations.
              </p>
            </Card>

            <Card hoverable className="space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-sky-500/50 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Notifications & Audit Logs</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Keep employees informed of leave reviews and salary updates via in-app notifications. Immutable enterprise audit trail logs all administrative mutations.
              </p>
            </Card>
          </div>
        </section>

        {/* 5. HOW IT WORKS STEP PROGRESSION */}
        <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <Badge variant="warning">Step-by-Step Workflow</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Simple for Everyone.</h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base font-medium">
              Get started in minutes with clean role-based onboarding and streamlined HR workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <Card className="p-6 relative border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-indigo-500/50 transition-all duration-200">
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">01</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">Sign In</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed font-medium">
                Users securely log in with role-based JWT authentication as Employee, HR, or Admin.
              </p>
            </Card>

            <Card className="p-6 relative border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-emerald-500/50 transition-all duration-200">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">02</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">Manage</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed font-medium">
                Employees log daily check-ins, apply for leaves, and inspect their active payslip structure.
              </p>
            </Card>

            <Card className="p-6 relative border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-purple-500/50 transition-all duration-200">
              <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">03</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">Review</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed font-medium">
                HR/Admin officers approve or reject leave applications and adjust employee pay structures.
              </p>
            </Card>

            <Card className="p-6 relative border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131926] hover:border-amber-500/50 transition-all duration-200">
              <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">04</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">Stay Updated</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed font-medium">
                Real-time in-app notifications and system audit logs keep the entire organization aligned.
              </p>
            </Card>
          </div>
        </section>

        {/* 6. ROLE-BASED COMPARISON & DEMO LOGIN SHORTCUTS */}
        <section id="roles" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <Badge variant="info">Workplace Portals</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Built for Every Side of the Workplace.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Employee Portal Card */}
            <Card className="p-8 border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-[#131926] space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Employee Capabilities</h3>
                </div>
                <Badge variant="info">EMPLOYEE PORTAL</Badge>
              </div>

              <ul className="space-y-3 text-sm text-slate-800 dark:text-slate-200 font-semibold">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" /> Manage personal profile (phone, address, avatar)
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" /> Daily check-in & check-out attendance widget
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" /> View 30-day attendance history & summary rates
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" /> Submit Paid, Sick, or Unpaid leave applications
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" /> Read-only payslip breakdown (basic, allowances, net)
                </li>
              </ul>

              <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                Sign In to Employee Portal
              </Button>
            </Card>

            {/* HR / Admin Command Center Card */}
            <Card className="p-8 border-purple-200 dark:border-purple-500/30 bg-white dark:bg-[#131926] space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">HR & Admin Command Center</h3>
                </div>
                <Badge variant="warning">ADMIN & HR PORTAL</Badge>
              </div>

              <ul className="space-y-3 text-sm text-slate-800 dark:text-slate-200 font-semibold">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" /> Organization-wide employee directory & departments
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" /> Org-wide attendance monitoring & date filters
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" /> Leave approval inbox (Approve / Reject + comments)
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" /> Full payroll management & salary structure updates
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" /> Interactive Recharts analytics & system audit trail
                </li>
              </ul>

              <Button variant="primary" className="w-full" onClick={() => navigate('/login')}>
                Sign In to HR / Admin Center
              </Button>
            </Card>
          </div>
        </section>
      </main>

      {/* 7. EVALUATION & DEMO FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">Dayflow</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Human Resource Management, Simplified. Enterprise-grade HR self-service & administrative controls.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                <Layers className="w-3 h-3" /> Built for Odoo Hackathon Evaluation
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li><button onClick={() => scrollToSection('features')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</button></li>
              <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How It Works</button></li>
              <li><button onClick={() => scrollToSection('roles')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Roles & Portals</button></li>
            </ul>
          </div>

          {/* Quick Login Shortcuts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">Quick Demo Login</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li><Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">Employee Portal Sign In</Link></li>
              <li><Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">HR Manager Sign In</Link></li>
              <li><Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">System Admin Sign In</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">Account</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li><Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400">Create Account</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
          © 2026 Dayflow HRMS. Built for hackathon demonstration.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
