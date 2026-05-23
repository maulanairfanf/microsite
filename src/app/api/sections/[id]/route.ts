import { NextRequest, NextResponse } from 'next/server';
import { getSection, updateSection, deleteSection } from '@/lib/db/sections';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const section = await getSection(id);

    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: section });
  } catch (error) {
    console.error('GET /api/sections/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { componentId, order, configJson } = body;

    const section = await updateSection(id, {
      componentId: componentId || null,
      order,
      configJson,
    });

    return NextResponse.json({ data: section });
  } catch (error: any) {
    console.error('PUT /api/sections/[id] error:', error);

    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await deleteSection(id);

    return NextResponse.json({
      success: true,
      message: 'Section deleted successfully',
    });
  } catch (error: any) {
    console.error('DELETE /api/sections/[id] error:', error);

    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    );
  }
}