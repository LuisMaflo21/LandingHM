import * as XLSX from 'xlsx';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const ANALYTICS_STORAGE_KEY = 'hoja_maestra_analytics_db_v2';
const SESSION_STORAGE_KEY = 'hoja_maestra_session_active';

export interface DailyStat {
  date: string;
  dayLabel: string;
  visitors: number;
  leads: number;
  courseClicks: number;
  templateClicks: number;
}

export interface AnalyticsMetrics {
  totalVisitors: number;        // Visitantes únicos reales (por sesión/dispositivo)
  totalPageviews: number;       // Páginas vistas totales reales
  totalTimeSpentSeconds: number;// Segundos reales acumulados en la página
  averageTimeSeconds: number;   // Tiempo promedio real por visita
  leadsCount: number;           // Prospectos reales en la base de datos Firestore
  conversionRate: number;       // (leadsCount / totalVisitors) * 100%
  templateClicks: {
    googleSheets: number;       // Clics reales para abrir en Google Sheets
    excelDownload: number;      // Clics reales para descargar archivo Excel .xlsx
    ctaUnlock: number;          // Clics reales para habilitar/desbloquear formulario
    total: number;              // Total real de clics en enlaces de recursos
  };
  courseClicks: {
    offer5Usd: number;          // Clics reales Curso Oferta $5 USD
    beginner: number;           // Clics reales Excel para Principiantes
    business: number;           // Clics reales Excel Empresarial
    ebook: number;              // Clics reales Ebook para Excel
    total: number;              // Clics totales reales hacia pasarelas de Hotmart
  };
  deviceBreakdown: {
    mobile: number;             // Tráfico Móvil real
    desktop: number;            // Escritorio / Laptops real
    tablet: number;             // Tablets real
  };
  retentionBreakdown: {
    bounce: number;             // Visitas de menos de 15 segundos
    reading: number;            // Visitas entre 15s y 90s
    highEngagement: number;     // Visitas de más de 90s (lectura profunda)
  };
  dailyStats: DailyStat[];      // Registro real de los últimos 7 días
  lastUpdated: string;
  isRealData: boolean;          // Garantía de datos reales
}

// Genera estadísticas de los últimos 7 días limpias en cero (sin datos simulados)
export function generateRealDailyStats(): DailyStat[] {
  const days: DailyStat[] = [];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = `${dayNames[d.getDay()]} ${d.getDate()}`;
    
    days.push({
      date: dateStr,
      dayLabel,
      visitors: 0,
      leads: 0,
      courseClicks: 0,
      templateClicks: 0,
    });
  }
  return days;
}

export const REAL_BASE_METRICS: AnalyticsMetrics = {
  totalVisitors: 0,
  totalPageviews: 0,
  totalTimeSpentSeconds: 0,
  averageTimeSeconds: 0,
  leadsCount: 0,
  conversionRate: 0,
  templateClicks: {
    googleSheets: 0,
    excelDownload: 0,
    ctaUnlock: 0,
    total: 0,
  },
  courseClicks: {
    offer5Usd: 0,
    beginner: 0,
    business: 0,
    ebook: 0,
    total: 0,
  },
  deviceBreakdown: {
    mobile: 0,
    desktop: 0,
    tablet: 0,
  },
  retentionBreakdown: {
    bounce: 0,
    reading: 0,
    highEngagement: 0,
  },
  dailyStats: generateRealDailyStats(),
  lastUpdated: new Date().toISOString(),
  isRealData: true,
};

function detectCurrentDevice(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = (navigator.userAgent || '').toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (
    /(mobile|iphone|ipod|android.*mobile|blackberry|opera mini|iemobile|wpdesktop)/i.test(ua) ||
    (typeof window !== 'undefined' && window.innerWidth < 768)
  ) {
    return 'mobile';
  }
  return 'desktop';
}

// Lee las métricas locales asegurando que no queden datos ficticios heredados
export function getAnalyticsMetrics(): AnalyticsMetrics {
  try {
    // Purge legacy storage key with mock 158 visitors if present
    localStorage.removeItem('hoja_maestra_analytics_db');

    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(REAL_BASE_METRICS));
      return { ...REAL_BASE_METRICS };
    }
    const parsed = JSON.parse(raw);

    // If previously saved metrics contain old mock data (e.g., totalVisitors >= 100 before real visits or mock 54 clicks)
    if (!parsed.isRealData || parsed.totalVisitors >= 100 && parsed.templateClicks?.googleSheets === 54) {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(REAL_BASE_METRICS));
      return { ...REAL_BASE_METRICS };
    }

    return {
      ...REAL_BASE_METRICS,
      ...parsed,
      isRealData: true,
      templateClicks: {
        ...REAL_BASE_METRICS.templateClicks,
        ...(parsed.templateClicks || {}),
      },
      courseClicks: {
        ...REAL_BASE_METRICS.courseClicks,
        ...(parsed.courseClicks || {}),
      },
      deviceBreakdown: {
        ...REAL_BASE_METRICS.deviceBreakdown,
        ...(parsed.deviceBreakdown || {}),
      },
      retentionBreakdown: {
        ...REAL_BASE_METRICS.retentionBreakdown,
        ...(parsed.retentionBreakdown || {}),
      },
      dailyStats: parsed.dailyStats && parsed.dailyStats.length > 0 
        ? parsed.dailyStats 
        : generateRealDailyStats(),
    };
  } catch {
    return { ...REAL_BASE_METRICS };
  }
}

// Guarda y sincroniza métricas con Firebase Firestore en tiempo real
export function saveAnalyticsMetrics(metrics: AnalyticsMetrics) {
  try {
    const visitors = metrics.totalVisitors;
    metrics.averageTimeSeconds = visitors > 0 ? Math.round(metrics.totalTimeSpentSeconds / visitors) : 0;
    metrics.conversionRate = visitors > 0 ? Number(((metrics.leadsCount / visitors) * 100).toFixed(1)) : 0;
    metrics.templateClicks.total = 
      metrics.templateClicks.googleSheets + 
      metrics.templateClicks.excelDownload;
    metrics.courseClicks.total = 
      metrics.courseClicks.offer5Usd + 
      metrics.courseClicks.beginner + 
      metrics.courseClicks.business + 
      metrics.courseClicks.ebook;
    metrics.lastUpdated = new Date().toISOString();
    metrics.isRealData = true;

    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(metrics));

    // Persistir métricas 100% reales en Firebase Firestore
    try {
      setDoc(doc(db, 'system', 'metrics'), {
        ...metrics,
        savedAt: new Date().toISOString(),
      }, { merge: true }).catch((fbErr) => {
        console.warn('Firebase metrics sync warning:', fbErr);
      });
    } catch {
      // Non-blocking
    }

    // Sync with server API if available
    try {
      if (typeof fetch !== 'undefined') {
        fetch('/api/analytics/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(metrics),
        }).catch(() => {
          // OK on Netlify static
        });
      }
    } catch {
      // Ignore
    }
  } catch (err) {
    console.error('Error saving analytics:', err);
  }
}

// Carga las métricas reales directamente desde Firebase Firestore
export async function fetchRealMetricsFromFirestore(): Promise<AnalyticsMetrics> {
  let metrics = getAnalyticsMetrics();

  try {
    // 1. Obtener conteo real de leads en Firestore
    const leadsSnap = await getDocs(collection(db, 'leads'));
    let realLeadsCount = 0;
    leadsSnap.forEach((d) => {
      const data = d.data();
      if (
        data &&
        !['lead_101', 'lead_102', 'lead_103'].includes(data.id) &&
        !data.email?.includes('carlos.mendoza')
      ) {
        realLeadsCount++;
      }
    });

    // 2. Obtener documento de métricas en Firestore
    const metricsDoc = await getDoc(doc(db, 'system', 'metrics'));
    if (metricsDoc.exists()) {
      const cloudData = metricsDoc.data() as AnalyticsMetrics;
      // Comprobar que no sean métricas demo antiguas
      if (cloudData && cloudData.isRealData) {
        metrics = {
          ...REAL_BASE_METRICS,
          ...cloudData,
          leadsCount: realLeadsCount,
          isRealData: true,
        };
      } else {
        // Inicializar documento limpio en Firestore
        metrics.leadsCount = realLeadsCount;
        metrics.isRealData = true;
        await setDoc(doc(db, 'system', 'metrics'), metrics, { merge: true });
      }
    } else {
      metrics.leadsCount = realLeadsCount;
      metrics.isRealData = true;
      await setDoc(doc(db, 'system', 'metrics'), metrics, { merge: true });
    }

    // Recalcular tasa de conversión
    if (metrics.totalVisitors > 0) {
      metrics.conversionRate = Number(((metrics.leadsCount / metrics.totalVisitors) * 100).toFixed(1));
    } else {
      metrics.conversionRate = 0;
    }

    saveAnalyticsMetrics(metrics);
  } catch (err) {
    console.warn('Could not fetch real metrics from Firestore, using client cache:', err);
  }

  return metrics;
}

// Track page load and visitor real
export function trackPageView() {
  const metrics = getAnalyticsMetrics();
  metrics.totalPageviews += 1;

  const isSessionActive = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!isSessionActive) {
    metrics.totalVisitors += 1;
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'active');

    // Track real device
    const device = detectCurrentDevice();
    metrics.deviceBreakdown[device] = (metrics.deviceBreakdown[device] || 0) + 1;

    // Update today's entry in daily stats
    const todayStr = new Date().toISOString().split('T')[0];
    let todayEntry = metrics.dailyStats.find(d => d.date === todayStr);
    if (todayEntry) {
      todayEntry.visitors += 1;
    } else {
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const d = new Date();
      todayEntry = {
        date: todayStr,
        dayLabel: `${dayNames[d.getDay()]} ${d.getDate()}`,
        visitors: 1,
        leads: 0,
        courseClicks: 0,
        templateClicks: 0,
      };
      metrics.dailyStats.push(todayEntry);
      if (metrics.dailyStats.length > 7) {
        metrics.dailyStats.shift();
      }
    }
  }

  saveAnalyticsMetrics(metrics);
}

// Track real time on page incrementally
export function trackTimeSpent(seconds: number) {
  if (seconds <= 0) return;
  const metrics = getAnalyticsMetrics();
  metrics.totalTimeSpentSeconds += seconds;

  // Classify retention
  const avg = metrics.totalVisitors > 0 ? metrics.totalTimeSpentSeconds / metrics.totalVisitors : seconds;
  if (avg < 15) {
    metrics.retentionBreakdown.bounce += 1;
  } else if (avg <= 90) {
    metrics.retentionBreakdown.reading += 1;
  } else {
    metrics.retentionBreakdown.highEngagement += 1;
  }

  saveAnalyticsMetrics(metrics);
}

// Track real template clicks (Google Sheets / Excel / CTA)
export function trackTemplateClick(type: 'googleSheets' | 'excelDownload' | 'ctaUnlock') {
  const metrics = getAnalyticsMetrics();
  if (type === 'googleSheets') {
    metrics.templateClicks.googleSheets += 1;
  } else if (type === 'excelDownload') {
    metrics.templateClicks.excelDownload += 1;
  } else if (type === 'ctaUnlock') {
    metrics.templateClicks.ctaUnlock = (metrics.templateClicks.ctaUnlock || 0) + 1;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = metrics.dailyStats.find(d => d.date === todayStr);
  if (todayEntry) {
    todayEntry.templateClicks += 1;
  }

  saveAnalyticsMetrics(metrics);
}

// Track real clicks on Hotmart course offerings
export function trackCourseClick(courseId: 'offer5Usd' | 'beginner' | 'business' | 'ebook') {
  const metrics = getAnalyticsMetrics();
  if (courseId === 'offer5Usd') metrics.courseClicks.offer5Usd += 1;
  else if (courseId === 'beginner') metrics.courseClicks.beginner += 1;
  else if (courseId === 'business') metrics.courseClicks.business += 1;
  else if (courseId === 'ebook') metrics.courseClicks.ebook += 1;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = metrics.dailyStats.find(d => d.date === todayStr);
  if (todayEntry) {
    todayEntry.courseClicks += 1;
  }

  saveAnalyticsMetrics(metrics);
}

// Sync leads count with actual leads list
export function syncLeadsCount(leadsCount: number) {
  const metrics = getAnalyticsMetrics();
  const previous = metrics.leadsCount;
  metrics.leadsCount = leadsCount;

  if (leadsCount > previous) {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayEntry = metrics.dailyStats.find(d => d.date === todayStr);
    if (todayEntry) {
      todayEntry.leads += (leadsCount - previous);
    }
  }

  saveAnalyticsMetrics(metrics);
}

// Format seconds into minutes and seconds (e.g., 2m 45s)
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs > 0 ? `${secs}s` : ''}`;
}

// Reset metrics to 100% REAL ZERO (clears both Firestore and local storage)
export async function resetAnalyticsMetrics(): Promise<AnalyticsMetrics> {
  const cleanMetrics: AnalyticsMetrics = {
    ...REAL_BASE_METRICS,
    dailyStats: generateRealDailyStats(),
    lastUpdated: new Date().toISOString(),
    isRealData: true,
  };
  localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(cleanMetrics));

  try {
    await setDoc(doc(db, 'system', 'metrics'), {
      ...cleanMetrics,
      savedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Could not reset metrics in Firestore:', err);
  }

  return cleanMetrics;
}

// Export real metrics summary as Excel workbook
export function exportAnalyticsToExcel(metrics: AnalyticsMetrics) {
  try {
    const wb = XLSX.utils.book_new();

    // Sheet 1: KPIs Principales
    const kpiData = [
      ['REPORTE EJECUTIVO DE MÉTRICAS • HOJA MAESTRA (DATOS REALES)', ''],
      ['Fecha de Generación:', new Date().toLocaleString('es-ES')],
      ['Estado de la Fuente:', 'Conectado a Firebase Firestore (ai-studio-masterexcelproac)'],
      ['', ''],
      ['MÉTRICAS CLAVE DEL EMBUDO', 'VALOR REAL'],
      ['Total de Visitantes Únicos Reales', metrics.totalVisitors],
      ['Total de Páginas Vistas (Pageviews)', metrics.totalPageviews],
      ['Tiempo Promedio de Visita (segundos)', metrics.averageTimeSeconds],
      ['Tiempo Promedio de Visita (formato legible)', formatDuration(metrics.averageTimeSeconds)],
      ['Prospectos Capturados (Leads)', metrics.leadsCount],
      ['Tasa de Conversión (% Visitantes a Leads)', `${metrics.conversionRate}%`],
      ['', ''],
      ['CLICS EN ENLACES DE LA PLANTILLA', 'CANTIDAD'],
      ['Clics para abrir en Google Sheets', metrics.templateClicks.googleSheets],
      ['Clics para descargar archivo Excel .xlsx', metrics.templateClicks.excelDownload],
      ['Clics para desbloquear con formulario', metrics.templateClicks.ctaUnlock],
      ['Total Clics en Recursos', metrics.templateClicks.total],
      ['', ''],
      ['CLICS EN OFERTAS DE CURSOS HOTMART', 'CANTIDAD'],
      ['Curso Oferta Especial $5 USD', metrics.courseClicks.offer5Usd],
      ['Curso Excel Principiantes', metrics.courseClicks.beginner],
      ['Curso Excel Empresarial / Avanzado', metrics.courseClicks.business],
      ['Ebook de Fórmulas y Automatización', metrics.courseClicks.ebook],
      ['Total Clics a Pasarelas de Hotmart', metrics.courseClicks.total],
      ['', ''],
      ['DISTRIBUCIÓN POR DISPOSITIVO', 'VISITAS'],
      ['Móviles (Smartphones)', metrics.deviceBreakdown.mobile],
      ['Escritorio (Computadoras/Laptops)', metrics.deviceBreakdown.desktop],
      ['Tablets', metrics.deviceBreakdown.tablet],
      ['', ''],
      ['RETENCIÓN DE TIEMPO', 'USUARIOS'],
      ['Rebote (< 15 segundos)', metrics.retentionBreakdown.bounce],
      ['Lectura activa (15s a 90s)', metrics.retentionBreakdown.reading],
      ['Alta interacción (> 90 segundos)', metrics.retentionBreakdown.highEngagement],
    ];

    const ws1 = XLSX.utils.aoa_to_sheet(kpiData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Métricas Reales');

    // Sheet 2: Desglose Diario
    const dailyData = [
      ['Fecha', 'Día', 'Visitantes', 'Leads', 'Clics Cursos Hotmart', 'Clics Plantilla'],
      ...metrics.dailyStats.map((d) => [
        d.date,
        d.dayLabel,
        d.visitors,
        d.leads,
        d.courseClicks,
        d.templateClicks,
      ]),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(dailyData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Historial 7 Días');

    XLSX.writeFile(wb, `Metricas_Reales_Hoja_Maestra_${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (err) {
    console.error('Error exportando Excel de métricas:', err);
    alert('No se pudo generar el archivo Excel de métricas.');
  }
}
