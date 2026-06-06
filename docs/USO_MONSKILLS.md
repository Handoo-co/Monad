# Uso de monskills en este proyecto

## Instalacion

Se instalo el set indicado por el mentor:

```bash
npx skills add therealharpaljadeja/monskills
```

Ruta instalada:

```text
.agents/skills/monskill
```

El instalador reporto riesgo critico para `monskill`; por eso se usa como
referencia tecnica auditada, no como permiso para ejecutar hooks o scripts sin
revision.

## Skills aplicadas

- `scaffold`: separacion por carpetas, contrato antes de frontend, verificacion
  post-deploy y uso preferente de Foundry.
- `gas`: en Monad se cobra por `gas_limit`; evitar limites inflados y documentar
  costos desde `gasLimit * gasPrice`.
- `concepts`: considerar async execution, block states y reserve balance en la
  experiencia de wallet/confirmacion.
- `wallet`: no pedir private keys; cualquier firma real la hace Emmanuel con
  wallet de prueba. No se generaron wallets desde Codex.
- `tooling-and-infra`: usar explorers/RPC soportados y verificar provider antes
  de depender de el.
- `wallet-integration`: para frontend, preferir chain oficial desde
  `viem/chains` y evaluar Para solo si necesitamos embedded wallets/social
  login; para demo simple puede bastar wallet externa.

## Decisiones derivadas

- V2 separa dominios en `RegistroEmpresas.sol` y `PasaporteProductos.sol`:
  empresas/KYB por un lado, productos QR por otro.
- `PasaporteOrigen.sol` queda como legado V1 basado en serial.
- Los contratos activos usan Solidity `^0.8.28`.
- `foundry.toml` fija `evm_version = "prague"` para el flujo recomendado por
  monskills.
- El QR usa `productHash` on-chain y metadata por URI + hash para no guardar
  datos sensibles en Monad.
- `docs/HANDOFF_FRONTEND_MONAD.md` y `artifacts/frontend-config.example.json`
  se agregan para que Thomas conecte wallet en Monad Testnet sin depender de
  address dummy ni de nombres de funciones inventados.
- Remix sigue como fallback operativo inmediato porque `forge`, `cast` y `jq`
  no estan instalados en esta maquina.
- Nunca se almacenan llaves privadas, `.env` ni secretos en el repo.
- Despues de deploy, el contrato debe verificarse en explorers.

## Skills adicionales revisadas

- `monad-development`: refuerza Foundry como ruta preferente, Chain ID `10143`,
  `evm_version = "prague"` y verificacion multi-explorer post-deploy.
- `security-review`: aplicada para mantener cero secretos, cero llaves privadas
  y validaciones explicitas antes de mutar estado.
- `wallet-integration`: aplicada como criterio de handoff. No se ejecuto
  `para init`, no se instalaron CLIs y no se generaron API keys.
- `skill-installer`: se uso para listar skills curated disponibles. Candidatas
  utiles mas adelante: `security-threat-model`, `security-best-practices`,
  `playwright`, `vercel-deploy` y `sentry`; no se instalaron porque el repo aun
  no tiene frontend/deploy productivo.
