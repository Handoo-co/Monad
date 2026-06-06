# Guia de Deploy Remix - Handoo OriginPass V2

## Objetivo

Desplegar `RegistroEmpresas.sol` y `PasaporteProductos.sol` en Monad Testnet,
sin exponer llaves privadas, y dejar una empresa demo aprobada para registrar
productos verificables por QR.

## Precondiciones

- Wallet de prueba con MON.
- Red Monad Testnet:
  - Chain ID: `10143`
  - RPC: `https://testnet-rpc.monad.xyz`
  - Simbolo: `MON`
- Compilador Solidity `0.8.28`.
- Optimizer activo con `200` runs.

## Orden de deploy

1. Abrir Remix: `https://remix.ethereum.org`.
2. Crear/copiar `contracts/RegistroEmpresas.sol`.
3. Compilar con Solidity `0.8.28`.
4. En `Deploy & Run`, usar `Injected Provider` en Monad Testnet.
5. Desplegar `RegistroEmpresas`.
6. Copiar el address.
7. Crear/copiar `contracts/PasaporteProductos.sol`.
8. Compilar.
9. Desplegar `PasaporteProductos` pasando el address de `RegistroEmpresas` al
   constructor.
10. Copiar el address.

## Configurar frontend

En `.env.local`:

```bash
VITE_REGISTRO_EMPRESAS_ADDRESS=0x...
VITE_PASAPORTE_PRODUCTOS_ADDRESS=0x...
```

Reiniciar `npm run dev`.

## Demo comercial

1. En la vista Empresa, conectar wallet emisora.
2. Solicitar empresa tipo `Comercial`.
3. Usar modo `Camara de Comercio` o `Registro oficial`.
4. Pegar un codigo demo; la app lo hashea antes de enviarlo.
5. En la vista Admin, aprobar empresa.
6. Volver a Empresa y registrar producto.
7. Copiar/abrir el QR generado.

## Demo artesanal

1. En la vista Empresa, seleccionar tipo `Artesanal`.
2. No ingresar codigo de Camara de Comercio.
3. En la vista Admin, aprobar por revision artesanal.
4. Registrar producto artesanal.
5. Verificar que la ficha publica muestre el distintivo artesanal.

## Seguridad

- No pegar private keys en Remix, GitHub, chats ni frontend.
- No subir `.env.local`.
- No guardar codigo de Camara, NIT, certificados ni datos personales on-chain.
- Metadata publica debe poder compartirse; evidencia sensible queda off-chain.
- En Monad no inflar `gas_limit`: se cobra por limite declarado.
