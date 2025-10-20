#!/usr/bin/env bash
set -euo pipefail

# Simple deploy script bypassing docker-compose issues on this host.
# Builds the image from Dockerfile and runs it mapping EC2 port 80 -> container 3000.

APP_NAME="nextjs-app"
IMAGE_NAME="ass2:latest"
PROJECT_DIR="/home/ec2-user/CSE3CWA---Assignment-2"

echo "[deploy] Building image ${IMAGE_NAME} from ${PROJECT_DIR}/dockerfile ..."
docker build -t "${IMAGE_NAME}" -f "${PROJECT_DIR}/dockerfile" "${PROJECT_DIR}"

echo "[deploy] Stopping/removing existing container ${APP_NAME} if present ..."
docker rm -f "${APP_NAME}" >/dev/null 2>&1 || true

echo "[deploy] Ensure host data directory exists and preserve any existing DB"
mkdir -p "${PROJECT_DIR}/data"
if [ -f "${PROJECT_DIR}/database.sqlite" ] && [ ! -f "${PROJECT_DIR}/data/database.sqlite" ]; then
	echo "[deploy] Copying existing database.sqlite to data/ for persistence"
	cp "${PROJECT_DIR}/database.sqlite" "${PROJECT_DIR}/data/database.sqlite"
fi

# Optional .env support for runtime env vars (if PROJECT_DIR/.env exists)
ENV_FILE_OPT=""
if [ -f "${PROJECT_DIR}/.env" ]; then
	echo "[deploy] Using env-file: ${PROJECT_DIR}/.env"
	ENV_FILE_OPT="--env-file ${PROJECT_DIR}/.env"
fi

echo "[deploy] Starting container ${APP_NAME} on port 80 -> 3000 (restart unless-stopped) ..."
docker run -d \
	--name "${APP_NAME}" \
	--restart unless-stopped \
	-p 80:3000 \
	-v "${PROJECT_DIR}/data/database.sqlite:/app/database.sqlite" \
	${ENV_FILE_OPT} \
	"${IMAGE_NAME}" /bin/sh -c "npx sequelize-cli db:migrate && npm start"

echo "[deploy] Waiting for app to start ..."
sleep 2

echo "[deploy] Recent logs:"
docker logs --tail=50 "${APP_NAME}" || true

echo "[deploy] Health check:"
curl -sI localhost:80 | head -n 1 || true

echo "[deploy] Done. Visit: http://<YOUR_EC2_PUBLIC_IP>"
