import { Clock, AlertTriangle, TrendingDown, ArrowRight } from 'lucide-react';

export function PainPointsSimple() {
  const points = [
    {
      icon: Clock,
      title: '¿Horas perdidas copiando y pegando?',
      desc: 'Llegas tarde a casa porque pasas la tarde unificando reportes de diferentes áreas en una sola hoja.',
      result: 'Con Power Query lo resuelves en 1 solo clic en menos de 5 segundos.',
    },
    {
      icon: AlertTriangle,
      title: '¿Miedo a fórmulas rotas (#¡REF! o #¡VALOR!)?',
      desc: 'El estrés de que tu presentación con jefes o clientes se dañe por mover una simple fila o columna.',
      result: 'Aprenderás modelos sólidos con BUSCARX y SI.ERROR que nunca fallan.',
    },
    {
      icon: TrendingDown,
      title: '¿Estancado profesionalmente?',
      desc: 'Ves cómo otros compañeros con Excel avanzado reciben ascensos mientras tú sigues con tareas rutinarias.',
      result: 'Te conviertes en la persona clave de tu equipo con Dashboards ejecutivos.',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
            Los Problemas Comunes
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            ¿Te pasa esto con Excel en tu trabajo?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            El 90% de las personas nunca recibieron una formación práctica pensada para el día a día laboral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs text-emerald-800 font-medium">
                  <span className="font-bold text-emerald-900 block mb-0.5">La Solución:</span>
                  {p.result}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
