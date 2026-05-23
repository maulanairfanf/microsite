import { NextRequest, NextResponse } from 'next/server';
import { getSession, setSession } from '@/lib/auth';
import { getTenantByTenantId } from '@/lib/db/tenants';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { tenantId } = await request.json();

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId is required' },
        { status: 400 }
      );
    }

    const tenant = await getTenantByTenantId(tenantId);

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    const impersonatedSession = {
      userId: session.userId,
      email: session.email,
      role: 'tenant_main_admin' as const,
      name: session.name,
      tenantId: tenant.tenantId,
      isImpersonating: true,
      originalRole: 'super_admin' as const,
      originalTenantId: session.tenantId,
    };

    await setSession(impersonatedSession);

    return NextResponse.json({
      success: true,
      redirectUrl: '/admin'
    });
  } catch (error) {
    console.error('Impersonate error:', error);
    return NextResponse.json(
      { error: 'Failed to impersonate tenant' },
      { status: 500 }
    );
  }
}