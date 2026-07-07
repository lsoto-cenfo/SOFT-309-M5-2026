#!/usr/bin/env bash
set -euo pipefail

TARGET="${ZAP_TARGET:-https://www.saucedemo.com}"
REPORT_DIR="$(pwd)/zap-report"
REPORT_FILE="${REPORT_DIR}/zap-report.html"
ZAP_VER="${ZAP_VER:-2.16.1}"
ZAP_HOME="$(pwd)/.zap-runtime/ZAP_${ZAP_VER}"

mkdir -p "$REPORT_DIR" .zap-runtime

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  echo "→ OWASP ZAP baseline (Docker) contra ${TARGET}"
  docker run --rm \
    -v "${REPORT_DIR}:/zap/wrk:rw" \
    ghcr.io/zaproxy/zaproxy:stable \
    zap-baseline.py -t "$TARGET" -r zap-report.html -a
  exit 0
fi

if [[ ! -x "${ZAP_HOME}/zap.sh" ]]; then
  echo "→ Descargando OWASP ZAP ${ZAP_VER}..."
  curl -fsSL -o /tmp/zap.zip \
    "https://github.com/zaproxy/zaproxy/releases/download/v${ZAP_VER}/ZAP_${ZAP_VER}_Crossplatform.zip"
  unzip -qo /tmp/zap.zip -d .zap-runtime
fi

echo "→ OWASP ZAP quick scan (local) contra ${TARGET}"
"${ZAP_HOME}/zap.sh" -cmd \
  -quickurl "$TARGET" \
  -quickout "$REPORT_FILE" \
  -quickprogress

echo "Reporte: ${REPORT_FILE}"
