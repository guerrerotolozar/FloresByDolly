# 🚀 Guía de Despliegue: Conectar un Dominio (Hostinger) con Backend en AWS EC2

> **Autor:** Ronald Guerrero Toloza  
> **Proyecto:** Flores By Dolly  
> **Stack:** Angular (Frontend) + Node.js/Express (Backend) + MongoDB  
> **Fecha:** Marzo 2026

---

## 📋 Tabla de Contenidos

1. [Resumen de la Arquitectura](#1--resumen-de-la-arquitectura)
2. [Prerrequisitos](#2--prerrequisitos)
3. [Paso 1: Configurar los DNS en Hostinger](#3--paso-1-configurar-los-dns-en-hostinger)
4. [Paso 2: Instalar Nginx en EC2](#4--paso-2-instalar-nginx-en-ec2)
5. [Paso 3: Configurar Nginx como Reverse Proxy](#5--paso-3-configurar-nginx-como-reverse-proxy)
6. [Paso 4: Obtener un Certificado SSL Gratuito (Let's Encrypt)](#6--paso-4-obtener-un-certificado-ssl-gratuito-lets-encrypt)
7. [Paso 5: Abrir Puertos en AWS Security Groups](#7--paso-5-abrir-puertos-en-aws-security-groups)
8. [Paso 6: Configurar CORS en el Backend](#8--paso-6-configurar-cors-en-el-backend)
9. [Paso 7: Configurar el Frontend para Producción](#9--paso-7-configurar-el-frontend-para-producción)
10. [Paso 8: Compilar y Subir el Frontend a Hostinger](#10--paso-8-compilar-y-subir-el-frontend-a-hostinger)
11. [Paso 9: Verificar que Todo Funcione](#11--paso-9-verificar-que-todo-funcione)
12. [Solución de Problemas Comunes](#12--solución-de-problemas-comunes)
13. [Glosario de Términos](#13--glosario-de-términos)

---

## 1. 🏗 Resumen de la Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET                                 │
│                                                                 │
│   Usuario escribe: www.floresbydolly.com                        │
│        │                                                        │
│        ▼                                                        │
│   ┌──────────────┐         ┌──────────────────────────────────┐ │
│   │  HOSTINGER   │         │         AWS EC2                  │ │
│   │              │         │                                  │ │
│   │  Sirve el    │  HTTP   │  ┌───────────┐    ┌───────────┐  │ │
│   │  Frontend    │ ──────► │  │   Nginx   │───►│  Node.js  │  │ │
│   │  (Angular)   │  HTTPS  │  │ (puerto   │    │ (puerto   │  │ │
│   │              │         │  │  80/443)  │    │  3000)    │  │ │
│   │  Dominio:    │         │  └───────────┘    └─────┬─────┘  │ │
│   │  www.flores  │         │                         │        │ │
│   │  bydolly.com │         │  Subdominio:      ┌─────▼─────┐  │ │
│   │              │         │  api.floresby     │  MongoDB  │  │ │
│   │              │         │  dolly.com        │  (local)  │  │ │
│   └──────────────┘         │                   └───────────┘  │ │
│                            └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### ¿Cómo funciona?

1. El usuario entra a `www.floresbydolly.com` → **Hostinger** le sirve los archivos del frontend (HTML, CSS, JS).
2. Angular necesita datos (categorías, productos) → Le hace una petición a `https://api.floresbydolly.com`.
3. El DNS de Hostinger sabe que `api.floresbydolly.com` apunta a la **IP de EC2** → La petición llega al servidor.
4. **Nginx** recibe la petición en el puerto 443 (HTTPS), le quita el SSL, y se la pasa a **Node.js** (puerto 3000).
5. Node.js consulta **MongoDB**, obtiene los datos, y los devuelve al navegador del usuario.

---

## 2. 📦 Prerrequisitos

Antes de empezar, asegúrate de tener:

| Recurso | Descripción |
|---------|-------------|
| **Dominio en Hostinger** | Un dominio comprado y activo (ej: `floresbydolly.com`) |
| **Plan de Hosting en Hostinger** | Con acceso a la Zona DNS y acceso FTP |
| **Instancia EC2 en AWS** | Con Ubuntu, tu backend corriendo con PM2, y MongoDB instalado |
| **Acceso SSH al EC2** | Para conectarte por terminal (ej: `ssh -i clave.pem ubuntu@tu-ip`) |
| **FileZilla** | Instalado en tu computador para subir archivos por FTP |
| **Angular CLI** | Instalado localmente para compilar el frontend |

---

## 3. 🌐 Paso 1: Configurar los DNS en Hostinger

Los **DNS** son como la "guía telefónica" de internet. Le dicen al mundo a qué servidor dirigirse cuando alguien escribe tu dominio.

### Crear un subdominio para el Backend (API)

1. Entra a [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Ve a **Dominios** → Selecciona tu dominio → **DNS / Nameservers** → **Registros DNS**
3. Busca el formulario de **"Añadir registro"** en la parte inferior
4. Llénalo así:

| Campo | Valor | Explicación |
|-------|-------|-------------|
| **Type** | `A` | Registro de tipo "Dirección" (apunta a una IP) |
| **Nombre** | `api` | Esto crea el subdominio `api.tudominio.com` |
| **Apunta a** | `TU_IP_PUBLICA_EC2` | La IPv4 pública de tu instancia EC2 (ej: `18.216.94.22`) |
| **TTL** | `14400` | Tiempo de vida (déjalo por defecto) |

5. Click en **"Añadir registro"**

> [!IMPORTANT]
> Los cambios de DNS pueden tardar entre **5 minutos y 2 horas** en propagarse por todo el internet. Ten paciencia.

### ¿Dónde encuentro mi IP Pública de EC2?

1. Abre la consola de AWS → **EC2** → **Instancias**
2. Selecciona tu instancia
3. En el panel inferior busca: **"Dirección IPv4 pública"**

---

## 4. 🔧 Paso 2: Instalar Nginx en EC2

**Nginx** (pronunciado "engine-x") es un servidor web que actúa como **intermediario** (reverse proxy) entre internet y tu aplicación de Node.js. Es necesario porque:

- Le agrega el **certificado SSL** (HTTPS / candadito 🔒) a tu backend
- Escucha en el puerto estándar (80/443) para que los usuarios no tengan que escribir `:3000` en la URL
- Es más eficiente y seguro que exponer Node.js directamente

### Comandos (conéctate por SSH a tu EC2):

```bash
# 1. Actualizar la lista de paquetes disponibles
sudo apt update

# 2. Instalar Nginx, Certbot (para SSL) y el plugin de Nginx para Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# 3. Iniciar Nginx y configurarlo para que arranque automáticamente
sudo systemctl start nginx
sudo systemctl enable nginx
```

### ¿Qué hace cada comando?

| Comando | Explicación |
|---------|-------------|
| `sudo apt update` | Actualiza la lista de programas disponibles para instalar |
| `sudo apt install -y nginx` | Instala el servidor web Nginx. `-y` acepta automáticamente |
| `certbot` | Herramienta que gestiona certificados SSL gratuitos de Let's Encrypt |
| `python3-certbot-nginx` | Plugin que permite a Certbot configurar Nginx automáticamente |
| `systemctl start nginx` | Arranca Nginx ahora mismo |
| `systemctl enable nginx` | Hace que Nginx se inicie solo cada vez que se prenda el servidor |

---

## 5. ⚙️ Paso 3: Configurar Nginx como Reverse Proxy

Ahora le decimos a Nginx: *"Cuando alguien llegue buscando `api.tudominio.com`, pásale la petición a Node.js en el puerto 3000"*.

### Crear el archivo de configuración:

```bash
sudo bash -c 'cat > /etc/nginx/sites-available/api.tudominio.com << EOF
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF'
```

> [!NOTE]
> Reemplaza `api.tudominio.com` por tu subdominio real (ej: `api.floresbydolly.com`).
> Reemplaza `3000` por el puerto donde corre tu backend (revisa tu archivo `.env`).

### Desglose del archivo de configuración:

| Línea | Explicación |
|-------|-------------|
| `listen 80` | Escucha en el puerto 80 (HTTP estándar) |
| `server_name api.tudominio.com` | Solo responde cuando la petición viene al subdominio de la API |
| `proxy_pass http://localhost:3000` | **¡La magia!** Redirige todo al backend de Node.js |
| `proxy_set_header Host` | Le pasa a Node.js el nombre del dominio original |
| `proxy_set_header X-Real-IP` | Le dice a Node.js cuál es la IP real del visitante |
| `proxy_set_header X-Forwarded-Proto` | Le dice a Node.js si el usuario conectó por HTTP o HTTPS |

### Activar la configuración:

```bash
# 1. Crear un enlace simbólico para activar el sitio
sudo ln -s /etc/nginx/sites-available/api.tudominio.com /etc/nginx/sites-enabled/

# 2. Verificar que la configuración no tenga errores de sintaxis
sudo nginx -t

# 3. Reiniciar Nginx para aplicar los cambios
sudo systemctl restart nginx
```

> [!TIP]
> Si `nginx -t` dice **"syntax is ok"** y **"test is successful"**, todo está perfecto. Si da error, revisa que no haya errores de tipeo en el archivo.

---

## 6. 🔒 Paso 4: Obtener un Certificado SSL Gratuito (Let's Encrypt)

**Let's Encrypt** es una autoridad certificadora que emite certificados SSL **100% gratuitos**. Certbot se encarga de pedirlo, instalarlo y configurar Nginx automáticamente.

```bash
sudo certbot --nginx -d api.tudominio.com
```

### El proceso interactivo te pedirá:

1. **Tu email** → Para notificarte cuando el certificado esté por vencer
2. **Aceptar los términos de servicio** → Escribe `y` y dale Enter
3. **Compartir email con EFF** → Puedes decir `y` o `n`, no afecta nada

### Si todo sale bien, verás:

```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/api.tudominio.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/api.tudominio.com/privkey.pem

Deploying certificate
Successfully deployed certificate for api.tudominio.com
Congratulations! You have successfully enabled HTTPS on https://api.tudominio.com
```

> [!IMPORTANT]
> El certificado se **renueva automáticamente** cada 90 días gracias a un timer que Certbot configura. No tienes que hacer nada más.

---

## 7. 🛡 Paso 5: Abrir Puertos en AWS Security Groups

AWS bloquea todo el tráfico por defecto. Necesitas abrir los puertos para que el mundo pueda llegar a tu servidor.

1. Ve a **AWS Console** → **EC2** → Tu instancia → Pestaña **Seguridad**
2. Click en el **Grupo de Seguridad** (ej: `sg-0abc123def`)
3. Click en **"Editar reglas de entrada"** (Inbound rules)
4. Agrega estas reglas:

| Tipo  | Puerto | Origen      | Para qué                                    |
|------ |--------|-------------|---------------------------------------------|
| HTTP  | 80     | `0.0.0.0/0` | Nginx HTTP (redirige a HTTPS)               |
| HTTPS | 443    | `0.0.0.0/0` | Nginx HTTPS (la conexión segura)            |
| SSH   | 22     | `Tu IP/32`  | Para conectarte por SSH (restringe a tu IP) |

> [!WARNING]
> **No** expongas el puerto 3000 (tu backend) directamente. Nginx ya lo maneja internamente. Exponer Node.js directamente es un riesgo de seguridad.

---

## 8. 🔗 Paso 6: Configurar CORS en el Backend

**CORS** (Cross-Origin Resource Sharing) le dice a tu backend qué páginas web tienen permiso de hablar con él. Necesitas agregar tu dominio real.

En tu archivo `server.js` (o donde configures Express), asegúrate de tener:

```javascript
app.use(cors({
    origin: [
        'http://localhost:4200',           // Desarrollo local
        'https://www.tudominio.com',       // Tu dominio con www
        'https://tudominio.com',           // Tu dominio sin www
    ],
    credentials: true,
}));
```

> [!CAUTION]
> Si olvidas agregar tu dominio aquí, el navegador bloqueará todas las peticiones del frontend al backend con un error de CORS, aunque todo lo demás esté perfecto.

---

## 9. 🔨 Paso 7: Configurar el Frontend para Producción

### Archivo `environment.production.ts`

Este archivo le dice a Angular **a dónde mandar las peticiones** cuando está en producción:

```typescript
// src/environments/environment.production.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.tudominio.com/api',  // ← ¡Tu subdominio con HTTPS!
};
```

### Archivo `angular.json`

Asegúrate de que la configuración de producción reemplace el archivo de entorno correcto:

```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.production.ts"
      }
    ]
  }
}
```

### Auth Interceptor (para rutas protegidas)

Si tu backend tiene rutas protegidas con JWT, necesitas un **interceptor** que le pegue el token a cada petición:

```typescript
// src/app/interceptors/auth-interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

Regístralo en `app.config.ts`:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
```

---

## 10. 📤 Paso 8: Compilar y Subir el Frontend a Hostinger

### Compilar el frontend:

```bash
# Desde la carpeta del frontend
ng build --configuration production
```

Esto genera la carpeta `dist/frontend/` (o `dist/nombre-de-tu-proyecto/`) con todos los archivos optimizados y listos para producción.

### Subir a Hostinger con FileZilla:

1. Abre **FileZilla**
2. Conéctate a tu Hostinger con las credenciales FTP:
   - **Host:** Busca en Hostinger → Archivos → Cuentas FTP
   - **Usuario:** Tu usuario FTP
   - **Contraseña:** Tu contraseña FTP
   - **Puerto:** `21`
3. En el panel derecho (servidor), navega a `public_html/`
4. **Borra** el contenido anterior de `public_html/`
5. En el panel izquierdo (tu PC), navega a `dist/frontend/browser/` (o `dist/frontend/`)
6. Arrastra **todo el contenido** al `public_html/` del servidor

> [!TIP]
> Si tu proyecto Angular usa rutas (ej: `/catalogo`, `/admin`), necesitas un archivo `.htaccess` en `public_html/` para que Hostinger no muestre "404 Not Found" al recargar la página:
> ```apache
> RewriteEngine On
> RewriteBase /
> RewriteRule ^index\.html$ - [L]
> RewriteCond %{REQUEST_FILENAME} !-f
> RewriteCond %{REQUEST_FILENAME} !-d
> RewriteRule . /index.html [L]
> ```

---

## 11. ✅ Paso 9: Verificar que Todo Funcione

### Checklist de verificación:

- [ ] **Health Check del Backend:** Abre `https://api.tudominio.com/api/health` → Debe responder `{"status":"ok"}`
- [ ] **Frontend carga:** Abre `https://www.tudominio.com` → Debe mostrar tu página
- [ ] **Datos cargan:** Navega al catálogo → Los productos deben aparecer
- [ ] **Admin funciona:** Inicia sesión en `/admin` → Debe poder editar productos
- [ ] **SSL activo:** Verifica que el candadito 🔒 aparezca en la barra del navegador

### Comando útil para verificar el estado:

```bash
# En tu EC2, verificar que todo esté corriendo:
sudo systemctl status nginx      # Nginx debe estar "active (running)"
pm2 status                       # Tu backend debe estar "online"
```

---

## 12. 🔧 Solución de Problemas Comunes

### `ERR_CONNECTION_TIMED_OUT`
**Causa:** El puerto 443 (HTTPS) no está abierto en el Security Group de AWS.
**Solución:** Ve al [Paso 5](#7--paso-5-abrir-puertos-en-aws-security-groups) y agrega la regla de HTTPS.

### `ERR_SSL_PROTOCOL_ERROR`
**Causa:** El frontend intenta conectarse por HTTPS pero el backend no tiene certificado SSL.
**Solución:** Instala el certificado con Certbot ([Paso 4](#6--paso-4-obtener-un-certificado-ssl-gratuito-lets-encrypt)).

### `Mixed Content` / Contenido Mixto
**Causa:** Tu frontend se sirve por HTTPS (`https://www.tudominio.com`) pero intenta llamar al backend por HTTP (`http://api...`).
**Solución:** Asegúrate de usar `https://` en tu `environment.production.ts`.

### `401 Unauthorized`
**Causa:** El frontend no envía el token JWT en las peticiones protegidas.
**Solución:** Implementa el Auth Interceptor ([Paso 7](#9--paso-7-configurar-el-frontend-para-producción)).

### `CORS Error`
**Causa:** Tu dominio no está en la lista de orígenes permitidos del backend.
**Solución:** Agrega tu dominio al array de `origin` en la configuración de CORS ([Paso 6](#8--paso-6-configurar-cors-en-el-backend)).

### `404 Not Found` al recargar rutas de Angular
**Causa:** Hostinger no sabe que todas las rutas deben redirigir a `index.html`.
**Solución:** Crea un archivo `.htaccess` en `public_html/` (ver [Paso 8](#10--paso-8-compilar-y-subir-el-frontend-a-hostinger)).

### `Unable to locate package python3-certbot-nginx`
**Causa:** Error de tipeo al escribir el nombre del paquete.
**Solución:** Copia y pega el comando exactamente como está en la guía. Es `python3-certbot-nginx` (con **t** en cer**t**bot).

---

## 13. 📖 Glosario de Términos

| Término | Significado |
|---------|-------------|
| **DNS** | Sistema de Nombres de Dominio. Traduce `floresbydolly.com` a la IP `18.216.94.22` |
| **Registro A** | Tipo de registro DNS que apunta un nombre directamente a una dirección IP |
| **Nginx** | Servidor web que actúa como "portero" entre internet y tu aplicación |
| **Reverse Proxy** | Patrón donde Nginx recibe peticiones de internet y las reenvía internamente a Node.js |
| **SSL / TLS** | Protocolo de seguridad que encripta la comunicación entre el navegador y tu servidor |
| **Let's Encrypt** | Autoridad certificadora que emite certificados SSL gratuitos |
| **Certbot** | Herramienta que automatiza la obtención y renovación de certificados SSL |
| **CORS** | Mecanismo de seguridad que controla qué dominios pueden hacer peticiones a tu API |
| **PM2** | Gestor de procesos para Node.js que mantiene tu backend corriendo 24/7 |
| **Security Group** | Firewall virtual de AWS que controla qué tráfico entra y sale de tu EC2 |
| **JWT** | JSON Web Token. Un "carnet de identidad digital" que el frontend envía al backend para autenticarse |
| **Interceptor** | En Angular, una función que modifica automáticamente todas las peticiones HTTP antes de enviarlas |
| **FileZilla** | Programa para transferir archivos entre tu PC y un servidor por FTP |
| **`.htaccess`** | Archivo de configuración de Apache (usado por Hostinger) para manejar redirecciones y rutas |

---

> **💡 Consejo final:** Si algo no funciona, siempre revisa **en este orden**: DNS → Security Groups → Nginx → CORS → Frontend Environment. El 90% de los problemas están en los puertos bloqueados o en el CORS mal configurado.

---

*Documento creado como parte del Bootcamp de Desarrollo Web Full Stack. ¡Compártelo con tus compañeros! 🎓*
