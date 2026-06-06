#!/usr/bin/env bash
#
# Deploy V2 (RegistroEmpresas + PasaporteProductos) en Monad Testnet.
#
# Requisitos:
#   - Foundry instalado (forge en PATH)
#   - Variable de entorno DEPLOYER_PK con la clave hex (con prefijo 0x) de
#     una wallet de prueba financiada con MON
#   - MON de faucet en la wallet (~0.1 MON debe alcanzar)
#
# Uso:
#   DEPLOYER_PK=0x... npm run deploy:testnet
#
# Para verificar después:
#   - Copiar las addresses impresas y pegarlas en Vercel (scripts/vercel-envs.sh)
#   - Visitar el explorer enlazado en el output
#
set -euo pipefail

if [[ -z "${DEPLOYER_PK:-}" ]]; then
  echo "ERROR: setea DEPLOYER_PK con la clave hex de la wallet de despliegue." >&2
  echo "Ejemplo: DEPLOYER_PK=0xabc... npm run deploy:testnet" >&2
  exit 1
fi

if ! command -v forge >/dev/null 2>&1; then
  echo "ERROR: forge no está en PATH. Instala Foundry desde foundry.paradigm.xyz" >&2
  exit 1
fi

echo "==> Compilando contratos..."
forge build

echo ""
echo "==> Ejecutando tests antes de deployar..."
forge test -vv

echo ""
echo "==> Desplegando en Monad Testnet (chain id 10143)..."
forge script script/DesplegarV2.s.sol:DesplegarV2 \
  --rpc-url monad_testnet \
  --broadcast \
  -vv

echo ""
echo "==> Deploy completado."
echo "Lee las addresses del bloque 'Variables Vercel/local a configurar' arriba"
echo "y luego corre: npm run vercel:envs"
