# Onboarding - Handoo OriginPass V2

## 1. Prerrequisitos

| Herramienta | Version minima | Uso |
| --- | --- | --- |
| Node.js | 20+ | Frontend Vite/React |
| npm | 10+ | Dependencias |
| Git | 2.40+ | Rama `Pacha` |
| Wallet EVM | actual | Empresa/admin en Monad Testnet |

Opcional para contrato: Foundry (`forge`) o `solc 0.8.28`.

## 2. Setup local

```bash
git clone https://github.com/Handoo-co/Monad.git
cd Monad
git checkout Pacha
npm install
cp ./.env.example ./.env.local
npm run dev
```

App local: `http://127.0.0.1:5173`.

## 3. Variables de entorno

```bash
VITE_WALLETCONNECT_PROJECT_ID=...
VITE_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
VITE_REGISTRO_EMPRESAS_ADDRESS=
VITE_PASAPORTE_PRODUCTOS_ADDRESS=
```

## 4. Flujo del producto

| Vista | Usuario | Acciones |
| --- | --- | --- |
| Comprador | Sin wallet | Abre QR y lee producto + empresa desde Monad. |
| Empresa | Wallet emisora | Solicita registro y registra productos tras aprobacion. |
| Admin | Wallet admin | Aprueba/rechaza/suspende empresas y revoca productos. |

## 5. Reglas de negocio

- Empresa comercial requiere hash de verificacion de Camara/registro oficial.
- Empresa artesanal se aprueba por revision admin de Handoo, sin Camara.
- Producto comercial solo lo emite empresa comercial aprobada.
- Producto artesanal solo lo emite empresa artesanal aprobada.
- QR contiene URL publica con chainId, contrato de producto, productId y
  `productHash`.
- Metadata completa vive en URI publica; contrato guarda hash + URI.

## 6. Validacion local

```bash
npm run lint
npx tsc --noEmit -p tsconfig.app.json
npm run build
```

Para deploy frontend en Vercel, seguir `docs/DEPLOY_VERCEL.md`. El repo ya
incluye `vercel.json` con rewrite SPA para rutas QR directas.

Compilacion Solidity rapida:

```bash
npx solc@0.8.28 --abi contracts/RegistroEmpresas.sol contracts/PasaporteProductos.sol
```

## 7. Estructura relevante

```text
contracts/
  RegistroEmpresas.sol
  PasaporteProductos.sol
  PasaporteOrigen.sol        # legado V1
src/
  components/PublicProductView.tsx
  components/CompanyPortal.tsx
  components/AdminPanel.tsx
  abi/handooV2.ts
public/demo-metadata/
artifacts/
  RegistroEmpresas.abi.json
  PasaporteProductos.abi.json
```

## 8. Reglas de oro

- Cero secretos en repo.
- Cero datos personales on-chain.
- Cero codigos de Camara o certificados crudos on-chain.
- Diferenciar siempre: empresa verificada vs producto atestado.
- Usar wallets de prueba con MON de faucet.
