import { 
  AlertTriangle, 
  Clock, 
  HelpCircle, 
  TrendingDown, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export function PainPointsSection() {
  const painPoints = [
    {
      icon: Clock,
      question: '¿Cansado de perder horas copiando, pegando y arreglando formatos a mano?',
      frustration: 'Llegas a casa agotado porque tuviste que juntar manualmente reportes de tres áreas diferentes antes de que terminara el día.',
      solution: 'Con Power Query y Tablas Inteligentes, consolidas miles de filas de múltiples archivos con un solo clic en 3 segundos.',
    },
    {
      icon: AlertTriangle,
      question: '¿Pánico cada vez que una fórmula se rompe con #¡VALOR! o #¡REF! frente a tus jefes?',
      frustration: 'Es humillante estar en una reunión gerencial proyectando un informe y que los números se desconfiguren por mover una fila.',
      solution: 'Aprenderás a construir modelos robustos con BUSCARX y SI.ERROR que jamás se quiebran aunque agregues o borres información.',
    },
    {
      icon: HelpCircle,
      question: '¿Sientes que usas sólo el 5% de Excel mientras otros automatizan todo?',
      frustration: 'Ves a compañeros que terminan en minutos lo que a ti te toma todo el día, y temes quedarte atrás tecnológicamente.',
      solution: 'Una ruta estructurada sin tecnicismos que te enseña únicamente las fórmulas y funciones que realmente se usan en las empresas.',
    },
    {
      icon: TrendingDown,
      question: '¿Estancado profesionalmente y sin el salario ni reconocimiento que mereces?',
      frustration: 'En las ofertas de trabajo piden "Excel Avanzado", pero nadie te enseñó a transformar datos en decisiones ejecutivas.',
      solution: 'Te convertirás en el referente técnico indiscutible de tu equipo, capaz de entregar Dashboards ejecutivos que impresionan a cualquier director.',
    },
  ];

  const benefitsVsFeatures = [
    {
      feature: 'Power Query & Automatización ETL',
      benefit: 'Ahorras más de 10 horas cada semana eliminando el trabajo repetitivo de copiar y pegar.',
      metric: '+10 hrs libres',
    },
    {
      feature: 'BUSCARX & Funciones Lógicas Anidadas',
      benefit: 'Tus reportes financieros y comerciales son 100% exactos y a prueba de errores humanos.',
      metric: '0% Errores de cálculo',
    },
    {
      feature: 'Dashboards Interactivos con Segmentadores',
      benefit: 'Tus presentaciones lucen ejecutivas y captan la atención inmediata de gerentes y clientes.',
      metric: 'Impacto visual 10x',
    },
    {
      feature: '12 Plantillas Corporativas Listas',
      benefit: 'No partes de una hoja en blanco; adaptas plantillas profesionales a tu negocio en 5 minutos.',
      metric: 'Listas para usar',
    },
  ];

  return (
    <section id="metodo" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 opacity-10 excel-grid-bg pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-300 text-xs font-semibold border border-red-500/30 mb-4">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            La Realidad en las Empresas
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            ¿Te Identificas con Alguno de Estos <span className="text-red-400">4 Dolores de Cabeza</span>?
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Excel es la herramienta más usada en el mundo corporativo, pero el 90% de las personas nunca recibieron una capacitación práctica pensada para el trabajo real.
          </p>
        </div>

        {/* 4 Pain Points Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {painPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col justify-between hover:border-slate-600 transition"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {item.question}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 pl-1">
                    {item.frustration}
                  </p>
                </div>

                <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-xl p-3.5 text-xs text-emerald-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-300 font-bold block mb-0.5">La Solución en MasterExcel:</strong>
                    <span>{item.solution}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits vs Features Section (Translating technical features to real-life value) */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-800/50 rounded-3xl p-6 sm:p-10 border border-slate-700">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              No Vendemos Módulos Teóricos • Vendemos Resultados
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Beneficios Reales para tu Rutina Diaria
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefitsVsFeatures.map((b, i) => (
              <div key={i} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    {b.feature}
                  </span>
                  <div className="text-emerald-400 font-extrabold text-base mb-2">
                    {b.metric}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {b.benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="#descarga-plantilla"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition shadow-lg"
            >
              <span>Empieza hoy descargando la plantilla gratuita</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
