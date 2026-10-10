import { useState } from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';

interface Props {
  onOpenAdmin: () => void;
}

export function Header({ onOpenAdmin }: Props) {
  const [clickCount, setClickCount] = useState(0);

  // Secret admin gesture: 3 clicks on logo within 1.5 seconds opens admin panel
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount >= 3) {
      setClickCount(0);
      onOpenAdmin();
    } else {
      setTimeout(() => setClickCount(0), 1500);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo (with secret 3-click gesture for admin) */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          title="Hoja Maestra"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 group-hover:bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs transition">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-base leading-none">
              Hoja<span className="text-emerald-700">Maestra</span>
            </span>
          </div>
        </div>

        {/* Navigation & Clean Public CTAs */}
        <div className="flex items-center gap-4 text-xs">
          <a
            href="#cursos"
            className="font-semibold text-slate-600 hover:text-emerald-700 transition"
          >
            Ver Cursos
          </a>

          <a
            href="#name-input"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('name-input');
              if (el) {
                el.focus();
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Plantilla Gratis</span>
          </a>
        </div>

      </div>
    </header>
  );
}
