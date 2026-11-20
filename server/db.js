import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const appointmentsPath = path.join(dataDir, "appointments.json");
const leadsPath = path.join(dataDir, "leads.json");
const settingsPath = path.join(dataDir, "settings.json");

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

/**
 * Thread-safe atomic file writer using temporary file swap
 */
function atomicWriteJson(filePath, data) {
  ensureDataDir();
  const tempPath = `${filePath}.${crypto.randomBytes(4).toString("hex")}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tempPath, filePath);
}

function loadJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[DB] Error loading ${filePath}:`, err.message);
    return fallback;
  }
}

/* --- Appointments Database --- */
export function listAppointments() {
  const store = loadJson(appointmentsPath, { appointments: [] });
  return store.appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getAppointment(id) {
  const list = listAppointments();
  return list.find(a => a.id === id) || null;
}

export function saveAppointment({ name, phone, email, service, date, time, notes, ipHash }) {
  const store = loadJson(appointmentsPath, { appointments: [] });
  const newAppointment = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: String(name || "").trim(),
    phone: String(phone || "").trim(),
    email: email ? String(email).trim() : null,
    service: String(service || "General Consultation").trim(),
    preferredDate: String(date || "").trim(),
    preferredTime: String(time || "").trim(),
    notes: notes ? String(notes).trim() : "",
    status: "pending", // pending, confirmed, completed, cancelled
    ipHash: ipHash || "anonymous",
  };
  store.appointments.push(newAppointment);
  atomicWriteJson(appointmentsPath, store);
  return newAppointment;
}

export function patchAppointment(id, updates) {
  const store = loadJson(appointmentsPath, { appointments: [] });
  const index = store.appointments.findIndex(a => a.id === id);
  if (index === -1) return null;
  const allowed = ["status", "notes", "confirmedSlot", "doctorNotes"];
  for (const key of allowed) {
    if (key in updates) {
      store.appointments[index][key] = updates[key];
    }
  }
  store.appointments[index].updatedAt = new Date().toISOString();
  atomicWriteJson(appointmentsPath, store);
  return store.appointments[index];
}

/* --- Fast Callback Leads Database --- */
export function listLeads() {
  const store = loadJson(leadsPath, { leads: [] });
  return store.leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function saveLead({ name, phone, ipHash }) {
  const store = loadJson(leadsPath, { leads: [] });
  const newLead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: String(name || "").trim(),
    phone: String(phone || "").trim(),
    status: "new", // new, called, converted, closed
    ipHash: ipHash || "anonymous",
  };
  store.leads.push(newLead);
  atomicWriteJson(leadsPath, store);
  return newLead;
}

/* --- Clinic Settings & Configuration --- */
export function getSetting(key) {
  const settings = loadJson(settingsPath, {});
  return settings[key] ?? null;
}

export function setSetting(key, value) {
  const settings = loadJson(settingsPath, {});
  settings[key] = value;
  atomicWriteJson(settingsPath, settings);
  return settings;
}

/* --- Clinic Dashboard Metrics --- */
export function getStats() {
  const appointments = listAppointments();
  const leads = listLeads();
  const todayStr = new Date().toISOString().slice(0, 10);

  const todayAppointments = appointments.filter(a => a.createdAt.startsWith(todayStr)).length;
  const pendingAppointments = appointments.filter(a => a.status === "pending").length;
  const newLeads = leads.filter(l => l.status === "new").length;

  return {
    totalAppointments: appointments.length,
    todayAppointments,
    pendingAppointments,
    totalLeads: leads.length,
    newLeads,
    databaseHealthy: true,
  };
}
