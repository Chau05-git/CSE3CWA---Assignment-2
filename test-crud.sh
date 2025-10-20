#!/usr/bin/env bash
# Test CRUD API endpoints
set -e

API_URL="${1:-http://localhost:80}"
echo "Testing CRUD API at: $API_URL"
echo "================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test CREATE
echo -e "\n${BLUE}1. Testing CREATE (POST /api/items)${NC}"
RESPONSE=$(curl -s -X POST "$API_URL/api/items" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Laptop","description":"For testing purposes"}')
echo "$RESPONSE"
ITEM_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)
if [ -n "$ITEM_ID" ]; then
  echo -e "${GREEN}✓ CREATE successful - Item ID: $ITEM_ID${NC}"
else
  echo -e "${RED}✗ CREATE failed${NC}"
  exit 1
fi

# Test READ ALL
echo -e "\n${BLUE}2. Testing READ ALL (GET /api/items)${NC}"
RESPONSE=$(curl -s "$API_URL/api/items")
echo "$RESPONSE" | head -c 200
echo "..."
if echo "$RESPONSE" | grep -q "\"id\":$ITEM_ID"; then
  echo -e "${GREEN}✓ READ ALL successful${NC}"
else
  echo -e "${RED}✗ READ ALL failed${NC}"
  exit 1
fi

# Test READ ONE
echo -e "\n${BLUE}3. Testing READ ONE (GET /api/items/$ITEM_ID)${NC}"
RESPONSE=$(curl -s "$API_URL/api/items/$ITEM_ID")
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "\"id\":$ITEM_ID"; then
  echo -e "${GREEN}✓ READ ONE successful${NC}"
else
  echo -e "${RED}✗ READ ONE failed${NC}"
  exit 1
fi

# Test UPDATE
echo -e "\n${BLUE}4. Testing UPDATE (PUT /api/items/$ITEM_ID)${NC}"
RESPONSE=$(curl -s -X PUT "$API_URL/api/items/$ITEM_ID" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Updated Laptop","description":"Updated for testing"}')
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "Updated Laptop"; then
  echo -e "${GREEN}✓ UPDATE successful${NC}"
else
  echo -e "${RED}✗ UPDATE failed${NC}"
  exit 1
fi

# Test DELETE
echo -e "\n${BLUE}5. Testing DELETE (DELETE /api/items/$ITEM_ID)${NC}"
RESPONSE=$(curl -s -X DELETE "$API_URL/api/items/$ITEM_ID")
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "\"success\":true"; then
  echo -e "${GREEN}✓ DELETE successful${NC}"
else
  echo -e "${RED}✗ DELETE failed${NC}"
  exit 1
fi

# Verify deletion
echo -e "\n${BLUE}6. Verifying DELETE${NC}"
RESPONSE=$(curl -s "$API_URL/api/items/$ITEM_ID")
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "Not found"; then
  echo -e "${GREEN}✓ Verification successful - Item deleted${NC}"
else
  echo -e "${RED}✗ Item still exists after delete${NC}"
  exit 1
fi

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}All CRUD tests passed! ✓${NC}"
echo -e "${GREEN}================================${NC}"
