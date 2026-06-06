# Próximos Pasos — Handoo OriginPass

Fuente única de pendientes. Si un ítem se mueve a hecho, tachar y dejar la línea
hasta que se cierre el sprint. Si aparece un nuevo bloqueador, agregarlo aquí
con dueño + prioridad.

## Leyenda

- **P0**: bloquea la demo o a otro rol.
- **P1**: necesario antes del code freeze.
- **P2**: mejora si sobra tiempo.

| Estado | Significado |
| --- | --- |
| ⏳ | Pendiente |
| 🔄 | En curso |
| ✅ | Hecho |
| ⛔ | Bloqueado |

---

## Contrato y deploy (Emmanuel)

| # | Estado | Prioridad | Tarea | Notas |
| --- | --- | --- | --- | --- |
| C1 | ⏳ | P0 | Deploy real de `PasaporteOrigen.sol` en Monad Testnet | Usar wallet de prueba. Ver `GUIA_DEPLOY_REMIX.md`. |
| C2 | ⏳ | P0 | Ejecutar `registrarMarca(walletDemo, "Handoo Demo Brand", hashMarca, true)` | Sin este paso, `emitirProducto` revierte. |
| C3 | ⏳ | P0 | Compartir `VITE_PASAPORTE_ORIGEN_ADDRESS` real al equipo | Pegar en canal del equipo + actualizar host (Vercel/Netlify). |
| C4 | ⏳ | P1 | Verificar contrato en explorer (Socialscan u oficial) | Multi-explorer si la primera API falla. |
| C5 | ⏳ | P1 | Ejecutar Foundry tests (`forge test`) en máquina con `forge` instalado | Tests ya están en `test/PasaporteOrigen.t.sol`. |
| C6 | ⏳ | P2 | Medir gas real de `emitirProducto` en testnet | Para no inflar `gas_limit` (Monad cobra por limit, no por usado). |

## Frontend (Miguel Ángel + Thomas)

| # | Estado | Prioridad | Tarea | Notas |
| --- | --- | --- | --- | --- |
| F1 | ⏳ | P0 | Probar conexión wallet en Monad Testnet con MON de faucet | Sin contrato real basta para validar wallet/red. |
| F2 | ⏳ | P0 | Conectar `useIssue` real (no mock) al contrato desplegado | Reemplazar import desde `useIssue.mock` a `useIssue`. |
| F3 | ⏳ | P0 | Conectar `useVerify` real al contrato desplegado | Mismo patrón. |
| F4 | ⏳ | P0 | Setear `VITE_PASAPORTE_ORIGEN_ADDRESS` en variables locales y en host de deploy | Una vez Emmanuel comparta address. |
| F5 | ⏳ | P1 | Mapear custom errors del contrato a textos de UI | Tabla en `HANDOFF_FRONTEND_MONAD.md`. |
| F6 | ⏳ | P1 | Estados de UI: disconnected, wrong network, pending, confirming, confirmed, failed | Mínimo viable para demo. |
| F7 | ⏳ | P1 | Link a explorer en cada tx confirmada | Usar helpers de `HANDOFF_FRONTEND_MONAD.md`. |
| F8 | ⏳ | P2 | Flujo de `transferirProducto` y `revocarProducto` | Demo opcional si sobra tiempo. |

## Producto, pitch y submission (Thomas)

| # | Estado | Prioridad | Tarea | Notas |
| --- | --- | --- | --- | --- |
| P1 | ⏳ | P0 | Datos demo: serial, metadata, línea de producto | Cero datos personales. Ver `GUIA_DEPLOY_REMIX.md`. |
| P2 | ⏳ | P0 | Guion del pitch (3 min) | Demo: emitir → verificar → transferir → revocar. |
| P3 | ⏳ | P1 | Capturas y video de backup | Por si la red falla durante la presentación. |
| P4 | ⏳ | P1 | README final de submission con contract address + explorer link | Editar `README.md` antes del freeze. |
| P5 | ⏳ | P0 | Formulario de submission con: nombre, frase, repo, address, demo URL, integrantes | Ver checklist en `PLAN_MAESTRO_PACHA.md` §Submission. |

## Infraestructura compartida

| # | Estado | Prioridad | Tarea | Notas |
| --- | --- | --- | --- | --- |
| I1 | ⏳ | P1 | Hostear demo (Vercel/Netlify) con variables de Monad Testnet | `npm run build` → deploy de la carpeta `dist/`. |
| I2 | ⏳ | P2 | Hotspot/red de respaldo en sede del hackathon | Por si la wifi del evento falla. |
| I3 | ⏳ | P2 | Monitorear faucet MON en wallets de prueba | Revisar saldo en wallets demo cada mañana. |

---

## Riesgos vivos

- Red equivocada en demo: confirmar Chain ID `10143` antes de cada acción.
- ABI vieja: cada redeploy obliga a recopiar address + ABI.
- `MarcaNoAutorizada`: si el deploy se rehace, hay que repetir `registrarMarca`.
- Datos sensibles: usar solo seriales y metadata de prueba.

## Code freeze

Una vez ejecutados todos los ítems P0 y los P1 críticos, declarar code freeze.
Después del freeze:

- Cero cambios salvo emergencia real.
- Probar la demo end-to-end antes de presentar.
- Submission lista 30 min antes del deadline.
