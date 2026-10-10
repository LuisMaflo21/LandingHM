import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FaqSimple() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Cómo recibo la plantilla de finanzas personales?',
      a: 'Al poner tu nombre y correo en el formulario, el archivo .xlsx se descarga inmediatamente en tu navegador y te enviamos una copia de respaldo por correo.',
    },
    {
      q: '¿Para qué versión de Excel funciona?',
      a: 'Es compatible con Microsoft 365, Excel 2016, 2019, 2021 (Windows y Mac) y Google Sheets.',
    },
    {
      q: '¿Cómo funciona la garantía de 7 días de Hotmart?',
      a: 'Hotmart retiene tu pago durante 7 días. Si el contenido no cumple tus expectativas, solicitas el reembolso directo en Hotmart y te devuelven el 100% sin preguntas.',
    },
    {
      q: '¿Cuánto tiempo tengo para ver el curso?',
      a: 'El acceso es de por vida. Puedes ver las clases a tu propio ritmo desde cualquier dispositivo y repasar cuando lo necesites.',
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Preguntas Frecuentes
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Respuestas claras antes de comenzar.
          </p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-slate-900 hover:text-emerald-700 transition"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'transform rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 border-t border-slate-100 pt-2 leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
