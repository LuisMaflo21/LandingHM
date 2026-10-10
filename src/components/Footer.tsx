import { 
  FileSpreadsheet, 
  ShieldCheck, 
  Lock, 
  Mail, 
  HelpCircle, 
  Trash2, 
  Database,
  ExternalLink
} from 'lucide-react';
import { AppConfig } from '../types';

interface Props {
  config: AppConfig;
  onOpenModal: (type: 'privacy' | 'terms' | 'refund' | 'cookies' | 'delete-data') => void;
  onOpenAdmin: () => void;
}

export function Footer({ config, onOpenModal, onOpenAdmin }: Props) {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-extrabold text-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span>Master<span className="text-emerald-400">Excel</span> Pro</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Formación profesional en Excel, Power Query y Dashboards ejecutivos orientada a resultados empresariales reales.
            </p>
            <div className="pt-1">
              <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                Datos de la Empresa:
              </span>
              <p className="text-slate-400 text-[11px] leading-tight">
                {config.companyName}<br />
                Soporte oficial: {config.supportEmail}<br />
                Plataforma de pagos: Hotmart Pay Global
              </p>
            </div>
          </div>

          {/* Programas & Embudo */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Niveles del Programa
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#cursos-y-planes" className="hover:text-emerald-400 transition">
                  Excel Básico: De Cero a Operativo
                </a>
              </li>
              <li>
                <a href="#cursos-y-planes" className="hover:text-emerald-400 transition">
                  Excel Intermedio: Análisis & Tablas Dinámicas
                </a>
              </li>
              <li>
                <a href="#cursos-y-planes" className="hover:text-emerald-400 transition">
                  Excel Avanzado: Dashboards & Power Query
                </a>
              </li>
              <li>
                <a href="#cursos-y-planes" className="hover:text-emerald-400 transition font-bold text-emerald-400">
                  MasterExcel Full Pass (Los 3 Niveles)
                </a>
              </li>
              <li>
                <a href="#descarga-plantilla" className="hover:text-emerald-400 transition">
                  Plantilla Finanzas Personales 2026 (Gratis)
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Transparencia */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Políticas y Transparencia
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenModal('privacy')}
                  className="hover:text-emerald-400 transition text-left"
                >
                  Política de Privacidad (RGPD / Habeas Data)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('terms')}
                  className="hover:text-emerald-400 transition text-left"
                >
                  Términos del Servicio y Contratación
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('refund')}
                  className="hover:text-emerald-400 transition text-left"
                >
                  Política de Reembolso ({config.hotmartGuaranteeDays} Días Hotmart)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('cookies')}
                  className="hover:text-emerald-400 transition text-left"
                >
                  Política de Cookies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('delete-data')}
                  className="text-red-400 hover:text-red-300 transition text-left flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Solicitud Eliminación de Datos Personales</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Seguridad y Compromisos Éticos */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Garantías Éticas del Sitio
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400 leading-relaxed">
              <div className="flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Sin Tarifas Ocultas:</strong> Los precios mostrados son finales con pago único, sin cobros recurrentes sorpresa.
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Sin Patrones Oscuros:</strong> Puedes cancelar tu suscripción a correos en cualquier momento con un clic en el pie de página de cada mensaje.
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Consentimiento y Menores:</strong> Plataforma dirigida exclusivamente a mayores de 18 años o con consentimiento parental para formación profesional.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Acceso Central de Leads & CRM</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 text-center md:text-left">
          <div>
            &copy; {new Date().getFullYear()} {config.companyName}. Todos los derechos reservados.
            <span className="block mt-1 text-slate-600">
              Microsoft Excel&reg; es una marca comercial registrada de Microsoft Corporation. Este programa formativo no está afiliado, patrocinado ni respaldado por Microsoft Corporation.
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => onOpenModal('privacy')} className="hover:text-white">
              Privacidad
            </button>
            <span>•</span>
            <button onClick={() => onOpenModal('terms')} className="hover:text-white">
              Términos
            </button>
            <span>•</span>
            <button onClick={() => onOpenModal('refund')} className="hover:text-white">
              Garantía Hotmart
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
