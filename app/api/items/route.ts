import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/items - List all items
export async function GET(_req: NextRequest) {
  const startTime = Date.now();
  console.log(`[INSTRUMENTATION] GET /api/items - Request received at ${new Date().toISOString()}`);
  
  try {
    const { ensureDb, getItemModel } = await import('@/lib/db');
    await ensureDb();
    const Item = getItemModel();
    
    const items = await Item.findAll({
      order: [['createdAt', 'DESC']],
    });

    const duration = Date.now() - startTime;
    console.log(`[INSTRUMENTATION] GET /api/items - Success: Retrieved ${items.length} items in ${duration}ms`);
    
    return NextResponse.json(items, { status: 200 });
  } catch (e: any) {
    const duration = Date.now() - startTime;
    console.error(`[INSTRUMENTATION] GET /api/items - Error after ${duration}ms:`, e);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

// POST /api/items - Create a new item
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log(`[INSTRUMENTATION] POST /api/items - Request received at ${new Date().toISOString()}`);
  
  try {
    const body = await req.json();
    const { name, description } = body || {};
    
    console.log(`[INSTRUMENTATION] POST /api/items - Body:`, { name, description });
    
    if (!name) {
      console.log(`[INSTRUMENTATION] POST /api/items - Validation failed: name required`);
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      );
    }
    const { ensureDb, getItemModel } = await import('@/lib/db');
    await ensureDb();
    const Item = getItemModel();
    const item = await Item.create({ name, description });
    return NextResponse.json(item, { status: 201 });
  } catch (e: any) {
    console.error('POST /api/items error', e);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
