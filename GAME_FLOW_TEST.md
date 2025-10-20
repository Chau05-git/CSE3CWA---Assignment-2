# 🎮 Complete Escape Room Game Flow Test

## Overview
This test suite simulates the **complete player experience** in the Escape Room game, from entering the room to completing all challenges and saving the result.

## Test Scenarios

### ✅ 1. Complete Game Journey (Win Scenario)
**Simulates a successful player completing all challenges:**

```
Player Journey:
┌─────────────────────────────────────────────┐
│ 1. Enter Escape Room                        │
│    ✅ Page loads successfully               │
├─────────────────────────────────────────────┤
│ 2. Challenge 1: Sum Calculation             │
│    Task: Calculate sum of 0 to 10           │
│    Answer: 55                                │
│    ✅ Validation passed                     │
├─────────────────────────────────────────────┤
│ 3. Challenge 2: localStorage                │
│    Task: Save user data to localStorage     │
│    Data: {name: "John", age: 25, city: "NYC"}│
│    ✅ Validation passed                     │
├─────────────────────────────────────────────┤
│ 4. Challenge 3: Debug Tool Selection        │
│    Task: Select correct debugging tool      │
│    Answer: Bug Icon (🐛)                    │
│    ✅ Validation passed                     │
├─────────────────────────────────────────────┤
│ 5. Win Game                                  │
│    ✅ All challenges completed               │
│    Time: 120 seconds                         │
├─────────────────────────────────────────────┤
│ 6. Save Result to Database                   │
│    Player: "Playwright E2E Test"             │
│    Status: win                               │
│    Time: 120s / 180s                         │
│    ✅ Saved successfully                     │
├─────────────────────────────────────────────┤
│ 7. Verify Result                             │
│    ✅ Data confirmed in database             │
└─────────────────────────────────────────────┘
```

**Expected Outcome:**
- ✅ Player completes game in 120 seconds
- ✅ Result saved with ID in database
- ✅ All validations pass

---

### ❌ 2. Failed Challenge Attempts
**Tests validation logic with incorrect answers:**

| Challenge | Wrong Input | Expected Result |
|-----------|-------------|-----------------|
| Challenge 1 | Sum = 100 (wrong) | ❌ Rejected |
| Challenge 2 | Invalid data | ❌ Rejected |
| Challenge 3 | Wrong tool | ❌ Rejected |

**Expected Outcome:**
- ✅ All incorrect answers properly rejected
- ✅ Appropriate error messages shown

---

### ⏰ 3. Loss Scenario (Timeout)
**Simulates player running out of time:**

```
Player Journey:
┌─────────────────────────────────────────────┐
│ 1. Enter Escape Room                        │
│ 2. Start Timer (180 seconds)                │
│ 3. Time Expires                              │
│    ⏰ Timeout - Game Lost                   │
├─────────────────────────────────────────────┤
│ 4. Save Loss Result                          │
│    Player: "Timeout Test Player"             │
│    Status: lose                              │
│    Completion Time: null                     │
│    ✅ Saved successfully                     │
└─────────────────────────────────────────────┘
```

**Expected Outcome:**
- ✅ Loss recorded in database
- ✅ Completion time is null

---

### 👥 4. Multiple Players
**Tests concurrent game sessions:**

```
3 Players Complete Game:
─────────────────────────────────────
Player 1: "Speed Runner"    → 95s  ✅
Player 2: "Average Player"  → 150s ✅
Player 3: "Slow Player"     → 175s ✅
─────────────────────────────────────
```

**Expected Outcome:**
- ✅ All 3 results saved with unique IDs
- ✅ Times correctly recorded
- ✅ All retrievable from database

---

## Running the Tests

### Quick Run:
```bash
./run-tests.sh game
```

### Detailed Run:
```bash
npm test tests/e2e/game-flow.spec.ts
```

### With Reporting:
```bash
npm test tests/e2e/game-flow.spec.ts
npx playwright show-report
```

---

## Test Output Example

```
🎮 Starting Escape Room Game Test...

📍 Step 1: Access Escape Room page
✅ Game page loaded successfully

📍 Step 2: Validate Challenge 1 (Sum Calculation)
✅ Challenge 1 completed: ✅ Correct! The answer is 55

📍 Step 3: Validate Challenge 2 (localStorage Data)
✅ Challenge 2 completed: ✅ Perfect! Data saved to localStorage successfully!

📍 Step 4: Validate Challenge 3 (Debug Tool Selection)
✅ Challenge 3 completed: ✅ Correct! "Bug Icon" is a debugging tool!

📍 Step 5: Save game result to database
✅ Game result saved successfully!
   ID: 20
   Player: Playwright E2E Test
   Status: win
   Time: 120s / 180s

📍 Step 6: Verify saved result in database
✅ Result verified in database

🎉 GAME COMPLETED SUCCESSFULLY!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Player Journey Summary:
  ✅ Entered Escape Room
  ✅ Completed Challenge 1 (Sum: 0-10 = 55)
  ✅ Completed Challenge 2 (localStorage)
  ✅ Completed Challenge 3 (Debug Tool)
  ✅ Won the game
  ✅ Saved result to database (ID: 20)
  ⏱️  Time: 120s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  4 passed (2.1s)
```

---

## Verification

After tests complete, verify results in database:

```bash
./results.sh
```

Expected output shows test results:
```
🏆 GAME RESULTS
═══════════════════════════════════════════════════════════════
id    Player              Result    Time          Date                  
----  ------------------  --------  ------------  ----------------------
24    Slow Player         win       175s          2025-10-20 03:01:34   
23    Average Player      win       150s          2025-10-20 03:01:34   
22    Speed Runner        win       95s           2025-10-20 03:01:34   
21    Timeout Test Playe  lose      DNF           2025-10-20 03:01:33   
20    Playwright E2E Tes  win       120s          2025-10-20 03:01:33   
```

---

## Why This Test is Important

### 🎯 Complete Coverage
- Tests **entire user journey** from start to finish
- Validates **all 3 challenges** in sequence
- Confirms **database integration** works correctly

### 🚀 Works Everywhere
- ✅ Runs on **headless servers** (EC2, CI/CD)
- ✅ No GUI required (API-based testing)
- ✅ Fast execution (~2 seconds)

### 🔍 Real-World Simulation
- Mimics **actual player behavior**
- Tests **win and loss scenarios**
- Validates **error handling**

### 📊 Comprehensive Validation
- ✅ Page accessibility
- ✅ Challenge logic
- ✅ Data persistence
- ✅ Error rejection
- ✅ Multiple users

---

## Technical Details

**Test Type:** Integration/E2E  
**Framework:** Playwright  
**Method:** API-based (no browser GUI)  
**Duration:** ~2 seconds  
**Tests:** 4 scenarios  
**Assertions:** 15+ validations  

**APIs Tested:**
- `GET /EscapeRoom` - Page access
- `POST /api/validate/code` - Challenge 1 & 2 validation
- `POST /api/validate/debug` - Challenge 3 validation
- `POST /api/game-results` - Save results
- `GET /api/game-results` - Verify results

---

## Success Criteria

All tests pass when:
1. ✅ Game page loads (200 OK)
2. ✅ All 3 challenges validate correctly
3. ✅ Wrong answers are rejected
4. ✅ Win results save with completion time
5. ✅ Loss results save without completion time
6. ✅ Results are retrievable from database
7. ✅ Multiple players can play concurrently

**Current Status: ALL PASSING ✅**
