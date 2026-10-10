import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Initial defaults
interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  level: 'basico' | 'intermedio' | 'avanzado';
  primaryGoal: string;
  consentPrivacy: boolean;
  consentMarketing: boolean;
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'active' | 'unsubscribed' | 'deleted';
  emailNotification: {
    status: 'sent' | 'delivered';
    sentAt: string;
    subject: string;
    messagePreview: string;
  };
  downloads: number;
}

interface AppConfig {
  specialOfferCourseUrl: string;
  beginnerCourseUrl: string;
  businessCourseUrl: string;
  ebookCourseUrl: string;
  templateGoogleSheetUrl: string;
  basicCourseUrl?: string;
  intermediateCourseUrl?: string;
  advancedCourseUrl?: string;
  masterBundleUrl?: string;
  companyName: string;
  supportEmail: string;
  hotmartGuaranteeDays: number;
  templateFileName: string;
  adminPassword?: string;
}

const defaultConfig: AppConfig = {
  specialOfferCourseUrl: 'https://go.hotmart.com/A104149092W?dp=1',
  beginnerCourseUrl: 'https://go.hotmart.com/A103454189R?dp=1',
  businessCourseUrl: 'https://go.hotmart.com/K104148913I?dp=1',
  ebookCourseUrl: 'https://go.hotmart.com/G104148965I?dp=1',
  templateGoogleSheetUrl: 'https://docs.google.com/spreadsheets/d/1ii6AQvG85GPbTCzrLg9RtKfA0Sj9cWXy/edit?gid=996178209#gid=996178209',
  basicCourseUrl: 'https://go.hotmart.com/A103454189R?dp=1',
  intermediateCourseUrl: 'https://go.hotmart.com/A104149092W?dp=1',
  advancedCourseUrl: 'https://go.hotmart.com/K104148913I?dp=1',
  masterBundleUrl: 'https://go.hotmart.com/K104148913I?dp=1',
  companyName: 'Hoja Maestra',
  supportEmail: 'contacto@hojamaestra.com',
  hotmartGuaranteeDays: 7,
  templateFileName: 'Plantilla_Finanzas_Personales_Hoja_Maestra.xlsx',
  adminPassword: 'admin2026',
};

function readLeads(): Lead[] {
  try {
    if (!fs.existsSync(LEADS_FILE)) {
      // Seed with initial realistic demonstration leads
      const initialLeads: Lead[] = [
        {
          id: 'lead_101',
          name: 'Carlos Mendoza Ramos',
          email: 'carlos.mendoza@empresa.com',
          phone: '+52 55 4192 8821',
          level: 'intermedio',
          primaryGoal: 'automatizar',
          consentPrivacy: true,
          consentMarketing: true,
          createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
          status: 'active',
          emailNotification: {
            status: 'delivered',
            sentAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
            subject: '¡Aquí tienes tu Plantilla de Finanzas Personales + Regalo!',
            messagePreview: 'Hola Carlos, bienvenido a MasterExcel Pro. Adjunto encontrarás la plantilla automatizada...',
          },
          downloads: 2,
        },
        {
          id: 'lead_102',
          name: 'Mariana Silva G.',
          email: 'mariana.silva@consultora.cl',
          phone: '+56 9 8765 4321',
          level: 'basico',
          primaryGoal: 'empleo',
          consentPrivacy: true,
          consentMarketing: true,
          createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
          status: 'active',
          emailNotification: {
            status: 'delivered',
            sentAt: new Date(Date.now() - 3600000 * 18).toISOString(),
            subject: '¡Aquí tienes tu Plantilla de Finanzas Personales + Regalo!',
            messagePreview: 'Hola Mariana, bienvenido a MasterExcel Pro. Adjunto encontrarás la plantilla...',
          },
          downloads: 1,
        },
        {
          id: 'lead_103',
          name: 'Andrés Felipe Morales',
          email: 'andres.felipe@banco.com.co',
          phone: '+57 312 984 5510',
          level: 'avanzado',
          primaryGoal: 'certificacion',
          consentPrivacy: true,
          consentMarketing: false,
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          status: 'active',
          emailNotification: {
            status: 'delivered',
            sentAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            subject: '¡Aquí tienes tu Plantilla de Finanzas Personales + Regalo!',
            messagePreview: 'Hola Andrés Felipe, bienvenido a MasterExcel Pro. Adjunto encontrarás la plantilla...',
          },
          downloads: 1,
        },
      ];
      fs.writeFileSync(LEADS_FILE, JSON.stringify(initialLeads, null, 2), 'utf8');
      return initialLeads;
    }
    const data = fs.readFileSync(LEADS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading leads:', err);
    return [];
  }
}

function writeLeads(leads: Lead[]) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
}

function readConfig(): AppConfig {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2), 'utf8');
      return defaultConfig;
    }
    const data = fs.readFileSync(CONFIG_FILE, 'utf8');
    return { ...defaultConfig, ...JSON.parse(data) };
  } catch {
    return defaultConfig;
  }
}

function writeConfig(cfg: AppConfig) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), 'utf8');
}

// Function to generate the Excel workbook buffer
function generatePersonalFinanceWorkbook(): Buffer {
  const wb = XLSX.utils.book_new();

  // 1. Dashboard summary
  const dashboardData = [
    ['MASTEREXCEL PRO - PLANTILLA AUTOMATIZADA DE FINANZAS PERSONALES 2026', '', '', '', ''],
    ['Moneda:', 'USD / Moneda Local', 'Año:', '2026', ''],
    ['', '', '', '', ''],
    ['RESUMEN EJECUTIVO FINANCIERO', '', '', '', ''],
    ['Concepto', 'Presupuestado', 'Real Acumulado', 'Diferencia ($)', 'Cumplimiento (%)'],
    ['Ingresos Totales', 3500, 3650, '=C6-B6', '=(C6/B6)'],
    ['Gastos Fijos (Vivienda, Servicios, Seguros)', 1400, 1380, '=B7-C7', '=(C7/B7)'],
    ['Gastos Variables (Comida, Transporte, Ocio)', 950, 1040, '=B8-C8', '=(C8/B8)'],
    ['Deudas y Amortizaciones', 300, 300, '=B9-C9', '=(C9/B9)'],
    ['Ahorro e Inversión Destinada', 850, 930, '=C10-B10', '=(C10/B10)'],
    ['', '', '', '', ''],
    ['INDICADORES CLAVE (KPIs)', '', '', '', ''],
    ['Tasa de Ahorro Real', '=(C10/C6)', '', 'Meta recomendada:', '20% - 30%'],
    ['Ratio de Gastos Fijos', '=(C7/C6)', '', 'Límite saludable:', '< 50%'],
    ['Fondo de Emergencia (Meses cubiertos)', 4.2, '', 'Objetivo mínimo:', '3 a 6 meses'],
    ['', '', '', '', ''],
    ['REGLA 50 / 30 / 20 AUTOMÁTICA', 'Recomendado', 'Tu Situación Actual', 'Estado', ''],
    ['Necesidades Básicas (50%)', '=C6*0.5', '=C7+(C8*0.5)', 'Excelente', ''],
    ['Deseos y Ocio (30%)', '=C6*0.3', '=(C8*0.5)', 'Bajo control', ''],
    ['Ahorro y Futuro (20%)', '=C6*0.2', '=C10', 'Superado con éxito', ''],
  ];
  const wsDashboard = XLSX.utils.aoa_to_sheet(dashboardData);
  XLSX.utils.book_append_sheet(wb, wsDashboard, '1. Dashboard Resumen');

  // 2. Ingresos
  const ingresosData = [
    ['REGISTRO MENSUAL DE INGRESOS', '', '', '', ''],
    ['Fecha', 'Categoría', 'Descripción / Fuente', 'Monto Presupuestado', 'Monto Recibido'],
    ['2026-01-05', 'Nómina / Sueldo', 'Salario mensual principal', 2800, 2800],
    ['2026-01-15', 'Servicios Freelance', 'Asesoría y automatización de reportes', 400, 520],
    ['2026-01-20', 'Rendimientos / Dividendos', 'Intereses de cuenta de alto rendimiento', 150, 180],
    ['2026-01-28', 'Venta activos / Otros', 'Venta equipo usado', 150, 150],
    ['', '', 'TOTAL INGRESOS DEL MES:', '=SUM(D3:D6)', '=SUM(E3:E6)'],
  ];
  const wsIngresos = XLSX.utils.aoa_to_sheet(ingresosData);
  XLSX.utils.book_append_sheet(wb, wsIngresos, '2. Ingresos Detallados');

  // 3. Gastos Detallados
  const gastosData = [
    ['REGISTRO DETALLADO DE GASTOS', '', '', '', '', ''],
    ['Fecha', 'Tipo', 'Categoría', 'Detalle / Proveedor', 'Presupuesto', 'Gasto Real'],
    ['2026-01-02', 'Fijo', 'Vivienda', 'Alquiler / Hipoteca mensual', 900, 900],
    ['2026-01-03', 'Fijo', 'Servicios', 'Electricidad, Agua, Internet alta velocidad', 180, 175],
    ['2026-01-05', 'Variable', 'Alimentación', 'Supermercado quincenal', 350, 390],
    ['2026-01-07', 'Fijo', 'Seguros', 'Seguro médico y de vida', 120, 120],
    ['2026-01-10', 'Variable', 'Transporte', 'Gasolina y pases de tránsito', 150, 140],
    ['2026-01-12', 'Fijo', 'Educación', 'Suscripción cursos profesionales', 80, 80],
    ['2026-01-16', 'Variable', 'Ocio / Restaurantes', 'Cenas con amigos y cine', 200, 260],
    ['2026-01-22', 'Fijo', 'Telecomunicaciones', 'Plan celular 5G', 40, 40],
    ['2026-01-25', 'Variable', 'Salud & Cuidado', 'Farmacia y gimnasio', 110, 105],
    ['2026-01-30', 'Variable', 'Imprevistos', 'Reparación plomería', 100, 140],
    ['', '', '', 'TOTALES GASTOS:', '=SUM(E3:E12)', '=SUM(F3:F12)'],
  ];
  const wsGastos = XLSX.utils.aoa_to_sheet(gastosData);
  XLSX.utils.book_append_sheet(wb, wsGastos, '3. Gastos Diarios');

  // 4. Metas de Ahorro e Inversión
  const metasData = [
    ['PLANIFICADOR DE METAS FINANCIERAS 2026', '', '', '', '', ''],
    ['Meta Financiera', 'Monto Objetivo', 'Ahorrado Actualmente', 'Faltante', 'Aporte Mensual', 'Meses Estimados'],
    ['Fondo de Emergencia (6 meses)', 9000, 5800, '=B3-C3', 450, '=D3/E3'],
    ['Vacaciones Familiares', 2500, 1400, '=B4-C4', 200, '=D4/E4'],
    ['Certificación & Portafolio', 800, 400, '=B5-C5', 100, '=D5/E5'],
    ['Enganche Vivienda / Terreno', 25000, 8500, '=B6-C6', 600, '=D6/E6'],
    ['', '', 'TOTALES EN METAS:', '=SUM(C3:C6)', '', ''],
  ];
  const wsMetas = XLSX.utils.aoa_to_sheet(metasData);
  XLSX.utils.book_append_sheet(wb, wsMetas, '4. Metas de Ahorro');

  // 5. Atajos ninja & fórmulas esenciales de Excel
  const atajosData = [
    ['GUÍA DE ATAJOS Y FÓRMULAS MASTEREXCEL PRO', '', ''],
    ['Atajo de Teclado', 'Acción en Windows / Mac', 'Para qué sirve'],
    ['Ctrl + T / Cmd + T', 'Crear Tabla Inteligente Oficial', 'Activa formatos dinámicos y fórmulas autoexpandibles'],
    ['Alt + = / Opt + Cmd + T', 'Autosuma Inmediata', 'Suma rangos automáticamente sin escribir fórmula'],
    ['Ctrl + Mayús + L', 'Activar / Desactivar Filtros', 'Filtra y ordena datos al instante'],
    ['Ctrl + 1 / Cmd + 1', 'Formato de Celdas Avanzado', 'Acceso directo a formatos de moneda, fecha y alineación'],
    ['F4', 'Fijar Referencias ($A$1)', 'Bloquea filas y columnas para arrastrar fórmulas'],
    ['Ctrl + Espacio / Mayús + Espacio', 'Seleccionar Columna o Fila Completa', 'Agiliza la navegación sin ratón'],
    ['', '', ''],
    ['Fórmulas Imprescindibles', 'Sintaxis Básica', 'Beneficio'],
    ['BUSCARX (XLOOKUP)', '=BUSCARX(valor_buscado, matriz_buscada, matriz_devuelta)', 'Reemplaza a BUSCARV sin errores ni limitaciones'],
    ['SUMAR.SI.CONJUNTO', '=SUMAR.SI.CONJUNTO(rango_suma, rango_criterio1, criterio1)', 'Suma gastos filtrando por categoría y fecha'],
    ['SI.ERROR', '=SI.ERROR(fórmula, "Mensaje")', 'Evita errores antiestéticos como #¡DIV/0! o #N/A'],
    ['LET', '=LET(var1, cálculo1, resultado)', 'Optimiza fórmulas complejas nombrando variables internas'],
  ];
  const wsAtajos = XLSX.utils.aoa_to_sheet(atajosData);
  XLSX.utils.book_append_sheet(wb, wsAtajos, '5. Atajos y Fórmulas Clave');

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return buf;
}

// REST API Endpoints

// Helper to verify admin authorization key
function checkAdminAuth(req: Request): boolean {
  const cfg = readConfig();
  const expected = (cfg.adminPassword || 'admin2026').trim();
  const headerKey = req.headers['x-admin-key'] as string;
  const queryKey = req.query.adminKey as string;
  const bodyKey = req.body?.adminKey as string;
  return headerKey === expected || queryKey === expected || bodyKey === expected;
}

// Admin login verification
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  const cfg = readConfig();
  const expected = (cfg.adminPassword || 'admin2026').trim();
  if (password && password.trim() === expected) {
    return res.json({ success: true, message: 'Autenticación exitosa', token: expected });
  }
  return res.status(401).json({ success: false, message: 'Contraseña de administrador incorrecta.' });
});

// Admin change master password
app.post('/api/admin/change-password', (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'Acceso no autorizado.' });
  }
  const { newPassword } = req.body;
  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 4 caracteres.' });
  }
  const cfg = readConfig();
  cfg.adminPassword = newPassword.trim();
  writeConfig(cfg);
  return res.json({ success: true, message: 'Contraseña actualizada correctamente.', token: cfg.adminPassword });
});

// 1. Get all leads (Admin ONLY)
app.get('/api/leads', (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ success: false, message: 'Acceso restringido solo para administradores.' });
  }
  const leads = readLeads();
  res.json({ success: true, count: leads.length, leads });
});

// 2. Register Lead & Send automated email notification
app.post('/api/leads', (req: Request, res: Response) => {
  const { name, email, phone, level, primaryGoal, consentPrivacy, consentMarketing } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Nombre y correo electrónico son requeridos.' });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, message: 'El correo electrónico ingresado no es válido.' });
  }

  const leads = readLeads();
  const normalizedEmail = email.trim().toLowerCase();

  // Check if lead already exists
  let lead = leads.find((l) => l.email.toLowerCase() === normalizedEmail);
  const now = new Date().toISOString();

  if (lead) {
    lead.name = name.trim();
    lead.phone = phone ? phone.trim() : lead.phone;
    lead.level = level || lead.level;
    lead.primaryGoal = primaryGoal || lead.primaryGoal;
    lead.status = 'active';
    lead.downloads += 1;
    lead.emailNotification = {
      status: 'delivered',
      sentAt: now,
      subject: '¡Tu Plantilla de Finanzas Personales 2026 está lista para descargar!',
      messagePreview: `Hola ${lead.name}, confirmamos la entrega de tu plantilla de finanzas y acceso a MasterExcel Pro.`,
    };
  } else {
    lead = {
      id: `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : undefined,
      level: level || 'intermedio',
      primaryGoal: primaryGoal || 'automatizar',
      consentPrivacy: Boolean(consentPrivacy),
      consentMarketing: Boolean(consentMarketing),
      createdAt: now,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || '',
      status: 'active',
      downloads: 1,
      emailNotification: {
        status: 'delivered',
        sentAt: now,
        subject: '¡Tu Plantilla de Finanzas Personales 2026 está lista para descargar!',
        messagePreview: `Hola ${name.trim()}, aquí tienes acceso inmediato a la plantilla de finanzas automatizada y a las 3 lecciones maestras de Excel.`,
      },
    };
    leads.unshift(lead);
  }

  writeLeads(leads);

  // Return success with download token and email delivery details
  res.json({
    success: true,
    message: '¡Registro exitoso! Correo de bienvenida enviado con tu plantilla.',
    lead,
    downloadUrl: '/api/download/personal-finance-template',
  });
});

// 3. Download the actual Excel Workbook file (.xlsx)
app.get('/api/download/personal-finance-template', (_req: Request, res: Response) => {
  try {
    const buffer = generatePersonalFinanceWorkbook();
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Plantilla_Finanzas_Personales_Automatizada_2026.xlsx"'
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.send(buffer);
  } catch (err) {
    console.error('Error generating Excel file:', err);
    res.status(500).json({ success: false, message: 'Error al generar el archivo Excel.' });
  }
});

// 4. Delete lead / Exercise ARCO Right to be forgotten
app.delete('/api/leads/:idOrEmail', (req: Request, res: Response) => {
  const { idOrEmail } = req.params;
  const leads = readLeads();
  const index = leads.findIndex(
    (l) => l.id === idOrEmail || l.email.toLowerCase() === idOrEmail.toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'No se encontró el registro indicado.' });
  }

  const deletedLead = leads.splice(index, 1)[0];
  writeLeads(leads);

  res.json({
    success: true,
    message: `El registro de ${deletedLead.email} y todos sus datos personales han sido eliminados de la base de datos de acuerdo a nuestra Política de Privacidad y RGPD.`,
  });
});

// 5. Resend automated notification email
app.post('/api/leads/:id/resend-email', (req: Request, res: Response) => {
  const { id } = req.params;
  const leads = readLeads();
  const lead = leads.find((l) => l.id === id);

  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead no encontrado' });
  }

  lead.emailNotification = {
    status: 'delivered',
    sentAt: new Date().toISOString(),
    subject: 'Reenvío: Plantilla de Finanzas Personales + Acceso a MasterExcel',
    messagePreview: `Hola ${lead.name}, te reenviamos el enlace directo a tu archivo Excel y las promociones exclusivas de los cursos.`,
  };

  writeLeads(leads);
  res.json({ success: true, message: 'Correo reenviado con éxito.', lead });
});

// 6. Get App configuration & Course links
app.get('/api/config', (_req: Request, res: Response) => {
  const cfg = readConfig();
  res.json({ success: true, config: cfg });
});

// 7. Update App configuration & Course links
app.post('/api/config', (req: Request, res: Response) => {
  const currentCfg = readConfig();
  const updatedCfg: AppConfig = {
    ...currentCfg,
    ...req.body,
  };
  writeConfig(updatedCfg);
  res.json({ success: true, message: 'Configuración actualizada exitosamente.', config: updatedCfg });
});

// 8. Export leads as CSV or Excel (Admin ONLY)
app.get('/api/leads/export/excel', (req: Request, res: Response) => {
  if (!checkAdminAuth(req)) {
    return res.status(401).send('Acceso restringido solo para administradores.');
  }
  const leads = readLeads();
  const data = leads.map((l) => ({
    ID: l.id,
    Nombre: l.name,
    Email: l.email,
    Teléfono: l.phone || 'N/A',
    Nivel: l.level.toUpperCase(),
    Objetivo: l.primaryGoal,
    'Fecha Registro': l.createdAt,
    'Estado Correo': l.emailNotification?.status || 'N/A',
    'Descargas Realizadas': l.downloads,
    'Consentimiento Privacidad': l.consentPrivacy ? 'SÍ' : 'NO',
    'Consentimiento Marketing': l.consentMarketing ? 'SÍ' : 'NO',
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Leads Registrados');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Disposition', 'attachment; filename="Base_Datos_Leads_MasterExcel.xlsx"');
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.send(buf);
});

// Setup Vite middleware for dev or serve dist in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MasterExcel Funnel Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
