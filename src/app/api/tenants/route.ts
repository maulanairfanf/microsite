import { NextRequest, NextResponse } from 'next/server';
import { listTenants, createTenant, getTenantByTenantId } from '@/lib/db/tenants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('all') === 'true';

    const tenants = await listTenants({ includeInactive });

    return NextResponse.json({ data: tenants });
  } catch (error) {
    console.error('GET /api/tenants error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, name, themeId } = body;

    if (!tenantId || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: tenantId, name' },
        { status: 400 }
      );
    }

    if (typeof tenantId !== 'string' || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Invalid field types' },
        { status: 400 }
      );
    }

    const existing = await getTenantByTenantId(tenantId);
    if (existing) {
      return NextResponse.json(
        { error: 'Tenant ID already exists' },
        { status: 409 }
      );
    }

    const tenant = await createTenant({ tenantId, name, themeId: themeId || null });

    return NextResponse.json({ data: tenant }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/tenants error:', error);
    return NextResponse.json(
      { error: 'Failed to create tenant' },
      { status: 500 }
    );
  }
}