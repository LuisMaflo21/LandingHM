import { Check, ArrowRight, ShieldCheck, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import { AppConfig, CourseLevel } from '../types';
import { coursesData } from '../data/coursesData';
import { trackCourseClick } from '../services/analytics';

interface Props {
  config: AppConfig;
  onOpenDetails: (course: CourseLevel) => void;
}

export function CoursesGridSimple({ config, onOpenDetails }: Props) {
  // Priority order: Oferta $5, Principiantes, Empresarial, Ebook
  const offerCourse = coursesData.find((c) => c.id === 'oferta-5') || coursesData[0];
  const beginnerCourse = coursesData.find((c) => c.id === 'principiantes') || coursesData[1];
  const businessCourse = coursesData.find((c) => c.id === 'empresarial') || coursesData[2];
  const ebookCourse = coursesData.find((c) => c.id === 'ebook') || coursesData[3];

  return (
    <section id="cursos" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-300 shadow-xs inline-block mb-3">
            OFERTA ESPECIAL • CURSOS ONLINE DE EXCEL
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Oferta de Cursos Online de Excel
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 font-medium">
            Programas 100% prácticos desde <strong>$5 USD</strong> con acceso de por vida y garantía incondicional de 7 días respaldada por Hotmart.
          </p>
        </div>

        {/* Highlighted Banner: Oferta Flash $5 USD */}
        {offerCourse && (
          <div className="mb-10 bg-gradient-to-r from-emerald-800 via-emerald-700 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-400 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-950 uppercase tracking-wider bg-amber-400 px-3 py-0.5 rounded-full shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  PRECIO DE OFERTA EXCLUSIVO
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {offerCourse.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                  {offerCourse.subtitle}
                </p>
                <div className="pt-1 flex flex-wrap gap-4 text-xs text-emerald-200">
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> Acceso vitalicio</span>
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> Ejercicios prácticos</span>
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> Certificado incluido</span>
                </div>
              </div>

              <div className="text-center md:text-right shrink-0 bg-white/10 backdrop-blur-xs p-5 rounded-xl border border-white/20">
                <div className="mb-3">
                  <span className="text-xs text-slate-300 line-through mr-2">Normal: ${offerCourse.originalPrice} USD</span>
                  <div className="text-4xl sm:text-5xl font-black text-white">
                    $5 <span className="text-sm font-semibold text-emerald-300">USD</span>
                  </div>
                </div>

                <a
                  href={config.specialOfferCourseUrl || offerCourse.hotmartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCourseClick('offer5Usd')}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black rounded-xl text-sm transition shadow-lg transform hover:scale-105"
                >
                  <span>Inscribirme por solo $5 USD</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <div className="text-[11px] text-slate-300 mt-2 flex items-center justify-center md:justify-end gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Garantía Hotmart 7 Días</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3 Grid Cards: Principiantes, Empresarial, Ebook */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Excel para Principiantes */}
          {beginnerCourse && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs hover:border-emerald-400 transition">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {beginnerCourse.tag}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {beginnerCourse.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {beginnerCourse.subtitle}
                </p>

                <div className="my-5">
                  <span className="text-xs text-slate-400 line-through mr-1.5">${beginnerCourse.originalPrice}</span>
                  <span className="text-3xl font-extrabold text-slate-900">${beginnerCourse.currentPrice}</span>
                  <span className="text-xs text-slate-500 ml-1">USD (Pago único)</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  {beginnerCourse.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <a
                  href={config.beginnerCourseUrl || beginnerCourse.hotmartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCourseClick('beginner')}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <span>Ver Curso Principiantes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onOpenDetails(beginnerCourse)}
                  className="w-full py-1.5 text-xs text-slate-500 hover:text-slate-800 underline transition text-center"
                >
                  Ver temario detallado
                </button>
              </div>
            </div>
          )}

          {/* 2. Excel Empresarial */}
          {businessCourse && (
            <div className="bg-white rounded-2xl border-2 border-emerald-500 p-6 flex flex-col justify-between shadow-md relative">
              <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Recomendado
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white">
                  {businessCourse.tag}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {businessCourse.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {businessCourse.subtitle}
                </p>

                <div className="my-5">
                  <span className="text-xs text-slate-400 line-through mr-1.5">${businessCourse.originalPrice}</span>
                  <span className="text-3xl font-extrabold text-slate-900">${businessCourse.currentPrice}</span>
                  <span className="text-xs text-slate-500 ml-1">USD (Pago único)</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  {businessCourse.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <a
                  href={config.businessCourseUrl || businessCourse.hotmartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCourseClick('business')}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <span>Ver Excel Empresarial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onOpenDetails(businessCourse)}
                  className="w-full py-1.5 text-xs text-slate-500 hover:text-slate-800 underline transition text-center"
                >
                  Ver temario detallado
                </button>
              </div>
            </div>
          )}

          {/* 3. Ebook para Excel */}
          {ebookCourse && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs hover:border-emerald-400 transition">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  {ebookCourse.tag}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {ebookCourse.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {ebookCourse.subtitle}
                </p>

                <div className="my-5">
                  <span className="text-xs text-slate-400 line-through mr-1.5">${ebookCourse.originalPrice}</span>
                  <span className="text-3xl font-extrabold text-slate-900">${ebookCourse.currentPrice}</span>
                  <span className="text-xs text-slate-500 ml-1">USD (Descarga PDF)</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  {ebookCourse.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <a
                  href={config.ebookCourseUrl || ebookCourse.hotmartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCourseClick('ebook')}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <span>Obtener Ebook de Excel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onOpenDetails(ebookCourse)}
                  className="w-full py-1.5 text-xs text-slate-500 hover:text-slate-800 underline transition text-center"
                >
                  Ver contenido del libro
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
