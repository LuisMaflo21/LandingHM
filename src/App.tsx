import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroWithForm } from './components/HeroWithForm';
import { TemplateHookPreview } from './components/TemplateHookPreview';
import { PainPointsSimple } from './components/PainPointsSimple';
import { CoursesGridSimple } from './components/CoursesGridSimple';
import { GuaranteeSimple } from './components/GuaranteeSimple';
import { FaqSimple } from './components/FaqSimple';
import { FooterSimple } from './components/FooterSimple';
import { CookieBanner } from './components/CookieBanner';
import { LegalModals } from './components/LegalModals';
import { CourseDetailModal } from './components/CourseDetailModal';
import { AdminDrawer } from './components/AdminDrawer';
import { AppConfig, CourseLevel, Lead } from './types';
import { getLocalConfig, saveLocalConfig, getLocalLeads } from './services/leadStorage';
import { trackPageView, trackTimeSpent, syncLeadsCount } from './services/analytics';
import { testFirestoreConnection } from './services/firebase';

export default function App() {
  const [config, setConfig] = useState<AppConfig>(() => getLocalConfig());
  const [activeLegalModal, setActiveLegalModal] = useState<
    'privacy' | 'terms' | 'refund' | 'cookies' | 'delete-data' | null
  >(null);
  const [activeCourseModal, setActiveCourseModal] = useState<CourseLevel | null>(null);
  const [adminDrawerOpen, setAdminDrawerOpen] = useState<boolean>(false);

  // Initialize analytics & track visitor time on page
  useEffect(() => {
    testFirestoreConnection();
    trackPageView();
    const leads = getLocalLeads();
    syncLeadsCount(leads.length);

    // Track active time every 10 seconds while tab is visible
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        trackTimeSpent(10);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Fetch initial config from server (if available) with safe json handling
  useEffect(() => {
    fetch('/api/config')
      .then(async (res) => {
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) return null;
        const text = await res.text();
        if (text.startsWith('<')) return null;
        return JSON.parse(text);
      })
      .then((data) => {
        if (data && data.success && data.config) {
          setConfig((prev) => {
            const merged = {
              ...prev,
              ...data.config,
            };
            saveLocalConfig(merged);
            return merged;
          });
        }
      })
      .catch(() => {
        // Netlify static fallback already loaded from getLocalConfig()!
      });
  }, []);

  // Admin access listeners: '#admin' hash in URL and shortcut Ctrl + Shift + A
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setAdminDrawerOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setAdminDrawerOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLeadCreated = (_newLead: Lead) => {
    const leads = getLocalLeads();
    syncLeadsCount(leads.length);
  };

  const handleLeadDeleted = (_email: string) => {
    // Lead deleted
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white">
      {/* Clean Header (3-clicks on logo opens admin) */}
      <Header
        onOpenAdmin={() => setAdminDrawerOpen(true)}
      />

      <main className="flex-1">
        {/* 1. Hook + Direct Simplified Form with Gated Download Button */}
        <HeroWithForm
          onLeadSuccess={handleLeadCreated}
          onOpenPrivacy={() => setActiveLegalModal('privacy')}
          googleSheetUrl={config.templateGoogleSheetUrl}
        />

        {/* 2. The Hook Presentation (Template Showcase) */}
        <TemplateHookPreview googleSheetUrl={config.templateGoogleSheetUrl} />

        {/* 3. The 3 Common Pain Points & Solutions */}
        <PainPointsSimple />

        {/* 4. Course Levels & Pricing (Oferta $5, Principiantes, Empresarial & Ebook) */}
        <CoursesGridSimple
          config={config}
          onOpenDetails={(course) => setActiveCourseModal(course)}
        />

        {/* 5. Hotmart 7-Day Money Back Guarantee */}
        <GuaranteeSimple
          days={config.hotmartGuaranteeDays}
          onOpenRefund={() => setActiveLegalModal('refund')}
        />

        {/* 6. Essential FAQ */}
        <FaqSimple />
      </main>

      {/* Clean Footer (Discreet 🔒 Admin link) */}
      <FooterSimple
        config={config}
        onOpenModal={(type) => setActiveLegalModal(type)}
        onOpenAdmin={() => setAdminDrawerOpen(true)}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner
        onOpenCookiesPolicy={() => setActiveLegalModal('cookies')}
      />

      {/* Legal & Compliance Modals (Privacy, Terms, Refund, Data Deletion) */}
      <LegalModals
        activeModal={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
        config={config}
        onLeadDeleted={handleLeadDeleted}
      />

      {/* Course Curriculum Syllabus Modal */}
      <CourseDetailModal
        course={activeCourseModal}
        onClose={() => setActiveCourseModal(null)}
        config={config}
      />

      {/* Central de Leads Drawer (Protected by Admin Password) */}
      <AdminDrawer
        isOpen={adminDrawerOpen}
        onClose={() => setAdminDrawerOpen(false)}
        config={config}
        onConfigUpdated={(newCfg) => setConfig(newCfg)}
      />
    </div>
  );
}
