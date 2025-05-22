// File: /app/api/get-chat/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {                                      // Handle GET requests to fetch a specific chat session
  const url = new URL(req.url);                                                    // Parse the request URL                          
  const id = url.searchParams.get('id');                                          // Extract the chat ID from the query parameters
  if (!id) {
    return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
  }

  const { data } = await supabase                                             // Fetch the chat session for the authenticated user
    .from('chat_sessions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!data) {                                                                // If the chat session is not found, return an error response                     
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
