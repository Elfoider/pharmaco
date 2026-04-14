# Analytics Seed (Firestore)

Este seed puebla datos de prueba para analítica en las colecciones:

- `products`
- `sales`
- `sale_items`

Todos los documentos generados incluyen `seedTag: "analytics_seed_v1"` para facilitar limpieza.

## Ejecutar seed

```bash
npm run seed:analytics
```

Requiere variables `NEXT_PUBLIC_FIREBASE_*` válidas en el entorno.

## Limpiar seed

```bash
npm run seed:analytics:clear
```

El script elimina únicamente documentos con `seedTag = analytics_seed_v1`.
