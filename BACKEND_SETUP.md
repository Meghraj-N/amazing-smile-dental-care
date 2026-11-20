# Backend Architecture & Operational Setup Guide
## Amazing Smile Dental Care — Production Web Platform
**Author:** Craftvale Engineering Team  
**Architecture:** Node.js (v20+) · Express.js · Atomic JSON Storage Engine · Dual-Dispatch Client  
**Version:** 2.0.0-PROD

---

### 1. Architecture Overview

```
c:\client websites\project details\Craftvale\websites\website_4\
├── assets/
│   ├── css/styles.css           # Premium dental design system & responsive layout
│   ├── js/main.js               # Apple-fluid interactive motion, Cal scheduler, & dual-dispatch
│   └── images/                  # Clinic operatory, Dr. Gangwani, smile transformations
├── data/
│   ├── appointments.json        # Atomic JSON store for patient booking records
│   ├── leads.json               # Atomic JSON store for callback and consultation requests
│   └── settings.json            # Practice preferences and operational configuration
├── server/
│   ├── index.js                 # Production Express application & REST routes
│   ├── security.js              # 32-feature security middleware suite & sanitizers
│   ├── db.js                    # Concurrency-safe atomic temp-swap persistence engine
│   └── auth.js                  # Timing-safe HMAC-SHA256 authentication controller
├── .env                         # Production environment configuration
├── .env.example                 # Example configuration template
├── Dockerfile                   # Hardened multi-stage non-root container definition
├── .dockerignore                # Container build exclusion rules
├── .gitignore                   # Version control exclusion rules
├── package.json                 # Project dependencies and operational scripts
├── SECURITY.md                  # Comprehensive security audit of all 32 implemented features
├── BACKEND_SETUP.md             # This operations and API documentation file
├── 404.html                     # Custom branded 404 page
├── privacy.html                 # DPDP Act 2023 compliant patient privacy policy
├── terms.html                   # Clinical terms of service and medical disclaimer
├── cookies.html                 # Cookie transparency and storage policy
└── licenses.html                # Open-source and font attributions
```

---

### 2. Gap Analysis: What Was Missing in `website_4` vs `website_3`

| Feature / File | State in `website_3` | Previous State in `website_4` | Current State in `website_4` (Resolved) |
| :--- | :--- | :--- | :--- |
| **Backend Server** | Express server with REST API | No backend (basic Python `http.server`) | **Production Express server** with full REST API & health probes |
| **Security Controls** | Basic headers | Zero security controls | **32 discrete security features** (Rate limits, CSP, HSTS, timing-safe auth) |
| **Data Persistence** | JSON file storage | No persistence (leads lost if WhatsApp closed) | **Atomic Temp-Swap JSON Engine** with zero partial write corruption |
| **Legal Pages** | Present (placeholder "Westside") | Completely missing | **Created & Customized** (`privacy.html`, `terms.html`, `cookies.html`, `licenses.html`) |
| **Error Handling** | Generic 404 | Default server 404 | **Custom Branded 404** with clinic phone CTA and home redirect |
| **Dual-Dispatch Lead Capture** | Single dispatch | Client WhatsApp only | **Dual-dispatch**: Silently saves to DB + triggers WhatsApp instant connect |
| **Containerization** | Basic Dockerfile | Missing | **Hardened Alpine Dockerfile** running as non-root user with health check |

---

### 3. Environment Variables (`.env`)

Configure the following variables in `.env` (or via container environment variables):

```env
# Server Port & Mode
PORT=8123
NODE_ENV=production

# Administrative Credentials
ADMIN_USER=admin
ADMIN_PASSWORD=AmazingSmile@2026!Ulhasnagar
SESSION_SECRET=c9b2f6718a3d4e5f9182736450ab1cde8273948572615243adbfec8291029384

# Clinic Details
CLINIC_PHONE=+919975999529
CLINIC_NAME=Amazing Smile Dental Care
CLINIC_DOCTOR=Dr. Manish Gangwani
```

---

### 4. REST API Endpoint Reference

#### Public Endpoints

##### 1. Health Probe
- **Method:** `GET`
- **Route:** `/api/health`
- **Access:** Public
- **Response:**
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-11-20T15:10:00.000Z",
    "clinic": "Amazing Smile Dental Care",
    "doctor": "Dr. Manish Gangwani",
    "phone": "+919975999529",
    "version": "2.0.0"
  }
  ```

##### 2. Book Patient Appointment
- **Method:** `POST`
- **Route:** `/api/appointments`
- **Access:** Public (Rate limited: 12 req / 15m)
- **Request Body:**
  ```json
  {
    "name": "Sunil Sharma",
    "phone": "+919820123456",
    "email": "sunil@example.com",
    "service": "Painless Root Canal (RCT)",
    "date": "Monday, 23 November 2026",
    "time": "11:30am",
    "notes": "Sharp sensitivity on upper right molar",
    "source": "cal_scheduler"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Appointment request submitted successfully.",
    "id": "apt_1795188000000_a1b2c3"
  }
  ```

##### 3. Submit Consultation / Callback Lead
- **Method:** `POST`
- **Route:** `/api/leads`
- **Access:** Public (Rate limited: 12 req / 15m)
- **Request Body:**
  ```json
  {
    "name": "Pooja Varma",
    "phone": "+919920987654",
    "notes": "Interested in invisible clear aligners"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Lead received. Our clinical coordinator will call you shortly."
  }
  ```

##### 4. Admin Login
- **Method:** `POST`
- **Route:** `/api/login`
- **Access:** Public (Rate limited: 5 req / 15m)
- **Request Body:**
  ```json
  {
    "username": "admin",
    "password": "AmazingSmile@2026!Ulhasnagar"
  }
  ```
- **Response (200 OK):**
  Sets `HttpOnly; SameSite=Lax; Secure` cookie `adm_token`.

---

#### Protected Endpoints (Requires `adm_token` Cookie)

##### 5. Check Active Admin Session
- **Method:** `GET`
- **Route:** `/api/me`
- **Access:** Admin
- **Response:**
  ```json
  {
    "authenticated": true,
    "user": "admin"
  }
  ```

##### 6. List Appointments
- **Method:** `GET`
- **Route:** `/api/appointments`
- **Access:** Admin
- **Query Parameters:** `?status=pending|confirmed|completed|cancelled`
- **Response:** Array of sanitized appointment records.

##### 7. Update Appointment Status
- **Method:** `PATCH`
- **Route:** `/api/appointments/:id`
- **Access:** Admin
- **Request Body:**
  ```json
  {
    "status": "confirmed",
    "clinical_notes": "Confirmed chair slot 2 with Dr. Gangwani"
  }
  ```

##### 8. Get Clinic Analytics & Statistics
- **Method:** `GET`
- **Route:** `/api/stats`
- **Access:** Admin
- **Response:**
  ```json
  {
    "totalAppointments": 42,
    "pendingAppointments": 3,
    "totalLeads": 87,
    "conversionRate": "76.4%"
  }
  ```

---

### 5. Frontend Dual-Dispatch Lead Architecture

To prevent lead loss when prospective patients submit booking requests:
1. **Background Async Post:** When a patient clicks "Confirm Slot" in the Cal.com scheduler or the consultation form, `assets/js/main.js` sends an immediate background `fetch('/api/appointments', ...)` or `fetch('/api/leads', ...)`.
2. **Instant WhatsApp Forward:** Simultaneously, the user is seamlessly forwarded to WhatsApp pre-populated with Dr. Gangwani's clinic contact (`+919975999529`).
3. **Resilience Guarantee:** If the patient's phone battery dies or they close WhatsApp before hitting "Send", their appointment is already safely preserved in `data/appointments.json` on the server. Clinic reception can immediately follow up via phone call.

---

### 6. Containerization & Deployment

To build and run the Docker container:

```bash
# Build the production Docker image
docker build -t amazing-smile-web:latest .

# Run the container in detached mode
docker run -d \
  --name amazing-smile \
  -p 8123:8123 \
  -v amazing_smile_data:/app/data \
  --restart unless-stopped \
  amazing-smile-web:latest
```

The container automatically configures a non-root user (`appuser`) and includes an automated healthcheck against `/api/health`.

---

### 7. Node.js Local Execution

```bash
# Install dependencies
npm install

# Start production server
npm start

# Run in background via pm2 (recommended for production servers)
npx pm2 start server/index.js --name "amazing-smile"
```
