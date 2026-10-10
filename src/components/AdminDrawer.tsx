import { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Link as LinkIcon, 
  Trash2, 
  RotateCw, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  FileSpreadsheet, 
  Send, 
  Users, 
  Settings, 
  Lock, 
  Unlock, 
  KeyRound, 
  LogOut, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  MousePointerClick, 
  ShoppingCart, 
  Layers, 
  RotateCcw,
  Sparkles,
  Smartphone,
  Monitor,
  Tablet,
  DollarSign,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { Lead, AppConfig } from '../types';
import { 
  verifyAdminPassword, 
  fetchLeadsUnified, 
  deleteLeadUnified, 
  exportLeadsToExcelClient,
  saveLocalConfig,
  setStoredAdminPassword,
  updateAdminPasswordUnified
} from '../services/leadStorage';
import { 
  getAnalyticsMetrics, 
  resetAnalyticsMetrics, 
  formatDuration, 
  AnalyticsMetrics,
  syncLeadsCount,
  exportAnalyticsToExcel
} from '../services/analytics';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onConfigUpdated: (newConfig: AppConfig) => void;
}

export function AdminDrawer({ isOpen, onClose, config, onConfigUpdated }: Props) {
  // Authentication state
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('hoja_maestra_admin_token') || null;
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Panel tabs & state (default tab: metrics)
  const [activeTab, setActiveTab] = useState<'metrics' | 'leads' | 'links' | 'security'>('metrics');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Analytics metrics state
  const [metrics, setMetrics] = useState<AnalyticsMetrics>(() => getAnalyticsMetrics());

  // Change password form state
  const [newPassword, setNewPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Config form state
  const [formData, setFormData] = useState<AppConfig>(config);
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  // Refresh analytics whenever drawer opens or tab changes
  useEffect(() => {
    if (isOpen) {
      const fresh = getAnalyticsMetrics();
      setMetrics(fresh);
    }
  }, [isOpen, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const auth = await verifyAdminPassword(passwordInput);
      if (auth.success) {
        setAdminToken(auth.token);
        localStorage.setItem('hoja_maestra_admin_token', auth.token);
        setPasswordInput('');
        const loadedLeads = await fetchLeadsUnified(auth.token);
        setLeads(loadedLeads);
        syncLeadsCount(loadedLeads.length);
        setMetrics(getAnalyticsMetrics());
      } else {
        setAuthError('Contraseña incorrecta. (Prueba con admin2026)');
      }
    } catch {
      setAuthError('Error al iniciar sesión.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('hoja_maestra_admin_token');
    setLeads([]);
  };

  const fetchLeadsWithToken = async (token: string) => {
    setLoading(true);
    try {
      const loadedLeads = await fetchLeadsUnified(token);
      setLeads(loadedLeads);
      syncLeadsCount(loadedLeads.length);
      setMetrics(getAnalyticsMetrics());
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && adminToken) {
      fetchLeadsWithToken(adminToken);
    }
  }, [isOpen, adminToken]);

  const handleDeleteLead = async (id: string, email: string) => {
    if (!adminToken) return;
    if (!confirm(`¿Confirmas la eliminación permanente del registro de ${email}?`)) {
      return;
    }

    try {
      await deleteLeadUnified(id, adminToken);
      const remaining = leads.filter((l) => l.id !== id);
      setLeads(remaining);
      syncLeadsCount(remaining.length);
      setMetrics(getAnalyticsMetrics());
      setStatusMessage(`Registro de ${email} eliminado correctamente.`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      alert('Error al eliminar lead.');
    }
  };

  const handleResendEmail = async (id: string) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;

    setStatusMessage(`Notificación reenviada a ${lead.email}.`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleResetMetrics = () => {
    if (confirm('¿Deseas reiniciar las estadísticas para comenzar a medir una nueva campaña publicitaria?')) {
      const fresh = resetAnalyticsMetrics();
      setMetrics(fresh);
      setStatusMessage('Métricas de campaña reiniciadas.');
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      saveLocalConfig(formData);
      onConfigUpdated(formData);

      try {
        await fetch('/api/config', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-key': adminToken || '',
          },
          body: JSON.stringify(formData),
        });
      } catch {
        // Ok on Netlify
      }

      setStatusMessage('¡Configuración guardada exitosamente!');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      alert('Error al guardar la configuración.');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    if (newPassword.trim().length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setChangingPass(true);
    try {
      const cleanPass = newPassword.trim();
      await updateAdminPasswordUnified(cleanPass);
      setAdminToken(cleanPass);
      localStorage.setItem('hoja_maestra_admin_token', cleanPass);

      try {
        await fetch('/api/admin/change-password', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-key': adminToken,
          },
          body: JSON.stringify({ newPassword: cleanPass }),
        });
      } catch {
        // Ok on Netlify
      }

      setNewPassword('');
      setStatusMessage('¡Contraseña de administrador actualizada con éxito!');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      alert('Error al cambiar contraseña.');
    } finally {
      setChangingPass(false);
    }
  };

  if (!isOpen) return null;

  // 1. IF NOT LOGGED IN: SHOW ADMIN LOGIN DIALOG
  if (!adminToken) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Acceso de Administrador
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ingresa tu contraseña para ver las métricas, prospectos y enlaces de <strong>Hoja Maestra</strong>.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="admin2026"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                <span>Contraseña inicial:</span>
                <button
                  type="button"
                  onClick={() => setPasswordInput('admin2026')}
                  className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold hover:bg-emerald-100 transition border border-emerald-200 cursor-pointer"
                >
                  admin2026
                </button>
              </p>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {authLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Entrar al Dashboard de Métricas</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. IF LOGGED IN: SHOW FULL SECURED ADMIN DRAWER
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.phone && l.phone.includes(searchQuery));
    const matchesLevel = filterLevel === 'all' || l.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const totalCourseClicks = metrics.courseClicks.total || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white w-full max-w-4xl h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600 text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                <span>Dashboard de Control • Hoja Maestra</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Administrador Activo
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Métricas del embudo, visitantes, clics y base de datos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              title="Cerrar sesión de administrador"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Cerrar panel"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Status Message Notification Bar */}
        {statusMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-medium flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {statusMessage}
            </span>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center justify-between text-xs font-semibold overflow-x-auto">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'metrics'
                  ? 'border-emerald-600 text-emerald-800 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Métricas & Embudo</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'leads'
                  ? 'border-emerald-600 text-emerald-800 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Base de Datos ({leads.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('links')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'links'
                  ? 'border-emerald-600 text-emerald-800 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Enlaces Hotmart & Plantilla</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'security'
                  ? 'border-emerald-600 text-emerald-800 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Cambiar Contraseña</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => {
                setMetrics(getAnalyticsMetrics());
                if (adminToken) fetchLeadsWithToken(adminToken);
              }}
              disabled={loading}
              className="p-1.5 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              title="Recargar datos y métricas"
            >
              <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          
          {/* TAB 1: METRICS & CONVERSION FUNNEL */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              
              {/* Top Banner with live badge & actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Métricas de Tráfico y Comportamiento del Embudo
                    </h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      En Vivo
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Monitorea en tiempo real visitantes, clics en enlaces, retención de tiempo, tasa de conversión y clics en cursos.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => exportAnalyticsToExcel(metrics)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    title="Descargar resumen de métricas en archivo Excel"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Exportar Métricas (.xlsx)</span>
                  </button>

                  <button
                    onClick={() => setMetrics(getAnalyticsMetrics())}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    title="Actualizar métricas"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Actualizar</span>
                  </button>

                  <button
                    onClick={handleResetMetrics}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-200"
                    title="Reiniciar métricas para nueva campaña publicitaria"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reiniciar Campaña</span>
                  </button>
                </div>
              </div>

              {/* 4 Main KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Visitantes Únicos */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-300 transition">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                    <span className="font-semibold text-slate-700">1. Número de Visitantes</span>
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {metrics.totalVisitors.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
                    <span>{metrics.totalPageviews} visualizaciones</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      {(metrics.totalPageviews / Math.max(1, metrics.totalVisitors)).toFixed(1)} págs/visita
                    </span>
                  </div>
                </div>

                {/* 2. Clics en el Enlace */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-300 transition">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                    <span className="font-semibold text-slate-700">2. Clics en el Enlace</span>
                    <MousePointerClick className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-purple-700">
                    {metrics.templateClicks.total.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
                    <span>{metrics.templateClicks.googleSheets} Sheets • {metrics.templateClicks.excelDownload} Excel</span>
                    <span className="text-purple-700 font-semibold bg-purple-50 px-1.5 py-0.5 rounded">
                      {Math.round((metrics.templateClicks.total / Math.max(1, metrics.totalVisitors)) * 100)}% ratio
                    </span>
                  </div>
                </div>

                {/* 3. Tiempo Promedio de Visita */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-300 transition">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                    <span className="font-semibold text-slate-700">3. Tiempo Promedio Visita</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {formatDuration(metrics.averageTimeSeconds)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
                    <span>{metrics.averageTimeSeconds} segs / usuario</span>
                    <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                      Lectura Activa
                    </span>
                  </div>
                </div>

                {/* 4. Tasa de Conversión */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-300 bg-emerald-50/40 shadow-2xs hover:border-emerald-500 transition">
                  <div className="flex items-center justify-between text-emerald-800 text-xs mb-1">
                    <span className="font-bold text-emerald-900">4. Tasa de Conversión</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                    {metrics.conversionRate}%
                  </div>
                  <div className="text-[11px] text-emerald-800 mt-1.5 flex items-center justify-between">
                    <span className="font-semibold">{metrics.leadsCount} leads registrados</span>
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                      Excelente
                    </span>
                  </div>
                </div>

              </div>

              {/* SECTION: CLICS EN LOS CURSOS (HOTMART) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-emerald-600" />
                      <span>5. Clics en los Cursos (Intención de Compra en Hotmart)</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Monitorea qué producto genera más interés hacia las pasarelas de pago de Hotmart.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5">
                      <div className="text-lg font-black text-emerald-700">
                        {metrics.courseClicks.total}
                      </div>
                      <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                        Clics Totales Hotmart
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Curso Oferta $5 */}
                  <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-amber-900">⚡ Oferta Especial</span>
                      <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-200">$5 USD</span>
                    </div>
                    <div className="text-2xl font-black text-amber-600 mt-1">
                      {metrics.courseClicks.offer5Usd} <span className="text-xs font-semibold text-slate-500">clics</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 flex justify-between">
                      <span>Participación:</span>
                      <span className="font-bold text-amber-700">{Math.round((metrics.courseClicks.offer5Usd / totalCourseClicks) * 100)}%</span>
                    </div>
                    <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden mt-2">
                      <div 
                        className="bg-amber-500 h-full rounded-full" 
                        style={{ width: `${Math.min(100, Math.round((metrics.courseClicks.offer5Usd / totalCourseClicks) * 100))}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Excel Principiantes */}
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-900">🌱 Principiantes</span>
                      <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-emerald-200">$19 USD</span>
                    </div>
                    <div className="text-2xl font-black text-emerald-700 mt-1">
                      {metrics.courseClicks.beginner} <span className="text-xs font-semibold text-slate-500">clics</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 flex justify-between">
                      <span>Participación:</span>
                      <span className="font-bold text-emerald-800">{Math.round((metrics.courseClicks.beginner / totalCourseClicks) * 100)}%</span>
                    </div>
                    <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden mt-2">
                      <div 
                        className="bg-emerald-600 h-full rounded-full" 
                        style={{ width: `${Math.min(100, Math.round((metrics.courseClicks.beginner / totalCourseClicks) * 100))}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Excel Empresarial */}
                  <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-blue-900">🏢 Empresarial</span>
                      <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-blue-200">$37 USD</span>
                    </div>
                    <div className="text-2xl font-black text-blue-700 mt-1">
                      {metrics.courseClicks.business} <span className="text-xs font-semibold text-slate-500">clics</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 flex justify-between">
                      <span>Participación:</span>
                      <span className="font-bold text-blue-800">{Math.round((metrics.courseClicks.business / totalCourseClicks) * 100)}%</span>
                    </div>
                    <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden mt-2">
                      <div 
                        className="bg-blue-600 h-full rounded-full" 
                        style={{ width: `${Math.min(100, Math.round((metrics.courseClicks.business / totalCourseClicks) * 100))}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Ebook */}
                  <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-purple-900">📖 Ebook Excel</span>
                      <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-purple-200">$9 USD</span>
                    </div>
                    <div className="text-2xl font-black text-purple-700 mt-1">
                      {metrics.courseClicks.ebook} <span className="text-xs font-semibold text-slate-500">clics</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 flex justify-between">
                      <span>Participación:</span>
                      <span className="font-bold text-purple-800">{Math.round((metrics.courseClicks.ebook / totalCourseClicks) * 100)}%</span>
                    </div>
                    <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden mt-2">
                      <div 
                        className="bg-purple-600 h-full rounded-full" 
                        style={{ width: `${Math.min(100, Math.round((metrics.courseClicks.ebook / totalCourseClicks) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: DESGLOSE DE DISPOSITIVOS & RETENCIÓN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Dispositivos (Móvil vs Escritorio) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        <span>Dispositivos de los Visitantes (Mobile First)</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Tráfico mayoritariamente móvil de redes sociales (Instagram, TikTok, FB).
                      </p>
                    </div>
                  </div>

                  {(() => {
                    const totalDev = Math.max(1, metrics.deviceBreakdown.mobile + metrics.deviceBreakdown.desktop + metrics.deviceBreakdown.tablet);
                    const mobilePct = Math.round((metrics.deviceBreakdown.mobile / totalDev) * 100);
                    const desktopPct = Math.round((metrics.deviceBreakdown.desktop / totalDev) * 100);
                    const tabletPct = Math.max(0, 100 - mobilePct - desktopPct);

                    return (
                      <div className="space-y-3 text-xs">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-slate-700 flex items-center gap-1">
                              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                              Móviles (Smartphones)
                            </span>
                            <span className="font-mono font-bold text-emerald-700">
                              {metrics.deviceBreakdown.mobile} ({mobilePct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${mobilePct}%` }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-slate-700 flex items-center gap-1">
                              <Monitor className="w-3.5 h-3.5 text-blue-600" />
                              Computadoras (Escritorio / Laptop)
                            </span>
                            <span className="font-mono font-bold text-blue-700">
                              {metrics.deviceBreakdown.desktop} ({desktopPct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${desktopPct}%` }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-slate-700 flex items-center gap-1">
                              <Tablet className="w-3.5 h-3.5 text-purple-600" />
                              Tablets
                            </span>
                            <span className="font-mono font-bold text-purple-700">
                              {metrics.deviceBreakdown.tablet} ({tabletPct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-purple-600 h-full rounded-full" style={{ width: `${tabletPct}%` }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Retención & Profundidad de Lectura */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Profundidad y Retención de Visita</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Distribución de tiempo que los prospectos pasan en la landing page.
                      </p>
                    </div>
                  </div>

                  {(() => {
                    const totalRet = Math.max(1, metrics.retentionBreakdown.bounce + metrics.retentionBreakdown.reading + metrics.retentionBreakdown.highEngagement);
                    const highPct = Math.round((metrics.retentionBreakdown.highEngagement / totalRet) * 100);
                    const readPct = Math.round((metrics.retentionBreakdown.reading / totalRet) * 100);
                    const bouncePct = Math.max(0, 100 - highPct - readPct);

                    return (
                      <div className="space-y-3 text-xs">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-slate-700">
                              🔥 Alto Interés (&gt; 90 segundos)
                            </span>
                            <span className="font-mono font-bold text-emerald-700">
                              {metrics.retentionBreakdown.highEngagement} usuarios ({highPct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${highPct}%` }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-slate-700">
                              📖 Lectura Regular (15s a 90s)
                            </span>
                            <span className="font-mono font-bold text-amber-700">
                              {metrics.retentionBreakdown.reading} usuarios ({readPct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${readPct}%` }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-slate-700">
                              ⚡ Rebote Rápido (&lt; 15 segundos)
                            </span>
                            <span className="font-mono font-bold text-slate-600">
                              {metrics.retentionBreakdown.bounce} usuarios ({bouncePct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-slate-400 h-full rounded-full" style={{ width: `${bouncePct}%` }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>

              {/* SECTION: EVOLUCIÓN DIARIA (ÚLTIMOS 7 DÍAS) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>Evolución Diaria del Embudo (Últimos 7 Días)</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Visualiza la tendencia diaria de visitantes, capturas de leads y clics.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    Historial activo
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Día / Fecha</th>
                        <th className="p-2.5 text-center">Visitantes</th>
                        <th className="p-2.5 text-center">Leads Capturados</th>
                        <th className="p-2.5 text-center">Clics Plantilla</th>
                        <th className="p-2.5 text-center">Clics Cursos</th>
                        <th className="p-2.5 text-right">Tasa Conversión</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {metrics.dailyStats.map((day, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="p-2.5 font-bold text-slate-800">
                            {day.dayLabel} <span className="font-mono text-[10px] text-slate-400 font-normal">({day.date})</span>
                          </td>
                          <td className="p-2.5 text-center font-bold text-slate-900">
                            {day.visitors}
                          </td>
                          <td className="p-2.5 text-center font-bold text-emerald-700 bg-emerald-50/50">
                            {day.leads}
                          </td>
                          <td className="p-2.5 text-center text-purple-700 font-medium">
                            {day.templateClicks}
                          </td>
                          <td className="p-2.5 text-center text-amber-700 font-medium">
                            {day.courseClicks}
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                            {day.visitors > 0 ? `${((day.leads / day.visitors) * 100).toFixed(1)}%` : '0%'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION: EMBUDO VISUAL COMPLETO DE 4 FASES */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Embudo de Conversión Integral • Hoja Maestra</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">1. Llegada a la Landing</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{metrics.totalVisitors}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">100% Audiencia Total</div>
                  </div>

                  <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200">
                    <div className="text-[10px] text-purple-900 uppercase font-bold">2. Clics en la Plantilla</div>
                    <div className="text-2xl font-black text-purple-700 mt-1">{metrics.templateClicks.total}</div>
                    <div className="text-[10px] text-purple-800 font-semibold mt-0.5">
                      {Math.round((metrics.templateClicks.total / Math.max(1, metrics.totalVisitors)) * 100)}% interacción
                    </div>
                  </div>

                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300">
                    <div className="text-[10px] text-emerald-900 uppercase font-bold">3. Leads Registrados</div>
                    <div className="text-2xl font-black text-emerald-700 mt-1">{metrics.leadsCount}</div>
                    <div className="text-[10px] text-emerald-800 font-bold mt-0.5">
                      {metrics.conversionRate}% conversión
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="text-[10px] text-amber-900 uppercase font-bold">4. Clics en Cursos Hotmart</div>
                    <div className="text-2xl font-black text-amber-700 mt-1">{metrics.courseClicks.total}</div>
                    <div className="text-[10px] text-amber-800 font-semibold mt-0.5">
                      {Math.round((metrics.courseClicks.total / Math.max(1, metrics.totalVisitors)) * 100)}% intención compra
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: LEADS DATABASE */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              {/* Action Bar: Search & Export */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre o correo..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-medium text-slate-700"
                  >
                    <option value="all">Todos</option>
                    <option value="basico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>

                {/* Direct Client-Side Excel Export (Works 100% on Netlify) */}
                <button
                  type="button"
                  onClick={() => exportLeadsToExcelClient(filteredLeads)}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Exportar a Excel (.xlsx)</span>
                </button>
              </div>

              {/* Leads Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-3">Nombre & Correo</th>
                        <th className="p-3">Nivel</th>
                        <th className="p-3">Fecha de Registro</th>
                        <th className="p-3 text-center">Estado</th>
                        <th className="p-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400">
                            No se encontraron registros de prospectos.
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-50 transition">
                            <td className="p-3">
                              <div className="font-bold text-slate-900">{lead.name}</div>
                              <div className="font-mono text-[11px] text-slate-500">{lead.email}</div>
                            </td>
                            <td className="p-3">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                {lead.level}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 text-[11px]">
                              {new Date(lead.createdAt).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="p-3 text-center">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Registrado</span>
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleResendEmail(lead.id)}
                                  className="p-1 text-slate-500 hover:text-emerald-700 transition cursor-pointer"
                                  title="Reenviar correo"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLead(lead.id, lead.email)}
                                  className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                                  title="Eliminar registro"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOTMART & TEMPLATE LINKS */}
          {activeTab === 'links' && (
            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div className="bg-white rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
                  <LinkIcon className="w-4 h-4" />
                  <h4>Configuración de Enlaces de Hotmart & Google Sheets</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Modifica aquí tus enlaces directos. Se guardan y aplican inmediatamente en tu página.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Enlace Curso Oferta USD 5 (Hotmart URL)
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.specialOfferCourseUrl || ''}
                    onChange={(e) => setFormData({ ...formData, specialOfferCourseUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-emerald-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Enlace Excel para Principiantes (Hotmart URL)
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.beginnerCourseUrl || ''}
                    onChange={(e) => setFormData({ ...formData, beginnerCourseUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Enlace Excel Empresarial (Hotmart URL)
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.businessCourseUrl || ''}
                    onChange={(e) => setFormData({ ...formData, businessCourseUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Enlace Ebook para Excel (Hotmart URL)
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.ebookCourseUrl || ''}
                    onChange={(e) => setFormData({ ...formData, ebookCourseUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-amber-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Enlace de la Plantilla en Google Sheets (Hoja Maestra)
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.templateGoogleSheetUrl || ''}
                    onChange={(e) => setFormData({ ...formData, templateGoogleSheetUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingConfig}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingConfig ? 'Guardando...' : 'Guardar Enlaces'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 4: CHANGE PASSWORD */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  <h4>Cambiar Contraseña de Administrador</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Esta contraseña protege el acceso a los leads y enlaces en Netlify y en local.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 text-xs max-w-md">
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    placeholder="Mínimo 4 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPass}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                >
                  {changingPass ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
