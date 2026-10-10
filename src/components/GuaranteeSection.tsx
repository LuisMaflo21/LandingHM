import { ShieldCheck, CheckCircle2, Lock, RefreshCcw } from 'lucide-react';

interface Props {
  guaranteeDays?: number;
  onOpenRefundPolicy?: () => void;
}

export function GuaranteeSection({ guaranteeDays = 7, onOpenRefundPolicy }: Props) {
  return (
    <section className="py-16 sm:py-20 bg-emerald-900 text-white relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 excel-grid-bg pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-slate-900/90 rounded-3xl p-8 sm:p-12 border-2 border-emerald-500/40 shadow-2xl flex flex-col md:flex-row items-center gap-8">
          {/* Authentic Guarantee Seal */}
          <div className="shrink-0 text-center">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-dashed border-emerald-400 p-2 flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-950 to-slate-900 shadow-xl">
              <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 mb-1" />
              <span className="text-2xl sm:text-3xl font-extrabold text-white leading-none">
                {guaranteeDays} DÍAS
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-300 mt-1">
                Garantía Total
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono">
              Respaldo Oficial Hotmart
            </div>
          </div>

          {/* Guarantee Copy */}
          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Lock className="w-3.5 h-3.5" />
              Riesgo Cero Absoluto Para Ti
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Prueba el curso durante {guaranteeDays} días sin compromiso alguno
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              Inscríbete hoy, accede inmediatamente a todas las lecciones, descarga las plantillas de trabajo y pon en práctica el método. Si durante los primeros <strong>{guaranteeDays} días</strong> sientes que el curso no cumple tus expectativas o no te ahorra tiempo real, solicitas la devolución con un solo clic directamente en la plataforma de <strong>Hotmart</strong> y se te reembolsa el 100% de tu dinero de forma automática.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Reembolso procesado en menos de 24 horas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sin preguntas incómodas ni llamadas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Conserva la plantilla de regalo sin costo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pasarela de pago cifrada con Hotmart Pay</span>
              </div>
            </div>

            {onOpenRefundPolicy && (
              <div className="pt-2">
                <button
                  onClick={onOpenRefundPolicy}
                  className="text-xs text-emerald-400 hover:text-emerald-300 underline font-semibold transition"
                >
                  Consulta nuestra Política de Reembolso Transparente y Términos de Hotmart &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
