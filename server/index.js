import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import * as db from "./db.js";
import * as auth from "./auth.js";
import {
  createRateLimiter,
  anonymizeIp,
  sanitizeString,
  checkHoneypot,
  validatePhone,
  validateEmail,
  sensitiveFileGuard,
} from "./security.js";

// Load environment variables (.env override)
dotenv.config({ override: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const PORT = Number(process.env.PORT || 8123);

const app = express();

/* --- 1. Server Security Headers --- */
app.disable("x-powered-by");

app.use((req, res, next) => {
  // Method security: Block deprecated/exploitable methods
  if (["TRACE", "TRACK"].includes(req.method)) {
    return res.status(405).send("Method Not Allowed");
  }

  // Modern Defensive Security Headers
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'self';"
  );
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }

  next();
});

/* --- 2. Body Parsing & Size Clamping (DoS Mitigation) --- */
app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ extended: true, limit: "500kb" }));
app.use(cookieParser());

/* --- 3. Rate Limiters --- */
const globalLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 150,
  message: "Too many requests from this IP. Please try again in a minute.",
});

const formLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 12,
  message: "Too many appointment submissions from this network. Please call us directly at +919975999529.",
});

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: "Too many failed login attempts. Account locked for 15 minutes.",
});

app.use(globalLimiter);

/* --- 4. Sensitive File & Route Fencing --- */
app.use(sensitiveFileGuard);

/* --- 5. Health & Diagnostic API --- */
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    clinic: "Amazing Smile Dental Care",
    doctor: "Dr. Manish Gangwani (BDS)",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: db.getStats(),
  });
});

/* --- 6. Patient Appointment Booking API --- */
app.post("/api/appointments", formLimiter, checkHoneypot, (req, res) => {
  try {
    const { name, phone, email, service, date, time, notes } = req.body || {};

    // Input sanitization
    const cleanName = sanitizeString(name, 100);
    const cleanPhone = sanitizeString(phone, 20);
    const cleanEmail = sanitizeString(email, 100);
    const cleanService = sanitizeString(service, 100);
    const cleanDate = sanitizeString(date, 50);
    const cleanTime = sanitizeString(time, 50);
    const cleanNotes = sanitizeString(notes, 1000);

    // Strict validation
    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ error: "Please provide a valid patient name (minimum 2 characters)." });
    }

    if (!validatePhone(cleanPhone)) {
      return res.status(400).json({ error: "Please provide a valid 10-digit mobile contact number." });
    }

    if (cleanEmail && !validateEmail(cleanEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ipHash = anonymizeIp(rawIp);

    const saved = db.saveAppointment({
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail || null,
      service: cleanService || "General Consultation & Diagnostic Checkup",
      date: cleanDate,
      time: cleanTime,
      notes: cleanNotes,
      ipHash,
    });

    return res.status(201).json({
      ok: true,
      message: "Appointment request recorded successfully",
      appointmentId: saved.id,
      patient: {
        name: saved.name,
        service: saved.service,
        date: saved.preferredDate,
        time: saved.preferredTime,
      },
    });
  } catch (err) {
    console.error("[API] Appointment Error:", err);
    return res.status(500).json({ error: "Internal server error while saving appointment." });
  }
});

/* --- 7. Fast Hero Callback Lead API --- */
app.post("/api/leads", formLimiter, checkHoneypot, (req, res) => {
  try {
    const { name, phone } = req.body || {};
    const cleanName = sanitizeString(name, 100);
    const cleanPhone = sanitizeString(phone, 20);

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ error: "Please provide your full name." });
    }

    if (!validatePhone(cleanPhone)) {
      return res.status(400).json({ error: "Please provide a valid mobile phone number." });
    }

    const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ipHash = anonymizeIp(rawIp);

    const saved = db.saveLead({
      name: cleanName,
      phone: cleanPhone,
      ipHash,
    });

    return res.status(201).json({
      ok: true,
      message: "Callback request received. Our clinic desk will contact you within 10 minutes.",
      leadId: saved.id,
    });
  } catch (err) {
    console.error("[API] Lead Error:", err);
    return res.status(500).json({ error: "Internal server error while recording callback request." });
  }
});

/* --- 8. Admin Authentication & Management APIs --- */
app.post("/api/login", loginLimiter, auth.handleLogin);
app.post("/api/logout", auth.handleLogout);

app.get("/api/me", (req, res) => {
  const session = auth.readSession(req);
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  res.json({ user: session.sub, role: session.role });
});

app.get("/api/appointments", auth.requireAdmin, (_req, res) => {
  const appointments = db.listAppointments();
  res.json({ ok: true, count: appointments.length, appointments });
});

app.patch("/api/appointments/:id", auth.requireAdmin, (req, res) => {
  const updated = db.patchAppointment(req.params.id, req.body || {});
  if (!updated) return res.status(404).json({ error: "Appointment not found" });
  res.json({ ok: true, appointment: updated });
});

app.get("/api/leads", auth.requireAdmin, (_req, res) => {
  const leads = db.listLeads();
  res.json({ ok: true, count: leads.length, leads });
});

app.get("/api/stats", auth.requireAdmin, (_req, res) => {
  res.json({ ok: true, stats: db.getStats() });
});

/* --- 9. Static File Serving with Caching Strategy --- */
app.use(
  express.static(root, {
    extensions: ["html"],
    index: "index.html",
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) {
        // HTML is served fresh to ensure changes appear immediately
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      } else if (/\.(jpg|jpeg|png|webp|svg|gif|woff2|woff|ttf|css|js)$/i.test(filePath)) {
        // High-performance immutable static asset caching
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  })
);

/* --- 10. Custom 404 Fallback --- */
app.use((_req, res) => {
  const notFoundPath = path.join(root, "404.html");
  if (fs.existsSync(notFoundPath)) {
    return res.status(404).sendFile(notFoundPath);
  }
  res.status(404).send("<h1>404 - Page Not Found</h1>");
});

/* --- 11. Centralized Error Handler --- */
app.use((err, _req, res, _next) => {
  console.error("[SERVER ERROR]", err);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message;
  res.status(status).json({ error: message });
});

/* --- 12. Graceful Server Startup & Termination --- */
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Amazing Smile Dental Care - Production Server Online `);
  console.log(`  URL:         http://localhost:${PORT}                 `);
  console.log(`  Health API:  http://localhost:${PORT}/api/health      `);
  console.log(`  Mode:        ${process.env.NODE_ENV || "development"} `);
  console.log(`=======================================================`);
});

function gracefulShutdown(signal) {
  console.log(`\n[SHUTDOWN] Received ${signal}. Closing server gracefully...`);
  server.close(() => {
    console.log("[SHUTDOWN] All active connections closed. Process terminating.");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("[SHUTDOWN] Force closing after 5s timeout.");
    process.exit(1);
  }, 5000).unref();
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
