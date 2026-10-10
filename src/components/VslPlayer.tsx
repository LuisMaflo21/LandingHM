import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Clock, 
  FileText, 
  ChevronRight, 
  CheckCircle,
  TrendingUp,
  FileSpreadsheet,
  Zap,
  Users
} from 'lucide-react';

interface Props {
  onCtaClick?: () => void;
}

export function VslPlayer({ onCtaClick }: Props) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [progress, setProgress] = useState<number>(15);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);

  const chapters = [
    {
      time: '00:00',
      title: 'El error de las 10 horas semanales',
      desc: 'Por qué seguir copiando, pegando y formateando datos a mano está frenando tu crecimiento profesional.',
      highlight: '92% de profesionales usan menos del 8% del potencial real de Excel',
      metric: '-10 hrs/semana',
      metricLabel: 'Tiempo desperdiciado',
    },
    {
      time: '01:20',
      title: 'Fórmulas rotas y estrés en reuniones',
      desc: 'El pánico del #¡REF! o #N/A frente a tu jefe y cómo reemplazar fórmulas frágiles por modelos automatizados.',
      highlight: 'BUSCARX + Tablas Inteligentes = Cero errores manuales',
      metric: '100%',
      metricLabel: 'Estabilidad de datos',
    },
    {
      time: '02:45',
      title: 'El Método de los 3 Niveles',
      desc: 'De Cero a Operativo (Básico) ➔ Análisis de Negocio (Intermedio) ➔ Power Query & Dashboards (Avanzado).',
      highlight: 'Aprende sólo lo que el mercado laboral y las empresas exigen hoy',
      metric: '3 Niveles',
      metricLabel: 'Ruta guiada clara',
    },
    {
      time: '04:15',
      title: 'Tu regalo: Plantilla de Finanzas 2026',
      desc: 'Llévate la plantilla de regalo y descubre cómo aplicar cada técnica en tu propia vida financiera.',
      highlight: 'Totalmente gratis, sin suscripciones ocultas ni trucos',
      metric: '100% Gratis',
      metricLabel: 'Plantilla de regalo',
    },
  ];

  // Auto increment simulated progress when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        const next = prev + 1;
        // sync chapter
        if (next < 25) setActiveChapter(0);
        else if (next < 55) setActiveChapter(1);
        else if (next < 80) setActiveChapter(2);
        else setActiveChapter(3);
        return next;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const selectChapter = (index: number) => {
    setActiveChapter(index);
    const targetProgress = index === 0 ? 10 : index === 1 ? 35 : index === 2 ? 65 : 88;
    setProgress(targetProgress);
    setIsPlaying(true);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-7 shadow-2xl border border-slate-800">
      {/* VSL Header Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400 tracking-wide uppercase text-[11px]">
            Masterclass Exclusiva en Video (5 min)
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-xs">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            +1,420 personas viendo hoy
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Duración: 5:20 min
          </span>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border border-slate-800 group shadow-inner">
        {/* Animated Background Graphic simulating DaVinci Resolve / After Effects high energy presentation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none excel-grid-bg"></div>

        {/* Video Canvas Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-8">
          {/* Top video corner info */}
          <div className="flex items-center justify-between">
            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium text-slate-200">
                Capítulo {activeChapter + 1} de 4: {chapters[activeChapter].title}
              </span>
            </div>

            <div className="bg-emerald-600/90 text-white font-mono text-xs px-2.5 py-1 rounded-md font-bold shadow-xs">
              HD 1080p
            </div>
          </div>

          {/* Central Animated Content representing the VSL lesson */}
          <div className="max-w-xl mx-auto text-center space-y-3 py-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              {chapters[activeChapter].highlight}
            </div>

            <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {chapters[activeChapter].title}
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              {chapters[activeChapter].desc}
            </p>

            {/* Quick Graphic Metric badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 mt-2">
              <div className="text-emerald-400 font-extrabold text-lg sm:text-xl font-mono">
                {chapters[activeChapter].metric}
              </div>
              <div className="text-left text-[11px] text-slate-300 font-medium leading-tight">
                {chapters[activeChapter].metricLabel}
              </div>
            </div>
          </div>

          {/* Video Bottom Overlay */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px]">{chapters[activeChapter].time} / 05:20</span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Instructor: Lic. Roberto Valenzuela • Consultor en Automatización
            </span>
          </div>
        </div>

        {/* Central Big Play/Pause Button when hovering or paused */}
        {(!isPlaying || progress === 100) && (
          <div 
            onClick={() => {
              if (progress === 100) setProgress(0);
              setIsPlaying(true);
            }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-all"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl transform hover:scale-105 active:scale-95 transition-all">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Custom Video Control Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 pt-6 flex flex-col gap-2">
          {/* Timeline track */}
          <div 
            className="relative w-full h-2 bg-slate-700/80 rounded-full cursor-pointer overflow-hidden group/bar"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newProgress = Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 100)));
              setProgress(newProgress);
              if (newProgress < 25) setActiveChapter(0);
              else if (newProgress < 55) setActiveChapter(1);
              else if (newProgress < 80) setActiveChapter(2);
              else setActiveChapter(3);
            }}
          >
            <div 
              className="absolute left-0 top-0 bottom-0 bg-emerald-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Controls button row */}
          <div className="flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-emerald-400 transition"
                aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={() => setProgress(0)}
                className="hover:text-emerald-400 transition"
                aria-label="Reiniciar video"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-emerald-400 transition"
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="font-mono text-xs text-slate-400 ml-1">
                {Math.floor((progress * 320) / 100 / 60)}:
                {String(Math.floor(((progress * 320) / 100) % 60)).padStart(2, '0')} / 05:20
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition text-xs ${
                  showTranscript ? 'bg-emerald-600 text-white' : 'hover:text-white text-slate-400'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Transcripción</span>
              </button>

              {onCtaClick && (
                <button
                  onClick={onCtaClick}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1 rounded text-xs transition flex items-center gap-1 shadow-sm"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Obtener Plantilla</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Selector Grid */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Capítulos clave del video (Haz clic para ir directamente):
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {chapters.map((ch, idx) => (
            <button
              key={idx}
              onClick={() => selectChapter(idx)}
              className={`p-2.5 rounded-xl text-left border transition text-xs flex flex-col justify-between ${
                activeChapter === idx
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[11px] text-emerald-400 font-bold">{ch.time}</span>
                {activeChapter === idx && <CheckCircle className="w-3 h-3 text-emerald-400" />}
              </div>
              <span className="font-medium text-[11px] text-white line-clamp-2 leading-tight">
                {ch.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Optional Accessible Transcript Section */}
      {showTranscript && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2.5 animate-fadeIn">
          <div className="font-bold text-white text-sm flex items-center justify-between border-b border-slate-800 pb-2">
            <span>Transcripción completa de la Masterclass VSL</span>
            <button onClick={() => setShowTranscript(false)} className="text-slate-400 hover:text-white">
              Cerrar
            </button>
          </div>
          <p>
            <strong>[00:00 - Introducción]:</strong> Bienvenido. Si abres Excel todos los días y sientes que pasas más tiempo copiando datos, limpiando errores de formato y rogando que tus fórmulas no fallen frente a tus colegas, esta masterclass cambiará tu carrera.
          </p>
          <p>
            <strong>[01:20 - El dolor de las fórmulas rotas]:</strong> El 90% de los errores no ocurren porque seas malo con los números, sino porque nadie te enseñó a estructurar tablas relacionales limpias ni a utilizar BUSCARX en lugar de las viejas funciones.
          </p>
          <p>
            <strong>[02:45 - Los 3 niveles profesionales]:</strong> Diseñamos una metodología progresiva. En el Nivel Básico adquieres soltura y atajos; en el Nivel Intermedio construyes análisis con tablas dinámicas; y en el Nivel Avanzado automatizas todo con Power Query y creas Dashboards de alto impacto visual.
          </p>
          <p>
            <strong>[04:15 - Descarga de la plantilla]:</strong> Para que compruebes la calidad de nuestro trabajo antes de invertir un solo centavo, hoy te regalamos nuestra Plantilla Oficial de Finanzas Personales 2026. Regístrate en el formulario inferior para recibirla de inmediato.
          </p>
        </div>
      )}
    </div>
  );
}
