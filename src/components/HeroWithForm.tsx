import { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  Mail, 
  User, 
  Star,
  RefreshCw,
  Lock,
  Unlock,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Lead } from '../types';

interface Props {
  onLeadSuccess: (lead: Lead) => void;
  onOpenPrivacy: () => void;
  googleSheetUrl: string;
}

export function HeroWithForm({ onLeadSuccess, onOpenPrivacy, googleSheetUrl }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // The export URL allows immediate download as .xlsx from the same Google Sheet
  const directExcelExportUrl = googleSheetUrl.includes('/edit')
    ? googleSheetUrl.replace(/\/edit.*$/, '/export?format=xlsx')
    : googleSheetUrl;

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

    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          level: 'intermedio',
          primaryGoal: 'automatizar',
          consentPrivacy: true,
          consentMarketing: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al procesar el registro.');
      }

      // Celebratory Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#34d399', '#0f172a'],
        });
      } catch {
        // Fallback
      }

      setIsUnlocked(true);
      onLeadSuccess(data.lead);

    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al conectar con la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-10 pb-16 sm:pt-16 sm:pb-20 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Rating and Social Proof */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-700">
            4.9 / 5 • Hoja Maestra: Cursos y Plantillas de Excel
          </span>
        </div>

        {/* The Hook Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Automatiza tus reportes en Excel en{' '}
            <span className="text-emerald-700">5 minutos</span> sin fórmulas complejas
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Bienvenido a <strong>Hoja Maestra</strong>. Llena el formulario a continuación para <strong>habilitar el botón de descarga</strong> de nuestra Plantilla Oficial de Finanzas Personales.
          </p>
        </div>

        {/* The Registration Form & Gated Download Container */}
        <div className="mt-10 max-w-xl mx-auto">
          {!isUnlocked ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  PLANTILLA OFICIAL HOJA MAESTRA
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Desbloquea tu Archivo de Excel & Google Sheets
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Completa tu nombre y correo para habilitar el botón de descarga inmediata.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="name-input" className="sr-only">Tu Nombre</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="name-input"
                      type="text"
                      required
                      placeholder="Tu nombre completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-white rounded-xl border border-slate-300 text-slate-900 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email-input" className="sr-only">Tu Correo</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="email-input"
                      type="email"
                      required
                      placeholder="Tu correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-white rounded-xl border border-slate-300 text-slate-900 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Form Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-base shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Registrando y habilitando descarga...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-5 h-5" />
                      <span>Habilitar Botón de Descarga</span>
                    </>
                  )}
                </button>

                {/* The Download Button in Locked State */}
                <div className="pt-2">
                  <div className="p-3 bg-slate-200/60 rounded-xl border border-dashed border-slate-300 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Botón de descarga bloqueado</span>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 px-4 bg-slate-200 text-slate-400 font-bold rounded-lg text-xs cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar Plantilla Hoja Maestra (Bloqueado)</span>
                    </button>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Llena tus datos arriba y haz clic en "Habilitar Botón" para activar este enlace.
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-center text-slate-500 pt-1">
                  🔒 Cero spam. Al registrarte aceptas nuestra{' '}
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="underline text-emerald-700 hover:text-emerald-900 font-medium"
                  >
                    Política de Privacidad
                  </button>
                  .
                </p>
              </form>
            </div>
          ) : (
            /* UNLOCKED STATE: The download button is now fully active! */
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-lg animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  ¡Botón Habilitado con Éxito!
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                  ¡Excelente, {name.split(' ')[0]}! Ya puedes descargar tu archivo
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Tu registro quedó guardado en nuestra base de datos. Haz clic en el botón para acceder a tu plantilla oficial:
                </p>
              </div>

              {/* The Enabled Buttons requested by user */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={googleSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir en Google Sheets</span>
                </a>

                <a
                  href={directExcelExportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Descargar en Excel (.xlsx)</span>
                </a>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-200 text-left text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Enlace directo a tu archivo:</span>
                  <span className="font-mono text-[11px] text-slate-500 truncate block max-w-xs sm:max-w-md">
                    {googleSheetUrl}
                  </span>
                </div>
                <a
                  href={googleSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold hover:underline shrink-0 text-xs ml-2"
                >
                  Ir al archivo &rarr;
                </a>
              </div>

              <div className="pt-2">
                <a
                  href="#cursos"
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Ver cursos de Excel en oferta especial &darr;
                </a>
              </div>
            </div>
          )}
        </div>

        {/* 3 Value Pillars */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Plantilla 100% editable</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Compatible con Google Sheets & Excel</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Fórmulas automáticas de finanzas</span>
          </div>
        </div>

      </div>
    </section>
  );
}
