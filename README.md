# Handoo OriginPass

> Pasaporte de autenticidad por unidad física, anclado en Monad Testnet.
> Hackathon MonadBlitz Medellín.

Cada producto físico tiene un serial existente. Este proyecto convierte ese
serial en un **pasaporte verificable on-chain** sin guardar el serial plano, sin
datos personales, y con tres acciones demo: **emitir**, **verificar**,
**revocar** (más transferencia de propiedad).

---

## Estado actual

| Capa | Estado | Detalle |
| --- | --- | --- |
| Contrato `PasaporteOrigen.sol` | ✅ Listo | Compilado con `solc 0.8.28`. Tests Foundry escritos. |
| ABI | ✅ Generada | `artifacts/PasaporteOrigen.abi.json`. |
| Deploy en Monad Testnet | ⏳ Pendiente | Ver `docs/GUIA_DEPLOY_REMIX.md`. |
| Frontend (Vite + React + RainbowKit) | ✅ Integrado | `src/`. Falta apuntar al address real. |
| Hooks `useIssue` / `useVerify` | ✅ Cableados al ABI real | Usar versiones no-mock cuando exista deploy. |
| Pitch + submission | ⏳ Pendiente | Ver `docs/PROXIMOS_PASOS.md` §Producto. |

➡️ **Backlog vivo:** [`docs/PROXIMOS_PASOS.md`](docs/PROXIMOS_PASOS.md).

---

## Quickstart (5 minutos)

```bash
git clone https://github.com/Handoo-co/Monad.git
cd Monad
git checkout Pacha
npm install
cp ./env.example ./env.local
# editar ./env.local con tu WalletConnect Project ID
npm run dev
```

Levanta en `http://127.0.0.1:5173`. Conecta wallet (MetaMask, WalletConnect,
Rainbow) y cambia a Monad Testnet (Chain ID `10143`).

**Setup completo y troubleshooting:** [`docs/ONBOARDING.md`](docs/ONBOARDING.md).

---

## Roles y ownership

| Persona | Rol | Carril |
| --- | --- | --- |
| Emmanuel | Contrato, on-chain, deploy, debugging | Rama `Pacha` |
| Miguel Ángel Riveros | Frontend, wallet, demo | `src/` integrado en `Pacha` |
| Thomas Osorio | Producto, pitch, datos, QA, submission | Rama `Thomas` (integrada) |

**Regla de desacople:** Emmanuel entrega ABI + address; frontend avanza con
mocks (`*.mock.ts`) mientras tanto; Thomas prepara datos demo + guion.

---

## Stack

- **Contrato:** Solidity `^0.8.28`, Foundry, Remix como fallback de deploy.
- **Frontend:** Vite + React 19 + TypeScript + RainbowKit 2.2 + Wagmi 2.19 + Viem 2.
- **Red:** Monad Testnet (`10143`, RPC `https://testnet-rpc.monad.xyz`, token `MON`).
- **Explorer:** Socialscan testnet (`monad-testnet.socialscan.io`).

---

## Documentación

| Doc | Para qué |
| --- | --- |
| [`docs/PROXIMOS_PASOS.md`](docs/PROXIMOS_PASOS.md) | **Backlog vivo.** Tareas + dueños + prioridades. |
| [`docs/ONBOARDING.md`](docs/ONBOARDING.md) | Onboarding 5 min para nuevos contribuidores. |
| [`docs/PLAN_MAESTRO_PACHA.md`](docs/PLAN_MAESTRO_PACHA.md) | Estrategia y fases del proyecto. |
| [`docs/GUIA_DEPLOY_REMIX.md`](docs/GUIA_DEPLOY_REMIX.md) | Playbook de deploy en Remix. |
| [`docs/HANDOFF_FRONTEND_MONAD.md`](docs/HANDOFF_FRONTEND_MONAD.md) | Referencia: env vars, errores, helpers. |
| [`docs/USO_MONSKILLS.md`](docs/USO_MONSKILLS.md) | Decisiones derivadas del skill set monskills. |

---

## Submission (rellenar antes del freeze)

- **Nombre:** Handoo OriginPass.
- **Frase:** Handoo OriginPass convierte el serial existente de cada producto
  en un pasaporte verificable en Monad.
- **Repo:** https://github.com/Handoo-co/Monad
- **Contract address:** _pendiente de deploy_
- **Explorer link:** _pendiente de deploy_
- **Demo URL:** _pendiente de host_
- **Integrantes:** Emmanuel, Miguel Ángel Riveros, Thomas Osorio.
