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
| C3 | Pendiente | P0 | Deploy V2 en Monad Testnet | One-shot: `DEPLOYER_PK=0x... npm run deploy:testnet`. Script: `script/DesplegarV2.s.sol`. |
| C4 | Pendiente | P0 | Configurar envs V2 en Vercel | `npm run vercel:envs` (interactivo) o con `--auto`. Guia: `docs/DEPLOY_VERCEL.md`. |
| C5 | Pendiente | P1 | Verificar contratos en exploradores | Socialscan, MonadVision, Monadscan. |
| C6 | Hecho | P1 | Ejecutar `forge test` | 15/15 tests pass (9 V2 + 6 V1 legado). Foundry instalado. |
| C7 | Hecho | P0 | Script de deploy Foundry reproducible | `script/DesplegarV2.s.sol` + `scripts/deploy-v2.sh`. |

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
  `RegistroEmpresas`. Mitigado por `script/DesplegarV2.s.sol` (one-shot).
- QR de red equivocada: la ruta debe usar `10143`.
- Metadata rota: el contrato puede estar bien aunque el JSON publico no cargue.
- Claim legal: no prometer que la Camara certifica productos individuales.
- Gas en Monad: no inflar `gas_limit`.

## Comandos clave

| Tarea | Comando |
| --- | --- |
| Compilar contratos | `npm run contracts:build` |
| Tests del contrato | `npm run contracts:test` |
| Regenerar ABIs | `npm run contracts:abis` |
| Deploy V2 a Monad Testnet | `DEPLOYER_PK=0x... npm run deploy:testnet` |
| Push envs a Vercel | `npm run vercel:envs` |
| Type-check frontend | `npm run typecheck` |
| Build frontend | `npm run build` |
| Lint | `npm run lint` |

## Code freeze

Declarar freeze cuando: contratos V2 desplegados, envs configuradas, empresa
demo aprobada, producto demo registrado, QR verificado en mobile y admin probado.
