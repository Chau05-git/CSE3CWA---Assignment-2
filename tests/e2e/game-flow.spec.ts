import { test, expect } from '@playwright/test';

/**
 * Full Escape Room Game Flow Test (API-based)
 * This test simulates a complete player journey through the game
 * using API endpoints instead of browser UI (works on headless servers)
 */
test.describe('Escape Room - Complete Game Flow (API)', () => {
  
  test('Complete game journey: Start → Solve all challenges → Save result', async ({ request }) => {
    const baseURL = 'http://localhost:80';
    
    console.log('🎮 Starting Escape Room Game Test...\n');
    
    // Step 1: Verify game page is accessible
    console.log('📍 Step 1: Access Escape Room page');
    const pageResponse = await request.get(`${baseURL}/EscapeRoom`);
    expect(pageResponse.ok()).toBeTruthy();
    expect(pageResponse.status()).toBe(200);
    console.log('✅ Game page loaded successfully\n');
    
    // Step 2: Validate Challenge 1 API endpoint
    console.log('📍 Step 2: Validate Challenge 1 (Sum Calculation)');
    const challenge1Code = `let sum = 0;
for (let i = 0; i <= 10; i++) {
  sum += i;
}
console.log(sum);`;
    
    const challenge1Response = await request.post(`${baseURL}/api/validate/code`, {
      data: {
        stage: 1,
        code: challenge1Code,
        output: '55\n'
      }
    });
    
    expect(challenge1Response.ok()).toBeTruthy();
    const challenge1Result = await challenge1Response.json();
    expect(challenge1Result.data.correct).toBeTruthy();
    console.log(`✅ Challenge 1 completed: ${challenge1Result.data.message || 'Sum = 55'}\n`);
    
    // Step 3: Validate Challenge 2 API endpoint
    console.log('📍 Step 3: Validate Challenge 2 (localStorage Data)');
    const savedData = JSON.stringify({ name: "John", age: 25, city: "NYC" });
    
    const challenge2Response = await request.post(`${baseURL}/api/validate/code`, {
      data: {
        stage: 2,
        code: 'localStorage.setItem("userData", ...)',
        output: savedData
      }
    });
    
    expect(challenge2Response.ok()).toBeTruthy();
    const challenge2Result = await challenge2Response.json();
    expect(challenge2Result.data.correct).toBeTruthy();
    console.log(`✅ Challenge 2 completed: ${challenge2Result.data.message || 'Data saved to localStorage'}\n`);
    
    // Step 4: Validate Challenge 3 API endpoint (Debug Tool)
    console.log('📍 Step 4: Validate Challenge 3 (Debug Tool Selection)');
    const challenge3Response = await request.post(`${baseURL}/api/validate/debug`, {
      data: {
        selectedId: 'bug' // Bug icon
      }
    });
    
    expect(challenge3Response.ok()).toBeTruthy();
    const challenge3Result = await challenge3Response.json();
    expect(challenge3Result.data.correct).toBeTruthy();
    console.log(`✅ Challenge 3 completed: ${challenge3Result.data.message || 'Correct debug tool selected'}\n`);
    
    // Step 5: Save game result
    console.log('📍 Step 5: Save game result to database');
    const gameTime = 120; // Simulated completion time (2 minutes)
    const saveResultResponse = await request.post(`${baseURL}/api/game-results`, {
      data: {
        playerName: 'Playwright E2E Test',
        status: 'win',
        completionTime: gameTime,
        totalTime: 180
      }
    });
    
    expect(saveResultResponse.ok()).toBeTruthy();
    const savedResult = await saveResultResponse.json();
    expect(savedResult).toHaveProperty('id');
    expect(savedResult.playerName).toBe('Playwright E2E Test');
    expect(savedResult.status).toBe('win');
    expect(savedResult.completionTime).toBe(gameTime);
    
    console.log(`✅ Game result saved successfully!`);
    console.log(`   ID: ${savedResult.id}`);
    console.log(`   Player: ${savedResult.playerName}`);
    console.log(`   Status: ${savedResult.status}`);
    console.log(`   Time: ${savedResult.completionTime}s / ${savedResult.totalTime}s\n`);
    
    // Step 6: Verify saved result
    console.log('📍 Step 6: Verify saved result in database');
    const verifyResponse = await request.get(`${baseURL}/api/game-results`);
    expect(verifyResponse.ok()).toBeTruthy();
    
    const allResults = await verifyResponse.json();
    const ourResult = allResults.find((r: any) => r.id === savedResult.id);
    
    expect(ourResult).toBeDefined();
    expect(ourResult.playerName).toBe('Playwright E2E Test');
    expect(ourResult.status).toBe('win');
    console.log(`✅ Result verified in database\n`);
    
    console.log('🎉 GAME COMPLETED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Player Journey Summary:`);
    console.log(`  ✅ Entered Escape Room`);
    console.log(`  ✅ Completed Challenge 1 (Sum: 0-10 = 55)`);
    console.log(`  ✅ Completed Challenge 2 (localStorage)`);
    console.log(`  ✅ Completed Challenge 3 (Debug Tool)`);
    console.log(`  ✅ Won the game`);
    console.log(`  ✅ Saved result to database (ID: ${savedResult.id})`);
    console.log(`  ⏱️  Time: ${gameTime}s`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  test('Failed game journey: Wrong answers on challenges', async ({ request }) => {
    const baseURL = 'http://localhost:80';
    
    console.log('🎮 Testing incorrect challenge answers...\n');
    
    // Test wrong answer for Challenge 1
    console.log('📍 Testing Challenge 1 with wrong answer');
    const wrongChallenge1 = await request.post(`${baseURL}/api/validate/code`, {
      data: {
        stage: 1,
        code: 'let sum = 100;',
        output: '100\n'
      }
    });
    
    const wrong1Result = await wrongChallenge1.json();
    expect(wrong1Result.data.correct).toBeFalsy();
    console.log(`✅ Correctly rejected wrong answer (got 100, expected 55)\n`);
    
    // Test wrong answer for Challenge 2
    console.log('📍 Testing Challenge 2 with invalid data');
    const wrongChallenge2 = await request.post(`${baseURL}/api/validate/code`, {
      data: {
        stage: 2,
        code: 'localStorage.setItem(...)',
        output: JSON.stringify({ name: "Wrong", age: 99, city: "Wrong" })
      }
    });
    
    const wrong2Result = await wrongChallenge2.json();
    expect(wrong2Result.data.correct).toBeFalsy();
    console.log(`✅ Correctly rejected invalid data\n`);
    
    // Test wrong answer for Challenge 3
    console.log('📍 Testing Challenge 3 with wrong tool');
    const wrongChallenge3 = await request.post(`${baseURL}/api/validate/debug`, {
      data: {
        selectedId: 'console' // Wrong answer
      }
    });
    
    const wrong3Result = await wrongChallenge3.json();
    expect(wrong3Result.data.correct).toBeFalsy();
    console.log(`✅ Correctly rejected wrong debug tool selection\n`);
    
    console.log('✅ All validation checks working correctly!\n');
  });

  test('Loss scenario: Save game result after timeout', async ({ request }) => {
    const baseURL = 'http://localhost:80';
    
    console.log('🎮 Testing loss scenario (time expired)...\n');
    
    // Save a loss result
    const lossResponse = await request.post(`${baseURL}/api/game-results`, {
      data: {
        playerName: 'Timeout Test Player',
        status: 'lose',
        completionTime: null, // No completion time for losses
        totalTime: 180
      }
    });
    
    expect(lossResponse.ok()).toBeTruthy();
    const lossResult = await lossResponse.json();
    
    expect(lossResult.status).toBe('lose');
    expect(lossResult.completionTime).toBeNull();
    
    console.log(`✅ Loss result saved successfully`);
    console.log(`   ID: ${lossResult.id}`);
    console.log(`   Player: ${lossResult.playerName}`);
    console.log(`   Status: ${lossResult.status}`);
    console.log(`   Result: Time expired (no completion time)\n`);
  });

  test('Multiple players completing game', async ({ request }) => {
    const baseURL = 'http://localhost:80';
    
    console.log('🎮 Testing multiple players...\n');
    
    const players = [
      { name: 'Speed Runner', time: 95 },
      { name: 'Average Player', time: 150 },
      { name: 'Slow Player', time: 175 }
    ];
    
    const savedIds = [];
    
    for (const player of players) {
      console.log(`📍 Player: ${player.name} (${player.time}s)`);
      
      const response = await request.post(`${baseURL}/api/game-results`, {
        data: {
          playerName: player.name,
          status: 'win',
          completionTime: player.time,
          totalTime: 180
        }
      });
      
      expect(response.ok()).toBeTruthy();
      const result = await response.json();
      savedIds.push(result.id);
      
      console.log(`   ✅ Saved with ID: ${result.id}\n`);
    }
    
    // Verify all results
    const allResults = await request.get(`${baseURL}/api/game-results`);
    const results = await allResults.json();
    
    for (const id of savedIds) {
      const found = results.find((r: any) => r.id === id);
      expect(found).toBeDefined();
    }
    
    console.log(`✅ All ${players.length} players saved successfully!\n`);
  });
});
