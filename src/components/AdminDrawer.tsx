import { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Mail, 
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
  EyeOff
} from 'lucide-react';
import { Lead, AppConfig } from '../types';

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

  // Panel tabs & state
  const [activeTab, setActiveTab] = useState<'leads' | 'emails' | 'links' | 'security'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Change password form state
  const [newPassword, setNewPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Email preview modal state
  const [previewLead, setPreviewLead] = useState<Lead | null>(null);

  // Config form state
  const [formData, setFormData] = useState<AppConfig>(config);
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const token = data.token || passwordInput.trim();
        setAdminToken(token);
        localStorage.setItem('hoja_maestra_admin_token', token);
        setPasswordInput('');
        fetchLeadsWithToken(token);
      } else {
        setAuthError(data.message || 'Contraseña incorrecta.');
      }
    } catch {
      setAuthError('Error al conectar con el servidor.');
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
      const res = await fetch('/api/leads', {
        headers: { 'x-admin-key': token },
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
      }
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
      const res = await fetch(`/api/leads/${id}`, { 
        method: 'DELETE',
        headers: { 'x-admin-key': adminToken },
      });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.filter((l) => l.id !== id));
        setStatusMessage(`Registro de ${email} eliminado correctamente.`);
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch {
      alert('Error al eliminar lead.');
    }
  };

  const handleResendEmail = async (id: string) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/leads/${id}/resend-email`, { 
        method: 'POST',
        headers: { 'x-admin-key': adminToken },
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Notificación reenviada a ${data.lead.email}.`);
        fetchLeadsWithToken(adminToken);
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch {
      alert('Error al reenviar correo.');
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': adminToken || '',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        onConfigUpdated(data.config);
        setStatusMessage('¡Configuración guardada exitosamente!');
        setTimeout(() => setStatusMessage(null), 4000);
      }
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
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': adminToken,
        },
        body: JSON.stringify({ newPassword: newPassword.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const token = data.token || newPassword.trim();
        setAdminToken(token);
        localStorage.setItem('hoja_maestra_admin_token', token);
        setNewPassword('');
        setStatusMessage('¡Contraseña de administrador actualizada con éxito!');
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        alert(data.message || 'Error al cambiar contraseña.');
      }
    } catch {
      alert('Error de conexión.');
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
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Acceso de Administrador
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ingresa tu contraseña para acceder a la base de datos de leads de <strong>Hoja Maestra</strong>.
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
                  placeholder="Contraseña de admin"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Contraseña inicial predeterminada: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono font-bold">admin2026</code>
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
                  <span>Entrar al Panel de Leads</span>
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
                <span>Central de Leads • Hoja Maestra</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Sesión Protegida
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Solo visible por ti como administrador
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition"
              title="Cerrar sesión de administrador"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
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
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center justify-between text-xs font-semibold overflow-x-auto">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('leads')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
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
              className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
                activeTab === 'links'
                  ? 'border-emerald-600 text-emerald-800 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Enlaces Hotmart</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
                activeTab === 'security'
                  ? 'border-emerald-600 text-emerald-800 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Seguridad / Contraseña</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => adminToken && fetchLeadsWithToken(adminToken)}
              disabled={loading}
              className="p-1.5 text-slate-500 hover:text-slate-800 transition"
              title="Recargar datos"
            >
              <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {activeTab === 'leads' && (
            <div className="space-y-4">
              {/* Action Bar: Search & Export */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre, correo o teléfono..."
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

                <a
                  href={`/api/leads/export/excel?adminKey=${encodeURIComponent(adminToken)}`}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Exportar a Excel (.xlsx)</span>
                </a>
              </div>

              {/* Leads Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-3">Nombre & Correo</th>
                        <th className="p-3">Nivel / Meta</th>
                        <th className="p-3">Teléfono</th>
                        <th className="p-3">Fecha</th>
                        <th className="p-3 text-center">Estado</th>
                        <th className="p-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">
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
                            <td className="p-3 text-slate-600 font-mono text-[11px]">
                              {lead.phone || <span className="text-slate-400 italic">N/A</span>}
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
                                  className="p-1 text-slate-500 hover:text-emerald-700 transition"
                                  title="Reenviar correo"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLead(lead.id, lead.email)}
                                  className="p-1 text-slate-400 hover:text-red-600 transition"
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

          {activeTab === 'links' && (
            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div className="bg-white rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
                  <LinkIcon className="w-4 h-4" />
                  <h4>Configuración de Enlaces de Hotmart & Google Sheets</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Modifica aquí tus enlaces directos a las páginas de pago de Hotmart y la plantilla.
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

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  <h4>Cambiar Contraseña de Administrador</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Esta contraseña protege el acceso a la lista de leads y las configuraciones de venta.
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
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition"
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
