import { NextResponse } from 'next/server';

// Extends Vercel execution timeout limit from 10 seconds to 30 seconds
export const runtime = 'edge'; 

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(request) {
  const POWER_AUTOMATE_URL = "https://default062a8e8e449048f39ee3b309e2cfa4.ad.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/36e5dea2ad0f4486ac1c61e45e6dde4d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=vSvhWWzURBFmq2LDhc7ysp6wZ9blVACL2UNQ2SNRarA";

  try {
    const body = await request.json();
    
    const response = await fetch(POWER_AUTOMATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : { status: "Archive completed" };
    
    return NextResponse.json(data, { 
      status: response.ok ? 200 : response.status,
      headers: corsHeaders 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Proxy execution failed', details: error.message }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
}
