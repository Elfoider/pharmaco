# PHARMACO — Pharmaceutical Management & Control

Base de **Fase 1 (visual + estructural)** para un sistema administrativo farmacéutico con estética SaaS premium, identidad tecnológica y arquitectura escalable.

## Stack activo en esta fase

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion (reservado para fases interactivas)
- React Hook Form + Zod (reservado para formularios funcionales)
- Lucide React

> En esta iteración **no** se incluye lógica de Firebase ni autenticación.

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
- Estado de carga elegante sin backend real (mock con delay)
