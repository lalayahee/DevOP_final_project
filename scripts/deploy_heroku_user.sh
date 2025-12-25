#!/usr/bin/env bash
# Simple helper to build and push the user-service image to Heroku Container Registry.
# Usage: HEROKU_APP=your-heroku-app ./scripts/deploy_heroku_user.sh

set -euo pipefail

if [ -z "${HEROKU_APP:-}" ]; then
  echo "Error: HEROKU_APP environment variable must be set"
  echo "Usage: HEROKU_APP=your-heroku-app ./scripts/deploy_heroku_user.sh"
  exit 1
fi

echo "Building and pushing user-service to Heroku app: $HEROKU_APP"
cd "$(dirname "$0")/../user-service"
heroku container:login
heroku container:push web -a "$HEROKU_APP"
heroku container:release web -a "$HEROKU_APP"

echo "Deployed user-service to Heroku app: $HEROKU_APP"
