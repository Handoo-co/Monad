# Proximos Pasos - Handoo OriginPass V2

## Leyenda

| Estado | Significado |
| --- | --- |
| Pendiente | No iniciado |
| En curso | En ejecucion |
| Hecho | Cerrado |
| Bloqueado | Requiere input externo |

## Contrato y deploy

| # | Estado | Prioridad | Tarea | Notas |
| --- | --- | --- | --- | --- |
| C1 | Hecho | P0 | Implementar `RegistroEmpresas.sol` | Empresas comerciales/artesanales. |
| C2 | Hecho | P0 | Implementar `PasaporteProductos.sol` | Productos QR + `productHash`. |
| C3 | Pendiente | P0 | Deploy V2 en Monad Testnet | Primero Registro, luego Pasaporte con address de Registro. |
| C4 | Pendiente | P0 | Configurar envs V2 en Vercel | `VITE_REGISTRO_EMPRESAS_ADDRESS`, `VITE_PASAPORTE_PRODUCTOS_ADDRESS`; guia en `docs/DEPLOY_VERCEL.md`. |
| C5 | Pendiente | P1 | Verificar contratos en exploradores | Socialscan, MonadVision, Monadscan. |
| C6 | Pendiente | P1 | Ejecutar `forge test` | Si Foundry esta disponible. |

## Producto y UX

| # | Estado | Prioridad | Tarea | Notas |
| --- | --- | --- | --- | --- |
| P1 | Hecho | P0 | Cambiar comprador a QR publico | Sin wallet. |
| P2 | Hecho | P0 | Agregar portal empresa | Solicitud + registro producto. |
| P3 | Hecho | P0 | Agregar panel admin | Aprobar/suspender/revocar. |
| P4 | Pendiente | P0 | Preparar metadata real demo | No datos sensibles; usar JSON publico. |
| P5 | Pendiente | P1 | Video/capturas de fallback | QR, empresa comercial, artesanal. |

## Verificacion empresarial

| # | Estado | Prioridad | Tarea | Notas |
| --- | --- | --- | --- | --- |
| K1 | Hecho | P0 | Separar claim empresa/producto | Camara verifica empresa, no cada producto. |
| K2 | Hecho | P0 | Modo artesanal sin Camara | Aprobacion admin de Handoo. |
| K3 | Pendiente | P1 | Definir checklist operativo para admin | Que evidencia mira Handoo antes de aprobar. |
| K4 | Pendiente | P2 | Backend futuro de adapters KYB | Fuera del MVP actual. |

## Riesgos vivos

- Deploy incompleto: `PasaporteProductos` necesita el address correcto de
  `RegistroEmpresas`.
- QR de red equivocada: la ruta debe usar `10143`.
- Metadata rota: el contrato puede estar bien aunque el JSON publico no cargue.
- Claim legal: no prometer que la Camara certifica productos individuales.
- Gas en Monad: no inflar `gas_limit`.

## Code freeze

Declarar freeze cuando: contratos V2 desplegados, envs configuradas, empresa
demo aprobada, producto demo registrado, QR verificado en mobile y admin probado.
