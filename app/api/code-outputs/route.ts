import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/code-outputs - Save code output
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log(`[INSTRUMENTATION] POST /api/code-outputs - Request received at ${new Date().toISOString()}`);
  
  try {
    const body = await req.json();
    const { title, content, language } = body || {};
    
    console.log(`[INSTRUMENTATION] POST /api/code-outputs - Body:`, { title, language, contentLength: content?.length });
    
    if (!title || !content) {
      console.log(`[INSTRUMENTATION] POST /api/code-outputs - Validation failed: missing required fields`);
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

    const duration = Date.now() - startTime;
    console.log(`[INSTRUMENTATION] POST /api/code-outputs - Success: Created ID ${codeOutput.id} in ${duration}ms`);

    return NextResponse.json(codeOutput, { status: 201 });
  } catch (e: any) {
    const duration = Date.now() - startTime;
    console.error(`[INSTRUMENTATION] POST /api/code-outputs - Error after ${duration}ms:`, e);
    return NextResponse.json(
      { error: 'Failed to save code output' },
      { status: 500 }
    );
  }
}

// GET /api/code-outputs - List all saved code outputs
export async function GET(_req: NextRequest) {
  const startTime = Date.now();
  console.log(`[INSTRUMENTATION] GET /api/code-outputs - Request received at ${new Date().toISOString()}`);
  
  try {
    const { ensureDb, getCodeOutputModel } = await import('@/lib/db');
    await ensureDb();
    const CodeOutput = getCodeOutputModel();
    
    const outputs = await CodeOutput.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    const duration = Date.now() - startTime;
    console.log(`[INSTRUMENTATION] GET /api/code-outputs - Success: Retrieved ${outputs.length} outputs in ${duration}ms`);

    return NextResponse.json(outputs, { status: 200 });
  } catch (e: any) {
    const duration = Date.now() - startTime;
    console.error(`[INSTRUMENTATION] GET /api/code-outputs - Error after ${duration}ms:`, e);
    return NextResponse.json(
      { error: 'Failed to fetch code outputs' },
      { status: 500 }
    );
  }
}
