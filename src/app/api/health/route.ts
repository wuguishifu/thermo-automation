import { NextResponse } from 'next/server';

export function GET() {
  return new NextResponse('Ok', { status: 200 });
}
