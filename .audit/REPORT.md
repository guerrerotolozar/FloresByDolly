# Informe de Auditoría de Seguridad — FloresByDolly

## 1. Configuración de la Auditoría
* **Perfil:** `full` (Full Audit Mode)
* **Objetivo:** `W:\FloresByDolly`
* **Referencia de Código:** `fcc1122`
* **Alcance:** `backend/`, `whatsapp-bot/`, `docker-compose.yml`
* **Política de Ejecución:** `sandboxed-source-and-local-only`
* **Verificación Independiente:** Verificado por subagente independiente (`af6946ec-81e2-445b-bc42-ad5408258f12`).
* **Validación de Esquemas:**
  - `validate-coverage-ledger.cjs`: **PASS (4 coverage units valid)**
  - `validate-findings.cjs`: **PASS (4 findings valid)**

---

## 2. Resumen de Postura de Seguridad

FloresByDolly cuenta con una arquitectura de microservicios limpia basada en Angular, Express, MongoDB y Cloudinary. Sin embargo, el análisis de seguridad descubrió **dos vulnerabilidades Críticas** y **dos de severidad Media/Baja**:
1. **Fuga Crítica de Datos Personales (PII) y Alteración de Cuentas:** El endpoint público `POST /api/registro` permite a cualquier atacante consultar números de celular y obtener nombres completos y la agenda de contactos/referidos, además de sobreescribir los nombres registrados sin autenticación.
2. **MongoDB sin Autenticación:** El servicio de base de datos se expone en `127.0.0.1:27017` y en la red puente de Docker sin `--auth` ni variables de entorno de inicialización de credenciales.
3. **Falta de Rate Limiting:** Ausencia de `express-rate-limit` en `POST /api/auth/login` y `POST /api/registro`.
4. **Falta de Cabeceras de Seguridad HTTP:** Ausencia de `helmet` en Express (sin X-Frame-Options ni nosniff, y divulgación de X-Powered-By).

---

## 3. Tabla de Hallazgos Confirmados

| Severidad | Identificador | Límite / Superficie Afectada | Resultado Observable |
|---|---|---|---|
| **CRITICAL** | `flores-pii-leak-user-tampering` | `POST /api/registro` | Fuga masiva de nombres, celulares y agenda de referidos; alteración no autorizada de nombres |
| **CRITICAL** | `flores-mongodb-missing-authentication` | MongoDB `127.0.0.1:27017` y red Docker | Acceso administrativo completo sin credenciales a todas las colecciones de la BD |
| **MEDIUM** | `flores-missing-rate-limiting` | `POST /api/auth/login` y `/api/registro` | Fuerza bruta sin restricciones contra credenciales de admin y scraping masivo |
| **LOW** | `flores-missing-security-headers` | Express API (`server.js`) | Ausencia de Helmet (riesgo de Clickjacking por iframe, MIME-sniffing y divulgación de Express) |

---

## 4. Detalle de Hallazgos y Remediación Inmediata

### [CRITICAL] `flores-pii-leak-user-tampering`
* **Ubicación:** `backend/controllers/registro.controller.js` (Líneas 36–55)
* **Impacto:** Si un celular ya existe, el servidor ejecuta `existente.nombre = nombre.trim()` y devuelve el objeto `existente` completo con todos los `referidos` (nombres y teléfonos de terceros).
* **Solución:** Retornar `409 Conflict` con mensaje genérico y `data: null`.

### [CRITICAL] `flores-mongodb-missing-authentication`
* **Ubicación:** `docker-compose.yml` (Líneas 2–10), `backend/config/db.js` (Línea 5)
* **Impacto:** Cualquier proceso en el host o contenedor en la red Docker puede leer y borrar colecciones sin contraseña.
* **Solución:** Configurar `mongod --auth`, agregar `MONGO_INITDB_ROOT_USERNAME` y `MONGO_INITDB_ROOT_PASSWORD` en `docker-compose.yml`, y actualizar `MONGODB_URI`.

### [MEDIUM] `flores-missing-rate-limiting`
* **Ubicación:** `backend/server.js` (Líneas 10–36), `backend/routes/auth.routes.js` (Línea 6)
* **Impacto:** Permite ataques continuos de fuerza bruta sobre el login administrativo.
* **Solución:** Instalar `express-rate-limit` y aplicar ventana de 15 minutos con máximo 5 intentos en `/login`.

### [LOW] `flores-missing-security-headers`
* **Ubicación:** `backend/server.js` (Líneas 10–29)
* **Impacto:** Exposición a clickjacking y MIME sniffing en `/uploads`.
* **Solución:** Instalar `helmet`, montar `app.use(helmet())` y desactivar `x-powered-by`.
