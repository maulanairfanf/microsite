import { redirect } from 'next/navigation';
import { clearSession } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await clearSession();

  const referer = request.headers.get('referer') || '';
  if (referer.includes('/tenant')) {
    redirect('/login/tenant');
  }
  redirect('/login/admin');
}