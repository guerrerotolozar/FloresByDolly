# Architecture & Attack Surface Analysis — FloresByDolly

## 1. System Overview

FloresByDolly is an e-commerce platform and anniversary raffle system for a flower shop, containerized via Docker Compose:

* **Frontend:** Angular Single Page Application running in container `flores-frontend` (`127.0.0.1:4200:80`).
* **Backend:** Node.js Express REST API in container `flores-backend` (`127.0.0.1:3010:3000`).
* **Database:** MongoDB (`mongo:latest`) in container `flores-mongodb` (`127.0.0.1:27017:27017`).
* **Asset Storage:** Cloudinary CDN integrated via `multer-storage-cloudinary`.
* **WhatsApp Bot:** Automated customer response service running Baileys / Puppeteer Chromium in container `flores-whatsapp-bot`.
* **Public Ingress:** Cloudflare Tunnel via `flores-cloudflared`.

```
                        [ Internet Traffic ]
                                 │
                     [ Cloudflare Tunnel Ingress ]
                                 │
             ┌───────────────────┴───────────────────┐
             ▼                                       ▼
     [ Frontend: 4200 ]                      [ Backend: 3010 ]
             │                                       │
             │                              [ MongoDB: 27017 ]
             │                                       │
             └─────────────── [ WhatsApp Bot ] ──────┘
```

---

## 2. Boundaries & Trust Zones

* **Public Internet Boundary:** Endpoints exposed through Cloudflare Tunnels to untrusted external visitors:
  - `POST /api/registro`: Unauthenticated raffle signup and customer referral submission.
  - `POST /api/auth/login`: Administrator credentials check.
  - `GET /api/products`, `GET /api/categories`, `GET /api/gallery`: Public catalog endpoints.
* **Internal Docker Network Boundary (`floresbydolly_default`):**
  - Connects backend, frontend, MongoDB, and WhatsApp bot containers.
  - MongoDB port 27017 is also mapped directly to `127.0.0.1` on the host OS.
* **Storage & Persistence:**
  - `mongodb_data`: Persistent volume for Mongo collections.
  - `./whatsapp-bot/auth_session`: Host volume for persistent WhatsApp authentication sessions.

---

## 3. High-Priority Entrypoints & Attack Surfaces

1. **`POST /api/registro` (`backend/controllers/registro.controller.js`):**
   - Unauthenticated endpoint intended for anniversary raffle entry.
   - Accepts customer name, phone number, and referrals array.
   - When an existing phone number is submitted, it updates the record and returns the full entity in the JSON response without authentication.
2. **MongoDB Database Listener (`docker-compose.yml` & `backend/config/db.js`):**
   - Runs `mongo:latest` without `--auth` and without user credentials.
   - Accessible by any container on the bridge network and on `127.0.0.1:27017`.
3. **Authentication Endpoint (`backend/routes/auth.routes.js`):**
   - `POST /api/auth/login` checks credentials against the `User` collection.
   - Lacks rate limiting and lockout protection.
4. **HTTP Header Security (`backend/server.js`):**
   - Server runs without `helmet` middleware, emitting `X-Powered-By: Express` and omitting clickjacking and MIME sniffing protections.
