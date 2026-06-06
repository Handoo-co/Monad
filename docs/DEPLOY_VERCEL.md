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

## Variables de entorno

Configurar en Vercel, para Production y Preview:

```bash
VITE_WALLETCONNECT_PROJECT_ID=
VITE_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
VITE_REGISTRO_EMPRESAS_ADDRESS=
VITE_PASAPORTE_PRODUCTOS_ADDRESS=
```

Notas:

- `VITE_WALLETCONNECT_PROJECT_ID` permite WalletConnect/RainbowKit.
- `VITE_REGISTRO_EMPRESAS_ADDRESS` sale del deploy de `RegistroEmpresas`.
- `VITE_PASAPORTE_PRODUCTOS_ADDRESS` sale del deploy de `PasaporteProductos`.
- No subir `.env.local`; Vercel guarda esos valores como variables privadas del proyecto.

## Orden recomendado

1. Desplegar `RegistroEmpresas` en Monad Testnet.
2. Desplegar `PasaporteProductos` con el address de `RegistroEmpresas`.
3. Configurar las variables V2 en Vercel.
4. Ejecutar deploy de Vercel desde la rama `Pacha`.
5. Abrir `/` y validar demo comprador.
6. Conectar wallet admin y empresa en Monad Testnet.
7. Aprobar empresa demo, registrar producto y abrir el QR generado.

## Smoke test post-deploy

- `/` carga sin errores.
- `/p/10143/0x0000000000000000000000000000000000009009/1?hash=0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa` carga la ficha demo.
- Vista Empresa muestra bloqueo claro si faltan addresses.
- Vista Admin muestra bloqueo claro si faltan addresses.
- Con addresses reales, Empresa/Admin deben leer contratos sin errores de consola.
