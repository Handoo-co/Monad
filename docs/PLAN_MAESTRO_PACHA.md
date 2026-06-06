# Plan Maestro Pacha - Handoo OriginPass

## Definicion de hecho

La rama `Pacha` esta lista cuando existe un plan operativo para ejecutar el rol
de Emmanuel sin bloquear a frontend ni pitch: contrato definido, fases claras,
handoff de ABI/address, criterios de prueba y riesgos de demo documentados.

Este primer commit no implementa el contrato ni el frontend. Fija el plan maestro
para que el equipo ejecute por fases durante la hackathon.

## Contexto y decision de producto

Handoo OriginPass certifica productos fisicos por unidad usando el serial que la
empresa ya tiene. El serial no se guarda plano: se calcula un `serialHash` y se
registra en Monad junto con metadatos publicos de demo.

La demo debe probar tres acciones centrales:

1. Emitir un pasaporte de producto.
2. Verificarlo por serial/hash.
3. Revocarlo y mostrar el cambio de estado.

La transferencia de propiedad queda como extra post-MVP. No se construyen
marketplace, aduanas, supply chain completo ni NFC real.

## Roles del equipo

- Emmanuel: contrato, arquitectura on-chain, deploy y debugging.
- Miguel Angel Riveros: frontend, wallet y demo.
- Thomas Osorio: producto, pitch, datos, QA y submission.

Regla de desacople: Emmanuel entrega ABI + address; frontend puede avanzar con
datos mock mientras el contrato queda listo; Thomas prepara datos de demo,
guion, capturas y formulario.

## Fases de ejecucion

### Fase 0 - Base operativa

- Confirmar wallets de prueba, nunca wallets principales.
- Confirmar MON de faucet en las tres wallets.
- Confirmar Monad Testnet con Chain ID `10143`.
- Usar RPC base `https://testnet-rpc.monad.xyz/` y verificar `eth_chainId`
  como `0x279f`.
- Tener listo explorer para enlaces de deploy y transacciones.

Salida esperada: todos pueden firmar una transaccion y abrir un tx hash.

### Fase 1 - Contrato

Crear `OriginPass.sol` con Solidity `^0.8.24`.

Modelo minimo:

- `enum Status { Active, Revoked }`.
- `struct Product`: `issuer`, `serialHash`, `metadataHash`, `productLine`,
  `owner`, `status`, `issuedAt`.
- `struct Brand`: `allowed`, `name`, `metadataHash`.
- `admin`, `lastId`, `brands`, `products`, `idBySerial`.

Funciones MVP:

- `registerBrand(address brand, string calldata name, bytes32 metadataHash, bool allowed)`.
- `issueProduct(bytes32 serialHash, bytes32 metadataHash, string calldata productLine)`.
- `verifyBySerial(bytes32 serialHash)`.
- `getProduct(uint256 id)`.
- `revokeProduct(uint256 id, bytes32 reasonHash)`.

Eventos MVP:

- `BrandRegistered(address indexed brand, bool allowed)`.
- `ProductIssued(uint256 indexed id, address indexed issuer, bytes32 serialHash, bytes32 metadataHash)`.
- `ProductRevoked(uint256 indexed id, bytes32 reasonHash)`.

Extra solo si sobra tiempo:

- `transferOwnership(uint256 id, address newOwner)`.
- `OwnershipTransferred(uint256 indexed id, address from, address to)`.

### Fase 2 - Deploy

- Compilar en Remix con `0.8.24`.
- En Remix, usar `Injected Provider` conectado a Monad Testnet.
- Desplegar desde wallet de prueba.
- Paso 0 obligatorio tras deploy:
  `registerBrand(adminWallet, "Handoo Demo Brand", brandMetadataHash, true)`.
- Copiar address desde Remix/explorer.
- Copiar ABI desde compilation details.

Salida esperada: address del contrato, link de explorer y tx de
`registerBrand`.

### Fase 3 - Handoff a frontend

Entregar a frontend:

- `ORIGINPASS_ADDRESS`.
- ABI actualizada.
- Chain config:
  - id: `10143`
  - name: `Monad Testnet`
  - native currency: `MON`
  - rpc: `https://testnet-rpc.monad.xyz/`
  - explorer preferido disponible el dia de la demo.

Frontend recomendado:

- Vite + React + TypeScript.
- Wagmi + Viem + RainbowKit.
- `useReadContract` para `getProduct` y `verifyBySerial`.
- `useWriteContract` + `useWaitForTransactionReceipt` para emitir y revocar.

### Fase 4 - Integracion y debugging

Flujo base:

1. Conectar wallet.
2. Mostrar error si no esta en Monad Testnet.
3. Emitir producto demo.
4. Esperar receipt.
5. Mostrar link a explorer.
6. Verificar por serial/hash.
7. Revocar producto.
8. Verificar estado `Revoked`.

Estados de UI que no pueden faltar:

- Disconnected.
- Wrong network.
- Pending firma.
- Confirming on-chain.
- Confirmed con link de tx.
- Failed con mensaje legible y opcion de reintentar.

### Fase 5 - Freeze y submission

Antes de freeze:

- README final con nombre, frase, instrucciones, contrato y explorer.
- Capturas o video de backup.
- Demo abierta antes de presentar.
- Cero cambios despues de code freeze salvo emergencia real.

Submission:

- Nombre: Handoo OriginPass.
- Frase: Handoo OriginPass convierte el serial existente de cada producto en un
  pasaporte verificable en Monad.
- Repo publico.
- Contract address.
- Link de explorer.
- Demo URL o instrucciones locales.
- Integrantes.

## Pruebas de aceptacion

- Compila `OriginPass.sol` en Solidity `0.8.24`.
- `issueProduct` revierte si la marca no esta autorizada.
- `registerBrand` habilita `Handoo Demo Brand`.
- `issueProduct` guarda producto activo con issuer, owner, serialHash,
  metadataHash y productLine correctos.
- Serial duplicado revierte.
- `verifyBySerial` devuelve el producto correcto.
- `verifyBySerial` revierte para serial inexistente.
- `revokeProduct` solo funciona para el issuer.
- Producto revocado vuelve con estado `Revoked`.
- Tx de deploy, registro, emision y revocacion quedan visibles en explorer.

## Riesgos y mitigacion

- Red equivocada: confirmar Chain ID `10143` antes de cada accion.
- Falta de MON: revisar saldo antes de demo y pedir faucet temprano.
- ABI vieja: recopiar ABI y address cada vez que haya redeploy.
- Revert por permisos: ejecutar `registerBrand` antes de `issueProduct`.
- Address mal copiada: copiar desde Remix o explorer, nunca a mano.
- Internet inestable: tener hotspot y video/capturas de backup.
- Datos sensibles: usar solo seriales y metadata de prueba; nunca datos
  personales ni llaves privadas.

## Decisiones fijadas

- La idea activa es Handoo OriginPass.
- ProofFlow queda obsoleto para esta ejecucion.
- El contrato es simple y no upgradeable.
- No se guardan documentos, cedulas, correos ni datos personales on-chain.
- Transferencia de propiedad es opcional y no bloquea submission.
- Deploy inicial por Remix; Hardhat/Foundry solo si sobra tiempo.
