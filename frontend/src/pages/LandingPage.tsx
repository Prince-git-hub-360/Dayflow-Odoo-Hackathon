import React, { useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { ProductPreview } from '../components/landing/ProductPreview';
import { ProductStrip } from '../components/landing/ProductStrip';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { EmployeeShowcase } from '../components/landing/EmployeeShowcase';
import { AdminShowcase } from '../components/landing/AdminShowcase';
import { AnalyticsSection } from '../components/landing/AnalyticsSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { SecuritySection } from '../components/landing/SecuritySection';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/landing/Footer';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Dayflow — Modern HR Management';
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white font-sans relative transition-colors duration-200">
      {/* 1. STICKY NAVBAR */}
      <Navbar onNavigateSection={scrollToSection} />

      {/* MAIN BODY CONTENT */}
      <main className="overflow-hidden">
        {/* 2. HERO */}
        <Hero onExploreClick={() => scrollToSection('features')} />

        {/* 3. REAL DAYFLOW DASHBOARD PREVIEW */}
        <ProductPreview />

        {/* 4. VALUE STRIP */}
        <ProductStrip />

        {/* 5. CORE HR CAPABILITIES FEATURE GRID */}
        <FeatureGrid />

        {/* 6. EMPLOYEE EXPERIENCE SHOWCASE */}
        <EmployeeShowcase />

        {/* 7. HR / ADMIN SHOWCASE */}
        <AdminShowcase />

        {/* 8. WORKFORCE ANALYTICS (RECHARTS THEME-RESPONSIVE) */}
        <AnalyticsSection />

        {/* 9. HOW IT WORKS PROGRESSION */}
        <HowItWorks />

        {/* 10. ENTERPRISE SECURITY */}
        <SecuritySection />

        {/* 11. FINAL CONVERSION CTA */}
        <FinalCTA />
      </main>

      {/* 12. SAAS FOOTER */}
      <Footer onNavigateSection={scrollToSection} />
    </div>
  );
};

export default LandingPage;
