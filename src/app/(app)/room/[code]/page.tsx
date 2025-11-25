import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import RoomClient from '@/components/RoomClient';

export const dynamic = 'force-dynamic';

async function getRoom(code: string) {
  const supabase = await createClient();

  const { data: room } = await supabase
    .from('rooms')
    .select(
      `
      *,
      playlist_items(*),
      messages(*)
    `,
    )
    .eq('code', code.toUpperCase())
    .order('position', { foreignTable: 'playlist_items', ascending: true })
    .order('created_at', { foreignTable: 'messages', ascending: true })
    .limit(100, { foreignTable: 'messages' })
    .single();

  return room;
}

export default async function RoomPage({
  params,
}: {
  params: { code: string };
}) {
  const room = await getRoom(params.code);

  if (!room) {
    notFound();
  }

  return <RoomClient room={room} />;
}
