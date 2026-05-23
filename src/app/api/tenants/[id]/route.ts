import { NextRequest, NextResponse } from 'next/server';
import { getTenant, updateTenant, archiveTenant, restoreTenant, getTenantByTenantId } from '@/lib/db/tenants';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const tenant = await getTenant(id);

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: tenant });
  } catch (error) {
    console.error('GET /api/tenants/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenant' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, themeId } = body;

    if (name !== undefined && typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Invalid name field' },
        { status: 400 }
      );
    }

    const tenant = await updateTenant(id, { name, themeId });

    return NextResponse.json({ data: tenant });
  } catch (error: any) {
    console.error('PUT /api/tenants/[id] error:', error);

    return NextResponse.json(
      { error: 'Failed to update tenant' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await archiveTenant(id);

    return NextResponse.json({
      success: true,
      message: 'Tenant archived successfully',
    });
  } catch (error: any) {
    console.error('DELETE /api/tenants/[id] error:', error);

    return NextResponse.json(
      { error: 'Failed to archive tenant' },
      { status: 500 }
    );
  }
}