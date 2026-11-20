import crypto from "node:crypto";

const COOKIE_NAME = "amazing_smile_session";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret() {
  return process.env.SESSION_SECRET || "amazing-smile-dental-secure-fallback-key-2026";
}

/**
 * Timing-safe string equality to defeat timing attacks
 */
export function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a || ""));
  const bufB = Buffer.from(String(b || ""));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Sign an auth payload using HMAC-SHA256
 */
export function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", getSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

/**
 * Verify and decode an HMAC-SHA256 signed token
 */
export function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expectedSig = crypto.createHmac("sha256", getSecret()).update(body).digest("base64url");

  const bufSig = Buffer.from(sig);
  const bufExpected = Buffer.from(expectedSig);
  if (bufSig.length !== bufExpected.length || !crypto.timingSafeEqual(bufSig, bufExpected)) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Extract active session from request cookies
 */
export function readSession(req) {
  const token = req.cookies?.[COOKIE_NAME];
  return verifyToken(token);
}

/**
 * Express middleware to enforce admin privileges
 */
export function requireAdmin(req, res, next) {
  const session = readSession(req);
  if (!session || !session.sub) {
    return res.status(401).json({ error: "Unauthorized. Admin session required." });
  }
  req.adminUser = session.sub;
  next();
}

/**
 * Admin Login Endpoint
 */
export function handleLogin(req, res) {
  const { username, password } = req.body || {};
  const validUser = process.env.ADMIN_USER || "admin";
  const validPass = process.env.ADMIN_PASSWORD || "AmazingSmile@2026";

  if (!timingSafeEqual(username, validUser) || !timingSafeEqual(password, validPass)) {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }

  const token = signToken({
    sub: validUser,
    role: "admin",
    exp: Date.now() + MAX_AGE_MS,
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_MS,
    path: "/",
  });

  return res.json({
    ok: true,
    user: validUser,
    message: "Admin authenticated successfully",
  });
}

/**
 * Admin Logout Endpoint
 */
export function handleLogout(_req, res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return res.json({ ok: true, message: "Logged out successfully" });
}
