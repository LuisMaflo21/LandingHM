import { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Para qué versiones de Excel funciona el contenido y la plantilla de finanzas?',
      a: 'Tanto la plantilla como las lecciones son compatibles con Microsoft 365, Excel 2016, 2019, 2021 (versiones Windows y Mac), así como con Google Sheets. Para los módulos avanzados de Power Query se recomienda contar con Excel 2016 en adelante en entorno Windows.',
    },
    {
      q: '¿Cómo recibo la plantilla gratuita de finanzas personales?',
      a: 'Al completar el formulario en esta página, la descarga del archivo .xlsx inicia de inmediato en tu navegador. Además, nuestro sistema automatizado te envía un correo electrónico de respaldo con el enlace de descarga permanente.',
    },
    {
      q: '¿Qué garantía tengo si el curso no es lo que esperaba?',
      a: 'Todos los pagos están procesados y asegurados a través de Hotmart. Tienes 7 días completos de garantía incondicional. Si no estás 100% satisfecho, solicitas tu reembolso con un botón en la plataforma de Hotmart y te reintegran la totalidad de tu dinero sin trámites ni preguntas.',
    },
    {
      q: '¿Cuánto tiempo tengo para realizar el curso y cuándo empieza?',
      a: 'El acceso es vitalicio y a tu propio ritmo. Una vez efectuada la inscripción a través de Hotmart, recibes tus credenciales de acceso por correo y puedes ver las clases cuando quieras, las veces que lo necesites, desde cualquier computador, tablet o celular.',
    },
    {
      q: '¿Qué diferencia hay entre los cursos individuales y el Master Pack Completo?',
      a: 'Los cursos individuales abarcan su nivel específico (Básico, Intermedio o Avanzado). El Master Pack Full Pass incluye los 3 niveles con un 56% de descuento, más el paquete de 12 plantillas corporativas premium, tutoría para resolución de dudas y actualizaciones futuras de por vida.',
    },
    {
      q: '¿Cómo se protegen mis datos personales y cómo puedo solicitar su eliminación?',
      a: 'Cumplimos estrictamente las normativas de privacidad (RGPD / Habeas Data). No vendemos tus datos a terceros. Puedes darte de baja de nuestras comunicaciones en cualquier momento con un clic en el pie de página de nuestros correos, o utilizar nuestro portal de derecho al olvido en el pie de página de este sitio para purgar tu información.',
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-xs font-semibold border border-slate-300 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            Transparencia Total
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Preguntas Frecuentes
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Todo lo que necesitas saber antes de descargar tu plantilla o comenzar tu aprendizaje.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-emerald-700 transition"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
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
