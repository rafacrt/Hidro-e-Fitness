#!/bin/bash
set -e

echo "🚀 Starting application initialization..."

# Executa o script de inicialização do banco
if [ -f /app/scripts/init-db.sh ]; then
  echo "📋 Running database initialization..."
  bash /app/scripts/init-db.sh
else
  echo "⚠️  Database init script not found, skipping..."
fi

echo "🌐 Starting Next.js application..."
exec npm start -- -p 9002
