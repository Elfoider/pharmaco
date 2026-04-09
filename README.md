# PHARMACO — Pharmaceutical Management & Control

Fase 1 de la base administrativa farmacéutica, construida con Next.js (App Router), TypeScript, Tailwind CSS, Firebase y una arquitectura escalable.

## Stack

- Next.js 16 + App Router
- TypeScript
- Tailwind CSS v4
- Firebase App Hosting
- Firebase Authentication
- Cloud Firestore
- Framer Motion
- React Hook Form
- Zod
- Lucide React

## Estructura propuesta (escalable)

```txt
src/
  app/
    (public)/
      login/page.tsx
    (dashboard)/
      dashboard/page.tsx
      layout.tsx
    globals.css
    layout.tsx
    page.tsx
  components/
    auth/
    branding/
    dashboard/
    ui/
  lib/
    auth/
    firebase/
    validations/
    utils.ts
proxy.ts
apphosting.yaml
.env.example
```

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores de Firebase:

```bash
cp .env.example .env.local
```

## Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Alcance de Fase 1

- Tema visual premium global.
- Login dinámico con animaciones suaves (Framer Motion).
- Firebase client listo para Authentication y Firestore.
- Tipos de usuario y roles iniciales.
- Protección de rutas con `proxy.ts`.
- Dashboard base protegido.

## Despliegue en Firebase App Hosting

Archivo base incluido: `apphosting.yaml`.
