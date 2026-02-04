import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://world.rekhta.org/api/v2/dict';
const HEADERS = {
  'TempToken': '8C645614-D761-41BD-93A1-5536DFCEDD68',
  'User-Agent': 'Rekhta Dictionary/100',
  'Content-Type': 'application/json'
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action'); // 'home', 'search', or 'detail'
  const q = searchParams.get('q');
  const id = searchParams.get('id');

  let target = '';

  // 1. Map our "actions" to real Rekhta Endpoints
  if (action === 'home') {
    target = `${BASE_URL}/GetHomePage?lang=1&lastFetchDate=&deviceType=1`;
  } else if (action === 'search') {
    target = `${BASE_URL}/search?keyword=${q}&lang=1`;
  } else if (action === 'detail') {
    // The user specified SetRecentActivity for details
    target = `${BASE_URL}/SetRecentActivity?wordId=${id}&lang=1`;
  }

  try {
    const response = await fetch(target, { headers: HEADERS });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}