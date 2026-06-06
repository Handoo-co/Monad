# Plan Maestro Pacha - Handoo OriginPass V2

> Backlog vivo: [`PROXIMOS_PASOS.md`](PROXIMOS_PASOS.md).

## Definicion de hecho

La rama `Pacha` queda lista cuando existen contratos V2 desplegados en Monad
Testnet, una empresa demo aprobada, un producto registrado, QR publico
verificable y panel admin funcional.

## Enfoque de producto

Handoo OriginPass ya no verifica por serial. El comprador escanea un QR que
apunta a una ficha publica. Esa ficha consulta Monad y muestra:

- producto registrado y estado;
- empresa emisora;
- ubicacion y metadata publica;
- tipo comercial/artesanal;
- evidencia de registro empresarial o aprobacion artesanal.

La Camara de Comercio o registro equivalente valida existencia de empresa cuando
aplica. La autenticidad/origen del producto la atesta la empresa emisora o
Handoo mediante el contrato.

## Arquitectura V2

### `RegistroEmpresas`

- Administra solicitudes de empresas.
- Soporta `Comercial` y `Artesanal`.
- Comercial requiere hash de verificacion de Camara/registro oficial.
- Artesanal usa `RevisionArtesanalAdmin` y no requiere Camara.
- Expone indices simples para vista admin sin indexer.

### `PasaporteProductos`

- Recibe el address de `RegistroEmpresas` en constructor.
- Permite registrar productos solo a empresas aprobadas.
- Restringe tipo de producto segun tipo de empresa.
- Genera `productHash = keccak256(chainId, contract, productId)`.
- QR usa `productId + productHash`.

## Fases

| Fase | Estado | Salida |
| --- | --- | --- |
| Base V1 | Hecho | Contrato legacy `PasaporteOrigen`. |
| V2 contratos | Hecho | `RegistroEmpresas` + `PasaporteProductos`. |
| V2 frontend | Hecho | Comprador, empresa y admin. |
| Deploy | Pendiente | Addresses V2 + explorer. |
| Demo | Pendiente | Empresa aprobada + producto QR. |
| Submission | Pendiente | README final + demo URL + contratos. |

## Pruebas de aceptacion

- Comercial sin hash de verificacion revierte.
- Artesanal se aprueba sin Camara.
- Solo admin aprueba/suspende/revoca.
- Empresa no aprobada no registra productos.
- Empresa artesanal no registra producto comercial.
- Empresa comercial no registra producto artesanal.
- QR con hash incorrecto revierte.
- Comprador puede ver ficha sin wallet.
- Empresa genera QR tras registrar producto.
- Admin lista empresas/productos desde contrato.

## Decisiones fijadas

- V2 limpio; no hay compatibilidad frontend con serial.
- `PasaporteOrigen` queda como legado.
- Metadata completa vive off-chain en URI publica.
- Contrato guarda hashes, estados y punteros.
- No se guardan codigos de Camara, NIT, certificados ni datos personales
  on-chain.
- Monad Testnet es la red objetivo para demo.
