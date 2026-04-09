# PHARMACO — Pharmaceutical Management & Control

Base de **Fase 1 (visual + estructural)** para un sistema administrativo farmacéutico con estética SaaS premium, identidad tecnológica y arquitectura escalable.

## Stack activo en esta fase

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion (reservado para fases interactivas)
- React Hook Form + Zod (reservado para formularios funcionales)
- Lucide React

> Esta iteración incluye base Firebase/Auth para login y lectura de perfil, sin paneles complejos.

## Estructura escalable dentro de `src`

```txt
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    branding/
      pharmaco-mark.tsx
    layout/
      app-shell.tsx
      side-nav.tsx
      topbar.tsx
    ui/
      glass-panel.tsx
      grid-background.tsx
      section-heading.tsx
      stat-card.tsx
      status-chip.tsx
  lib/
    theme/
      tokens.ts
    utils/
      cn.ts
```

## Objetivo de esta base

- Diseño oscuro elegante, corporativo y tecnológico.
- Gradientes suaves con identidad farmacéutica.
- Glassmorphism ligero y consistente.
- Componentes reutilizables listos para crecer por módulos.


## Login premium (mock)

- Ruta: `/login`
- Diseño en dos columnas (hero + formulario)
- Branding fuerte PHARMACO + subtítulo Pharmaceutical Management & Control
- Tarjeta glass para formulario
- Animaciones sutiles con Framer Motion
- Efecto reactivo al cursor sin bloquear interacciones (`pointer-events-none`)
- Estado de carga elegante conectado a `useAuth` (Firebase Auth base)


## Firebase base

1. Crea `.env.local` desde `.env.example`.
2. Completa las variables `NEXT_PUBLIC_FIREBASE_*`.
3. La inicialización vive en `src/lib/firebase/client.ts`.
4. El hook `useAuth` escucha sesión de Firebase Auth y carga perfil en Firestore (`users/{uid}`).

Roles iniciales soportados:
`super_admin`, `admin`, `farmaceutico`, `cajero`, `almacenista`, `rrhh`.


## Roles y rutas protegidas

- `UserRole`: `super_admin`, `admin`, `farmaceutico`, `cajero`, `almacenista`, `rrhh`.
- Modelo `AppUser` en `src/lib/auth/types.ts`.
- Cookies de sesión/rol en `src/lib/auth/session.ts`.
- Guardas en `proxy.ts` para redirección si no hay sesión o si el rol no tiene acceso.
- Dashboard base en `/dashboard` y ejemplo de restricción por rol en `/dashboard/rrhh`.
- Sidebar dinámico según rol (`getRoleNavigation`).
