# Revision Fase 2 - Preparacion de Deploy

## Resultado

Fase 2 preparada sin firmar transacciones desde Codex.

Se genero la ABI del contrato y se documento el flujo seguro de deploy en Remix.
La ABI incluye emision, verificacion, transferencia y revocacion. El deploy real
queda pendiente porque debe hacerlo Emmanuel con una wallet de prueba en Monad
Testnet.

## Artefactos agregados

- `artifacts/PasaporteOrigen.abi.json`.
- `docs/GUIA_DEPLOY_REMIX.md`.

## Verificacion ejecutada

- Compilacion con `solc 0.8.28` via `npx.cmd`.
- ABI generada desde `contracts/PasaporteOrigen.sol`.
- `git diff --cached --check` ejecutado durante la fase.

## Revision

- No se agregaron llaves, tokens ni variables de entorno.
- Se agrego `.gitignore` para excluir `.env`, outputs Foundry y dependencias.
- La guia indica usar wallet de prueba.
- La guia usa hashes demo y prohibe datos personales on-chain.
- La guia incluye el paso obligatorio `registrarMarca` antes de `emitirProducto`.
- La guia incluye `transferirProducto` como prueba de ownership on-chain.
- La guia deja claro que un redeploy exige actualizar address y ABI.

## Pendiente

- Ejecutar deploy real en Remix.
- Registrar `Handoo Demo Brand`.
- Guardar direccion y links de explorer en la documentacion final.
- Entregar direccion real al frontend.
