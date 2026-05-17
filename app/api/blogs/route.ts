// app/api/blogs/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '2';
  
  try {
    const { rows } = await sql`
      SELECT id, title, slug, tags 
      FROM blogs 
      ORDER BY created_at DESC 
      LIMIT ${limit}
    `;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}