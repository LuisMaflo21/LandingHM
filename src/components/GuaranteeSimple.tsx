import { ShieldCheck } from 'lucide-react';

interface Props {
  onOpenRefund: () => void;
  days?: number;
}

export function GuaranteeSimple({ onOpenRefund, days = 7 }: Props) {
  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Garantía Incondicional Hotmart de {days} Días
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Prueba el curso durante {days} días completos. Si sientes que no te ahorra tiempo real, solicitas la devolución con 1 clic en la plataforma de Hotmart y te reembolsan el 100% de tu dinero de forma automática.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenRefund}
                className="text-xs text-emerald-800 font-bold underline hover:text-emerald-950"
              >
                Ver condiciones de reembolso &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
