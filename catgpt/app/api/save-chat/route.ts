// File: /app/api/save-chat/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, title, messages, session_id } = body;

  if (!user_id || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  if (session_id) {
    const { data: existing } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', session_id)
      .eq('user_id', user_id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Session not found or unauthorized' }, { status: 404 });
    }

    const { data } = await supabase
      .from('chat_sessions')
      .update({ title, messages, updated_at: new Date().toISOString() })
      .eq('id', session_id)
      .select();

    return NextResponse.json(data?.[0] || {});
  } else {
    const { data } = await supabase
      .from('chat_sessions')
      .insert({ user_id, title, messages })
      .select();

    return NextResponse.json(data?.[0] || {});
  }
}
