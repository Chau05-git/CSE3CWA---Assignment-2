import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log(`[INSTRUMENTATION] POST /api/game-results - Request received at ${new Date().toISOString()}`);
  
  try {
    // Use a relative import so the runtime resolves the module path correctly
    const { getGameResultModel } = await import('../../../lib/db');
    const GameResult = getGameResultModel();
    
    const body = await req.json();
    const { playerName, status, completionTime, totalTime } = body;

    console.log(`[INSTRUMENTATION] POST /api/game-results - Body:`, { playerName, status, completionTime, totalTime });

    if (!status || !totalTime) {
      console.log(`[INSTRUMENTATION] POST /api/game-results - Validation failed: missing required fields`);
      return NextResponse.json(
        { error: 'Status and totalTime are required' },
        { status: 400 }
      );
    }

    const gameResult = await GameResult.create({
      playerName: playerName || 'Anonymous',
      status,
      completionTime,
      totalTime,
    });

    const duration = Date.now() - startTime;
    console.log(`[INSTRUMENTATION] POST /api/game-results - Success: Created ID ${gameResult.id} in ${duration}ms`);
    
    return NextResponse.json(gameResult, { status: 201 });
  } catch (e: any) {
    const duration = Date.now() - startTime;
    console.error(`[INSTRUMENTATION] POST /api/game-results - Error after ${duration}ms:`, e);
    return NextResponse.json(
      { error: 'Failed to save game result', message: e.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const startTime = Date.now();
  console.log(`[INSTRUMENTATION] GET /api/game-results - Request received at ${new Date().toISOString()}`);
  
  try {
    const { getGameResultModel } = await import('@/lib/db');
    const GameResult = getGameResultModel();
    
    const results = await GameResult.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    const duration = Date.now() - startTime;
    console.log(`[INSTRUMENTATION] GET /api/game-results - Success: Retrieved ${results.length} results in ${duration}ms`);

    return NextResponse.json(results);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[INSTRUMENTATION] GET /api/game-results - Error after ${duration}ms:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch game results' },
      { status: 500 }
    );
  }
}
