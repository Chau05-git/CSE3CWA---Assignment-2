import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/items -> list all items
export async function GET(_req: NextRequest) {
  try {
    const { ensureDb, getItemModel } = await import('@/lib/db');
    await ensureDb();
    const Item = getItemModel();
    const items = await Item.findAll();
    return NextResponse.json(items, { status: 200 });
  } catch (e: any) {
    console.error('GET /api/items error', e);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

// POST /api/items -> create item
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description } = body || {};
    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
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
