# Environmental & Deployment Validation Leads — FloresByDolly

## 1. Verificación y Rotación de Secretos en `.env`
* **Archivo:** `backend/.env`
* **Observación:**
  ```
  JWT_SECRET=flores_dolly_secret_key_2025_change_in_production
  CLOUDINARY_CLOUD_NAME=dcea1j9yk
  CLOUDINARY_API_KEY=799898354898547
  CLOUDINARY_API_SECRET=MWm6vZV5SC2kqqdbSggk8kONMlc
  ```
* **Acción:**
  1. Confirmar que `backend/.env` permanezca excluido en `.gitignore`.
  2. Reemplazar `JWT_SECRET` por una clave criptográfica de 64 caracteres generada con `openssl rand -hex 32`.
  3. Asegurar que las credenciales de Cloudinary no hayan sido expuestas previamente en commits públicos.

## 2. Permisos del Bot de WhatsApp
* **Archivo:** `docker-compose.yml` (`flores-whatsapp-bot`)
* **Observación:** El bot corre como `user: "1000:1000"` y monta `./whatsapp-bot/auth_session`.
* **Acción:** Asegurar que la carpeta local tenga permisos de lectura y escritura para el usuario 1000 (`chown -R 1000:1000 ./whatsapp-bot/auth_session`).

## 3. Ingress de Cloudflare Tunnel
* **Archivo:** `docker-compose.yml` (`flores-cloudflared`)
* **Acción:** Asegurarse de que el hostname público apunte exclusivamente al frontend (`http://flores-frontend:80`) y que MongoDB nunca tenga rutas de túnel expuestas.
