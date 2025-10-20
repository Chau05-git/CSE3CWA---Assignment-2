# 🧪 Playwright E2E Testing

## ✅ Test Results

### API Tests (6/6 Passing ✅)
- ✅ GET /api/health
- ✅ GET /api/items
- ✅ POST /api/items  
- ✅ GET /api/game-results
- ✅ POST /api/game-results
- ✅ POST /api/code-outputs

### Complete Game Flow Tests (4/4 Passing ✅) **NEW!**
- ✅ Complete player journey (all 3 challenges → win → save)
- ✅ Failed challenge validation (wrong answers rejected)
- ✅ Loss scenario (timeout/incomplete)
- ✅ Multiple players simulation

### UI Tests (Requires GUI environment)
- Homepage navigation
- Escape Room gameplay
- Game result saving

## 📋 Test Files

```
tests/e2e/
├── api.spec.ts           # API endpoint tests (✅ Works on headless servers)
├── game-flow.spec.ts     # Complete game journey simulation (✅ NEW! Works everywhere)
├── homepage.spec.ts      # Homepage UI tests (Requires GUI)
└── escape-room.spec.ts   # Game flow E2E tests (Requires GUI)
```

## 🚀 Running Tests

### Run all tests:
```bash
npm test
```

### Run only API tests (works on server):
```bash
npm test tests/e2e/api.spec.ts
# OR
./run-tests.sh api
```

### Run complete game flow tests (works on server):
```bash
npm test tests/e2e/game-flow.spec.ts
# OR
./run-tests.sh game
```

### Run with UI (local machine with display):
```bash
npm run test:ui
```

### Run in headed mode (see browser):
```bash
npm run test:headed
```

### View test report:
```bash
npm run test:report
```

## 📊 Test Coverage

### ✅ API Testing (Automated - Works everywhere)
- Health check endpoint
- CRUD operations for Items
- CRUD operations for Game Results
- CRUD operations for Code Outputs
- Request/Response validation
- Status code verification

### ✅ Complete Game Flow Testing (NEW! - Works everywhere)
**Full player journey simulation:**
1. **Enter Escape Room** - Verify game page loads
2. **Challenge 1** - Sum calculation (0 to 10 = 55)
   - Submit correct answer → Pass
   - Submit wrong answer → Reject
3. **Challenge 2** - localStorage data save
   - Save correct user data → Pass
   - Save invalid data → Reject
4. **Challenge 3** - Debug tool selection
   - Select Bug icon (🐛) → Pass
   - Select wrong tool → Reject
5. **Win Game** - Complete all challenges
6. **Save Result** - Store to database with:
   - Player name
   - Win/Loss status
   - Completion time
   - Timestamp
7. **Verify Result** - Confirm data saved correctly

**Additional scenarios:**
- ✅ Loss scenario (timeout/incomplete)
- ✅ Multiple concurrent players
- ✅ Edge cases and error handling

### 🎮 E2E Testing (Requires GUI)
- Homepage loading
- Navigation between pages
- Escape Room game flow:
  - Starting the game
  - Completing Challenge 1 (Sum calculation)
  - Completing Challenge 2 (localStorage)
  - Completing Challenge 3 (Debug tool selection)
  - Winning the game
  - Saving game results
- Form interactions
- Real-time updates

## 🔧 Configuration

Test configuration is in `playwright.config.ts`:
- Base URL: `http://localhost:80`
- Browser: Chromium
- Retries: 2 on CI, 0 locally
- Screenshots: On failure
- Videos: On failure
- Traces: On first retry

## 📝 Notes

### EC2 Server Limitations
UI tests require a display/GUI environment. On headless EC2 servers:
- ✅ API tests work perfectly (using HTTP requests)
- ❌ Browser UI tests fail (no display available)

### Local Development
To run full E2E tests on your local machine:
1. Clone the repository
2. Install dependencies: `npm install`
3. Install Playwright browsers: `npx playwright install`
4. Run tests: `npm test`

### CI/CD Integration
For CI/CD pipelines:
```yaml
# Example GitHub Actions
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run tests
  run: npm test
```

## 🎯 Test Strategy

This project uses **automated E2E testing** with Playwright:

✅ **Automated** = Tests run automatically via `npm test`  
✅ **End-to-End** = Tests entire user flows from start to finish  
✅ **API Testing** = Works on any server (no GUI needed)  
✅ **UI Testing** = Full browser automation (requires display)

The tests are **written manually** but **execute automatically**, providing comprehensive coverage of all application features.

