# Deploy Vercel - Handoo OriginPass V2

## Configuracion del proyecto

| Campo | Valor |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node.js | 20+ |

`vercel.json` ya contiene el rewrite SPA para que las rutas QR `/p/...`
funcionen al abrirse directo desde el navegador o desde un telefono.

## Variables de entorno requeridas

| Variable | Origen | Obligatoria |
| --- | --- | --- |
| `VITE_WALLETCONNECT_PROJECT_ID` | cloud.walletconnect.com (crear proyecto) | Si |
| `VITE_MONAD_RPC_URL` | Default: `https://testnet-rpc.monad.xyz` | No (default) |
| `VITE_REGISTRO_EMPRESAS_ADDRESS` | Output de `npm run deploy:testnet` | Si |
| `VITE_PASAPORTE_PRODUCTOS_ADDRESS` | Output de `npm run deploy:testnet` | Si |

## Flujo recomendado (una sola corrida)

### Paso 1: Deploy de contratos a Monad Testnet

```bash
# Asegurar Foundry instalado y wallet con MON de faucet
DEPLOYER_PK=0xTU_PK_PRUEBA npm run deploy:testnet
```

El script imprime al final las dos addresses listas para copiar.

### Paso 2: Linkear el repo a Vercel (una sola vez)

```bash
npm i -g vercel
vercel login
vercel link
```

Esto crea `.vercel/project.json` (ya esta en `.gitignore`).

### Paso 3: Pushear envs a Vercel

Modo interactivo (te pregunta cada valor):

```bash
npm run vercel:envs
```

Modo no interactivo (envia todo de una):

```bash
VITE_REGISTRO_EMPRESAS_ADDRESS=0x... \
VITE_PASAPORTE_PRODUCTOS_ADDRESS=0x... \
VITE_WALLETCONNECT_PROJECT_ID=tu_id \
npm run vercel:envs -- --auto
```

El script setea cada variable en production, preview y development.

### Paso 4: Trigger deploy

```bash
vercel --prod
```

O simplemente pushear a `Pacha`; Vercel autodeploya si hay GitHub integration.

## Alternativa: configurar envs desde la UI de Vercel

Si prefieres GUI:

1. Vercel dashboard -> Project -> Settings -> Environment Variables
2. Para cada variable, agregar en Production, Preview y Development
3. Redeploy desde Deployments -> ... -> Redeploy

## Smoke test post-deploy

- `/` carga sin errores.
- `/p/10143/0xADDRESS_DEL_DEPLOY/1?hash=0xHASH_REAL` carga la ficha del producto.
- Vista Empresa carga sin errores con wallet conectada.
- Vista Admin carga sin errores con wallet admin (el deployer de los contratos).
- No hay warnings de `address(0)` o `undefined` en consola.

## Reglas de oro Vercel

- Cero secretos en el repo. Solo las claves publicas (addresses, RPC URL, WalletConnect Project ID).
- `.vercel/` esta gitignored.
- Cada redeploy de contratos exige actualizar las dos addresses con `npm run vercel:envs`.
- Para rotar valores, el script borra y agrega: no hay drift entre environments.
