#!/bin/bash

# Check game result by ID
# Usage: ./check-result.sh [ID]
# Example: ./check-result.sh 5

if [ -z "$1" ]; then
  echo "📋 Showing all game results..."
  echo ""
  curl -s http://localhost/api/game-results | jq -r '.[] | "ID: \(.id) | Player: \(.playerName) | Status: \(.status) | Time: \(.completionTime // "N/A")s / \(.totalTime)s | Date: \(.createdAt)"'
else
  ID=$1
  echo "🔍 Checking result with ID: $ID"
  echo ""
  RESULT=$(curl -s http://localhost/api/game-results | jq --arg id "$ID" '.[] | select(.id == ($id | tonumber))')
  
  if [ -z "$RESULT" ]; then
    echo "❌ No result found with ID: $ID"
    exit 1
  fi
  
  echo "$RESULT" | jq .
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Player: $(echo "$RESULT" | jq -r '.playerName')"
  echo "Status: $(echo "$RESULT" | jq -r '.status')"
  echo "Completion Time: $(echo "$RESULT" | jq -r '.completionTime // "N/A"') seconds"
  echo "Total Time: $(echo "$RESULT" | jq -r '.totalTime') seconds"
  echo "Date: $(echo "$RESULT" | jq -r '.createdAt')"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi
