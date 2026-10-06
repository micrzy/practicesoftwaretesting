#!/usr/bin/env bash
# Start the self-hosted Toolshop app, seed data, generate invoice PDFs, wait until ready.
set -euo pipefail
cd "$(dirname "$0")"
COMPOSE="docker compose -f docker-compose.sut.yml"

# Pull with retry (pulls occasionally fail with "No such image" right after Docker starts)
for i in 1 2 3; do $COMPOSE pull -q && break || { echo "pull failed, retry $i"; sleep 5; }; done
$COMPOSE up -d

echo "Seeding database..."
for i in $(seq 1 30); do
  $COMPOSE exec -T laravel-api php artisan migrate:fresh --seed --force >/dev/null 2>&1 && break
  [ "$i" = 30 ] && { echo "Seeding failed"; exit 1; }
  sleep 5
done

echo "Generating invoice PDFs..."
$COMPOSE exec -T laravel-api php artisan invoice:generate >/dev/null 2>&1
$COMPOSE exec -T laravel-api php artisan queue:work --stop-when-empty >/dev/null 2>&1

wait_for() {
  for i in $(seq 1 60); do
    [ "$(curl -s -o /dev/null -w '%{http_code}' "$1")" = 200 ] && { echo "$1 ready"; return 0; }
    sleep 5
  done
  echo "$1 not ready after 5 min"; $COMPOSE logs --tail 50; exit 1
}
wait_for http://localhost:8091/products
wait_for http://localhost:4200
