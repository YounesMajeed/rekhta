import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://world.rekhta.org/api/v2/dict';
const HEADERS = {
  'TempToken': '8C645614-D761-41BD-93A1-5536DFCEDD68',
  'User-Agent': 'Rekhta Dictionary/100',
  'Content-Type': 'application/json',
  'Host': 'world.rekhta.org'
} as const;

type ActionType = 'home' | 'search' | 'detail';

const ENDPOINT_MAP: Record<ActionType, (params: Record<string, string | null>) => string> = {
  home: () => `${BASE_URL}/GetHomePage?lang=1&lastFetchDate=&deviceType=1`,
  search: (params) => `${BASE_URL}/search?keyword=${encodeURIComponent(params.q || '')}&lang=1`,
  detail: (params) => `${BASE_URL}/GetWordDetailsByIdSlug?wordId=${encodeURIComponent(params.id || '')}&lang=1`
};

function buildUrl(action: string, searchParams: URLSearchParams): string | null {
  if (!action || !ENDPOINT_MAP[action as ActionType]) return null;
  
  const params: Record<string, string | null> = {
    q: searchParams.get('q'),
    id: searchParams.get('id')
  };
  
  return ENDPOINT_MAP[action as ActionType](params);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (!action) {
    return NextResponse.json({ error: 'Missing action parameter' }, { status: 400 });
  }

  const target = buildUrl(action, searchParams);
  if (!target) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  try {
    const response = await fetch(target, { headers: HEADERS });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=300' }
    });
  } catch (error) {
    console.error('Rekhta API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}