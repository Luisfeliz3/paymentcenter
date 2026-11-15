#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# The legacy root install hook invokes npm install in client. Install both
# lockfiles explicitly. The demo server only uses JavaScript dependencies.
npm ci --omit=dev --ignore-scripts --no-audit
npm ci --prefix client --no-audit
npm ci --prefix qa --no-audit
npm run build --prefix client
