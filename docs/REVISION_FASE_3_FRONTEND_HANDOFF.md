# Revision Fase 3 - Frontend y Wallet

## Resultado

Fase 3 integrada desde `origin/Thomas`: la app Vite/React conecta wallet en
Monad Testnet con RainbowKit/Wagmi y queda enlazada al ABI real de
`PasaporteOrigen`.

## Artefactos agregados

- `docs/HANDOFF_FRONTEND_MONAD.md`.
- `artifacts/frontend-config.example.json`.
- `src/` con UI de verificacion/emision.
- `package.json`, `package-lock.json`, `vite.config.ts` y config TypeScript.

## Alcance

- Chain config de Monad Testnet (`10143`, `0x279f`, MON, RPC base).
- Variables de entorno recomendadas para Vite y Next.js.
- Config RainbowKit/Wagmi con `VITE_WALLETCONNECT_PROJECT_ID`.
- Hooks reales para `emitirProducto` y `verificarPorSerial`.
- ABI real importada desde `artifacts/PasaporteOrigen.abi.json`.
- Links de explorer hacia Socialscan testnet.
- Mapa de custom errors del contrato a mensajes de UI.

## Seguridad y coordinacion

- `.env.local` queda ignorado por git; no se debe commitear.
- No se agregaron private keys, API keys ni direcciones de wallets personales.
- El address del contrato queda pendiente hasta deploy real.
- Thomas puede probar conexion wallet/red con MON antes del deploy.
- Emmanuel debe entregar address real y tx de `registrarMarca` tras deploy.

## Verificacion ejecutada

- `npm run lint`.
- `npm run build`.
- Render desktop y mobile con Playwright en `http://127.0.0.1:5173`.

## Pendiente

- Deploy real en Monad Testnet.
- Reemplazar `VITE_PASAPORTE_ORIGEN_ADDRESS` o
  `NEXT_PUBLIC_PASAPORTE_ORIGEN_ADDRESS` con el address real.
- Probar writes desde frontend contra el contrato desplegado.
- Medir gas real de `emitirProducto` en testnet antes de fijar limites manuales.
