import React, { useState } from 'react';
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

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] selection:bg-indigo-500 selection:text-white font-sans relative overflow-x-hidden transition-colors duration-200">
      {/* Dynamic Background Glow Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 dark:bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-purple-600/10 dark:bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* 1. HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 glass-card border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md bg-white/80 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-300 bg-clip-text text-transparent">
                Dayflow
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 -mt-1">
                HR Management Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700 dark:text-slate-300">
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
              onClick={() => scrollToSection('employees')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              For Employees
            </button>
            <button
              onClick={() => scrollToSection('hr')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              For HR / Admin
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

          {/* Mobile Menu & Theme Selector Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-6 space-y-4 animate-fade-in">
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('employees')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              For Employees
            </button>
            <button
              onClick={() => scrollToSection('hr')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              For HR / Admin
            </button>

            <div className="py-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Theme Preference</p>
              <ThemeSelector variant="segmented" className="w-full justify-center" />
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
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

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <Badge variant="info" className="px-4 py-1.5 text-xs tracking-wider uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" /> Modern HR Management Platform
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-white">
            Human Resource Management,{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
              Simplified.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Manage employees, attendance tracking, leave workflows, payroll visibility, and administrative controls from one unified, secure workspace.
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

        {/* Hero Visual Mockup Preview Composition */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 relative z-10 overflow-hidden">
            {/* Mock Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400 dark:text-slate-500">dayflow-hrms.app / workspace</span>
              </div>
              <Badge variant="success" size="sm">LIVE SYSTEM ACTIVE</Badge>
            </div>

            {/* Dashboard Mockup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Attendance Widget */}
              <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Daily Attendance</span>
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-between">
                  <span>Checked In Today</span>
                  <span className="font-mono text-[11px]">09:00:00 UTC</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Monthly Attendance Rate: <strong className="text-indigo-600 dark:text-indigo-400">96.5%</strong></p>
              </div>

              {/* Card 2: Leave Request Status */}
              <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Leave Requests</span>
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>Paid Vacation Leave</span>
                  <Badge variant="success">APPROVED</Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">"Approved by HR Manager"</p>
              </div>

              {/* Card 3: Payslip Summary */}
              <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Payroll Visibility</span>
                  <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                  <p className="text-[10px] uppercase text-purple-700 dark:text-purple-300 font-bold">Monthly Take-Home</p>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white">$116,000.00</p>
                </div>
                <p className="text-[11px] text-slate-500">Read-Only Employee View</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST / VALUE STRIP */}
      <section className="border-y border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-6 text-center">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Employee Profile Management</span>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Daily Attendance Tracking</span>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Atomic Leave Approval Workflows</span>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Role-Based Payroll Visibility</span>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Everything HR Needs. One Simple Workspace.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Dayflow brings essential employee self-service and HR administrative workflows together into one organized, secure platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card hoverable className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Employee Profile Management</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Store and manage employee profiles, job titles, department assignments, and contact info. Employees can update phone and address while core employment fields remain protected.
            </p>
          </Card>

          <Card hoverable className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Attendance Tracking</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Real-time check-in and check-out tracking with automated status calculation (Present, Half Day, Absent). Comprehensive 30-day attendance records for employees and HR.
            </p>
          </Card>

          <Card hoverable className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Leave Management</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Submit Paid, Sick, or Unpaid leave requests with Zod date validation. HR/Admin can review, approve, or reject requests with reviewer comments.
            </p>
          </Card>

          <Card hoverable className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payroll Visibility & Control</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Employees receive read-only payslip breakdowns (Basic, Allowances, Deductions, Net Pay). Authorized HR/Admin users manage and update pay structures.
            </p>
          </Card>

          <Card hoverable className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Role-Based Access Control</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Centralized backend dependencies enforce object-level security. Employees can only access their own data, while HR/Admin manage organizational operations.
            </p>
          </Card>

          <Card hoverable className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Real-Time Notifications & Audit</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Keep employees informed of leave reviews and salary updates via in-app notifications. Immutable enterprise audit trail logs all administrative mutations.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. EMPLOYEE EXPERIENCE SECTION */}
      <section id="employees" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 via-white to-slate-50 dark:from-indigo-950/30 dark:via-slate-900/50 dark:to-slate-950">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="info">Employee Portal</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Everything Employees Need, Right at Their Fingertips.
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Empower your workforce with intuitive self-service. Log daily attendance, apply for leave in seconds, inspect payslips, and receive instant status updates.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>One-click daily check-in & check-out widget</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Leave application tracking with reviewer notes</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Read-only payslip breakdown with net salary visibility</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Editable phone, address, and profile picture</span>
                </div>
              </div>
            </div>

            {/* Employee Preview Card Composition */}
            <div className="space-y-4">
              <Card className="p-5 border-indigo-200 dark:border-indigo-500/30 bg-white/90 dark:bg-slate-900/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Employee Dashboard</span>
                  <Badge variant="success">JOHN DOE (EMP001)</Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Attendance Rate</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">96.5% (22 Days Present)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Paid Leave Status</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-300">APPROVED for Sep 01 - Sep 05</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Net Payslip</span>
                    <span className="font-bold text-slate-900 dark:text-white">$116,000.00 / mo</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HR / ADMIN EXPERIENCE SECTION */}
      <section id="hr" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-50/50 via-white to-slate-50 dark:from-purple-950/30 dark:via-slate-900/50 dark:to-slate-950">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-4">
              <Card className="p-5 border-purple-200 dark:border-purple-500/30 bg-white/90 dark:bg-slate-900/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase">HR Command Center</span>
                  <Badge variant="warning">ADMIN MODE</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400">Total Staff</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">124</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400">Present Today</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">108</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400">Pending Review</p>
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400">7 Requests</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400">On Leave</p>
                    <p className="text-xl font-bold text-sky-600 dark:text-sky-400">8 Staff</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <Badge variant="warning">HR & Admin Portal</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Powerful Tools for HR. Clear Visibility for Every Decision.
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Streamline organization management with full visibility into attendance trends, leave request approvals, salary structure updates, and audit trails.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Searchable employee directory with department filters</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>One-click leave approval inbox with reviewer comments</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Payroll management & salary structure controls</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Interactive Recharts analytics & system audit trail</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Simple for Everyone.</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Get started in minutes with clean role-based onboarding and streamlined HR workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 relative">
            <span className="text-3xl font-extrabold text-indigo-500/40">01</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">Sign In</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Users securely log in with role-based JWT authentication as Employee, HR, or Admin.
            </p>
          </Card>

          <Card className="p-6 relative">
            <span className="text-3xl font-extrabold text-emerald-500/40">02</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">Manage</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Employees log daily check-ins, apply for leaves, and inspect their active payslip structure.
            </p>
          </Card>

          <Card className="p-6 relative">
            <span className="text-3xl font-extrabold text-purple-500/40">03</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">Review</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              HR/Admin officers approve or reject leave applications and adjust employee pay structures.
            </p>
          </Card>

          <Card className="p-6 relative">
            <span className="text-3xl font-extrabold text-amber-500/40">04</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">Stay Updated</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Real-time in-app notifications and system audit logs keep the entire organization aligned.
            </p>
          </Card>
        </div>
      </section>

      {/* 8. ROLE-BASED COMPARISON SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Built for Every Side of the Workplace.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Employee Card */}
          <Card className="p-8 border-indigo-200 dark:border-indigo-500/30 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Employee Capabilities</h3>
              </div>
              <Badge variant="info">EMPLOYEE ROLE</Badge>
            </div>

            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Manage personal profile (phone, address, avatar)
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Daily check-in & check-out attendance widget
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> View 30-day attendance history & summary rates
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Submit Paid, Sick, or Unpaid leave applications
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Read-only payslip breakdown (basic, allowances, net)
              </li>
            </ul>

            <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
              Sign In as Employee
            </Button>
          </Card>

          {/* HR / Admin Card */}
          <Card className="p-8 border-purple-200 dark:border-purple-500/30 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">HR / Admin Capabilities</h3>
              </div>
              <Badge variant="warning">HR & ADMIN ROLE</Badge>
            </div>

            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Organization-wide employee directory & departments
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> Org-wide attendance monitoring & date filters
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> Leave approval inbox (Approve / Reject + comments)
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> Full payroll management & salary structure updates
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> Interactive Recharts analytics & system audit trail
              </li>
            </ul>

            <Button variant="primary" className="w-full" onClick={() => navigate('/login')}>
              Sign In as HR / Admin
            </Button>
          </Card>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="glass-card rounded-3xl p-10 sm:p-16 border border-slate-200 dark:border-slate-800 bg-gradient-to-tr from-indigo-50 via-white to-purple-50 dark:from-indigo-950/50 dark:via-slate-900/80 dark:to-purple-950/50 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Bring Your HR Workflows Together with Dayflow.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              Give employees a simpler way to manage workplace essentials and give HR the visibility needed to manage them efficiently.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Get Started Now
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">Dayflow</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Human Resource Management, Simplified. Built for hackathon evaluation.
            </p>
          </div>

          {/* Column 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><button onClick={() => scrollToSection('features')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Features</button></li>
              <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-indigo-600 dark:hover:text-indigo-400">How It Works</button></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><button onClick={() => scrollToSection('employees')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Employee Portal</button></li>
              <li><button onClick={() => scrollToSection('hr')} className="hover:text-indigo-600 dark:hover:text-indigo-400">HR & Admin Control</button></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">Account</h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400">Create Account</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-500">
          © 2026 Dayflow HRMS. Built for hackathon demonstration.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
