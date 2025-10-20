#!/usr/bin/env bash
set -euo pipefail

cd /home/ec2-user/CSE3CWA---Assignment-2

echo "[compose-deploy] Building and starting via docker compose (legacy builder)..."
DOCKER_BUILDKIT=0 docker compose up -d --build

echo "[compose-deploy] Status:"
docker compose ps

echo "[compose-deploy] Health check:"
sleep 2
curl -sI localhost:80 | head -n 1 || true

echo "[compose-deploy] Done. Visit: http://<YOUR_EC2_PUBLIC_IP>"
