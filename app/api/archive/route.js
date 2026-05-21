import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60; 

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

  // Force active tracing into Vercel Real-time Logs stream
  console.log("--> API Archive Route Invoked");

  try {
    const body = await request.json();
    console.log("Forwarding Payload:", JSON.stringify(body));
    
    const response = await fetch(POWER_AUTOMATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log(`Power Automate Downstream Status: ${response.status} ${response.statusText}`);

    const text = await response.text();
    let parsedData;
    
    try {
      parsedData = text ? JSON.parse(text) : { status: "Archive flow run initialized" };
    } catch (parseError) {
      parsedData = { status: "Automation output parsed as string", rawResponse: text || "No data" };
    }

    if (!response.ok) {
      console.error("Downstream Workflow Error Body:", text);
    }
    
    return NextResponse.json(parsedData, { 
      status: response.ok ? 200 : response.status,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error("Proxy Runtime Exception:", error.message, error.stack);
    return NextResponse.json({ error: 'Proxy failed', details: error.message }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
}
