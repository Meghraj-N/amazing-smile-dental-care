import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isVercel = Boolean(process.env.VERCEL);
const defaultDataDir = path.join(__dirname, "..", "data");
const dataDir = isVercel ? path.join("/tmp", "data") : defaultDataDir;
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
  if (!fs.existsSync(filePath)) {
    // If running on Vercel and file is not in /tmp yet, check default project data dir
    if (isVercel) {
      const baseName = path.basename(filePath);
      const seedPath = path.join(defaultDataDir, baseName);
      if (fs.existsSync(seedPath)) {
        try {
          return JSON.parse(fs.readFileSync(seedPath, "utf8"));
        } catch {
          return fallback;
        }
      }
    }
    return fallback;
  }
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

export function patchLead(id, updates) {
  const store = loadJson(leadsPath, { leads: [] });
  const index = store.leads.findIndex(l => l.id === id);
  if (index === -1) return null;
  const allowed = ["status", "notes"];
  for (const key of allowed) {
    if (key in updates) {
      store.leads[index][key] = updates[key];
    }
  }
  store.leads[index].updatedAt = new Date().toISOString();
  atomicWriteJson(leadsPath, store);
  return store.leads[index];
}

/* --- Clinic Settings & Master Customization Schema --- */
export const DEFAULT_SETTINGS = {
  // 1. Clinic Contact & Identity
  clinicPhone: "+919975999529",
  clinicPhoneSecondary: "+919975999529",
  clinicWhatsapp: "919975999529",
  clinicEmail: "contact@amazingsmile.com",
  clinicAddress: "Gol Maidan, Sidhi Vinayak Nagar, Ulhasnagar - 421002",
  googleMapsUrl: "https://maps.app.goo.gl/ftz2b72YQJ1r1R5c8",
  announcementNotice: "★ 4.8 Rating on Google Maps (100+ Verified Patient Reviews)",
  showAnnouncementNotice: true,

  // 2. Promotional Offers & Special Campaigns
  offerActive: true,
  offerBadge: "SPECIAL CLINIC OFFER",
  offerTitle: "Complete Smile Makeover & Checkup",
  offerDiscount: "Flat 20% Off",
  offerDescription: "Complimentary digital RVG X-ray & consultation with Dr. Manish Gangwani on your first visit.",
  offerCode: "SMILE20",
  offerExpiry: "Valid Till End of Month",
  offerCtaText: "Claim Offer on WhatsApp",
  offerShowAsBanner: true,
  offerShowAsPopup: false,

  // 3. Hero Section Customization
  heroEyebrow: "TOP-RATED DENTAL CLINIC IN ULHASNAGAR",
  heroTitle: "Your Smile Deserves",
  heroGradientWord: "Exceptional Care.",
  heroSubtitle: "Experience gentle, advanced dental treatments with computerized precision, single-sitting root canals, dental implants, and invisible aligners in a stress-free environment.",
  heroPrimaryCtaText: "Book Appointment",
  heroSecondaryCtaText: "WhatsApp Consult",
  heroTrustText: "4.8 / 5.0 Rating · Over 10,000+ Happy Patients",

  // 4. Operating Hours & Emergency Closure
  hoursWeekdays: "Mon–Sat: 10:00 AM–1:30 PM & 5:00 PM–9:30 PM",
  hoursSunday: "Sunday: Closed (Emergency on Call)",
  holidayNoticeActive: false,
  holidayNoticeText: "Clinic closed today for holiday. In case of acute toothache, contact emergency WhatsApp.",

  // 5. Doctor Profile & Credentials
  doctorName: "Dr. Manish Gangwani",
  doctorDegrees: "BDS · Advanced Endodontics, Laser & Aesthetic Specialist",
  doctorExperience: "12+ Years Experience",
  doctorBio: "Dr. Manish Gangwani established Amazing Smile Dental Care with a simple mission: to take the fear out of dental visits. Over the last 12+ years, he has successfully treated more than 10,000 patients across Ulhasnagar, Kalyan, and Thane.",
  doctorPhilosophy: "100% transparent diagnostics. No unnecessary procedures, no hidden charges, and gentle, honest dental care.",

  // 6. Dental Services & Pricing Highlights
  services: [
    { id: "rct", title: "Painless Root Canal (RCT)", badge: "Single-Sitting", price: "From ₹2,499", desc: "Computerized rotary endodontics with zero pain and 99% tooth preservation." },
    { id: "laser", title: "Advanced Diode Laser", badge: "Suture-Free", price: "From ₹1,999", desc: "Minimally invasive gum contouring, ulcer relief, and bacterial pocket sterilization." },
    { id: "aligners", title: "Clear Aligners", badge: "Virtually Invisible", price: "EMI ₹2,999/mo", desc: "Custom 3D transparent polymer trays to straighten teeth without metal brackets." },
    { id: "implants", title: "Dental Implants", badge: "Lifetime Strength", price: "Premium Titanium", desc: "Permanent bio-compatible titanium tooth roots capped with lifelike zirconia crowns." },
    { id: "whitening", title: "Cosmetic Teeth Whitening", badge: "Instant Results", price: "From ₹3,499", desc: "Safe chairside light-activated whitening lifting stubborn stains in 45 minutes." },
    { id: "pediatric", title: "Gentle Pediatric Dentistry", badge: "Kid-Friendly", price: "Special Care", desc: "Gentle preventative care, fluoride therapy, and cavity seals for children." }
  ],

  // 7. Testimonials & Social Proof
  reviews: [
    { name: "Pooja Chawla", service: "Single-Sitting RCT", rating: 5, text: "I was terrified of root canals, but Dr. Manish made the entire procedure completely painless. Walked out with zero swelling!" },
    { name: "Rahul Makhija", service: "Clear Aligners", rating: 5, text: "Nobody even noticed I was wearing aligners during my client presentations. My teeth are perfectly straight now." },
    { name: "Sunil Bhatia", service: "Dental Implant", rating: 5, text: "Can chew normally again after 4 years of missing molar. Quality and cleanliness of the clinic is exceptional." }
  ]
};

export function getAllSettings() {
  const custom = loadJson(settingsPath, {});
  return { ...DEFAULT_SETTINGS, ...custom };
}

export function updateAllSettings(newSettings) {
  const current = getAllSettings();
  const merged = { ...current, ...newSettings, updatedAt: new Date().toISOString() };
  atomicWriteJson(settingsPath, merged);
  return merged;
}

export function getSetting(key) {
  const settings = getAllSettings();
  return settings[key] ?? null;
}

export function setSetting(key, value) {
  const settings = loadJson(settingsPath, {});
  settings[key] = value;
  atomicWriteJson(settingsPath, settings);
  return settings;
}

export function getFullBackup() {
  return {
    exportedAt: new Date().toISOString(),
    version: "2.0.0",
    settings: getAllSettings(),
    appointments: listAppointments(),
    leads: listLeads(),
  };
}

export function restoreFullBackup(data) {
  if (data.settings) atomicWriteJson(settingsPath, data.settings);
  if (Array.isArray(data.appointments)) atomicWriteJson(appointmentsPath, { appointments: data.appointments });
  if (Array.isArray(data.leads)) atomicWriteJson(leadsPath, { leads: data.leads });
  return true;
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
