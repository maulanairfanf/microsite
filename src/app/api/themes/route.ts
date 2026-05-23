import { NextRequest, NextResponse } from 'next/server';
import { listThemes, createTheme } from '@/lib/db/themes';

export async function GET() {
  try {
    const themes = await listThemes();

    return NextResponse.json({ data: themes });
  } catch (error) {
    console.error('GET /api/themes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug' },
        { status: 400 }
      );
    }

    const theme = await createTheme({ name, slug });

    return NextResponse.json({ data: theme }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/themes error:', error);
    return NextResponse.json(
      { error: 'Failed to create theme' },
      { status: 500 }
    );
  }
}