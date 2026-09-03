import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY;
  const aiKey = process.env.AI_API_KEY;

  return NextResponse.json({
    GEMINI_API_KEY_exists: !!geminiKey,
    GEMINI_API_KEY_length: geminiKey?.length || 0,
    GEMINI_API_KEY_prefix: geminiKey ? geminiKey.substring(0, 4) + '...' : 'NOT SET',
    AI_API_KEY_exists: !!aiKey,
    AI_API_KEY_length: aiKey?.length || 0,
    all_env_keys_with_key: Object.keys(process.env).filter(k => k.toUpperCase().includes('KEY') || k.toUpperCase().includes('GEMINI') || k.toUpperCase().includes('AI_API')),
    timestamp: new Date().toISOString(),
  });
}
