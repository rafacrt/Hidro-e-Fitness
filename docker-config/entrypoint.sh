#!/bin/bash
set -e

echo "Waiting for Hasura to be ready..."

# Aguarda até 60 segundos pelo Hasura
for i in {1..60}; do
  if wget --quiet --tries=1 --spider http://hasura:8080/healthz 2>/dev/null; then
    echo "Hasura is ready!"
    break
  fi

  if [ $i -eq 60 ]; then
    echo "Warning: Hasura is not responding after 60 seconds, starting anyway..."
  fi

  echo "Waiting for Hasura... ($i/60)"
  sleep 1
done

echo "Starting Next.js application..."
exec npm start -- -p 9002
