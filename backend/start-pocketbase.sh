#!/bin/sh
set -eu

# Apply existing migration files automatically on container start.
/pb/pocketbase migrate up

PB_SUPERUSER_EMAIL="${PB_SUPERUSER_EMAIL:-}"
PB_SUPERUSER_PASSWORD="${PB_SUPERUSER_PASSWORD:-}"
PB_DB_PATH="${PB_DB_PATH:-/pb/pb_data/data.db}"

if [ -n "$PB_SUPERUSER_EMAIL" ] && [ -n "$PB_SUPERUSER_PASSWORD" ]; then
  AUTH_TABLE="$(sqlite3 "$PB_DB_PATH" "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('_superusers','_admins') ORDER BY CASE name WHEN '_superusers' THEN 0 ELSE 1 END LIMIT 1;" 2>/dev/null || true)"

  if [ -n "$AUTH_TABLE" ]; then
    SUPERUSER_COUNT="$(sqlite3 "$PB_DB_PATH" "SELECT COUNT(*) FROM \"$AUTH_TABLE\";" 2>/dev/null || printf '0')"

    if [ "$SUPERUSER_COUNT" = "0" ]; then
      /pb/pocketbase admin create "$PB_SUPERUSER_EMAIL" "$PB_SUPERUSER_PASSWORD"
    fi
  fi
fi

exec /pb/pocketbase serve --http=0.0.0.0:8090
