#!/bin/bash

# Run Playwright Tests
# Usage: ./run-tests.sh [type]
# Examples:
#   ./run-tests.sh         # Run all tests
#   ./run-tests.sh api     # Run only API tests
#   ./run-tests.sh ui      # Run only UI tests

cd /home/ec2-user/CSE3CWA---Assignment-2

case "$1" in
  api)
    echo "🧪 Running API Tests..."
    npm test tests/e2e/api.spec.ts
    ;;
  game)
    echo "🎮 Running Complete Game Flow Tests..."
    npm test tests/e2e/game-flow.spec.ts
    ;;
  ui)
    echo "🎭 Running UI Tests..."
    npm test tests/e2e/homepage.spec.ts tests/e2e/escape-room.spec.ts
    ;;
  report)
    echo "📊 Opening Test Report..."
    npm run test:report
    ;;
  *)
    echo "🧪 Running All Tests..."
    npm test
    ;;
esac
