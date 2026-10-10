import { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  TrendingUp, 
  DollarSign, 
  PiggyBank, 
  ShieldCheck, 
  Sparkles,
  PieChart as PieChartIcon,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface Props {
  onDownloadClick?: () => void;
  isDownloading?: boolean;
}

export function InteractiveSpreadsheetPreview({ onDownloadClick, isDownloading }: Props) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ingresos' | 'gastos' | 'metas' | 'atajos'>('dashboard');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(3650);

  // Dynamic calculations based on state
  const fixedExpenses = 1380;
  const variableExpenses = 1040;
  const debtAmortization = 300;
  const totalExpenses = fixedExpenses + variableExpenses + debtAmortization;
  const netSavings = monthlyIncome - totalExpenses;
  const savingsRate = Math.round((netSavings / monthlyIncome) * 100);

  const rule50Needed = Math.round(monthlyIncome * 0.5);
  const rule30Wants = Math.round(monthlyIncome * 0.3);
  const rule20Savings = Math.round(monthlyIncome * 0.2);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-slate-800">
      {/* Excel Ribbon Window Header */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <span className="bg-emerald-600 text-white p-1 rounded font-bold text-[10px] flex items-center">
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1 inline" />
              XLSX
            </span>
            <span className="font-semibold text-white">Plantilla_Finanzas_Personales_Automatizada_2026.xlsx</span>
            <span className="hidden sm:inline text-slate-500">· Guardado automáticamente</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadClick}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold rounded-md transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Descargar .xlsx Gratis</span>
            <span className="sm:hidden">Descargar</span>
          </button>
        </div>
      </div>

      {/* Simulated Excel Ribbon Menu */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-1.5 flex items-center justify-between text-xs text-slate-600 overflow-x-auto">
        <div className="flex items-center space-x-4 shrink-0">
          <span className="font-semibold text-emerald-800 border-b-2 border-emerald-600 pb-0.5">Inicio</span>
          <span className="hover:text-slate-900 cursor-pointer">Insertar</span>
          <span className="hover:text-slate-900 cursor-pointer">Fórmulas</span>
          <span className="hover:text-slate-900 cursor-pointer">Datos</span>
          <span className="hover:text-slate-900 cursor-pointer">Revisar</span>
          <span className="hover:text-slate-900 cursor-pointer">Vista</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-500">
          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
            Fórmulas 100% nativas (Sin Macros requeridas)
          </span>
          <span>Compatibilidad: Excel 2016+, 365 & Google Sheets</span>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-1.5 flex items-center gap-3 text-xs font-mono">
        <div className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold border border-slate-300 w-16 text-center">
          {activeTab === 'dashboard' ? 'C12' : activeTab === 'ingresos' ? 'E7' : 'F13'}
        </div>
        <span className="text-slate-400 font-serif italic text-sm">fx</span>
        <div className="bg-slate-50 flex-1 px-3 py-1 rounded border border-slate-200 text-slate-700 truncate">
          {activeTab === 'dashboard'
            ? '=SI.ERROR((C10/C6), "0%") [Tasa de Ahorro Neta Automatizada]'
            : activeTab === 'ingresos'
            ? '=SUMA(E3:E6) [Total de Ingresos Mensuales]'
            : '=SUMA(F3:F12) [Total Gastos Reales]'}
        </div>
      </div>

      {/* Sheet Content Area */}
      <div className="p-4 sm:p-6 bg-slate-50 min-h-[360px] overflow-x-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 min-w-[620px]">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span>Ingresos Totales</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">
                  ${monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-1 font-medium">
                  <ArrowUpRight className="w-3 h-3" />
                  +4.2% sobre meta
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span>Gastos Totales</span>
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">
                  ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">
                  Fijos + Variables + Deudas
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-xs">
                <div className="flex items-center justify-between text-emerald-800 text-xs mb-1">
                  <span>Ahorro Neto Real</span>
                  <PiggyBank className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-700">
                  ${netSavings.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                <div className="text-[11px] text-emerald-800 mt-1 font-semibold">
                  Tasa Ahorro: {savingsRate}%
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span>Fondo Emergencia</span>
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">
                  4.2 meses
                </div>
                <div className="text-[11px] text-blue-700 mt-1 font-medium">
                  Meta mínima: 3 a 6 meses
                </div>
              </div>
            </div>

            {/* Financial Rule 50/30/20 & Expense Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <PieChartIcon className="w-3.5 h-3.5 text-emerald-600" />
                    Regla 50 / 30 / 20 Automatizada
                  </h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                    Salud Financiera Óptima
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Necesidades Básicas (50% max)</span>
                      <span className="font-semibold text-slate-800">${rule50Needed} / Real: ${fixedExpenses + Math.round(variableExpenses * 0.4)}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '48%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Deseos & Ocio (30% max)</span>
                      <span className="font-semibold text-slate-800">${rule30Wants} / Real: ${Math.round(variableExpenses * 0.6)}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '22%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Ahorro & Deudas (20% min)</span>
                      <span className="font-semibold text-emerald-700">${rule20Savings} / Real: ${netSavings}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Simulator */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Prueba Interactiva: Ajusta tu Ingreso
                    </h4>
                    <span className="text-[10px] text-slate-500">Cálculo dinámico</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Mueve el control deslizante para observar cómo se recalculan automáticamente las fórmulas de ahorro y porcentajes en tiempo real:
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Ingreso mensual de prueba:</span>
                      <span className="text-emerald-700 text-sm">${monthlyIncome.toLocaleString()} USD</span>
                    </div>
                    <input
                      type="range"
                      min={1500}
                      max={8000}
                      step={100}
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Ahorro proyectado anual:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ${(netSavings * 12).toLocaleString()} USD / año
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ingresos' && (
          <div className="min-w-[620px]">
            <table className="w-full text-xs text-left border-collapse bg-white rounded-lg overflow-hidden border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-2.5">Fecha</th>
                  <th className="p-2.5">Categoría</th>
                  <th className="p-2.5">Descripción / Fuente</th>
                  <th className="p-2.5 text-right">Presupuestado</th>
                  <th className="p-2.5 text-right">Monto Recibido</th>
                  <th className="p-2.5 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-mono text-slate-500">05/01/2026</td>
                  <td className="p-2.5 font-medium text-slate-800">Sueldo / Nómina</td>
                  <td className="p-2.5 text-slate-600">Salario mensual corporativo principal</td>
                  <td className="p-2.5 text-right font-mono">$2,800.00</td>
                  <td className="p-2.5 text-right font-mono font-semibold text-emerald-700">$2,800.00</td>
                  <td className="p-2.5 text-center"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Cobrado</span></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono text-slate-500">15/01/2026</td>
                  <td className="p-2.5 font-medium text-slate-800">Servicios Freelance</td>
                  <td className="p-2.5 text-slate-600">Automatización de reportes en Excel</td>
                  <td className="p-2.5 text-right font-mono">$400.00</td>
                  <td className="p-2.5 text-right font-mono font-semibold text-emerald-700">$520.00</td>
                  <td className="p-2.5 text-center"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Cobrado</span></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono text-slate-500">20/01/2026</td>
                  <td className="p-2.5 font-medium text-slate-800">Rendimientos</td>
                  <td className="p-2.5 text-slate-600">Intereses cuenta de alto rendimiento</td>
                  <td className="p-2.5 text-right font-mono">$150.00</td>
                  <td className="p-2.5 text-right font-mono font-semibold text-emerald-700">$180.00</td>
                  <td className="p-2.5 text-center"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Cobrado</span></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono text-slate-500">28/01/2026</td>
                  <td className="p-2.5 font-medium text-slate-800">Otros ingresos</td>
                  <td className="p-2.5 text-slate-600">Venta de equipo tecnológico usado</td>
                  <td className="p-2.5 text-right font-mono">$150.00</td>
                  <td className="p-2.5 text-right font-mono font-semibold text-emerald-700">$150.00</td>
                  <td className="p-2.5 text-center"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Cobrado</span></td>
                </tr>
              </tbody>
              <tfoot className="bg-emerald-50 text-emerald-950 font-bold border-t-2 border-emerald-300">
                <tr>
                  <td colSpan={3} className="p-2.5 text-right uppercase tracking-wider text-[11px]">Total Ingresos Consolidados:</td>
                  <td className="p-2.5 text-right font-mono">$3,500.00</td>
                  <td className="p-2.5 text-right font-mono text-emerald-800 text-sm">$3,650.00</td>
                  <td className="p-2.5 text-center text-emerald-700 text-[11px] font-semibold">+104% cumplimiento</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {activeTab === 'gastos' && (
          <div className="min-w-[620px]">
            <table className="w-full text-xs text-left border-collapse bg-white rounded-lg overflow-hidden border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-2.5">Fecha</th>
                  <th className="p-2.5">Tipo</th>
                  <th className="p-2.5">Categoría</th>
                  <th className="p-2.5">Concepto</th>
                  <th className="p-2.5 text-right">Presupuesto</th>
                  <th className="p-2.5 text-right">Gasto Real</th>
                  <th className="p-2.5 text-center">Variación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-mono text-slate-500">02/01/2026</td>
                  <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">Fijo</span></td>
                  <td className="p-2.5 font-medium text-slate-800">Vivienda</td>
                  <td className="p-2.5 text-slate-600">Alquiler mensual departamento</td>
                  <td className="p-2.5 text-right font-mono">$900.00</td>
                  <td className="p-2.5 text-right font-mono font-semibold">$900.00</td>
                  <td className="p-2.5 text-center text-emerald-600 font-semibold">$0.00</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono text-slate-500">05/01/2026</td>
                  <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-semibold">Variable</span></td>
                  <td className="p-2.5 font-medium text-slate-800">Alimentación</td>
                  <td className="p-2.5 text-slate-600">Supermercado y despensa quincenal</td>
                  <td className="p-2.5 text-right font-mono">$350.00</td>
                  <td className="p-2.5 text-right font-mono font-semibold text-amber-700">$390.00</td>
                  <td className="p-2.5 text-center text-red-600 font-semibold">+$40.00</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono text-slate-500">10/01/2026</td>
                  <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-semibold">Variable</span></td>
                  <td className="p-2.5 font-medium text-slate-800">Transporte</td>
                  <td className="p-2.5 text-slate-600">Gasolina y recargas de peaje</td>
                  <td className="p-2.5 text-right font-mono">$150.00</td>
                  <td className="p-2.5 text-right font-mono font-semibold text-emerald-700">$140.00</td>
                  <td className="p-2.5 text-center text-emerald-600 font-semibold">-$10.00</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono text-slate-500">16/01/2026</td>
                  <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-semibold">Variable</span></td>
                  <td className="p-2.5 font-medium text-slate-800">Ocio / Restaurantes</td>
                  <td className="p-2.5 text-slate-600">Salidas sociales fin de semana</td>
                  <td className="p-2.5 text-right font-mono">$200.00</td>
                  <td className="p-2.5 text-right font-mono font-semibold text-amber-700">$260.00</td>
                  <td className="p-2.5 text-center text-red-600 font-semibold">+$60.00</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                <tr>
                  <td colSpan={4} className="p-2.5 text-right uppercase tracking-wider text-[11px]">Total Gastos Registrados:</td>
                  <td className="p-2.5 text-right font-mono">$2,350.00</td>
                  <td className="p-2.5 text-right font-mono text-slate-900 text-sm">$2,420.00</td>
                  <td className="p-2.5 text-center text-amber-700 text-[11px] font-semibold">Bajo control</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {activeTab === 'metas' && (
          <div className="space-y-4 min-w-[620px]">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800">Fondo de Emergencia</span>
                  <span className="text-emerald-700 font-semibold">64%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full mb-2">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '64%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>$5,800 acumulados</span>
                  <span>Meta: $9,000</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800">Vacaciones Familiares</span>
                  <span className="text-emerald-700 font-semibold">56%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full mb-2">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '56%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>$1,400 acumulados</span>
                  <span>Meta: $2,500</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800">Certificación Profesional</span>
                  <span className="text-emerald-700 font-semibold">50%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full mb-2">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '50%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>$400 acumulados</span>
                  <span>Meta: $800</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Automatización activa:</strong> Cada vez que ingresas un ahorro en la hoja de Gastos, las barras de progreso y los meses restantes se recalculan de forma 100% automática.
              </span>
            </div>
          </div>
        )}

        {activeTab === 'atajos' && (
          <div className="grid grid-cols-2 gap-4 text-xs min-w-[620px]">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                Atajos Ninja (Ahorra 2 horas al día)
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800">Ctrl + T</kbd>
                  <span>Crear Tabla Dinámica Oficial</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800">Alt + =</kbd>
                  <span>Autosuma instantánea de rangos</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-1.5">
                  <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800">Ctrl + Mayús + L</kbd>
                  <span>Activar / Desactivar Filtros</span>
                </li>
                <li className="flex justify-between">
                  <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800">F4</kbd>
                  <span>Fijar celdas con $A$1 automáticamente</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Fórmulas Incluidas en la Plantilla
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li className="border-b border-slate-100 pb-1.5">
                  <span className="font-mono font-bold text-emerald-800">=BUSCARX(...)</span>
                  <p className="text-[11px] text-slate-500">Localiza datos exactos sin limitaciones de columnas.</p>
                </li>
                <li className="border-b border-slate-100 pb-1.5">
                  <span className="font-mono font-bold text-emerald-800">=SUMAR.SI.CONJUNTO(...)</span>
                  <p className="text-[11px] text-slate-500">Agrupa gastos filtrando por categoría y rango de fechas.</p>
                </li>
                <li>
                  <span className="font-mono font-bold text-emerald-800">=SI.ERROR(...)</span>
                  <p className="text-[11px] text-slate-500">Protege tu planilla contra errores feos como #¡VALOR! o #N/A.</p>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Sheet Tabs Footer (Like genuine Excel) */}
      <div className="bg-slate-200 border-t border-slate-300 px-3 py-1.5 flex items-center justify-between text-xs overflow-x-auto">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded-t font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'dashboard'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-xs'
                : 'bg-slate-300/80 hover:bg-slate-300 text-slate-700'
            }`}
          >
            <span>📊 1. Dashboard Resumen</span>
          </button>

          <button
            onClick={() => setActiveTab('ingresos')}
            className={`px-3 py-1 rounded-t font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'ingresos'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-xs'
                : 'bg-slate-300/80 hover:bg-slate-300 text-slate-700'
            }`}
          >
            <span>💵 2. Ingresos</span>
          </button>

          <button
            onClick={() => setActiveTab('gastos')}
            className={`px-3 py-1 rounded-t font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'gastos'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-xs'
                : 'bg-slate-300/80 hover:bg-slate-300 text-slate-700'
            }`}
          >
            <span>🛒 3. Gastos Diarios</span>
          </button>

          <button
            onClick={() => setActiveTab('metas')}
            className={`px-3 py-1 rounded-t font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'metas'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-xs'
                : 'bg-slate-300/80 hover:bg-slate-300 text-slate-700'
            }`}
          >
            <span>🎯 4. Metas de Ahorro</span>
          </button>

          <button
            onClick={() => setActiveTab('atajos')}
            className={`px-3 py-1 rounded-t font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'atajos'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-xs'
                : 'bg-slate-300/80 hover:bg-slate-300 text-slate-700'
            }`}
          >
            <span>⚡ 5. Atajos y Fórmulas</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-600">
          <span>Pestañas activas: 5</span>
          <span className="text-slate-400">|</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Fórmulas Validadas
          </span>
        </div>
      </div>
    </div>
  );
}
