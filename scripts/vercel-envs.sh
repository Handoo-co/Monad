#!/usr/bin/env bash
#
# Pushea las variables de entorno V2 a Vercel (production + preview + development).
#
# Requisitos:
#   - Vercel CLI instalado: npm i -g vercel
#   - Vercel project linkeado: ejecutar `vercel link` una vez en la raíz del repo
#   - Login: `vercel login`
#
# Uso (interactivo, pide cada valor):
#   npm run vercel:envs
#
# O setea las vars antes y pasa --auto:
#   VITE_REGISTRO_EMPRESAS_ADDRESS=0x... \
#   VITE_PASAPORTE_PRODUCTOS_ADDRESS=0x... \
#   VITE_WALLETCONNECT_PROJECT_ID=xxx \
#   npm run vercel:envs -- --auto
#
set -euo pipefail

if ! command -v vercel >/dev/null 2>&1; then
  echo "ERROR: Vercel CLI no instalada. Corre: npm i -g vercel" >&2
  exit 1
fi

if [[ ! -f .vercel/project.json ]]; then
  echo "ERROR: el repo no está linkeado a un proyecto de Vercel." >&2
  echo "Ejecuta: vercel link" >&2
  exit 1
fi

AUTO=false
for arg in "$@"; do
  case "$arg" in
    --auto) AUTO=true ;;
  esac
done

prompt_or_use() {
  local name="$1"
  local current="${!name:-}"

  if [[ -n "$current" ]]; then
    echo "$current"
    return
  fi

  if $AUTO; then
    echo "ERROR: --auto requiere que $name esté seteada como variable de entorno." >&2
    exit 1
  fi

  read -rp "Valor para $name: " value
  echo "$value"
}

push_env() {
  local name="$1"
  local value="$2"

  for target in production preview development; do
    echo "==> $name → $target"
    # Si existe, removerla antes para evitar prompt interactivo
    vercel env rm "$name" "$target" --yes 2>/dev/null || true
    printf '%s' "$value" | vercel env add "$name" "$target"
  done
}

REGISTRO_VAL=$(prompt_or_use VITE_REGISTRO_EMPRESAS_ADDRESS)
PASAPORTE_VAL=$(prompt_or_use VITE_PASAPORTE_PRODUCTOS_ADDRESS)
WC_VAL=$(prompt_or_use VITE_WALLETCONNECT_PROJECT_ID)

push_env VITE_REGISTRO_EMPRESAS_ADDRESS "$REGISTRO_VAL"
push_env VITE_PASAPORTE_PRODUCTOS_ADDRESS "$PASAPORTE_VAL"
push_env VITE_WALLETCONNECT_PROJECT_ID "$WC_VAL"

# Var opcional con default sensato
RPC_VAL="${VITE_MONAD_RPC_URL:-https://testnet-rpc.monad.xyz}"
push_env VITE_MONAD_RPC_URL "$RPC_VAL"

echo ""
echo "==> Listo. Trigger redeploy con: vercel --prod"
