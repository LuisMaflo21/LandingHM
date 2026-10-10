import { Star, CheckCircle, Quote, Building2, Briefcase } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sofía Valenzuela R.',
      role: 'Analista de Control de Gestión',
      company: 'Empresa Retail & Logística',
      initialLevel: 'Nivel Intermedio',
      courseTaken: 'MasterExcel Full Pass (Avanzado)',
      avatarInitial: 'S',
      rating: 5,
      comment:
        'Todos los lunes perdía 4 horas enteras consolidando los informes de 14 sucursales en un solo archivo. Gracias al módulo de Power Query en el nivel avanzado, ahora dejo la carpeta lista y con darle a "Actualizar Todo" se procesan los datos en menos de 20 segundos. Mi jefe me felicitó por la puntualidad del reporte.',
      verifiedPurchase: true,
    },
    {
      name: 'Jorge Luis Morales',
      role: 'Asistente Administrativo y Compras',
      company: 'Distribuidora Farmacéutica',
      initialLevel: 'Nivel Básico',
      courseTaken: 'Excel Básico a Intermedio',
      avatarInitial: 'J',
      rating: 5,
      comment:
        'Le tenía fobia a Excel porque en la universidad me enseñaron pura teoría aburrida. Con este curso entendí de verdad para qué sirve cada atajo y cómo armar tablas sin que se rompan. El salto a BUSCARX y tablas dinámicas me dio la seguridad necesaria para postularme a una vacante interna de analista.',
      verifiedPurchase: true,
    },
    {
      name: 'Mariana Duarte C.',
      role: 'Controller Financiero',
      company: 'Consultoría Contable & Fiscal',
      initialLevel: 'Nivel Intermedio',
      courseTaken: 'Excel Avanzado & Dashboards',
      avatarInitial: 'M',
      rating: 5,
      comment:
        'Lo que más valoro es el enfoque de diseño ejecutivo. Casi todos los cursos te enseñan gráficos colorinches feos que nadie en gerencia quiere ver. Aquí aprendí a usar paletas sobrias, tarjetas de KPIs y segmentadores limpios. La plantilla de finanzas que regalan como gancho también está impecablemente estructurada.',
      verifiedPurchase: true,
    },
  ];

  return (
    <section id="testimonios" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 mb-3">
            <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
            Casos de Estudio & Experiencias Reales
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Profesionales que ya Transformaron su Flujo de Trabajo
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Sin testimonios inflados ni promesas irreales. Historias de personas que aplican Excel todos los días en sus empresas.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & verified badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-500">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  {t.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-700" />
                      Alumno Verificado
                    </span>
                  )}
                </div>

                {/* Comment quote */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{t.comment}"
                </p>
              </div>

              {/* Author info */}
              <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  {t.avatarInitial}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                    {t.role}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    Curso: {t.courseTaken}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
