import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
  // Use a relative import so the runtime resolves the module path correctly
  const { getGameResultModel } = await import('../../../lib/db');
    const GameResult = getGameResultModel();
    
    const body = await req.json();
    const { playerName, status, completionTime, totalTime } = body;

    if (!status || !totalTime) {
      return NextResponse.json(
        { error: 'Status and totalTime are required' },
        { status: 400 }
      );
    }

    const result = await GameResult.create({
      playerName: playerName || 'Anonymous',
      status,
      completionTime: completionTime || null,
      totalTime,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error saving game result:', error);
    // Return more info for debugging (temporary)
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error && error.stack ? error.stack : undefined;
    return NextResponse.json(
      { error: 'Failed to save game result', message, stack },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { getGameResultModel } = await import('@/lib/db');
    const GameResult = getGameResultModel();
    
    const results = await GameResult.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching game results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game results' },
      { status: 500 }
    );
  }
}
