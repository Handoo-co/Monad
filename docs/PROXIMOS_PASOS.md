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
| C2 | ⏳ | P0 | Ejecutar `registrarMarca(walletDemo, "Handoo Demo Brand", hashMetadatosKYB, true)` | Solo después de completar verificación empresarial o usar metadata demo explícita. |
| C3 | ⏳ | P0 | Compartir `VITE_PASAPORTE_ORIGEN_ADDRESS` real al equipo | Pegar en canal del equipo + actualizar host (Vercel/Netlify). |
| C4 | ⏳ | P1 | Verificar contrato en explorer (Socialscan u oficial) | Multi-explorer si la primera API falla. |
| C5 | ⏳ | P1 | Ejecutar Foundry tests (`forge test`) en máquina con `forge` instalado | Tests ya están en `test/PasaporteOrigen.t.sol`. |
| C6 | ⏳ | P2 | Medir gas real de `emitirProducto` en testnet | Para no inflar `gas_limit` (Monad cobra por limit, no por usado). |

## Verificación empresarial / KYB (Emmanuel + Thomas)

| # | Estado | Prioridad | Tarea | Notas |
| --- | --- | --- | --- | --- |
| K1 | ✅ | P0 | Definir política de autorización de empresas | Documentada en `VERIFICACION_EMPRESARIAL.md`. |
| K2 | ⏳ | P0 | Preparar flujo manual Colombia para demo | Código de verificación de Cámara de Comercio, sin guardar datos reales on-chain. |
| K3 | ⏳ | P1 | Elegir primeros países soportados post-demo | Recomendado: Colombia, Reino Unido, Estados Unidos, UE + LEI como complemento. |
| K4 | ⏳ | P1 | Definir JSON canónico para `hashMetadatosKYB` | Usar schema `handoo.kyb.v1`. |
| K5 | ⏳ | P2 | Diseñar backend de adapters KYB | Endpoints futuros en `VERIFICACION_EMPRESARIAL.md`. |

## Frontend (Miguel Ángel + Thomas)

| # | Estado | Prioridad | Tarea | Notas |
| --- | --- | --- | --- | --- |
| F1 | ⏳ | P0 | Probar conexión wallet en Monad Testnet con MON de faucet | Sin contrato real basta para validar wallet/red. |
| F2 | 🔄 | P0 | Validar `useIssue` real contra contrato desplegado | El import ya apunta a `useIssue`; falta address real + tx. |
| F3 | 🔄 | P0 | Validar `useVerify` real contra contrato desplegado | El import ya apunta a `useVerify`; falta address real + read. |
| F4 | ⏳ | P0 | Setear `VITE_PASAPORTE_ORIGEN_ADDRESS` en variables locales y en host de deploy | Una vez Emmanuel comparta address. |
| F5 | ⏳ | P1 | Mapear custom errors del contrato a textos de UI | Tabla en `HANDOFF_FRONTEND_MONAD.md`. |
| F6 | ⏳ | P1 | Estados de UI: disconnected, wrong network, pending, confirming, confirmed, failed | Mínimo viable para demo. |
| F7 | ⏳ | P1 | Link a explorer en cada tx confirmada | Usar helpers de `HANDOFF_FRONTEND_MONAD.md`. |
| F8 | ⏳ | P2 | Flujo de `transferirProducto` y `revocarProducto` | Demo opcional si sobra tiempo. |
| F9 | ⏳ | P2 | UI futura de onboarding de empresa | País + autoridad + código; nunca enviar evidencia sensible al contrato. |

## Producto, pitch y submission (Thomas)

| # | Estado | Prioridad | Tarea | Notas |
| --- | --- | --- | --- | --- |
| P1 | ⏳ | P0 | Datos demo: empresa, serial, metadata, línea de producto | Cero datos personales y cero certificados reales. Ver `GUIA_DEPLOY_REMIX.md`. |
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
- Verificación empresarial incompleta: ninguna marca real debe autorizarse sin KYB.
- Datos sensibles: usar solo hashes, seriales demo y metadata de prueba.

## Code freeze

Una vez ejecutados todos los ítems P0 y los P1 críticos, declarar code freeze.
Después del freeze:

- Cero cambios salvo emergencia real.
- Probar la demo end-to-end antes de presentar.
- Submission lista 30 min antes del deadline.
