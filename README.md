# Nexo Hogar IA — Plataforma de Domótica con IA Privada

Plataforma dockerizada para cotizar, vender y administrar hardware domótico potenciado por software de IA propietario (privado, local y sin nube).

## Stack

| Capa       | Tecnología                                  |
| ---------- | ------------------------------------------- |
| Frontend   | React 19 + Vite + Tailwind CSS + Framer Motion |
| Backend    | Node.js + Express + Prisma ORM              |
| Base datos | PostgreSQL 16                               |
| Contenedor | Docker + docker-compose                     |

## Estructura del proyecto

```
.
├── docker-compose.yml       # Orquestación de servicios
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma/schema.prisma  # Modelo de datos
│   ├── prisma/seed.ts        # Seed de admin + config inicial
│   └── src/
│       ├── index.ts          # Servidor Express
│       ├── middleware/auth.ts # JWT authentication
│       └── routes/           # API REST (auth, admin, quotes, products)
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx           # Router principal
│       ├── api.ts            # Cliente HTTP tipado
│       ├── components/       # Componentes reutilizables
│       └── pages/            # Páginas (Home, Software, Admin)
└── docs/
    ├── AI_LOCAL_ARCHITECTURE.md
    └── DATABASE_ARCHITECTURE.md
```

## Requisitos

- Docker 24+ y Docker Compose v2

## Comandos DevOps

### Levantar todo el proyecto

```bash
docker compose up --build
```

Esto inicia PostgreSQL, backend (Express en puerto 3001) y frontend (Vite en puerto 5173).

### Levantar en background (detached)

```bash
docker compose up --build -d
```

### Ver logs en vivo

```bash
# Todos los servicios
docker compose logs -f

# Solo el frontend
docker compose logs -f frontend

# Solo el backend
docker compose logs -f backend

# Solo la base de datos
docker compose logs -f postgres
```

### Detener los servicios

```bash
docker compose down
```

### Detener y eliminar volúmenes (borra la base de datos)

```bash
docker compose down -v
```

### Reconstruir imágenes desde cero

```bash
docker compose build --no-cache
docker compose up
```

### Ejecutar seed manualmente

```bash
docker compose exec backend npx prisma db seed
```

### Acceder a la base de datos

```bash
docker compose exec postgres psql -U nexo -d nexo_hogar_ia
```

### URLs locales

| Servicio  | URL                                    | Descripción                         |
| --------- | -------------------------------------- | ----------------------------------- |
| Frontend  | http://localhost:5173                  | Landing + cotizador                 |
| Licencia  | http://localhost:5173/software         | Página de ventas del Cerebro IA     |
| Admin     | http://localhost:5173/admin            | Login del panel administrativo      |
| Dashboard | http://localhost:5173/admin/dashboard  | Panel de admin (requiere login)     |
| API       | http://localhost:3001/api/health       | Health check del backend            |
| DB        | localhost:5432                         | PostgreSQL                          |

### Credenciales del panel admin (desarrollo)

Copia `.env.example` a `.env` y define `ADMIN_EMAIL` y `ADMIN_PASSWORD` antes de ejecutar el seed.

## Funcionalidades

### Cotizador interactivo
- Selección de productos domóticos con contadores +/-
- Cálculo en tiempo real de equipos, instalación y total
- **CTA principal:** "Pagar Anticipo del 60%" con simulador de pasarela
- **CTA secundario:** "Asesoría por WhatsApp" con resumen de cotización
- Animaciones Framer Motion en transiciones, hover y carga

### Página de ventas del software (/software)
- Explica el modelo de licenciamiento del "Cerebro IA"
- Precios: licencia única + suscripción mensual
- Beneficios: privacidad total, actualizaciones, soporte

### Panel administrador (/admin)
- Autenticación JWT
- **Solicitudes:** lista de cotizaciones entrantes con cambio de estado (pendiente → contactado → completado)
- **Precios:** editor dinámico de:
  - Costo de instalación por punto
  - Precio de licencia del software
  - Valor de suscripción mensual
  - Precios de cada producto del catálogo (bombillos, cámaras, servidores, etc.)

## Modelo de negocio

1. El cliente paga un **anticipo del 60%** sobre el hardware + instalación
2. Al completar la instalación, paga el **40% restante**
3. Activa la **suscripción mensual del Cerebro IA** para mantenimiento, actualizaciones y soporte
4. Todo procesamiento de IA corre en un rack local dentro del edificio — los datos nunca salen a la nube
