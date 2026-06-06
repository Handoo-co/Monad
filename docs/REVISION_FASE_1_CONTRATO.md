# Revision Fase 1 - Contrato

## Resultado

Fase 1 completada en local con `contracts/PasaporteOrigen.sol`.

El contrato usa nombres en espanol natural para la API publica y conserva el
nombre de producto Handoo OriginPass solo en la documentacion del proyecto.

## Superficie implementada

- Administrador inmutable definido en el deploy.
- Registro de marcas autorizadas con `registrarMarca`.
- Emision de pasaportes por hash de serial con `emitirProducto`.
- Verificacion publica con `verificarPorSerial`.
- Lectura por id con `obtenerProducto`.
- Revocacion por emisor original con `revocarProducto`.
- Transferencia por dueno actual con `transferirProducto`.
- Eventos: `MarcaRegistrada`, `ProductoEmitido`, `ProductoRevocado`,
  `ProductoTransferido`.

## Verificacion ejecutada

- Compilacion local con `solc 0.8.28` via `npx.cmd`.
- Optimizacion activada con `--optimize --optimize-runs 200`.
- ABI y bytecode generados en carpeta temporal fuera del repo.
- Revision de ABI: funciones, eventos y errores esperados presentes.

## Revision de seguridad

- No hay llaves privadas, tokens ni secretos en el contrato.
- No se recibe ni guarda serial plano.
- No se guardan cedulas, correos, documentos ni datos personales.
- `registrarMarca` solo lo ejecuta el administrador.
- `emitirProducto` solo lo ejecuta una marca autorizada.
- `revocarProducto` solo lo ejecuta el emisor original.
- `transferirProducto` solo lo ejecuta el dueno actual y solo sobre productos
  activos.
- Hashes nulos, lineas vacias, serial duplicado y producto inexistente revierten.
- No se usa `tx.origin`, `delegatecall` ni `selfdestruct`.

## Riesgos pendientes

- Falta prueba en Remix contra Monad Testnet.
- Falta prueba con Foundry `evm_version = "prague"` cuando `forge` este
  instalado en la maquina.
- Falta deploy real y transacciones en explorer.
- Falta entregar ABI/address al frontend.
- Las pruebas Foundry quedan agregadas, pero no se ejecutaron porque `forge` no
  esta instalado en esta maquina.
- Los mensajes de error son custom errors; si el equipo necesita textos visibles
  en UI, frontend debe mapear esos nombres a mensajes humanos.
