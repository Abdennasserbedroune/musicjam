import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } },
) {
  const { code } = params;
  const { searchParams } = request.nextUrl;
  const since = searchParams.get('since');

  try {
    const supabase = await createClient();

    const { data: room } = await supabase
      .from('rooms')
      .select('id')
      .eq('code', code.toUpperCase())
      .single();

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    let query = supabase
      .from('messages')
      .select('*')
      .eq('room_id', room.id)
      .order('created_at', { ascending: true })
      .limit(100);

    if (since) {
      query = query.gt('created_at', new Date(since).toISOString());
    }

    const { data: messages, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
