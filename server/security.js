import crypto from "node:crypto";

/* --- 1. In-Memory Anti-DDoS Rate Limiter --- */
const rateLimitBuckets = new Map();

/**
 * Creates an in-memory rate limiting middleware
 * @param {Object} options { windowMs, maxRequests, message }
 */
export function createRateLimiter({ windowMs, maxRequests, message }) {
  return function rateLimitMiddleware(req, res, next) {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const now = Date.now();
    const key = `${ip}:${req.baseUrl || ""}${req.path}`;

    let bucket = rateLimitBuckets.get(key);
    if (!bucket || now - bucket.resetTime > windowMs) {
      bucket = { count: 1, resetTime: now };
      rateLimitBuckets.set(key, bucket);
      return next();
    }

    bucket.count++;
    if (bucket.count > maxRequests) {
      res.setHeader("Retry-After", Math.ceil((bucket.resetTime + windowMs - now) / 1000));
      return res.status(429).json({
        error: message || "Too many requests. Please slow down and try again later.",
      });
    }

    next();
  };
}

// Cleanup stale buckets every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitBuckets.entries()) {
    if (now - bucket.resetTime > 30 * 60 * 1000) {
      rateLimitBuckets.delete(key);
    }
  }
}, 10 * 60 * 1000).unref();

/* --- 2. Medical Privacy IP Anonymization --- */
const IP_SALT = process.env.IP_SALT || crypto.randomBytes(16).toString("hex");

export function anonymizeIp(rawIp) {
  if (!rawIp) return "anonymous";
  const clientIp = String(rawIp).split(",")[0].trim();
  return crypto.createHmac("sha256", IP_SALT).update(clientIp).digest("hex").slice(0, 16);
}

/* --- 3. Deep XSS & HTML Input Sanitizer --- */
export function sanitizeString(input, maxLength = 500) {
  if (typeof input !== "string") return "";
  let clean = input
    // Trim and clamp length
    .trim()
    .slice(0, maxLength)
    // Strip HTML tags
    .replace(/<[^>]*>?/gm, "")
    // Strip javascript: pseudoprotocol
    .replace(/javascript:/gi, "")
    // Strip inline event handler patterns
    .replace(/on\w+\s*=/gi, "")
    // Remove control characters except standard line breaks
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return clean;
}

/* --- 4. Anti-Bot Honeypot Detector --- */
export function checkHoneypot(req, res, next) {
  const body = req.body || {};
  // If either of these trap fields contains any value, it is a bot
  if (body._gotcha || body.website_url || body.patient_fax) {
    // Silently return fake success so bots don't adapt
    return res.json({ ok: true, message: "Request received" });
  }
  next();
}

/* --- 5. E.164 / Indian Mobile Phone Number Validator --- */
export function validatePhone(phone) {
  if (!phone || typeof phone !== "string") return false;
  // Cleans spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
  // Accepts standard Indian mobile formats:
  // 9820012345, 09820012345, +919820012345, 919820012345
  return /^(?:\+?91|0)?[6-9]\d{9}$/.test(cleaned);
}

/* --- 6. RFC Email Validator --- */
export function validateEmail(email) {
  if (!email || typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/* --- 7. Path Traversal & Sensitive File Route Guard --- */
export const SENSITIVE_PREFIXES = [
  "/.git",
  "/.env",
  "/server",
  "/data",
  "/src",
  "/dist",
  "/node_modules",
  "/package.json",
  "/package-lock.json",
  "/dockerfile",
  "/.dockerignore",
  "/.gitignore",
  "/analyze_images.py",
  "/scratch",
];

export function sensitiveFileGuard(req, res, next) {
  const p = req.path.toLowerCase();
  
  // Guard against null byte injection & encoded directory traversal
  if (p.includes("\0") || p.includes("%00") || p.includes("..") || p.includes("%2e%2e")) {
    return res.status(400).json({ error: "Invalid request path" });
  }

  // Fencing sensitive files
  if (SENSITIVE_PREFIXES.some(prefix => p === prefix || p.startsWith(`${prefix}/`) || p.endsWith(prefix))) {
    return res.status(404).sendFile(new URL("../404.html", import.meta.url).pathname);
  }

  next();
}
