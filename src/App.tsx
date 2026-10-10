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

const defaultHojaMaestraConfig: AppConfig = {
  specialOfferCourseUrl: 'https://go.hotmart.com/A104149092W?dp=1',
  beginnerCourseUrl: 'https://go.hotmart.com/A103454189R?dp=1',
  businessCourseUrl: 'https://go.hotmart.com/K104148913I?dp=1',
  ebookCourseUrl: 'https://go.hotmart.com/G104148965I?dp=1',
  templateGoogleSheetUrl: 'https://docs.google.com/spreadsheets/d/1ii6AQvG85GPbTCzrLg9RtKfA0Sj9cWXy/edit?gid=996178209#gid=996178209',
  companyName: 'Hoja Maestra',
  supportEmail: 'contacto@hojamaestra.com',
  hotmartGuaranteeDays: 7,
  templateFileName: 'Plantilla_Finanzas_Personales_Hoja_Maestra.xlsx',
};

export default function App() {
  const [config, setConfig] = useState<AppConfig>(defaultHojaMaestraConfig);
  const [activeLegalModal, setActiveLegalModal] = useState<
    'privacy' | 'terms' | 'refund' | 'cookies' | 'delete-data' | null
  >(null);
  const [activeCourseModal, setActiveCourseModal] = useState<CourseLevel | null>(null);
  const [adminDrawerOpen, setAdminDrawerOpen] = useState<boolean>(false);

  // Fetch initial config from server
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setConfig((prev) => ({
            ...prev,
            ...data.config,
            specialOfferCourseUrl: data.config.specialOfferCourseUrl || prev.specialOfferCourseUrl,
            beginnerCourseUrl: data.config.beginnerCourseUrl || prev.beginnerCourseUrl,
            businessCourseUrl: data.config.businessCourseUrl || prev.businessCourseUrl,
            ebookCourseUrl: data.config.ebookCourseUrl || prev.ebookCourseUrl,
            templateGoogleSheetUrl: data.config.templateGoogleSheetUrl || prev.templateGoogleSheetUrl,
          }));
        }
      })
      .catch((err) => console.error('Error fetching config:', err));
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
    // Lead created silently in database
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
