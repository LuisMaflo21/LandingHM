import { FileSpreadsheet, Download, Check, Sparkles, ExternalLink } from 'lucide-react';

interface Props {
  googleSheetUrl: string;
}

export function TemplateHookPreview({ googleSheetUrl }: Props) {
  const scrollToForm = () => {
    const el = document.getElementById('name-input');
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Visual Excel & Google Sheets Card */}
            <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-mono text-slate-300">Hoja_Maestra_Finanzas.xlsx</span>
                </div>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Google Sheets & Excel
                </span>
              </div>

              {/* Miniature Dashboard Mockup */}
              <div className="py-4 space-y-3 font-mono text-xs">
                <div className="bg-slate-800 p-3 rounded-lg flex justify-between items-center">
                  <span className="text-slate-400">Ingresos del Mes:</span>
                  <span className="text-emerald-400 font-bold">$3,650.00</span>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg flex justify-between items-center">
                  <span className="text-slate-400">Gastos Registrados:</span>
                  <span className="text-slate-200 font-bold">$2,420.00</span>
                </div>
                <div className="bg-emerald-950/70 border border-emerald-500/40 p-3 rounded-lg flex justify-between items-center text-emerald-300">
                  <span>Ahorro Proyectado:</span>
                  <span className="font-bold">$1,230.00 (34%)</span>
                </div>
              </div>

              {/* Tabs bottom bar */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-semibold">1. Resumen</span>
                  <span className="px-1.5 py-0.5">2. Ingresos</span>
                  <span className="px-1.5 py-0.5">3. Gastos</span>
                  <span className="px-1.5 py-0.5">4. Metas</span>
                </div>
                <span className="text-emerald-400 font-semibold text-[10px]">100% Automatizado</span>
              </div>
            </div>

            {/* Template Features Copy */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                El Gancho de Regalo • Hoja Maestra
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                ¿Qué incluye tu plantilla de finanzas?
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Diseñada por <strong>Hoja Maestra</strong> para darte control absoluto de tu dinero en Google Sheets o Microsoft Excel:
              </p>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dashboard con regla 50/30/20:</strong> calcula tus porcentajes de ahorro al instante.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Registro diario con semáforos:</strong> alertas visuales si sobrepasas tu presupuesto.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Fórmulas limpias y automáticas:</strong> listas desplegables y cálculos inmediatos.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Habilitación en 1 clic:</strong> completa el formulario superior para habilitar el botón de descarga.</span>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Completar Formulario para Habilitar Descarga</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
