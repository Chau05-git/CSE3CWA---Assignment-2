import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/code-outputs - Save code output
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, language } = body || {};
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'title and content are required' },
        { status: 400 }
      );
    }

    const { ensureDb, getCodeOutputModel } = await import('@/lib/db');
    await ensureDb();
    const CodeOutput = getCodeOutputModel();
    
    const codeOutput = await CodeOutput.create({
      title,
      content,
      language: language || 'typescript',
    });

    return NextResponse.json(codeOutput, { status: 201 });
  } catch (e: any) {
    console.error('POST /api/code-outputs error', e);
    return NextResponse.json(
      { error: 'Failed to save code output' },
      { status: 500 }
    );
  }
}

// GET /api/code-outputs - List all saved code outputs
export async function GET(_req: NextRequest) {
  try {
    const { ensureDb, getCodeOutputModel } = await import('@/lib/db');
    await ensureDb();
    const CodeOutput = getCodeOutputModel();
    
    const outputs = await CodeOutput.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    return NextResponse.json(outputs, { status: 200 });
  } catch (e: any) {
    console.error('GET /api/code-outputs error', e);
    return NextResponse.json(
      { error: 'Failed to fetch code outputs' },
      { status: 500 }
    );
  }
}
