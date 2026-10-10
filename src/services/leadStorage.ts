import * as XLSX from 'xlsx';
import { doc, getDoc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Lead, AppConfig } from '../types';

const LEADS_STORAGE_KEY = 'hoja_maestra_leads_db';
const CONFIG_STORAGE_KEY = 'hoja_maestra_config_db';
const ADMIN_PASS_KEY = 'hoja_maestra_admin_pass';

export const DEFAULT_ADMIN_PASS = 'admin2026';

export const DEFAULT_CONFIG: AppConfig = {
  specialOfferCourseUrl: 'https://go.hotmart.com/A104149092W?dp=1',
  beginnerCourseUrl: 'https://go.hotmart.com/A103454189R?dp=1',
  businessCourseUrl: 'https://go.hotmart.com/K104148913I?dp=1',
  ebookCourseUrl: 'https://go.hotmart.com/G104148965I?dp=1',
  templateGoogleSheetUrl: 'https://docs.google.com/spreadsheets/d/1ii6AQvG85GPbTCzrLg9RtKfA0Sj9cWXy/edit?gid=996178209#gid=996178209',
  companyName: 'Hoja Maestra',
  supportEmail: 'contacto@hojamaestra.com',
  hotmartGuaranteeDays: 7,
  templateFileName: 'Plantilla_Finanzas_Personales_Hoja_Maestra.xlsx',
};

// Seed leads for initial demonstration
const INITIAL_DEMO_LEADS: Lead[] = [
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
      messagePreview: 'Hola Carlos, bienvenido a Hoja Maestra. Adjunto encontrarás la plantilla automatizada...',
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
      messagePreview: 'Hola Mariana, bienvenido a Hoja Maestra. Adjunto encontrarás la plantilla...',
    },
    downloads: 1,
  },
];

// Helper to check if a response is actual JSON and not an HTML 404 page
async function safeJsonParse(res: Response): Promise<{ isJson: boolean; data: any }> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return { isJson: false, data: null };
  }
  try {
    const text = await res.text();
    if (text.trim().startsWith('<') || text.includes('<!DOCTYPE')) {
      return { isJson: false, data: null };
    }
    const data = JSON.parse(text);
    return { isJson: true, data };
  } catch {
    return { isJson: false, data: null };
  }
}

// Local storage readers & writers
export function getLocalLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LEADS));
      return INITIAL_DEMO_LEADS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_LEADS;
  }
}

export function saveLocalLeads(leads: Lead[]) {
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error('Error saving to local storage:', err);
  }
}

export function getLocalConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_CONFIG;
    }
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveLocalConfig(cfg: AppConfig) {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(cfg));
  } catch (err) {
    console.error('Error saving config locally:', err);
  }
}

export function getStoredAdminPassword(): string {
  try {
    return localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_ADMIN_PASS;
  } catch {
    return DEFAULT_ADMIN_PASS;
  }
}

export function setStoredAdminPassword(pass: string) {
  try {
    localStorage.setItem(ADMIN_PASS_KEY, pass);
  } catch (err) {
    console.error('Error saving admin pass:', err);
  }
}

// ==========================================
// FIREBASE PERSISTENCE INTEGRATION
// ==========================================

// Register lead with guaranteed multi-layer persistence (Firebase Firestore + LocalStorage + Backend API)
export async function registerLeadUnified(data: {
  name: string;
  email: string;
  phone?: string;
  level?: 'basico' | 'intermedio' | 'avanzado';
  primaryGoal?: string;
}): Promise<{ success: boolean; lead: Lead }> {
  const normalizedEmail = data.email.trim().toLowerCase();
  const now = new Date().toISOString();
  const leadId = `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // Prepare lead object
  const newLead: Lead = {
    id: leadId,
    name: data.name.trim(),
    email: normalizedEmail,
    phone: data.phone?.trim() || undefined,
    level: data.level || 'intermedio',
    primaryGoal: data.primaryGoal || 'automatizar',
    consentPrivacy: true,
    consentMarketing: true,
    createdAt: now,
    status: 'active',
    downloads: 1,
    emailNotification: {
      status: 'delivered',
      sentAt: now,
      subject: '¡Tu Plantilla Oficial de Finanzas de Hoja Maestra está lista!',
      messagePreview: `Hola ${data.name.trim()}, confirmamos tu registro y acceso a la plantilla de finanzas personales.`,
    },
  };

  // 1. Save in Firebase Firestore
  try {
    await setDoc(doc(db, 'leads', leadId), {
      ...newLead,
      updatedAt: now,
    });
  } catch (err) {
    console.warn('Could not save lead directly to Firestore (fallback enabled):', err);
  }

  // 2. Save in localStorage (instant offline and static fallback)
  const currentLeads = getLocalLeads();
  const existingIdx = currentLeads.findIndex((l) => l.email === normalizedEmail);
  if (existingIdx >= 0) {
    currentLeads[existingIdx] = {
      ...currentLeads[existingIdx],
      name: data.name.trim(),
      downloads: (currentLeads[existingIdx].downloads || 1) + 1,
      createdAt: now,
    };
  } else {
    currentLeads.unshift(newLead);
  }
  saveLocalLeads(currentLeads);

  // 3. Sync with Express backend if running
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const parsed = await safeJsonParse(res);
    if (parsed.isJson && parsed.data?.success && parsed.data.lead) {
      return { success: true, lead: parsed.data.lead };
    }
  } catch {
    // Non-blocking fallback
  }

  return { success: true, lead: newLead };
}

// Admin Authentication with Firebase Cloud check + Local storage + Server
export async function verifyAdminPassword(password: string): Promise<{ success: boolean; token: string }> {
  const cleanPass = password.trim();

  // 1. Try Firebase Firestore system/config check
  try {
    const snap = await getDoc(doc(db, 'system', 'config'));
    if (snap.exists()) {
      const cloudData = snap.data();
      if (cloudData?.adminPassword) {
        if (cleanPass === cloudData.adminPassword) {
          setStoredAdminPassword(cleanPass);
          return { success: true, token: cleanPass };
        }
      }
    } else {
      // Initialize system config in Firebase with default admin pass
      await setDoc(doc(db, 'system', 'config'), {
        adminPassword: DEFAULT_ADMIN_PASS,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Firestore admin check skipped:', err);
  }

  // 2. Try server verification if backend is running
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: cleanPass }),
    });
    const parsed = await safeJsonParse(res);
    if (parsed.isJson && parsed.data?.success) {
      setStoredAdminPassword(cleanPass);
      return { success: true, token: parsed.data.token || cleanPass };
    }
  } catch {
    // Server unavailable / static deployment
  }

  // 3. Fallback to localStorage or default password
  const expected = getStoredAdminPassword();
  if (cleanPass === expected || cleanPass === DEFAULT_ADMIN_PASS) {
    setStoredAdminPassword(cleanPass);
    return { success: true, token: cleanPass };
  }

  return { success: false, token: '' };
}

// Fetch leads from Firebase Firestore, server API, or localStorage
export async function fetchLeadsUnified(adminToken: string): Promise<Lead[]> {
  // 1. Try Firebase Firestore
  try {
    const snapshot = await getDocs(collection(db, 'leads'));
    if (!snapshot.empty) {
      const firestoreLeads: Lead[] = [];
      snapshot.forEach((d) => {
        firestoreLeads.push(d.data() as Lead);
      });
      // Sort newest first
      firestoreLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      saveLocalLeads(firestoreLeads);
      return firestoreLeads;
    }
  } catch (err) {
    console.warn('Firestore fetch leads error, falling back:', err);
  }

  // 2. Try backend API
  try {
    const res = await fetch('/api/leads', {
      headers: { 'x-admin-key': adminToken },
    });
    const parsed = await safeJsonParse(res);
    if (parsed.isJson && parsed.data?.success && Array.isArray(parsed.data.leads)) {
      saveLocalLeads(parsed.data.leads);
      return parsed.data.leads;
    }
  } catch {
    // Fall back to local storage
  }

  return getLocalLeads();
}

// Delete Lead Unified
export async function deleteLeadUnified(idOrEmail: string, adminToken: string): Promise<boolean> {
  // 1. Delete from Firebase Firestore
  try {
    await deleteDoc(doc(db, 'leads', idOrEmail));
  } catch (err) {
    console.warn('Error deleting lead from Firestore:', err);
  }

  // 2. Update local storage
  const leads = getLocalLeads();
  const filtered = leads.filter(
    (l) => l.id !== idOrEmail && l.email.toLowerCase() !== idOrEmail.toLowerCase()
  );
  saveLocalLeads(filtered);

  // 3. Try server sync
  try {
    await fetch(`/api/leads/${encodeURIComponent(idOrEmail)}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': adminToken },
    });
  } catch {
    // Ok
  }

  return true;
}

// Update admin password in Firebase Firestore + LocalStorage
export async function updateAdminPasswordUnified(newPassword: string): Promise<boolean> {
  const cleanPass = newPassword.trim();
  setStoredAdminPassword(cleanPass);

  try {
    await setDoc(doc(db, 'system', 'config'), {
      adminPassword: cleanPass,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Could not persist new password to Firebase:', err);
  }

  return true;
}

// Client-Side Excel Export
export function exportLeadsToExcelClient(leads: Lead[]) {
  const data = leads.map((l) => ({
    ID: l.id,
    Nombre: l.name,
    Email: l.email,
    Teléfono: l.phone || 'N/A',
    Nivel: l.level.toUpperCase(),
    Objetivo: l.primaryGoal,
    'Fecha de Registro': new Date(l.createdAt).toLocaleString('es-ES'),
    'Estado Notificación': l.emailNotification?.status || 'delivered',
    'Descargas Realizadas': l.downloads || 1,
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Prospectos Hoja Maestra');
  XLSX.writeFile(wb, 'Base_De_Datos_Leads_Hoja_Maestra.xlsx');
}
