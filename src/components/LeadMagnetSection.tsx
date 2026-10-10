import { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  Mail, 
  User, 
  ShieldCheck, 
  Lock, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Phone
} from 'lucide-react';
import { InteractiveSpreadsheetPreview } from './InteractiveSpreadsheetPreview';
import { Lead } from '../types';

interface Props {
  onLeadCreated?: (lead: Lead) => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTerms?: () => void;
}

export function LeadMagnetSection({ onLeadCreated, onOpenPrivacyPolicy, onOpenTerms }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState<'basico' | 'intermedio' | 'avanzado'>('intermedio');
  const [primaryGoal, setPrimaryGoal] = useState('automatizar');
  const [consentPrivacy, setConsentPrivacy] = useState(true);
  const [consentMarketing, setConsentMarketing] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successLead, setSuccessLead] = useState<Lead | null>(null);

  const handleDownloadDirect = () => {
    window.location.href = '/api/download/personal-finance-template';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (!consentPrivacy) {
      setErrorMsg('Debes aceptar la Política de Privacidad para poder enviarte la plantilla.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          level,
          primaryGoal,
          consentPrivacy,
          consentMarketing,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al procesar el registro.');
      }

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#34d399', '#0f172a', '#ffffff'],
        });
      } catch {
        // Confetti fallback
      }

      setSuccessLead(data.lead);
      if (onLeadCreated) {
        onLeadCreated(data.lead);
      }

      // Automatically trigger file download
      setTimeout(() => {
        handleDownloadDirect();
      }, 700);

    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error inesperado al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="descarga-plantilla" className="py-16 sm:py-24 bg-white relative overflow-hidden border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Recurso 100% Gratuito • El Gancho Oficial
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Descarga Gratis la Plantilla Automatizada de <span className="text-emerald-700">Finanzas Personales 2026</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Una hoja de cálculo profesional con fórmulas nativas, control de la regla 50/30/20, presupuestos y metas de ahorro. Pruébala en vivo o descárgala en tu computador ahora mismo.
          </p>
        </div>

        {/* Main Grid: Live Preview & Registration Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive Spreadsheet Component */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>Vista previa interactiva del archivo real:</span>
              <span className="text-emerald-700 font-semibold">Compatible con Microsoft Excel & Google Sheets</span>
            </div>

            <InteractiveSpreadsheetPreview onDownloadClick={handleDownloadDirect} />

            {/* Checklist of what's included in the template */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Dashboard con KPIs y regla 50/30/20 calculada al instante.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Hoja de gastos con categorías listas y semáforos de alerta.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Planificador automático de metas con cálculo de meses restantes.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Guía con los 10 atajos ninja de teclado que te ahorrarán horas.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form or Success Card */}
          <div className="lg:col-span-5">
            {!successLead ? (
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-xl relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-emerald-600 text-white">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Recibe la Plantilla en tu Email
                    </h3>
                    <p className="text-xs text-slate-500">
                      Descarga instantánea + notificaciones por correo
                    </p>
                  </div>
                </div>

                <hr className="my-4 border-slate-200" />

                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label htmlFor="lead-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nombre Completo <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        id="lead-name"
                        type="text"
                        required
                        placeholder="Ej. Roberto Sánchez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 sm:py-2 bg-white rounded-lg border border-slate-300 text-slate-900 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="lead-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Correo Electrónico <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        id="lead-email"
                        type="email"
                        required
                        placeholder="tu.correo@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 sm:py-2 bg-white rounded-lg border border-slate-300 text-slate-900 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-xs"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Aquí te enviaremos el enlace directo y las actualizaciones de la plantilla.
                    </p>
                  </div>

                  {/* Optional Phone / WhatsApp */}
                  <div>
                    <label htmlFor="lead-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Teléfono / WhatsApp <span className="text-slate-400 font-normal">(Opcional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        id="lead-phone"
                        type="tel"
                        placeholder="+52 / +56 / +57..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 sm:py-2 bg-white rounded-lg border border-slate-300 text-slate-900 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Current Excel Level Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="lead-level" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Tu Nivel Actual
                      </label>
                      <select
                        id="lead-level"
                        value={level}
                        onChange={(e) => setLevel(e.target.value as 'basico' | 'intermedio' | 'avanzado')}
                        className="w-full px-3 py-2.5 sm:py-2 bg-white rounded-lg border border-slate-300 text-slate-800 text-base sm:text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="basico">Básico (Principiante)</option>
                        <option value="intermedio">Intermedio (Tablas/Fórmulas)</option>
                        <option value="avanzado">Avanzado (Macros/Dashboards)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="lead-goal" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Meta Principal
                      </label>
                      <select
                        id="lead-goal"
                        value={primaryGoal}
                        onChange={(e) => setPrimaryGoal(e.target.value)}
                        className="w-full px-3 py-2.5 sm:py-2 bg-white rounded-lg border border-slate-300 text-slate-800 text-base sm:text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="automatizar">Ahorrar tiempo / Automatizar</option>
                        <option value="empleo">Mejorar puesto o salario</option>
                        <option value="finanzas">Controlar finanzas personales</option>
                        <option value="certificacion">Obtener certificación</option>
                      </select>
                    </div>
                  </div>

                  {/* GDPR & Compliance Consent Checkboxes */}
                  <div className="pt-2 space-y-2 text-xs text-slate-600">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentPrivacy}
                        onChange={(e) => setConsentPrivacy(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>
                        He leído y acepto la{' '}
                        <button
                          type="button"
                          onClick={onOpenPrivacyPolicy}
                          className="text-emerald-700 underline font-semibold hover:text-emerald-900"
                        >
                          Política de Privacidad
                        </button>{' '}
                        y los{' '}
                        <button
                          type="button"
                          onClick={onOpenTerms}
                          className="text-emerald-700 underline font-semibold hover:text-emerald-900"
                        >
                          Términos del Servicio
                        </button>
                        . <span className="text-emerald-600">*</span>
                      </span>
                    </label>

                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentMarketing}
                        onChange={(e) => setConsentMarketing(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>
                        Deseo recibir la plantilla y consejos exclusivos semanales de Excel en mi email (puedes cancelar cuando quieras con 1 clic).
                      </span>
                    </label>
                  </div>

                  {/* Submit CTA button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-600/20 transition flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Generando enlace seguro...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Descargar Plantilla Gratis Ahora</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Cero Spam Garantizado
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-slate-400" /> Datos Encriptados SSL
                    </span>
                  </div>
                </form>
              </div>
            ) : (
              /* Success confirmation state */
              <div className="bg-emerald-50 rounded-2xl p-6 sm:p-8 border border-emerald-300 shadow-xl text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  ¡Felicidades, {successLead.name.split(' ')[0]}!
                </h3>

                <p className="text-sm text-slate-700 leading-relaxed">
                  Tu registro ha sido almacenado exitosamente en nuestra base de datos centralizada y te enviamos un correo de confirmación a:
                </p>

                <div className="bg-white p-3 rounded-lg border border-emerald-200 font-mono text-xs text-emerald-900 font-semibold inline-block">
                  {successLead.email}
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Estado del envío:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Notificación Enviada
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Archivo:</span>
                    <span className="text-slate-800 font-medium">Plantilla_Finanzas_Personales_2026.xlsx</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    onClick={handleDownloadDirect}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>¿No se inició la descarga? Haz clic aquí</span>
                  </button>

                  <a
                    href="#cursos-y-planes"
                    className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-xl border border-slate-300 text-xs transition"
                  >
                    Ver Cursos con Precio Especial de Lanzamiento
                  </a>
                </div>

                <button
                  onClick={() => setSuccessLead(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline block mx-auto pt-1"
                >
                  Registrar otro correo electrónico
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
