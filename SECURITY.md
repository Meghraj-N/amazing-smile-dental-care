# Security Architecture & Implemented Protections
## Amazing Smile Dental Care — Production Web Platform
**Author:** Craftvale Security & Architecture Team  
**Audit Standard:** OWASP Top 10 (2025/2026), Indian DPDP Act (2023), HIPAA Patient Confidentiality Guidelines  
**Status:** All 32 Security Features Live & Verified

---

### Executive Summary

Prior to this upgrade, the `website_4` deployment operated purely as static HTML files on a basic local server without server-side request filtering, persistent database controls, security headers, or anti-abuse protection.

By comparing and upgrading to match and exceed the architectural standards of `website_3`, we engineered a dedicated **Node.js / Express security-first backend**. Below is the detailed breakdown of the **32 discrete security features** implemented across 8 security domains.

---

### Security Matrix Overview

| Domain | Security Features Implemented | Threat Mitigated |
| :--- | :--- | :--- |
| **1. HTTP Security Headers** | 10 Features | Clickjacking, MIME sniffing, Cross-Site Scripting (XSS), Downgrade attacks |
| **2. Rate Limiting & DoS** | 4 Features | Brute-force attacks, Automated scraping, Layer 7 HTTP floods |
| **3. Input Sanitization** | 4 Features | Persistent & Reflected XSS, HTML injection, Buffer abuse |
| **4. Anti-Bot Defense** | 2 Features | Headless bots, Spam submission floods |
| **5. Cryptographic Auth** | 5 Features | Timing attacks, Session hijacking, Replay attacks, Credential stuffing |
| **6. Sensitive File Fencing** | 3 Features | Path traversal, Directory browsing, Information disclosure |
| **7. Atomic Database Concurrency** | 2 Features | Concurrent race writes, Database corruption, Partial writes |
| **8. Data Privacy & Error Handling** | 2 Features | Sensitive medical telemetry leaks, Stack trace exploitation |
| **Total Features** | **32 Enterprise Protections** | **Comprehensive Full-Stack Hardening** |

---

### Detailed Breakdown of the 32 Security Protections

#### Domain 1: HTTP Hardening & Response Headers
1. **Strict Content Security Policy (CSP):**  
   Configured with `default-src 'self'`, restricting script execution strictly to verified origins, inline hash allowances, and trusted fonts (`fonts.googleapis.com`, `fonts.gstatic.com`). Eliminates arbitrary script injection.
2. **HTTP Strict Transport Security (HSTS):**  
   Enforced with `max-age=31536000; includeSubDomains; preload`, mandating modern browsers to communicate exclusively over encrypted HTTPS connections.
3. **X-Frame-Options (`SAMEORIGIN`):**  
   Prevents the dental website from being loaded inside unauthorized iframes on external domains, neutralizing Clickjacking attacks.
4. **X-Content-Type-Options (`nosniff`):**  
   Instructs browsers not to sniff MIME types, stopping malicious file downloads disguised as harmless images or text.
5. **Referrer-Policy (`strict-origin-when-cross-origin`):**  
   Protects patient privacy by withholding full URLs and query parameters when outbound links or media assets are loaded.
6. **Permissions-Policy Restrictions:**  
   Blocks sensitive device APIs (`camera=(), microphone=(), geolocation=(), payment=()`) from being triggered through compromised third-party scripts.
7. **Cross-Origin-Opener-Policy (`same-origin-allow-popups`):**  
   Isolates browser browsing contexts so malicious external tabs cannot inspect or hijack the patient portal window.
8. **Cross-Origin-Resource-Policy (`same-origin`):**  
   Restricts loading of backend static and data assets strictly to requests originating from the same clinic site.
9. **X-XSS-Protection Header (`1; mode=block`):**  
   Activates legacy browser reflective XSS filters as a defense-in-depth safety net.
10. **Information Leak Suppression (`X-Powered-By` Removal):**  
    Explicitly removed Express framework signatures (`app.disable('x-powered-by')`), denying automated reconnaissance scanners information about the server technology stack.

---

#### Domain 2: Denial of Service (DoS) & Anti-Brute-Force
11. **Global Rate Limiter (150 req / 60s per IP):**  
    Protects all static assets and health routes from aggressive crawling, scraping, or automated Layer-7 denial-of-service floods.
12. **Form Submission Rate Limiter (12 req / 15m per IP):**  
    Clamps appointment booking and callback forms so spam bots cannot overwhelm clinic notification channels or exhaust disk storage.
13. **Admin Login Brute-Force Shield (5 attempts / 15m):**  
    Halts automated dictionary and credential stuffing attacks against administrative endpoints.
14. **HTTP Payload Size Clamping (`500kb` limit):**  
    Limits incoming JSON bodies to 500 kilobytes, preventing memory exhaustion attacks caused by oversized payloads.

---

#### Domain 3: Input Sanitization & Threat Neutralization
15. **Deep Recursive Object Sanitization:**  
    Iterates recursively through nested form fields, stripping malicious payloads regardless of object depth.
16. **XSS & HTML Tag Stripping:**  
    Replaces `<` and `>` characters with escaped equivalents or eliminates them from user-submitted text fields (patient name, notes, symptoms).
17. **JavaScript Pseudoprotocol Eradication:**  
    Detects and neutralizes `javascript:`, `vbscript:`, and `data:` schemes in text inputs.
18. **Inline DOM Event Handler Neutralization:**  
    Detects and strips attributes like `onload=`, `onerror=`, `onclick=`, and `onfocus=` before data reaches storage.

---

#### Domain 4: Anti-Bot Honeypot Defense
19. **Silent Honeypot Trap Detection:**  
    Listens for invisible trap fields (`_gotcha`, `patient_fax`, `website_url`) placed offscreen in HTML forms. Real users never fill these, while bots populate them automatically.
20. **Zero-Feedback Bot Neutralization:**  
    When a bot triggers a honeypot, the server returns a faux `200 OK` response without executing database writes, wasting the bot's computational resources without alerting the attacker.

---

#### Domain 5: Cryptographic Authentication & Session Hardening
21. **Timing-Safe Credential Verification:**  
    Uses `crypto.timingSafeEqual` over SHA-256 digested buffers to authenticate admin passwords. Defeats side-channel timing analysis that measures CPU comparison cycles.
22. **Cryptographic HMAC-SHA256 Signed Session Tokens:**  
    Session tokens are cryptographically signed using an environmental secret key (`SESSION_SECRET`), preventing token forgery or tampering.
23. **Base64URL Tamper Detection:**  
    Session payload structure `user.timestamp.signature` allows instant stateless signature verification and structural tamper rejection.
24. **Session Expiration (TTL Enforcement):**  
    Tokens expire automatically after 8 hours of inactivity, neutralizing stale token reuse or replay attacks.
25. **Triple-Guarded Security Cookies:**  
    Authentication cookies are flagged with:
    - `HttpOnly`: Inaccessible to browser JavaScript (protects against XSS token theft).
    - `SameSite=Lax`: Mitigates Cross-Site Request Forgery (CSRF).
    - `Secure`: Transmitted only over encrypted HTTPS in production.

---

#### Domain 6: Sensitive File & Path Traversal Fencing
26. **Path Traversal & Null-Byte Shield:**  
    Rejects incoming URLs containing `%00`, `\0`, `..`, or backslash directory step-outs (`normalize()` validation).
27. **Sensitive File & Directory Blacklist:**  
    Strict regular expression guards intercept and block attempts to access:
    - Configuration files: `.env`, `.env.*`, `package.json`, `package-lock.json`
    - Version control artifacts: `.git/`, `.gitignore`
    - Server internals: `server/`, `data/`, `node_modules/`
    - Deployment files: `Dockerfile`, `.dockerignore`
28. **HTTP Method Whitelisting:**  
    Blocks dangerous or unnecessary HTTP verbs such as `TRACE` and `TRACK` (which can facilitate XST attacks).

---

#### Domain 7: Concurrency-Safe Atomic Database Engine
29. **Atomic Temp-Swap File Persistence:**  
    When saving leads or appointments, data is written to a randomized temporary file (`.appointments.json.tmp.XXXXXX`) and committed via `fs.renameSync()`. In POSIX and modern Windows systems, rename is an atomic filesystem operation, completely eliminating partial file corruption during unexpected crashes or power loss.
30. **Concurrent Write Memory Queue:**  
    Database operations are serialized sequentially via an in-memory lock chain, preventing race conditions when multiple patients submit bookings simultaneously.

---

#### Domain 8: Patient Medical Privacy & Telemetry Masking
31. **Medical Privacy IP Anonymization:**  
    Patient IP addresses are never saved in plaintext. They are passed through a one-way HMAC-SHA256 digest using a dynamic daily salt, ensuring forensic anti-abuse protection without violating medical confidentiality laws (DPDP Act 2023).
32. **Masked Production Error Responses:**  
    In production mode (`NODE_ENV=production`), server errors return generic, user-friendly JSON messages (`500 Internal Server Error`). Stack traces, line numbers, and internal filenames are suppressed, denying attackers reconnaissance intelligence.

---

### Verification and Compliance

- **OWASP Compliance:** Neutralizes A01 (Broken Access Control), A02 (Cryptographic Failures), A03 (Injection), A04 (Insecure Design), A05 (Security Misconfiguration), A07 (Identification and Authentication Failures).
- **DPDP Act (India):** Adheres to data minimization, purpose limitation, and storage security requirements for healthcare practices.
