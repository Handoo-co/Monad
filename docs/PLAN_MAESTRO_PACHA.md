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

La transferencia de propiedad queda incluida como mejora del contrato porque el
pasaporte ya modela `duenoActual`. No se construyen marketplace, aduanas,
supply chain completo ni NFC real.

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

Crear `PasaporteOrigen.sol` con Solidity `^0.8.28`.

Modelo minimo:

- `enum Status { Active, Revoked }`.
- `struct Product`: `issuer`, `serialHash`, `metadataHash`, `productLine`,
  `owner`, `status`, `issuedAt`.
- `struct Brand`: `allowed`, `name`, `metadataHash`.
- `admin`, `lastId`, `brands`, `products`, `idBySerial`.

Funciones MVP:

- `registrarMarca(address cuentaMarca, string calldata nombre, bytes32 hashMetadatos, bool autorizada)`.
- `emitirProducto(bytes32 hashSerial, bytes32 hashMetadatos, string calldata lineaProducto)`.
- `verificarPorSerial(bytes32 hashSerial)`.
- `obtenerProducto(uint256 id)`.
- `revocarProducto(uint256 id, bytes32 hashMotivo)`.
- `transferirProducto(uint256 id, address duenoNuevo)`.

Eventos MVP:

- `MarcaRegistrada(address indexed cuentaMarca, bool autorizada, string nombre, bytes32 hashMetadatos)`.
- `ProductoEmitido(uint256 indexed id, address indexed emisor, bytes32 hashSerial, bytes32 hashMetadatos, string lineaProducto)`.
- `ProductoRevocado(uint256 indexed id, address indexed emisor, bytes32 hashMotivo)`.
- `ProductoTransferido(uint256 indexed id, address indexed duenoAnterior, address indexed duenoNuevo)`.

Extra solo si sobra tiempo:

- Metadata off-chain mas rica para demo.
- Busqueda/indexacion historica de eventos si el frontend la necesita.

### Fase 2 - Deploy

- Si se usa Foundry, compilar con `solc_version = "0.8.28"` y
  `evm_version = "prague"`.
- Compilar en Remix con `0.8.28`.
- En Remix, usar `Injected Provider` conectado a Monad Testnet.
- Desplegar desde wallet de prueba.
- Paso 0 obligatorio tras deploy:
  `registrarMarca(adminWallet, "Handoo Demo Brand", hashMetadatosMarca, true)`.
- Copiar address desde Remix/explorer.
- Copiar ABI desde compilation details.

Salida esperada: address del contrato, link de explorer y tx de
`registrarMarca`.

Artefactos de esta fase:

- Guia de deploy: `docs/GUIA_DEPLOY_REMIX.md`.
- ABI para frontend: `artifacts/PasaporteOrigen.abi.json`.
- Config de handoff: `artifacts/frontend-config.example.json`.

### Fase 3 - Handoff a frontend

Entregar a frontend:

- `DIRECCION_PASAPORTE_ORIGEN`.
- ABI actualizada.
- Handoff wallet/contrato: `docs/HANDOFF_FRONTEND_MONAD.md`.
- Chain config:
  - id: `10143`
  - name: `Monad Testnet`
  - native currency: `MON`
  - rpc: `https://testnet-rpc.monad.xyz/`
  - explorer preferido disponible el dia de la demo.

Frontend recomendado:

- Vite + React + TypeScript.
- Wagmi + Viem + RainbowKit.
- Thomas avanza la conexion de wallet en Monad Testnet con una wallet que ya
  tiene MON; el contrato no debe bloquear ese trabajo mientras no haya address
  real.
- Importar `monadTestnet` desde `wagmi/chains` o `viem/chains` segun el stack
  instalado; solo definir la chain manualmente como fallback.
- `useReadContract` para `obtenerProducto` y `verificarPorSerial`.
- `useWriteContract` + `useWaitForTransactionReceipt` para emitir, transferir
  y revocar.

### Fase 4 - Integracion y debugging

Flujo base:

1. Conectar wallet.
2. Mostrar error si no esta en Monad Testnet.
3. Emitir producto demo.
4. Esperar receipt.
5. Mostrar link a explorer.
6. Verificar por serial/hash.
7. Transferir el pasaporte a una wallet demo o comprador de prueba.
8. Verificar `duenoActual`.
9. Revocar producto.
10. Verificar estado `Revoked`.

Estados de UI que no pueden faltar:

- Disconnected.
- Wrong network.
- Pending firma.
- Confirming on-chain.
- Confirmed con link de tx.
- Failed con mensaje legible y opcion de reintentar.
- En Monad hay estados de bloque `latest`, `safe` y `finalized`; la UI puede
  refrescar en receipt confirmado, pero para mensajes de seguridad usar
  confirmacion finalizada cuando el flujo lo requiera.
- Mostrar costo estimado desde `gasLimit * gasPrice`; en Monad se cobra por
  gas limit, no por gas usado.

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

- Compila `PasaporteOrigen.sol` en Solidity `0.8.28`.
- `emitirProducto` revierte si la marca no esta autorizada.
- `registrarMarca` habilita `Handoo Demo Brand`.
- `emitirProducto` guarda producto activo con emisor, duenoActual, hashSerial,
  hashMetadatos y lineaProducto correctos.
- Serial duplicado revierte.
- `verificarPorSerial` devuelve el producto correcto.
- `verificarPorSerial` revierte para serial inexistente.
- `transferirProducto` solo funciona para `duenoActual`, con producto activo y
  `duenoNuevo` no nulo.
- `revocarProducto` solo funciona para el emisor.
- Producto revocado vuelve con estado `Revoked`.
- Tx de deploy, registro, emision, transferencia y revocacion quedan visibles
  en explorer.

## Riesgos y mitigacion

- Red equivocada: confirmar Chain ID `10143` antes de cada accion.
- Falta de MON: revisar saldo antes de demo y pedir faucet temprano.
- ABI vieja: recopiar ABI y address cada vez que haya redeploy.
- Gas limit inflado: en Monad cuesta MON real/testnet completo; mantener
  estimaciones ajustadas.
- Revert por permisos: ejecutar `registrarMarca` antes de `emitirProducto`.
- Address mal copiada: copiar desde Remix o explorer, nunca a mano.
- Handoff incompleto a frontend: usar `docs/HANDOFF_FRONTEND_MONAD.md` y
  `artifacts/frontend-config.example.json` como fuente de nombres/env.
- Internet inestable: tener hotspot y video/capturas de backup.
- Datos sensibles: usar solo seriales y metadata de prueba; nunca datos
  personales ni llaves privadas.

## Decisiones fijadas

- La idea activa es Handoo OriginPass.
- ProofFlow queda obsoleto para esta ejecucion.
- El contrato es simple y no upgradeable.
- No se guardan documentos, cedulas, correos ni datos personales on-chain.
- Transferencia de propiedad queda implementada como mejora MVP acotada.
- Deploy inicial por Remix; Hardhat/Foundry solo si sobra tiempo.
