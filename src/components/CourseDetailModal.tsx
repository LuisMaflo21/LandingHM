import { X, BookOpen, Clock, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { CourseLevel, AppConfig } from '../types';
import { trackCourseClick } from '../services/analytics';

interface Props {
  course: CourseLevel | null;
  onClose: () => void;
  config: AppConfig;
}

export function CourseDetailModal({ course, onClose }: Props) {
  if (!course) return null;

  const url = course.hotmartUrl || '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              {course.tag}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
              {course.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {course.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Syllabus Modules List */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-200 pb-2">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              {course.modulesCount} Módulos de Aprendizaje
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {course.durationHours} en total
            </span>
          </div>

          <div className="space-y-4">
            {course.modules.map((m, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
                  <span>{m.title}</span>
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    Módulo {idx + 1}
                  </span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {m.lessons.map((lesson, lIdx) => (
                    <li key={lIdx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-2 text-center sm:text-left">
            <span className="text-xs text-slate-400 line-through">
              ${course.originalPrice} {course.currency}
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              ${course.currentPrice} {course.currency}
            </span>
            <span className="text-xs text-slate-500">
              (Pago único)
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Cerrar
            </button>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                const targetId = course.id === 'oferta-5' 
                  ? 'offer5Usd' 
                  : course.id === 'principiantes' 
                  ? 'beginner' 
                  : course.id === 'empresarial' 
                  ? 'business' 
                  : 'ebook';
                trackCourseClick(targetId);
              }}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Inscribirme con Descuento</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
