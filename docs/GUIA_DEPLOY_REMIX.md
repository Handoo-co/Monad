# Guia de Deploy en Remix - PasaporteOrigen

## Objetivo

Desplegar `contracts/PasaporteOrigen.sol` en Monad Testnet sin exponer llaves
privadas y dejar listo el primer emisor demo para que frontend pueda integrar la
ABI y la direccion del contrato.

## Precondiciones

- Usar una wallet de prueba, nunca la wallet principal.
- Tener MON de faucet para gas.
- Wallet conectada a Monad Testnet:
  - Chain ID: `10143`
  - RPC: `https://testnet-rpc.monad.xyz/`
  - Simbolo: `MON`
- Abrir el contrato local `contracts/PasaporteOrigen.sol`.
- Tener a mano la ABI generada en `artifacts/PasaporteOrigen.abi.json`.

## Deploy

1. Abrir Remix: `https://remix.ethereum.org`.
2. Crear un archivo `PasaporteOrigen.sol`.
3. Copiar el contenido de `contracts/PasaporteOrigen.sol`.
4. Ir a `Solidity Compiler`.
5. Seleccionar compilador `0.8.28`.
6. Activar optimizacion con `200` runs.
7. Compilar `PasaporteOrigen.sol`.
8. Ir a `Deploy & Run Transactions`.
9. En `Environment`, elegir `Injected Provider`.
10. Confirmar en la wallet que la red es Monad Testnet (`10143`).
11. Desplegar `PasaporteOrigen`.
12. Copiar la direccion del contrato desde Remix o explorer.

## Paso 0 obligatorio despues del deploy

Antes de emitir productos, autorizar la marca demo. Si este paso no se ejecuta,
`emitirProducto` revierte con `MarcaNoAutorizada`.

Valores recomendados para la demo:

- `cuentaMarca`: la misma wallet de prueba que desplego el contrato.
- `nombre`: `Handoo Demo Brand`.
- `hashMetadatos`: un `bytes32` no nulo que represente metadata demo.
- `autorizada`: `true`.

Ejemplo de `hashMetadatos` valido para Remix:

```text
0x2f8f9f3a8a9c6e6e7c0d5a4a9c8b7e6f5d4c3b2a19080706050403020100ff00
```

Llamada:

```text
registrarMarca(
  <wallet_de_prueba>,
  "Handoo Demo Brand",
  0x2f8f9f3a8a9c6e6e7c0d5a4a9c8b7e6f5d4c3b2a19080706050403020100ff00,
  true
)
```

## Datos de prueba para emitir producto

Usar hashes demo, no seriales reales ni datos personales.

`hashSerial`:

```text
0x1d4d8b1b7f6a4c3e2d1c0b9a887766554433221100ffeeddccbbaa9988776655
```

`hashMetadatos`:

```text
0xaabbccddeeff00112233445566778899aabbccddeeff00112233445566778899
```

`lineaProducto`:

```text
Sombrero vueltiao demo
```

Llamada:

```text
emitirProducto(
  0x1d4d8b1b7f6a4c3e2d1c0b9a887766554433221100ffeeddccbbaa9988776655,
  0xaabbccddeeff00112233445566778899aabbccddeeff00112233445566778899,
  "Sombrero vueltiao demo"
)
```

## Verificacion minima en Remix

1. Ejecutar `ultimoId`; debe devolver `1` tras la primera emision.
2. Ejecutar `verificarPorSerial(hashSerial)`; debe devolver `id = 1` y producto
   con estado `0` (`Activo`).
3. Ejecutar `transferirProducto(1, duenoNuevo)` desde la wallet duena actual.
4. Ejecutar `obtenerProducto(1)`; debe devolver `duenoActual = duenoNuevo`.
5. Ejecutar `revocarProducto(1, hashMotivo)` con la wallet emisora y un hash no
   nulo.
6. Ejecutar `obtenerProducto(1)`; debe devolver estado `1` (`Revocado`).

`duenoNuevo` demo:

```text
0x0000000000000000000000000000000000002002
```

Para una demo completa, usar una segunda wallet de prueba como `duenoNuevo`.
Si se usa la direccion demo anterior, no enviar MON ni activos a esa direccion.

`hashMotivo` demo:

```text
0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

## Datos para compartir al frontend

Despues del deploy, entregar:

- Direccion del contrato.
- Link del contrato en explorer.
- ABI: `artifacts/PasaporteOrigen.abi.json`.
- Config base: `artifacts/frontend-config.example.json`.
- Handoff wallet/contrato: `docs/HANDOFF_FRONTEND_MONAD.md`.
- Nombre de funciones:
  - `registrarMarca`
  - `emitirProducto`
  - `verificarPorSerial`
  - `obtenerProducto`
  - `transferirProducto`
  - `revocarProducto`

## Ruta Foundry recomendada por monskills

monskills recomienda Foundry para despliegues reproducibles y verificacion
multi-explorer. En esta maquina todavia no estan instalados `forge`, `cast` ni
`jq`, por eso esta guia conserva Remix como ruta operativa inmediata.

Cuando Foundry este instalado:

```bash
forge build
forge script script/DesplegarPasaporteOrigen.s.sol:DesplegarPasaporteOrigen \
  --rpc-url https://testnet-rpc.monad.xyz \
  --private-key $PRIVATE_KEY \
  --broadcast
```

Reglas:

- `foundry.toml` debe mantener `evm_version = "prague"`.
- No hardcodear direcciones ni private keys en scripts.
- Verificar el contrato tras deploy usando la API multi-explorer indicada por
  monskills o fallback Sourcify si esa API falla.
- En Monad, los usuarios pagan por `gas_limit`, no por gas usado; no inflar
  limites de gas.

## Checklist de seguridad

- No subir `.env`.
- No pegar private keys en Remix, GitHub, chats ni frontend.
- No usar seriales reales.
- No guardar correos, documentos, cedulas ni nombres de compradores on-chain.
- Copiar address desde Remix o explorer, nunca a mano.
- Si se redeploya, actualizar address y ABI antes de probar frontend.
