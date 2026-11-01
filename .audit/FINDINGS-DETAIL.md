# Technical Reproduction & Remediation Details — FloresByDolly

## 1. `flores-pii-leak-user-tampering`
* **Severidad:** **CRITICAL** (Likelihood: High | Impact: Critical)
* **Archivos:**
  - `backend/controllers/registro.controller.js` (Líneas 36–55)
  - `backend/routes/registro.routes.js` (Línea 6)
  - `backend/models/RegistroVip.js` (Líneas 3–39)

### Traza de Ejecución y Causa Raíz
```javascript
const existente = await RegistroVip.findOne({ celular: celular.trim() });
if (existente) {
    existente.nombre = nombre.trim(); // <-- Sobrescritura no autorizada
    const nuevosReferidos = [...existente.referidos, ...referidosLimpios];
    const referidosUnicos = Array.from(new Map(nuevosReferidos.map(r => [r.celular, r])).values());
    existente.referidos = referidosUnicos;
    existente.activo = true;
    await existente.save();

    return res.json({
        success: true,
        message: '¡Datos actualizados! Ya estabas registrado, actualizamos tu info de referidos.',
        data: existente, // <-- Fuga completa del documento Mongoose con PII y referidos
        updated: true,
    });
}
```

### PoC / Prueba de Reproducción
```bash
curl -s -X POST http://localhost:3010/api/registro \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Atacante Anónimo", "celular": "3001234567", "referidos": [{"nombre": "Infiltrado", "celular": "3009998877"}]}'
```
*Comportamiento vulnerable:* HTTP 200 devolviendo `data.referidos` y `data.nombre`.
*Comportamiento esperado:* HTTP 409 Conflict: `{"success": false, "message": "Este número ya está registrado.", "data": null}`.

### Código de Remediación
```javascript
const existente = await RegistroVip.findOne({ celular: celular.trim() });
if (existente) {
    return res.status(409).json({
        success: false,
        message: 'Este número ya se encuentra registrado en nuestra rifa.',
        data: null,
        updated: false
    });
}
```

---

## 2. `flores-mongodb-missing-authentication`
* **Severidad:** **CRITICAL** (Likelihood: High | Impact: Critical)
* **Archivos:**
  - `docker-compose.yml` (Líneas 2–10, 19)
  - `backend/config/db.js` (Línea 5)
  - `backend/.env` (Línea 2)

### PoC / Prueba de Reproducción
```bash
mongosh "mongodb://127.0.0.1:27017/floresbydolly" --eval "db.getCollectionNames();"
```
*Comportamiento vulnerable:* Lista de colecciones devuelta sin solicitar contraseña.
*Comportamiento esperado:* `MongoServerError: command listCollections requires authentication`.

### Código de Remediación
En `docker-compose.yml`:
```yaml
  mongodb:
    image: mongo:latest
    container_name: flores-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    command: mongod --auth
    volumes:
      - mongodb_data:/data/db
```
Actualizar `MONGODB_URI`:
```
MONGODB_URI=mongodb://${MONGO_ROOT_USER}:${MONGO_ROOT_PASSWORD}@mongodb:27017/floresbydolly?authSource=admin
```

---

## 3. `flores-missing-rate-limiting`
* **Severidad:** **MEDIUM** (Likelihood: High | Impact: Medium)
* **Archivos:**
  - `backend/server.js` (Líneas 10–36)
  - `backend/routes/auth.routes.js` (Línea 6)

### Código de Remediación
```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Demasiados intentos fallidos. Intenta más tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/login', loginLimiter, authController.login);
```

---

## 4. `flores-missing-security-headers`
* **Severidad:** **LOW** (Likelihood: High | Impact: Low)
* **Archivos:**
  - `backend/server.js` (Líneas 10–29)

### Código de Remediación
```javascript
const helmet = require('helmet');
app.use(helmet());
app.disable('x-powered-by');
```
