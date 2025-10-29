#!/bin/bash
set -e

echo "Starting application initialization..."

echo "Starting Next.js application..."
exec npm start -- -p 9002
