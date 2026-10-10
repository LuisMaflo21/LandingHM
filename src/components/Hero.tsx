import { 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  Award, 
  CheckCircle, 
  Sparkles,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { VslPlayer } from './VslPlayer';

interface Props {
  onCtaClick: () => void;
}

export function Hero({ onCtaClick }: Props) {
  return (
    <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden excel-grid-bg">
      {/* Decorative subtle backdrop elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust & Rating Micro Pill */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 shadow-xs text-xs text-slate-700">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="font-bold text-slate-900">4.9 / 5</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600">+4,850 alumnos en Latinoamérica y España</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Garantía de Satisfacción Hotmart 7 Días</span>
          </div>
        </div>

        {/* Main Title & Hook */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Descubre cómo automatizar tus reportes en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 underline decoration-emerald-400 decoration-wavy decoration-2">
              5 minutos
            </span>{' '}
            sin fórmulas complejas
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            El método paso a paso para dominar Excel desde nivel{' '}
            <strong className="text-slate-900 font-bold">Básico</strong>,{' '}
            <strong className="text-slate-900 font-bold">Intermedio</strong> hasta{' '}
            <strong className="text-slate-900 font-bold">Avanzado</strong>. 
            Sin rodeos teóricos, ahorrando hasta 10 horas de trabajo cada semana.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <a
              href="#descarga-plantilla"
              className="w-full sm:w-auto px-7 py-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-xl hover:shadow-emerald-600/25 transition flex items-center justify-center gap-2.5 text-base cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Descargar Plantilla Gratis de Finanzas</span>
            </a>

            <a
              href="#cursos-y-planes"
              className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border border-slate-300 shadow-xs hover:border-slate-400 transition flex items-center justify-center gap-2 text-base"
            >
              <span>Ver Cursos & Planes (Desde $27 USD)</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Value Micro-Points */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Acceso vitalicio ilimitado
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Certificado oficial con verificación
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Plantilla de regalo incluida
            </span>
          </div>
        </div>

        {/* Video Sales Letter (VSL) Section embedded right after the hook */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <VslPlayer onCtaClick={onCtaClick} />
        </div>
      </div>
    </section>
  );
}
