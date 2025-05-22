// File: /app/api/save-chat/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {                        // Handle POST requests to save chat sessions
  const body = await req.json();                                      // Parse the request body
  const { user_id, title, messages, session_id } = body;              // Extract user_id, title, messages, and session_id from the request body            

  if (!user_id || !Array.isArray(messages) || messages.length === 0) {          // Validate the input
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });      // Return an error response if input is invalid
  }

  if (session_id) {                                                         // If users session_id is already provided, update the existing session                           
    const { data: existing } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', session_id)
      .eq('user_id', user_id)
      .single();

    if (!existing) {                                                       // If the session does not exist or the user is unauthorized, return an error response
      return NextResponse.json({ error: 'Session not found or unauthorized' }, { status: 404 });
    }

    const { data } = await supabase                                           // Update the existing  session with the new title and messages
      .from('chat_sessions')
      .update({ title, messages, updated_at: new Date().toISOString() })      // Update the session with the new title and messages
      .eq('id', session_id)
      .select();

    return NextResponse.json(data?.[0] || {});                                // Return the updated session data
  } else {                                                      // If no session_id is provided, create a new session   
    const { data } = await supabase
      .from('chat_sessions')
      .insert({ user_id, title, messages })
      .select();

    return NextResponse.json(data?.[0] || {});
  }
}
