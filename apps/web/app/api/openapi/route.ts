import { openApiDocument } from '@/server/api/openapi';
import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  return NextResponse.json(openApiDocument);
}
