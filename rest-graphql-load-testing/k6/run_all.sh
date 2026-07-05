#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8000}"
REPORT_DIR="${REPORT_DIR:-k6/reports}"
LOAD_LEVELS="${LOAD_LEVELS:-low medium high very_high}"
TECHNOLOGIES="${TECHNOLOGIES:-rest graphql}"
SCENARIOS="${SCENARIOS:-product products order customer_orders}"

mkdir -p "$REPORT_DIR"

if ! command -v k6 >/dev/null 2>&1; then
  echo "k6 is not installed or is not available in PATH." >&2
  exit 1
fi

normalize_list() {
  echo "$1" | tr "," " "
}

run_test() {
  local technology="$1"
  local scenario="$2"
  local load_level="$3"
  local script="k6/${technology}/${scenario}.js"
  local report="${REPORT_DIR}/${technology}_${scenario}_${load_level}.json"

  if [[ ! -f "$script" ]]; then
    echo "Skipping missing script: $script"
    return
  fi

  echo
  echo "==> ${technology}/${scenario} | load=${load_level} | base=${BASE_URL}"
  BASE_URL="$BASE_URL" LOAD_LEVEL="$load_level" \
    k6 run --summary-export "$report" "$script"
}

for load_level in $(normalize_list "$LOAD_LEVELS"); do
  for technology in $(normalize_list "$TECHNOLOGIES"); do
    for scenario in $(normalize_list "$SCENARIOS"); do
      run_test "$technology" "$scenario" "$load_level"
    done
  done
done

echo
echo "Reports written to ${REPORT_DIR}"
