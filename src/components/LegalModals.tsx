import { useState } from 'react';
import { X, ShieldCheck, Trash2, CheckCircle2, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { AppConfig } from '../types';
import { deleteLeadUnified } from '../services/leadStorage';

interface Props {
  activeModal: 'privacy' | 'terms' | 'refund' | 'cookies' | 'delete-data' | null;
  onClose: () => void;
  config: AppConfig;
  onLeadDeleted?: (email: string) => void;
}

export function LegalModals({ activeModal, onClose, config, onLeadDeleted }: Props) {
  // States for data deletion form
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!activeModal) return null;

  const handleDeleteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);
    setDeleteMessage(null);

    const emailToClean = deleteEmail.trim().toLowerCase();
    if (!emailToClean || !emailToClean.includes('@')) {
      setDeleteError('Por favor introduce un correo válido.');
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteLeadUnified(emailToClean, 'admin2026');
      setDeleteMessage(`El registro de ${emailToClean} y todos sus datos personales han sido eliminados correctamente de la base de datos.`);
      if (onLeadDeleted) {
        onLeadDeleted(emailToClean);
      }
      setDeleteEmail('');
    } catch {
      setDeleteError('Error al procesar la solicitud.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              {activeModal === 'privacy' && 'Política de Privacidad y Protección de Datos'}
              {activeModal === 'terms' && 'Términos del Servicio y Condiciones de Contratación'}
              {activeModal === 'refund' && 'Política de Reembolso y Garantía Hotmart (7 Días)'}
              {activeModal === 'cookies' && 'Política de Cookies y Preferencias de Rastreo'}
              {activeModal === 'delete-data' && 'Portal de Eliminación de Datos Personales (Derecho al Olvido)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 overflow-y-auto text-xs sm:text-sm text-slate-600 space-y-4 leading-relaxed">
          {activeModal === 'privacy' && (
            <>
              <p>
                <strong>Responsable del Tratamiento:</strong> {config.companyName}, con domicilio operativo en cumplimiento de las normativas internacionales de protección de datos personales (incluyendo el Reglamento General de Protección de Datos - RGPD y normativas latinoamericanas de Habeas Data). Correo de contacto: <strong>{config.supportEmail}</strong>.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">1. Finalidad del Tratamiento</h4>
              <p>
                Los datos solicitados a través del formulario de captura (nombre, correo electrónico, nivel de Excel, meta y teléfono opcional) son tratados con la exclusiva finalidad de:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Facilitar el envío y descarga de la Plantilla de Finanzas Personales 2026.</li>
                <li>Enviar notificaciones y tutoriales pedagógicos de mejora de productividad en Excel.</li>
                <li>Ofrecer descuentos informativos para los programas formativos (Básico, Intermedio y Avanzado).</li>
              </ul>
              <h4 className="font-bold text-slate-900 text-sm">2. Principio de Minimización y Sin Venta a Terceros</h4>
              <p>
                No recopilamos datos financieros sensibles ni tarjetas bancarias directamente en este sitio (los pagos son procesados externamente por la pasarela segura de Hotmart). <strong>Jamás vendemos, alquilamos ni transferimos</strong> tus datos de contacto a intermediarios comerciales de terceros.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. Tus Derechos (Acceso, Rectificación y Supresión)</h4>
              <p>
                Puedes ejercer en cualquier momento tus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición), solicitar una copia de los datos almacenados o exigir su eliminación inmediata a través de nuestro portal de eliminación de datos en esta misma página o escribiendo a <em>{config.supportEmail}</em>.
              </p>
            </>
          )}

          {activeModal === 'terms' && (
            <>
              <h4 className="font-bold text-slate-900 text-sm">1. Aceptación de los Términos</h4>
              <p>
                Al acceder y utilizar el sitio web de MasterExcel Pro, el usuario acepta de manera expresa los presentes Términos de Servicio. Si no estás conforme con alguna de las estipulaciones, te rogamos abstenerte de hacer uso de la plataforma.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. Propiedad Intelectual y Licenciamiento</h4>
              <p>
                Los contenidos formativos, videos, estructuras de hojas de cálculo, logotipos y plantillas son propiedad exclusiva de {config.companyName}. La descarga de la plantilla gratuita otorga una licencia de uso personal y profesional intransferible. Queda expresamente prohibida la reventa comercial del archivo como producto propio sin consentimiento escrito.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. Modalidad de Pago y Plataforma Hotmart</h4>
              <p>
                La comercialización de los cursos se realiza a través de la infraestructura autorizada de Hotmart, actuando como comercializador oficial. Todas las transacciones son seguras y están cifradas bajo protocolos de grado bancario.
              </p>
            </>
          )}

          {activeModal === 'refund' && (
            <>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm font-bold">Garantía Incondicional de {config.hotmartGuaranteeDays} Días</strong>
                  <span>Respaldada legalmente por la infraestructura de Hotmart para tu total tranquilidad.</span>
                </div>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">¿Cómo funciona el reembolso?</h4>
              <p>
                Dispones de <strong>{config.hotmartGuaranteeDays} días naturales</strong> contados a partir del momento de tu compra para evaluar el contenido del curso adquirido (Nivel Básico, Intermedio, Avanzado o Master Pass).
              </p>
              <p>
                Si por cualquier motivo consideras que el curso no cumplió con tus expectativas:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>Ingresas al portal oficial de reembolso de Hotmart (<em>refund.hotmart.com</em>).</li>
                <li>Colocas el código de transacción de tu compra recibido por correo electrónico.</li>
                <li>El sistema de Hotmart aprueba la devolución del 100% de tu dinero a tu tarjeta o método de pago original en un plazo estándar de 1 a 5 días hábiles, sin necesidad de dar explicaciones ni justificaciones.</li>
              </ol>
            </>
          )}

          {activeModal === 'cookies' && (
            <>
              <h4 className="font-bold text-slate-900 text-sm">¿Qué cookies utilizamos?</h4>
              <p>
                Este sitio web utiliza cookies técnicas indispensables para el funcionamiento y optimización del embudo:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Cookies Técnicas / Esenciales:</strong> Necesarias para recordar tus preferencias de navegación, el estado del formulario y la entrega de la plantilla descargable.</li>
                <li><strong>Cookies Analíticas / Rendimiento (Opcionales):</strong> Permiten medir el volumen de visitas y evaluar los tiempos de carga para optimizar el rendimiento sin rastrear datos biométricos ni perfiles publicitarios invasivos.</li>
              </ul>
              <p>
                Puedes cambiar tus preferencias o revocar tu consentimiento en cualquier momento haciendo clic en "Preferencias de Cookies" en el pie de página.
              </p>
            </>
          )}

          {activeModal === 'delete-data' && (
            <div className="space-y-4">
              <p>
                En cumplimiento del principio de transparencia y del <strong>Derecho al Olvido (RGPD / Habeas Data)</strong>, cualquier usuario registrado en nuestra base de datos puede solicitar la eliminación inmediata de todos sus datos personales (nombre, correo, teléfono e historial).
              </p>

              {deleteMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{deleteMessage}</span>
                </div>
              )}

              {deleteError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{deleteError}</span>
                </div>
              )}

              <form onSubmit={handleDeleteRequest} className="space-y-3 pt-2">
                <label className="block font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Ingresa el correo con el que te registraste:
                </label>
                <input
                  type="email"
                  required
                  placeholder="tu.correo@ejemplo.com"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={deleteLoading}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-60"
                >
                  {deleteLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Procesando eliminación...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Purgar mis datos de la base de datos</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{config.companyName}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
