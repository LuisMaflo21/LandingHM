import { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Settings } from 'lucide-react';

interface Props {
  onOpenCookiesPolicy: () => void;
}

export function CookieBanner({ onOpenCookiesPolicy }: Props) {
  const [visible, setVisible] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('masterexcel_cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(
      'masterexcel_cookie_consent',
      JSON.stringify({ essential: true, analytics: true, date: new Date().toISOString() })
    );
    setVisible(false);
  };

  const acceptEssentialOnly = () => {
    localStorage.setItem(
      'masterexcel_cookie_consent',
      JSON.stringify({ essential: true, analytics: false, date: new Date().toISOString() })
    );
    setVisible(false);
  };

  const saveCustomPreferences = () => {
    localStorage.setItem(
      'masterexcel_cookie_consent',
      JSON.stringify({ essential: true, analytics: analyticsEnabled, date: new Date().toISOString() })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-slate-900/95 text-white border-t border-slate-800 shadow-2xl backdrop-blur-md animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Banner Text */}
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Utilizamos cookies técnicas estrictamente necesarias para el correcto funcionamiento de la plataforma y la entrega de tu plantilla de finanzas personales. Respetamos tu privacidad: <strong>no vendemos tus datos ni utilizamos patrones oscuros</strong>.
            </p>
            <div className="mt-1">
              <button
                type="button"
                onClick={onOpenCookiesPolicy}
                className="text-emerald-400 hover:text-emerald-300 underline font-semibold text-xs"
              >
                Leer Política de Cookies completa
              </button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={acceptEssentialOnly}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
          >
            Solo Esenciales
          </button>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
            title="Configurar cookies"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preferencias</span>
          </button>

          <button
            onClick={acceptAll}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition"
          >
            Aceptar Todas
          </button>
        </div>
      </div>

      {/* Modal Drawer for Custom Preferences */}
      {showConfig && (
        <div className="max-w-2xl mx-auto mt-4 pt-4 border-t border-slate-800 text-xs space-y-3">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800">
            <div>
              <strong className="block text-white font-semibold">Cookies Esenciales (Obligatorias)</strong>
              <span className="text-slate-400 text-[11px]">Necesarias para la sesión y descarga de archivos.</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Siempre Activas</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800">
            <div>
              <strong className="block text-white font-semibold">Métricas de Rendimiento Anónimas</strong>
              <span className="text-slate-400 text-[11px]">Nos ayudan a mejorar la velocidad de carga de la web.</span>
            </div>
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={saveCustomPreferences}
              className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs"
            >
              Guardar Preferencias
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
