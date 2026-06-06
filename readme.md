# Handoo OriginPass

Repositorio del equipo para MonadBlitz Medellin.

La rama `Pacha` contiene el carril de trabajo de Emmanuel: contrato, arquitectura
on-chain, deploy y debugging.

- Plan maestro: [`docs/PLAN_MAESTRO_PACHA.md`](docs/PLAN_MAESTRO_PACHA.md)
- Contrato: [`contracts/PasaporteOrigen.sol`](contracts/PasaporteOrigen.sol)
- Deploy Remix: [`docs/GUIA_DEPLOY_REMIX.md`](docs/GUIA_DEPLOY_REMIX.md)
- Handoff frontend/wallet: [`docs/HANDOFF_FRONTEND_MONAD.md`](docs/HANDOFF_FRONTEND_MONAD.md)
- Revision Fase 3: [`docs/REVISION_FASE_3_FRONTEND_HANDOFF.md`](docs/REVISION_FASE_3_FRONTEND_HANDOFF.md)
- ABI: [`artifacts/PasaporteOrigen.abi.json`](artifacts/PasaporteOrigen.abi.json)
- Config frontend: [`artifacts/frontend-config.example.json`](artifacts/frontend-config.example.json)
- Pruebas Foundry: [`test/PasaporteOrigen.t.sol`](test/PasaporteOrigen.t.sol)
- Idea base: Handoo OriginPass, pasaporte de autenticidad por unidad fisica.
- Funciones demo: emitir, verificar, transferir propiedad y revocar pasaportes.
- Red objetivo: Monad Testnet, Chain ID `10143`, token `MON`.

## Frontend

La app Vite/React de la rama `Thomas` esta integrada en `src/` con RainbowKit,
Wagmi y Monad Testnet.

```bash
npm install
npm run dev
npm run build
```

Variables locales:

- `VITE_WALLETCONNECT_PROJECT_ID`
- `VITE_MONAD_RPC_URL`
- `VITE_PASAPORTE_ORIGEN_ADDRESS` cuando exista deploy real.
