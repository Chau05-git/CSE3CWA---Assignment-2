#!/bin/bash

# Simple Game Results Viewer - Auto updates from container
# Usage: ./results.sh [ID]
# Examples:
#   ./results.sh       # Show all results
#   ./results.sh 6     # Show specific ID

cd /home/ec2-user/CSE3CWA---Assignment-2

# Auto sync from container
docker cp nextjs-app:/app/database.sqlite . 2>/dev/null

if [ -z "$1" ]; then
  # Show all results
  echo "🏆 GAME RESULTS"
  echo "═══════════════════════════════════════════════════════════════"
  sqlite3 database.sqlite <<EOF
.mode column
.headers on
.width 4 18 8 12 22

SELECT 
  id,
  playerName as Player,
  status as Result,
  CASE WHEN completionTime IS NULL THEN 'DNF' ELSE completionTime || 's' END as Time,
  datetime(createdAt) as Date
FROM GameResults
ORDER BY createdAt DESC;
EOF
  
  echo ""
  echo "📊 Stats: $(sqlite3 database.sqlite "SELECT COUNT(*) FROM GameResults WHERE status='win';") wins, $(sqlite3 database.sqlite "SELECT COUNT(*) FROM GameResults WHERE status='lose';") losses | Best: $(sqlite3 database.sqlite "SELECT MIN(completionTime) FROM GameResults WHERE status='win';")s"
  
else
  # Show specific ID
  ID=$1
  echo "🔍 Result ID: $ID"
  echo "───────────────────────────────────────────────────────────────"
  sqlite3 database.sqlite <<EOF
.mode list
.separator ': '
SELECT 'Player', playerName FROM GameResults WHERE id=$ID
UNION ALL
SELECT 'Status', status FROM GameResults WHERE id=$ID
UNION ALL
SELECT 'Time', CASE WHEN completionTime IS NULL THEN 'Did not finish' ELSE completionTime || ' seconds (' || (completionTime/60) || 'm ' || (completionTime%60) || 's)' END FROM GameResults WHERE id=$ID
UNION ALL
SELECT 'Played', datetime(createdAt) FROM GameResults WHERE id=$ID;
EOF
fi
