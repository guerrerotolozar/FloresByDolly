<![CDATA[# 🌸 Flores By Dolly

**Plataforma web para un emprendimiento familiar de flores ubicado en Bogotá, Colombia.**

Flores By Dolly es una tienda en línea que permite a los clientes explorar un catálogo de arreglos florales, conocer la galería de trabajos realizados y contactar directamente por WhatsApp para realizar pedidos. Incluye un panel de administración completo para gestionar productos, categorías y la galería de imágenes.

---

## 📸 Vista General

| Página        | Descripción                                      |
|---------------|--------------------------------------------------|
| **Inicio**    | Landing page con categorías destacadas y productos |
| **Catálogo**  | Listado completo de productos con filtros          |
| **Galería**   | Galería fotográfica de arreglos realizados         |
| **Contacto**  | Formulario de contacto e información del negocio   |
| **Admin**     | Panel de administración protegido con JWT          |

---

## 🛠️ Tech Stack

### Frontend
| Tecnología        | Versión  | Uso                              |
|-------------------|----------|----------------------------------|
| Angular           | 21       | Framework SPA                    |
| TypeScript        | 5.9      | Lenguaje principal               |
| Bootstrap         | 5.3      | Sistema de grid y componentes UI |
| Font Awesome      | 7.2      | Iconografía                      |
| AOS               | 2.3      | Animaciones al hacer scroll      |
| Zone.js           | 0.16     | Change detection                 |
| RxJS              | 7.8      | Programación reactiva            |

### Backend
| Tecnología            | Versión | Uso                           |
|-----------------------|---------|-------------------------------|
| Node.js + Express     | 5.x     | Servidor REST API             |
| MongoDB + Mongoose    | 9.x     | Base de datos NoSQL           |
| Cloudinary            | 1.41    | Almacenamiento de imágenes    |
| JWT (jsonwebtoken)    | 9.x     | Autenticación                 |
| bcryptjs              | 3.x     | Hashing de contraseñas        |
| Multer                | 2.x     | Subida de archivos            |
| express-validator     | 7.x     | Validación de datos           |

---

## 📁 Estructura del Proyecto

```
FloresByDolly/
├── backend/
│   ├── config/          # Configuración de BD y Cloudinary
│   ├── controllers/     # Lógica de negocio
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
        │   ├── pages/        # Páginas principales
        │   │   ├── home/
        │   │   ├── catalogo/
        │   │   ├── galeria/
        │   │   └── contacto/
        │   ├── admin/        # Panel de administración
        │   │   ├── admin-dashboard/
        │   │   ├── admin-products/
        │   │   ├── admin-product-form/
        │   │   ├── admin-categories/
        │   │   ├── admin-gallery/
        │   │   ├── admin-login/
        │   │   └── admin-layout/
        │   ├── services/     # Servicios Angular (HTTP)
        │   ├── shared/       # Componentes reutilizables (header, footer)
        │   └── guards/       # Guards de autenticación
        ├── environments/     # Configuración por entorno
        └── assets/           # Imágenes y recursos estáticos
```

---

## 🚀 Instalación y Ejecución Local

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

> El backend estará disponible en `http://localhost:3000`

### 3. Configurar el Frontend

```bash
cd frontend
npm install
npm start
```

> El frontend estará disponible en `http://localhost:4200`

### 4. (Opcional) Seed de datos iniciales

```bash
cd backend
npm run seed
```

---

## 🔌 API Endpoints

| Método | Ruta                   | Descripción                 | Autenticación |
|--------|------------------------|-----------------------------|---------------|
| POST   | `/api/auth/register`   | Registro de usuario         | No            |
| POST   | `/api/auth/login`      | Inicio de sesión            | No            |
| GET    | `/api/products`        | Listar productos            | No            |
| POST   | `/api/products`        | Crear producto              | JWT (Admin)   |
| PUT    | `/api/products/:id`    | Actualizar producto         | JWT (Admin)   |
| DELETE | `/api/products/:id`    | Eliminar producto           | JWT (Admin)   |
| GET    | `/api/categories`      | Listar categorías           | No            |
| POST   | `/api/categories`      | Crear categoría             | JWT (Admin)   |
| PUT    | `/api/categories/:id`  | Actualizar categoría        | JWT (Admin)   |
| DELETE | `/api/categories/:id`  | Eliminar categoría          | JWT (Admin)   |
| GET    | `/api/gallery`         | Listar galería              | No            |
| POST   | `/api/gallery`         | Subir imagen a galería      | JWT (Admin)   |
| DELETE | `/api/gallery/:id`     | Eliminar imagen de galería  | JWT (Admin)   |
| POST   | `/api/upload`          | Subir imagen (Cloudinary)   | JWT (Admin)   |
| GET    | `/api/health`          | Health check del servidor   | No            |

---

## 🌐 Despliegue

| Componente | Plataforma         |
|------------|--------------------|
| Frontend   | AWS S3 (Static)    |
| Backend    | AWS EC2 / Render   |
| Base de Datos | MongoDB Atlas   |
| Imágenes   | Cloudinary         |

---

## ✨ Funcionalidades

- 🛍️ **Catálogo de productos** — Navegación por categorías con filtros
- 📷 **Galería de fotos** — Muestra de arreglos realizados
- 🔐 **Panel de administración** — CRUD completo para productos, categorías y galería
- 🔑 **Autenticación JWT** — Login seguro con roles (admin/cliente)
- ☁️ **Subida de imágenes a Cloudinary** — Almacenamiento optimizado en la nube
- 📱 **Diseño responsive** — Adaptado para móvil con menú hamburguesa
- 💬 **Integración con WhatsApp** — Botón de contacto directo
- 🎨 **Animaciones AOS** — Transiciones suaves al hacer scroll

---

## 📍 Información del Negocio

| Dato        | Detalle                          |
|-------------|----------------------------------|
| 📍 Dirección | Transversal 73 #11C-20, Bogotá  |
| 🏪 Local     | Carnova Premium                  |
| 📞 Teléfono  | 311 458 2898                     |
| 🕐 Horario   | Lun - Sáb: 9:00am - 7:00pm     |

---

## 👥 Equipo

Desarrollado con 💚 por el equipo de **Flores By Dolly**.

---

## 📄 Licencia

Este proyecto está bajo la licencia ISC.
]]>
