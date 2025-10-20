import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/items/:id -> get one
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { ensureDb, getItemModel } = await import('@/lib/db');
    await ensureDb();
    const Item = getItemModel();
    const item = await Item.findByPk(id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item, { status: 200 });
  } catch (e: any) {
    console.error('GET /api/items/:id error', e);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// PUT /api/items/:id -> update
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { ensureDb, getItemModel } = await import('@/lib/db');
    await ensureDb();
    const Item = getItemModel();
    const item = await Item.findByPk(id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await item.update(body);
    return NextResponse.json(item, { status: 200 });
  } catch (e: any) {
    console.error('PUT /api/items/:id error', e);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// DELETE /api/items/:id -> remove
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { ensureDb, getItemModel } = await import('@/lib/db');
    await ensureDb();
    const Item = getItemModel();
    const item = await Item.findByPk(id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await item.destroy();
    return NextResponse.json({ success: true, id: Number(id) }, { status: 200 });
  } catch (e: any) {
    console.error('DELETE /api/items/:id error', e);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
