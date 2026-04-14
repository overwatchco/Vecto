# VECTO® — Fleet Management System — Estado del Proyecto

> Última actualización: 2026-04-14

---

## Design System

### Colores
| Token       | Valor       | Uso                              |
|-------------|-------------|----------------------------------|
| `--black`   | `#000000`   | Fondo principal de la app        |
| `--navy`    | `#0D2035`   | Panel lateral del login, cards   |
| `--yellow`  | `#FFC107`   | Color primario / acento / CTA    |
| `--yellow-dark` | `#E6AC00` | Hover de botones primarios     |
| `--text`    | `#E8E8E8`   | Texto principal sobre fondos oscuros |

### Tipografía
- **Cuerpo:** `Inter` (400, 500, 600, 700, 800)
- **Títulos / Display:** `Barlow Condensed` (700, 800, 900) — `uppercase`, `tracking-tight`

### Componentes UI
- **Librería:** shadcn/ui sobre Radix UI primitives
- **Config:** `components.json` en la raíz
- **Disponibles:** `alert`, `avatar`, `badge`, `breadcrumb`, `button`, `card`, `checkbox`, `dialog`, `dropdown-menu`, `input`, `label`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `spinner`, `tooltip`

### Logos
Ubicados en `public/images/logos/`:
- `VECTO-horizontal-amarillo.png` — navbar y auth panel izquierdo
- `VECTO-simbolo-amarillo.png` — app sidebar (icon collapsible)
- `VECTO-vertical-amarillo.png` — mobile login

---

## Stack Técnico

| Capa        | Tecnología                           | Versión  |
|-------------|--------------------------------------|----------|
| Backend     | Laravel                              | 12.x     |
| Auth        | Laravel Fortify                      | 1.30     |
| Frontend    | React                                | 19.x     |
| SPA Bridge  | Inertia.js                           | 2.x      |
| Lenguaje TS | TypeScript                           | 5.7      |
| CSS         | Tailwind CSS                         | v4       |
| Componentes | Radix UI / shadcn                    | —        |
| Build       | Vite                                 | 7.x      |
| Routing TS  | Laravel Wayfinder                    | 0.1.x    |
| Base de datos | MySQL                              | —        |

---

## Módulos — Estado

| # | Módulo                        | Backend | Migraciones | Modelo | Controller | Rutas | Páginas | Estado |
|---|-------------------------------|---------|-------------|--------|------------|-------|---------|--------|
| Auth | 3 Roles (superadmin/company_admin/operator) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| M1  | Inventario de Flota / Vehículos | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| M2  | Mantenimientos                  | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| M3  | Mapa de Localización            | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| M4  | Preoperacional                  | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| M5  | Materiales y Repuestos          | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| M6  | Gestión de Costos               | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| M7  | Dashboard de Costos por Vehículo| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| M8  | Ingresos y Rentabilidad         | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| M9  | Afiliación a Contratos          | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |
| M10 | Asignación a Bases              | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **COMPLETO** |

---

## Autenticación

### Estrategia
Guard único `web` con **roles basados en tabla** (no múltiples guards separados). Decisión:
- Fortify maneja login/logout/2FA sobre un único guard.
- El rol determina el panel al que redirige post-login.
- El middleware `EnsureRole` (alias: `role`) protege rutas por rol.

### Roles
| Rol            | Valor en DB       | Dashboard           | Acceso                              |
|----------------|-------------------|---------------------|-------------------------------------|
| Superadmin     | `superadmin`      | `/admin/dashboard`  | Global — todas las empresas         |
| Admin Empresa  | `company_admin`   | `/empresa/dashboard`| Su empresa — flota completa + costos|
| Operador       | `operator`        | `/dashboard`        | Preoperacional + mapa + su vehículo |

### Usuarios Demo (seeder)
| Email                    | Password   | Rol            |
|--------------------------|------------|----------------|
| superadmin@vecto.app     | password   | Superadmin     |
| admin@demo.com           | password   | Admin Empresa  |
| operador@demo.com        | password   | Operador       |

---

## Estructura de Rutas

```
/                    → landing.blade.php (pública)
/login               → Fortify auth
/dashboard           → Panel operador/general (auth)
/empresa/dashboard   → Panel admin empresa (role: company_admin, superadmin)
/admin/dashboard     → Panel superadmin (role: superadmin)
/fleet/vehicles      → M1 — CRUD vehículos
/fleet/maintenances  → M2 — Mantenimientos
/fleet/map           → M3 — Mapa Leaflet
/fleet/preoperational → M4 — Inspecciones
/fleet/preoperational-items → M4 — Config checklist
/fleet/materials     → M5 — Inventario materiales
/fleet/costs         → M6/M7 — Costos + dashboard
/fleet/revenues      → M8 — Ingresos
/fleet/contracts     → M9 — Contratos
/fleet/bases         → M10 — Bases operativas
/users               → CRUD usuarios (auth)
```

---

## Base de Datos — Tablas

### Tablas del Framework
- `users`, `companies`, `password_reset_tokens`, `sessions`, `cache`, `jobs`

### Tablas del Sistema de Flotas
| Tabla                         | Módulo   | Descripción                                   |
|-------------------------------|----------|-----------------------------------------------|
| `vehicles`                    | M1       | Inventario de vehículos                       |
| `vehicle_status_history`      | M1       | Historial de cambios de estado                |
| `maintenances`                | M2       | Registros de mantenimiento                    |
| `vehicle_locations`           | M3       | Historial GPS / ubicaciones                   |
| `preoperational_items`        | M4       | Checklist configurable por empresa            |
| `preoperational_inspections`  | M4       | Cabecera de cada inspección                   |
| `preoperational_responses`    | M4       | Respuestas por ítem del checklist             |
| `materials`                   | M5       | Inventario de repuestos/materiales            |
| `material_movements`          | M5       | Entradas/salidas de materiales                |
| `vehicle_costs`               | M6/M7    | Costos asociados a cada vehículo              |
| `vehicle_revenues`            | M8       | Ingresos asociados a cada vehículo            |
| `contracts`                   | M9       | Contratos con clientes                        |
| `contract_vehicle`            | M9       | Pivot contrato-vehículo                       |
| `bases`                       | M10      | Bases operativas                              |
| `base_vehicle`                | M10      | Pivot base-vehículo                           |
| `base_user`                   | M10      | Pivot base-operador                           |

---

## Instalación / Setup

```bash
git clone <repo>
cd Vecto
composer install
cp .env.example .env
php artisan key:generate
# Configurar DB_DATABASE, DB_USERNAME, DB_PASSWORD en .env
php artisan migrate --seed
npm install
npm run build
# Desarrollo:
composer run dev
```

---

## Pendientes / Mejoras Futuras

- [ ] **Integración GPS real** — actualmente las ubicaciones se registran manualmente (`POST /fleet/map/{vehicle}/location`). Integrar con proveedor GPS vía webhook/polling.
- [ ] **Dashboard con métricas KPIs** — agregar contadores reales de vehículos, costos del mes, alertas activas al dashboard principal.
- [ ] **Notificaciones de mantenimiento** — email/push cuando un mantenimiento programado se acerca (< 7 días).
- [ ] **Fotos de vehículos** — storage configurado, falta el campo `enctype="multipart/form-data"` en los forms de vehículos del frontend.
- [ ] **Editar material** — página `fleet/materials/edit.tsx` pendiente.
- [ ] **Ver movimientos de material** — página `fleet/materials/movements.tsx` pendiente.
- [ ] **Ver/editar mantenimiento** — páginas `fleet/maintenances/show.tsx` y `edit.tsx` pendientes.
- [ ] **Ver inspección preoperacional** — página `fleet/preoperational/show.tsx` pendiente.
- [ ] **Gestión de empresas** — CRUD de companies para el superadmin (`/admin/companies`).
- [ ] **Reportes exportables** — PDF/Excel de costos, ingresos, mantenimientos.
- [ ] **Multi-idioma** — actualmente solo español (es-CO).
- [ ] **Tests** — cobertura de controllers fleet.

---

## Decisiones Técnicas Clave

1. **Guard único con roles** — en lugar de 3 guards Fortify separados, se usa 1 guard `web` y el middleware `EnsureRole`. Más simple, sin duplicar tablas ni configuraciones.
2. **Leaflet vía CDN** — cargado dinámicamente mediante script tag para evitar bundling de la librería (sin npm install), ya que Vite no tiene acceso a la URL externa en build.
3. **Inertia.js SSR** — disponible con `npm run build:ssr` y `php artisan inertia:start-ssr`.
4. **Wayfinder** — genera tipos TypeScript para rutas automáticamente al hacer build.
5. **Soft Deletes** — vehículos, mantenimientos, materiales, costos, ingresos, contratos y bases usan SoftDeletes para trazabilidad.
