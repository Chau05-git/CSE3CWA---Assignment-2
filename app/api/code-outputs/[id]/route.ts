import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/code-outputs/:id - Get one code output
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { ensureDb, getCodeOutputModel } = await import('@/lib/db');
    await ensureDb();
    const CodeOutput = getCodeOutputModel();
    
    const output = await CodeOutput.findByPk(id);
    if (!output) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(output, { status: 200 });
  } catch (e: any) {
    console.error('GET /api/code-outputs/:id error', e);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// DELETE /api/code-outputs/:id - Delete code output
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { ensureDb, getCodeOutputModel } = await import('@/lib/db');
    await ensureDb();
    const CodeOutput = getCodeOutputModel();
    
    const output = await CodeOutput.findByPk(id);
    if (!output) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await output.destroy();
    return NextResponse.json({ success: true, id: Number(id) }, { status: 200 });
  } catch (e: any) {
    console.error('DELETE /api/code-outputs/:id error', e);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
