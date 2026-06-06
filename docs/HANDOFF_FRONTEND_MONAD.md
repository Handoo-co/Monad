# Referencia Frontend ↔ Contrato — Handoo OriginPass

> Esta es la **tarjeta de referencia** para el frontend.
> El cableado real ya existe en `src/`. Aquí solo se documentan los contratos,
> errores, env vars y helpers que el equipo frontend necesita consultar.
>
> Para setup inicial → [`ONBOARDING.md`](ONBOARDING.md).
> Para tareas pendientes → [`PROXIMOS_PASOS.md`](PROXIMOS_PASOS.md).

---

## Red

| Campo | Valor |
| --- | --- |
| Chain ID | `10143` (`0x279f`) |
| Nombre | Monad Testnet |
| Native currency | `MON` |
| RPC | `https://testnet-rpc.monad.xyz` |
| Explorer | `https://monad-testnet.socialscan.io` |

Definición ya hardcodeada en `src/config/chains.ts` y consumida por
`src/config/wagmi.ts`.

---

## Variables de entorno (Vite)

| Variable | Default | Notas |
| --- | --- | --- |
| `VITE_WALLETCONNECT_PROJECT_ID` | _vacío_ | Sin esto, solo funciona `injected()` (MetaMask local). Crear en cloud.walletconnect.com. |
| `VITE_MONAD_RPC_URL` | `https://testnet-rpc.monad.xyz` | Solo override si el RPC público cae. |
| `VITE_PASAPORTE_ORIGEN_ADDRESS` | _vacío_ | **Obligatoria para writes reales.** La comparte Emmanuel tras el deploy. |

> ⚠️ El archivo local de variables nunca se commitea. `.gitignore` ya lo cubre.

---

## ABI y dirección del contrato

```ts
// Ya implementado en src/abi/originPass.ts
import abi from '../../artifacts/PasaporteOrigen.abi.json'
export const PASAPORTE_ORIGEN_ABI = abi
```

La dirección se inyecta desde la variable de entorno `VITE_PASAPORTE_ORIGEN_ADDRESS`
usando el patrón estándar de Vite (`import.meta` / objeto de variables).

---

## Funciones del contrato (cheat sheet)

### Writes (requieren wallet + gas)

| Función | Args | Quién puede llamarla |
| --- | --- | --- |
| `registrarMarca(cuentaMarca, nombre, hashMetadatos, autorizada)` | `address, string, bytes32, bool` | Solo el admin (deployer) |
| `emitirProducto(hashSerial, hashMetadatos, lineaProducto)` | `bytes32, bytes32, string` | Solo marcas autorizadas |
| `transferirProducto(id, duenoNuevo)` | `uint256, address` | Solo `duenoActual` del producto |
| `revocarProducto(id, hashMotivo)` | `uint256, bytes32` | Solo el `emisor` original |

### Reads (gratis)

| Función | Args | Retorna |
| --- | --- | --- |
| `verificarPorSerial(hashSerial)` | `bytes32` | `(id, Producto)` o revierte |
| `obtenerProducto(id)` | `uint256` | `Producto` |
| `ultimoId()` | — | `uint256` |
| `marcas(address)` | `address` | `Marca` |
| `administrador()` | — | `address` |

### Estructura `Producto`

```solidity
struct Producto {
  address emisor;
  bytes32 hashSerial;
  bytes32 hashMetadatos;
  string  lineaProducto;
  address duenoActual;
  Estado  estado;        // 0 = Activo, 1 = Revocado
  uint256 emitidoEn;     // timestamp
}
```

Los tipos TS están en `src/types/index.ts`.

---

## Custom errors → textos de UI

| Error del contrato | Mensaje sugerido en UI |
| --- | --- |
| `MarcaNoAutorizada` | Esta wallet no está autorizada para emitir pasaportes. |
| `SerialYaEmitido` | Ese serial ya tiene un pasaporte emitido. |
| `ProductoNoExiste` | No existe un pasaporte para ese id o serial. |
| `SoloEmisor` | Solo la marca emisora puede revocar este pasaporte. |
| `SoloDuenoActual` | Solo el dueño actual puede transferir este pasaporte. |
| `DuenoInvalido` | La dirección destino no es válida para transferir. |
| `ProductoYaRevocado` | Este pasaporte ya está revocado. |
| `MarcaInvalida` | La wallet de marca no puede ser cero. |
| `NombreMarcaInvalido` | El nombre de marca no puede estar vacío. |
| `HashSerialInvalido` | El hash del serial no puede ser `0x00...`. |
| `HashMetadatosInvalido` | El hash de metadatos no puede ser `0x00...`. |
| `HashMotivoInvalido` | El hash del motivo no puede ser `0x00...`. |
| `LineaProductoInvalida` | La línea de producto no puede estar vacía. |
| `SoloAdministrador` | Solo el administrador del contrato puede autorizar marcas. |

Patrón sugerido para mapear en frontend:

```ts
function mapContractError(err: unknown): string {
  const msg = (err as Error)?.message ?? ''
  if (msg.includes('MarcaNoAutorizada')) return 'Esta wallet no está autorizada para emitir pasaportes.'
  if (msg.includes('SerialYaEmitido'))   return 'Ese serial ya tiene un pasaporte emitido.'
  if (msg.includes('ProductoNoExiste'))  return 'No existe un pasaporte para ese id o serial.'
  // ...
  return 'Error desconocido. Revisa la consola.'
}
```

---

## Helpers de explorer

```ts
const EXPLORER = 'https://monad-testnet.socialscan.io'

export const txUrl      = (hash: string)    => `${EXPLORER}/tx/${hash}`
export const addressUrl = (address: string) => `${EXPLORER}/address/${address}`
```

Pegar en cada estado "confirmed" de la UI para que el usuario pueda verificar
en explorer.

---

## Estados de UI mínimos

| Estado | Cuándo | Acción de usuario |
| --- | --- | --- |
| `disconnected` | Sin wallet conectada | Mostrar botón `Conectar` |
| `wrong-network` | Conectado pero `chainId !== 10143` | Botón `Cambiar a Monad Testnet` |
| `pending-signature` | Esperando firma en wallet | Spinner + "Firma en tu wallet" |
| `confirming` | Tx enviada, esperando receipt | Spinner + link a tx en explorer |
| `confirmed` | Receipt OK | ✓ + link a tx + refetch del estado |
| `failed` | Tx revertida o rechazada | Mensaje mapeado + botón `Reintentar` |

---

## Mock vs real

`src/hooks/` contiene dos versiones:

| Hook real | Hook mock | Cuándo usar mock |
| --- | --- | --- |
| `useIssue.ts` | `useIssue.mock.ts` | Iterar UI sin deploy real |
| `useVerify.ts` | `useVerify.mock.ts` | Probar formularios sin gastar gas |

Para cambiar: editar el import en `IssueForm.tsx` / `VerifyForm.tsx`.

---

## Onboarding de empresas (KYB)

Antes de que una empresa emita pasaportes, debe ser autorizada por el admin con
`registrarMarca`. Esa autorización exige verificación legal off-chain:

1. Frontend o backoffice recoge país, autoridad registral, código de verificación
   o número de registro, certificado/PDF y wallet de marca.
2. Backend/operador valida la información en la fuente oficial.
3. Backend/operador calcula `hashMetadatosKYB`.
4. Admin llama `registrarMarca(walletMarca, nombreComercial, hashMetadatosKYB, true)`.

No enviar al contrato el código de verificación de Cámara de Comercio, PDF,
NIT, nombres de representantes legales, correos, teléfonos ni direcciones.

Referencia completa: [`VERIFICACION_EMPRESARIAL.md`](VERIFICACION_EMPRESARIAL.md).

---

## Reglas Monad específicas

- **Gas:** Monad cobra por `gas_limit`, no por gas usado. No inflar límites.
- **MON nativo:** transferencia simple = `21000` gas fijo.
- **Cuentas nuevas:** ~1.2s de espera tras fondear antes de la primera tx.
- **Block states:** para UX normal basta el receipt; para confirmaciones de alta
  seguridad usar `finalized`.

---

## Flujo demo completo (orden de ejecución)

1. Emmanuel despliega `PasaporteOrigen.sol`.
2. Emmanuel valida o simula KYB para la marca demo.
3. Emmanuel ejecuta `registrarMarca(walletEmisora, "Handoo Demo Brand", hashMetadatosKYB, true)`.
4. Emmanuel comparte `VITE_PASAPORTE_ORIGEN_ADDRESS`.
5. Frontend setea la var y reinicia dev server.
6. Thomas conecta wallet emisora en Monad Testnet.
7. Frontend ejecuta `emitirProducto(hashSerial, hashMetadatos, "Sombrero vueltiao demo")`.
8. UI muestra link a tx en explorer.
9. Frontend ejecuta `verificarPorSerial(hashSerial)` → muestra `Producto`.
10. (opcional) `transferirProducto(1, walletComprador)`.
11. (opcional) `revocarProducto(1, hashMotivo)` desde la wallet emisora.
12. Verificar que `obtenerProducto(1).estado === Revocado`.
