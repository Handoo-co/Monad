# Handoff Frontend Monad - Handoo OriginPass V2

## Red

| Campo | Valor |
| --- | --- |
| Chain ID | `10143` |
| RPC | `https://testnet-rpc.monad.xyz` |
| Token | `MON` |
| Explorer | `https://monad-testnet.socialscan.io` |

## Variables Vite

| Variable | Uso |
| --- | --- |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect/RainbowKit. |
| `VITE_MONAD_RPC_URL` | Override del RPC. |
| `VITE_REGISTRO_EMPRESAS_ADDRESS` | Address de `RegistroEmpresas`. |
| `VITE_PASAPORTE_PRODUCTOS_ADDRESS` | Address de `PasaporteProductos`. |

## Contratos

### `RegistroEmpresas`

Funciones principales:

| Funcion | Uso |
| --- | --- |
| `solicitarRegistroEmpresa` | Empresa crea solicitud comercial/artesanal. |
| `aprobarEmpresa` | Admin aprueba. |
| `rechazarEmpresa` | Admin rechaza con hash de motivo. |
| `suspenderEmpresa` | Admin suspende. |
| `reactivarEmpresa` | Admin reactiva. |
| `obtenerEmpresaPorCuenta` | Frontend lee empresa por wallet. |
| `empresaPorIndice` / `totalEmpresas` | Vista admin sin indexer. |

Enums:

```text
TipoEmpresa:       0 Comercial, 1 Artesanal
ModoVerificacion: 0 CamaraComercio, 1 RegistroOficial, 2 RevisionArtesanalAdmin
EstadoEmpresa:    0 Pendiente, 1 Aprobada, 2 Rechazada, 3 Suspendida
```

### `PasaporteProductos`

Funciones principales:

| Funcion | Uso |
| --- | --- |
| `registrarProducto` | Empresa aprobada registra producto. |
| `verificarProducto` | Comprador valida `productId + productHash`. |
| `obtenerProductoPorHash` | Lookup por hash. |
| `revocarProducto` | Admin revoca. |
| `productoPorIndice` / `totalProductos` | Vista admin sin indexer. |

Enums:

```text
TipoProducto:   0 ComercialOriginal, 1 Artesanal
EstadoProducto: 0 Activo, 1 Revocado
```

## Errores de contrato

| Error | Significado UI |
| --- | --- |
| `EmpresaNoEditable` | La empresa ya esta aprobada o suspendida; solo admin puede cambiar ese estado. |
| `HashVerificacionInvalido` | Una empresa comercial necesita hash del codigo de Camara/registro oficial. |
| `ModoVerificacionInvalido` | El modo no corresponde al tipo de empresa. |
| `EmpresaNoAprobada` | La wallet aun no puede registrar productos. |
| `TipoProductoInvalido` | Comercial solo registra producto original; artesanal solo registra producto artesanal. |
| `HashProductoInvalido` | El QR no corresponde al producto indicado. |
| `SoloAdministrador` | La accion requiere la wallet admin del deploy. |

## QR

Formato:

```text
/p/:chainId/:productContract/:productId?hash=:productHash
```

Ejemplo:

```text
https://demo.handoo.co/p/10143/0xContrato/1?hash=0x...
```

La vista comprador lee `PasaporteProductos.verificarProducto`, obtiene el
address de `RegistroEmpresas` desde el contrato y luego carga metadata publica.

## Claims de UI

- Comercial: "Empresa verificada por Camara/registro; producto atestado por la
  empresa emisora."
- Artesanal: "Empresa artesanal aprobada por Handoo; producto hecho por taller
  artesanal."
- Nunca decir que la Camara certifica cada producto.

## Legacy

`PasaporteOrigen`, `emitirProducto` y `verificarPorSerial` son V1 legado. No se
usan en la app V2.
