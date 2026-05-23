import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://zachariasd.github.io',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request) {
  // Ensure this points to your NEW Flow 3 URL
  const INSIGHTS_FLOW_URL = "https://default062a8e8e449048f39ee3b309e2cfa4.ad.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/443d6efc77744c15b54d17b2db67ab01/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9mDGxxMjJOHLl3wMIjYucZ9IrL2ZPVUrvyzNnTItS74"; 

  try {
    const body = await request.json();
    
    const response = await fetch(INSIGHTS_FLOW_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: corsHeaders 
    });
  } catch (error) {
    console.error("Proxy Crash Details:", error);
    return NextResponse.json({ error: 'Proxy failed', details: error.message }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
}
