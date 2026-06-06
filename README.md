# Handoo OriginPass V2

> QR publico para verificar origen de productos en Monad Testnet.
> Empresas comerciales verificadas, talleres artesanales aprobados y productos
> consultables sin wallet.

El comprador escanea un QR y abre una ficha publica. La app consulta Monad y
muestra:

- empresa emisora y ubicacion declarada;
- tipo de empresa: comercial verificada o artesanal aprobada;
- tipo de producto: original comercial o artesanal;
- estado on-chain del producto;
- metadata publica verificada por hash.

La Camara de Comercio o registro equivalente verifica la empresa cuando aplica.
La autenticidad/origen del producto queda atestada por la empresa emisora o por
Handoo, no por la Camara.

---

## Estado actual

| Capa | Estado | Detalle |
| --- | --- | --- |
| `RegistroEmpresas.sol` | Listo | Registro, aprobacion y suspension de empresas. |
| `PasaporteProductos.sol` | Listo | Productos verificables por QR + `productHash`. |
| Frontend V2 | Listo | Vistas comprador, empresa y admin. |
| QR | Listo | URL publica `/p/:chainId/:contract/:productId?hash=:productHash`. |
| Metadata demo | Lista | `public/demo-metadata/`. |
| Vercel frontend | Listo para configurar | `vercel.json` + guia de envs. |
| Deploy en Monad Testnet | Pendiente | Ver `docs/GUIA_DEPLOY_REMIX.md`. |

`contracts/PasaporteOrigen.sol` queda como legado V1 y no se usa en la app V2.

---

## Quickstart

```bash
git clone https://github.com/Handoo-co/Monad.git
cd Monad
git checkout Pacha
npm install
cp ./.env.example ./.env.local
npm run dev
```

Abre `http://127.0.0.1:5173`.

Variables locales/Vercel:

```bash
VITE_WALLETCONNECT_PROJECT_ID=
VITE_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
VITE_REGISTRO_EMPRESAS_ADDRESS=
VITE_PASAPORTE_PRODUCTOS_ADDRESS=
```

Mientras no existan addresses desplegados, la vista comprador muestra una demo
local. Las vistas empresa/admin quedan bloqueadas hasta configurar contratos.

---

## Stack

- Solidity `^0.8.28`, Foundry config con `evm_version = "prague"`.
- Monad Testnet `10143`, RPC `https://testnet-rpc.monad.xyz`.
- Vite + React 19 + TypeScript + RainbowKit/Wagmi/Viem.
- Metadata publica por URI + hash on-chain.

---

## Documentacion

| Doc | Uso |
| --- | --- |
| [`docs/PROXIMOS_PASOS.md`](docs/PROXIMOS_PASOS.md) | Backlog vivo V2. |
| [`docs/ONBOARDING.md`](docs/ONBOARDING.md) | Setup de nuevos contribuidores. |
| [`docs/GUIA_DEPLOY_REMIX.md`](docs/GUIA_DEPLOY_REMIX.md) | Deploy manual V2. |
| [`docs/DEPLOY_VERCEL.md`](docs/DEPLOY_VERCEL.md) | Deploy frontend en Vercel. |
| [`docs/HANDOFF_FRONTEND_MONAD.md`](docs/HANDOFF_FRONTEND_MONAD.md) | ABI, env vars y flujos frontend. |
| [`docs/VERIFICACION_EMPRESARIAL.md`](docs/VERIFICACION_EMPRESARIAL.md) | KYB comercial y aprobacion artesanal. |
| [`docs/PLAN_MAESTRO_PACHA.md`](docs/PLAN_MAESTRO_PACHA.md) | Estrategia y fases. |

---

## Submission

- **Nombre:** Handoo OriginPass.
- **Frase:** Handoo OriginPass convierte un QR en una prueba publica de origen
  y empresa emisora, anclada en Monad.
- **Repo:** https://github.com/Handoo-co/Monad
- **Contracts:** pendiente de deploy V2.
- **Demo URL:** pendiente de host.
- **Integrantes:** Emmanuel, Miguel Angel Riveros, Thomas Osorio.
