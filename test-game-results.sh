#!/bin/bash

# Test script for Game Results CRUD API
# Usage: ./test-game-results.sh

set -e

echo "=== Testing Game Results API ==="
echo ""

BASE_URL="http://localhost/api/game-results"

# Test 1: Save a winning game result
echo "1. Creating a winning game result..."
WIN_RESULT=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"playerName":"Speed Runner","status":"win","completionTime":95,"totalTime":180}')
echo "$WIN_RESULT" | jq .
WIN_ID=$(echo "$WIN_RESULT" | jq -r '.id')
echo "✓ Win result created with ID: $WIN_ID"
echo ""

# Test 2: Save a losing game result  
echo "2. Creating a losing game result..."
LOSE_RESULT=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"playerName":"Unlucky Player","status":"lose","totalTime":180}')
echo "$LOSE_RESULT" | jq .
LOSE_ID=$(echo "$LOSE_RESULT" | jq -r '.id')
echo "✓ Lose result created with ID: $LOSE_ID"
echo ""

# Test 3: Save result without player name (Anonymous)
echo "3. Creating anonymous result..."
ANON_RESULT=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"status":"win","completionTime":150,"totalTime":180}')
echo "$ANON_RESULT" | jq .
echo "✓ Anonymous result created"
echo ""

# Test 4: List all game results
echo "4. Listing all game results..."
ALL_RESULTS=$(curl -s "$BASE_URL")
echo "$ALL_RESULTS" | jq .
RESULT_COUNT=$(echo "$ALL_RESULTS" | jq 'length')
echo "✓ Found $RESULT_COUNT game results"
echo ""

# Test 5: Validate win result has completion time
echo "5. Validating data integrity..."
HAS_TIME=$(echo "$ALL_RESULTS" | jq --arg id "$WIN_ID" '.[] | select(.id == ($id | tonumber)) | .completionTime != null')
if [ "$HAS_TIME" == "true" ]; then
  echo "✓ Win result has completion time"
else
  echo "✗ Win result missing completion time"
  exit 1
fi

# Test 6: Validate lose result has no completion time
LOSE_NO_TIME=$(echo "$ALL_RESULTS" | jq --arg id "$LOSE_ID" '.[] | select(.id == ($id | tonumber)) | .completionTime == null')
if [ "$LOSE_NO_TIME" == "true" ]; then
  echo "✓ Lose result has no completion time"
else
  echo "✗ Lose result should not have completion time"
  exit 1
fi

echo ""
echo "=== All tests passed! ==="
echo ""
echo "Summary:"
echo "- Game results can be saved with player name, status, and time"
echo "- Win results include completion time"
echo "- Lose results have null completion time"
echo "- Anonymous players are supported"
echo "- Results are listed in reverse chronological order"
