import { FileSpreadsheet } from 'lucide-react';
import { AppConfig } from '../types';

interface Props {
  config: AppConfig;
  onOpenModal: (type: 'privacy' | 'terms' | 'refund' | 'cookies' | 'delete-data') => void;
  onOpenAdmin: () => void;
}

export function FooterSimple({ config, onOpenModal, onOpenAdmin }: Props) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <span>Hoja<span className="text-emerald-400">Maestra</span></span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <a href="#cursos" className="hover:text-white transition">Cursos</a>
            <button onClick={() => onOpenModal('privacy')} className="hover:text-white transition">Privacidad</button>
            <button onClick={() => onOpenModal('terms')} className="hover:text-white transition">Términos</button>
            <button onClick={() => onOpenModal('refund')} className="hover:text-white transition">Garantía Hotmart</button>
            <button onClick={() => onOpenModal('delete-data')} className="text-red-400 hover:text-red-300 transition">Eliminar mis datos</button>
          </div>

          {/* Discreet Admin Lock Button */}
          <div>
            <button
              onClick={onOpenAdmin}
              className="text-slate-600 hover:text-slate-400 transition text-[11px] flex items-center gap-1 py-1 px-2 rounded hover:bg-slate-800/80"
              title="Acceso exclusivo para el administrador"
            >
              <span>🔒</span>
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div className="pt-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {config.companyName}. Soporte: {config.supportEmail}
          </div>
          <div>
            Pagos procesados y protegidos por Hotmart Pay.
          </div>
        </div>
      </div>
    </footer>
  );
}
