# Flores By Dolly

**Plataforma web para un emprendimiento familiar de flores ubicado en Bogota, Colombia.**

Flores By Dolly es una tienda en linea que permite a los clientes explorar un catalogo de arreglos florales, conocer la galeria de trabajos realizados y contactar directamente por WhatsApp para realizar pedidos. Incluye un panel de administracion completo para gestionar productos, categorias y la galeria de imagenes.

---

## Vista General

| Pagina       | Descripcion                                        |
| ------------ | -------------------------------------------------- |
| **Inicio**   | Landing page con categorias destacadas y productos |
| **Catalogo** | Listado completo de productos con filtros          |
| **Galeria**  | Galeria fotografica de arreglos realizados         |
| **Contacto** | Formulario de contacto e informacion del negocio   |
| **Admin**    | Panel de administracion protegido con JWT          |

---

## Tech Stack

### Frontend

| Tecnologia   | Version | Uso                              |
| ------------ | ------- | -------------------------------- |
| Angular      | 21      | Framework SPA                    |
| TypeScript   | 5.9     | Lenguaje principal               |
| Bootstrap    | 5.3     | Sistema de grid y componentes UI |
| Font Awesome | 7.2     | Iconografia                      |
| AOS          | 2.3     | Animaciones al hacer scroll      |
| Zone.js      | 0.16    | Change detection                 |
| RxJS         | 7.8     | Programacion reactiva            |

### Backend

| Tecnologia         | Version | Uso                        |
| ------------------ | ------- | -------------------------- |
| Node.js + Express  | 5.x     | Servidor REST API          |
| MongoDB + Mongoose | 9.x     | Base de datos NoSQL        |
| Cloudinary         | 1.41    | Almacenamiento de imagenes |
| JWT (jsonwebtoken) | 9.x     | Autenticacion              |
| bcryptjs           | 3.x     | Hashing de contrasenas     |
| Multer             | 2.x     | Subida de archivos         |
| express-validator  | 7.x     | Validacion de datos        |

---

## Estructura del Proyecto

```
FloresByDolly/
├── backend/
│   ├── config/          # Configuracion de BD y Cloudinary
│   ├── controllers/     # Logica de negocio
│   │   ├── auth.controller.js
│   │   ├── category.controller.js
│   │   ├── gallery.controller.js
│   │   ├── product.controller.js
│   │   └── upload.controller.js
│   ├── middleware/       # Auth middleware (JWT)
│   ├── models/           # Esquemas de Mongoose
│   │   ├── Category.js
│   │   ├── Gallery.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/           # Rutas de la API
│   ├── seed/             # Datos iniciales para la BD
│   ├── server.js         # Punto de entrada del servidor
│   └── .env              # Variables de entorno (no incluido en repo)
│
└── frontend/
    └── src/
        ├── app/
        │   ├── pages/        # Paginas principales
        │   │   ├── home/
        │   │   ├── catalogo/
        │   │   ├── galeria/
        │   │   └── contacto/
        │   ├── admin/        # Panel de administracion
        │   │   ├── admin-dashboard/
        │   │   ├── admin-products/
        │   │   ├── admin-product-form/
        │   │   ├── admin-categories/
        │   │   ├── admin-gallery/
        │   │   ├── admin-login/
        │   │   └── admin-layout/
        │   ├── services/     # Servicios Angular (HTTP)
        │   ├── shared/       # Componentes reutilizables (header, footer)
        │   └── guards/       # Guards de autenticacion
        ├── environments/     # Configuracion por entorno
        └── assets/           # Imagenes y recursos estaticos
```

---

## Instalacion y Ejecucion Local

### Prerrequisitos

- **Node.js** v18 o superior
- **MongoDB** corriendo localmente o una URI de MongoDB Atlas
- **npm** v9 o superior

### 1. Clonar el repositorio

```bash
git clone https://github.com/guerrerotolozar/FloresByDolly.git
cd FloresByDolly
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/floresbydolly
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

Iniciar el servidor:

```bash
npm start
```

El backend estara disponible en `http://localhost:3000`

### 3. Configurar el Frontend

```bash
cd frontend
npm install
npm start
```

El frontend estara disponible en `http://localhost:4200`

### 4. (Opcional) Seed de datos iniciales

```bash
cd backend
npm run seed
```

---

## API Endpoints

| Metodo | Ruta                  | Descripcion                | Auth        |
| ------ | --------------------- | -------------------------- | ----------- |
| POST   | `/api/auth/register`  | Registro de usuario        | No          |
| POST   | `/api/auth/login`     | Inicio de sesion           | No          |
| GET    | `/api/products`       | Listar productos           | No          |
| POST   | `/api/products`       | Crear producto             | JWT (Admin) |
| PUT    | `/api/products/:id`   | Actualizar producto        | JWT (Admin) |
| DELETE | `/api/products/:id`   | Eliminar producto          | JWT (Admin) |
| GET    | `/api/categories`     | Listar categorias          | No          |
| POST   | `/api/categories`     | Crear categoria            | JWT (Admin) |
| PUT    | `/api/categories/:id` | Actualizar categoria       | JWT (Admin) |
| DELETE | `/api/categories/:id` | Eliminar categoria         | JWT (Admin) |
| GET    | `/api/gallery`        | Listar galeria             | No          |
| POST   | `/api/gallery`        | Subir imagen a galeria     | JWT (Admin) |
| DELETE | `/api/gallery/:id`    | Eliminar imagen de galeria | JWT (Admin) |
| POST   | `/api/upload`         | Subir imagen (Cloudinary)  | JWT (Admin) |
| GET    | `/api/health`         | Health check del servidor  | No          |

---

## Despliegue

| Componente    | Plataforma       |
| ------------- | ---------------- |
| Frontend      | AWS S3 (Static)  |
| Backend       | AWS EC2 / Render |
| Base de Datos | MongoDB Atlas    |
| Imagenes      | Cloudinary       |

---

## Funcionalidades

- **Catalogo de productos** - Navegacion por categorias con filtros
- **Galeria de fotos** - Muestra de arreglos realizados
- **Panel de administracion** - CRUD completo para productos, categorias y galeria
- **Autenticacion JWT** - Login seguro con roles (admin/cliente)
- **Subida de imagenes a Cloudinary** - Almacenamiento optimizado en la nube
- **Diseno responsive** - Adaptado para movil con menu hamburguesa
- **Integracion con WhatsApp** - Boton de contacto directo
- **Animaciones AOS** - Transiciones suaves al hacer scroll

---

## Informacion del Negocio

| Dato      | Detalle                        |
| --------- | ------------------------------ |
| Direccion | Transversal 73 #11C-20, Bogota |
| Local     | Carnova Premium                |
| Telefono  | 311 458 2898                   |
| Horario   | Lun - Sab: 9:00am - 7:00pm     |

---

## Equipo

Desarrollado con amor por el equipo de **Flores By Dolly**.

---

## Licencia

Este proyecto esta bajo la licencia ISC.

---

## 🛡️ Auditoría de Seguridad Independiente (Full Audit Mode)

Se ejecutó una auditoría de seguridad exhaustiva utilizando la skill especializada `security-audit` de Google Antigravity en modo **Full Audit**. El análisis cubrió las superficies de entrada HTTP, controladores, middlewares de autenticación, integración con MongoDB y contenedor del bot de WhatsApp, validando los límites de confianza y sumideros de datos mediante subagentes verificadores independientes.

Los resultados y artefactos formales se encuentran registrados en el directorio [`.audit/`](./.audit/):
- **[`REPORT.md`](./.audit/REPORT.md)**: Informe ejecutivo de seguridad, desglose de postura y matriz de hallazgos.
- **[`FINDINGS-DETAIL.md`](./.audit/FINDINGS-DETAIL.md)**: Trazas fuente a sumidero, reproducciones delimitadas y casos de prueba de regresión.
- **[`NEEDS-VALIDATION.md`](./.audit/NEEDS-VALIDATION.md)**: Validaciones de secretos en `.env`, permisos de sesión en WhatsApp y reglas de Cloudflare Tunnel.
- **[`findings.json`](./.audit/findings.json)**: Registros estructurados validados contra el esquema JSON oficial (`report-schema.json`).
- **[`coverage-ledger.json`](./.audit/coverage-ledger.json)**: Matriz determinista de cobertura de superficies analizadas.

### Hallazgos Clave Identificados para Remediación:
1. **[CRITICAL] Fuga de PII y Sobre-escritura no autorizada en `POST /api/registro` (`backend/controllers/registro.controller.js`)**: Al coincidir un número de celular, se sobrescribe el nombre del cliente y se retorna el documento completo con todos los contactos referidos (nombres y celulares de terceros) sin autenticación.
2. **[CRITICAL] Ausencia de autenticación en MongoDB (`docker-compose.yml` y `backend/config/db.js`)**: El servicio de base de datos se expone en `127.0.0.1:27017` y en la red puente de Docker sin `--auth` ni variables de inicialización de credenciales.
3. **[MEDIUM] Falta de Rate Limiting (`backend/server.js` y `backend/routes/auth.routes.js`)**: Ausencia de limitación de tasa ante ataques de fuerza bruta en el login administrativo y scraping masivo en el formulario de la rifa.
4. **[LOW] Falta de Cabeceras de Seguridad HTTP (`backend/server.js`)**: Omisión de `helmet` (riesgo de Clickjacking, MIME sniffing y divulgación de `X-Powered-By: Express`).

