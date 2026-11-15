#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

mongod_bin="${MONGOD_BIN:-mongod}"
command -v "$mongod_bin" >/dev/null || { echo 'Set MONGOD_BIN to an executable mongod.' >&2; exit 1; }
test -s client/build/index.html || { echo 'Run ci/build.sh first.' >&2; exit 1; }

mkdir -p ci-logs
db_dir=$(mktemp -d "${TMPDIR:-/tmp}/payment-center-ci.XXXXXXXX")
mongo_pid=
app_pid=
cleanup() {
  if [[ -n "$app_pid" ]]; then kill "$app_pid" 2>/dev/null || true; wait "$app_pid" 2>/dev/null || true; fi
  if [[ -n "$mongo_pid" ]]; then kill "$mongo_pid" 2>/dev/null || true; wait "$mongo_pid" 2>/dev/null || true; fi
  rm -rf -- "$db_dir"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

port_pair=$(node --input-type=module <<'JS'
import { createServer } from 'node:net';
const servers = [createServer(), createServer()];
await Promise.all(servers.map(server => new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
})));
console.log(servers.map(server => server.address().port).join(' '));
servers.forEach(server => server.close());
JS
)
read -r mongo_port app_port <<< "$port_pair"

"$mongod_bin" --bind_ip 127.0.0.1 --port "$mongo_port" --dbpath "$db_dir" >ci-logs/mongodb.log 2>&1 &
mongo_pid=$!
for attempt in {1..30}; do
  if ! kill -0 "$mongo_pid" 2>/dev/null; then
    echo 'MongoDB exited during startup. See ci-logs/mongodb.log.' >&2
    exit 1
  fi
  if nc -z -w 1 127.0.0.1 "$mongo_port"; then break; fi
  if [[ "$attempt" == 30 ]]; then
    echo 'MongoDB missed its startup deadline. See ci-logs/mongodb.log.' >&2
    exit 1
  fi
  sleep 1
done
export MONGODB_URI="mongodb://127.0.0.1:$mongo_port/payment_center_ci"
env NODE_ENV=production PORT="$app_port" RENDER=false node server.js >ci-logs/app.log 2>&1 &
app_pid=$!
export PAYMENT_CENTER_URL="http://127.0.0.1:$app_port"

for attempt in {1..30}; do
  if ! kill -0 "$mongo_pid" "$app_pid" 2>/dev/null; then
    echo 'MongoDB or Payment Center exited during startup. See ci-logs/.' >&2
    exit 1
  fi
  if curl -fsS --max-time 2 "$PAYMENT_CENTER_URL/dashboard" >/dev/null 2>&1 &&
     curl -fsS --max-time 2 "$PAYMENT_CENTER_URL/api/portfolio" >/dev/null 2>&1; then
    CI=true npm test --prefix qa -- --fail-on-flaky-tests
    exit 0
  fi
  sleep 1
done
echo 'Payment Center missed its readiness deadline. See ci-logs/.' >&2
exit 1
