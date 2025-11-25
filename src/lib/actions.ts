'use server';

import { generateRoomCode, hashPasscode, verifyPasscode } from '@/utils/room';
import { fetchYouTubeMetadata, isValidYouTubeUrl } from '@/utils/youtube';
import { revalidatePath } from 'next/cache';
import { createClient } from './supabase/server';

export async function createRoom(passcode?: string) {
  const supabase = await createClient();
  let code = generateRoomCode();
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const { data: existing } = await supabase
      .from('rooms')
      .select('code')
      .eq('code', code)
      .single();
    if (!existing) break;
    code = generateRoomCode();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    return { error: 'Failed to generate unique room code' };
  }

  const passcodeHash = passcode ? await hashPasscode(passcode) : null;

  const { data: room, error } = await supabase
    .from('rooms')
    .insert({
      code,
      passcode_hash: passcodeHash,
    })
    .select()
    .single();

  if (error) {
    return { error: 'Failed to create room' };
  }

  return { success: true, code: room.code };
}

export async function joinRoom(code: string, passcode?: string) {
  const supabase = await createClient();

  const { data: room } = await supabase
    .from('rooms')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();

  if (!room) {
    return { error: 'Room not found' };
  }

  if (room.passcode_hash) {
    if (!passcode) {
      return { error: 'Passcode required', requiresPasscode: true };
    }

    const isValid = await verifyPasscode(passcode, room.passcode_hash);
    if (!isValid) {
      return { error: 'Invalid passcode', requiresPasscode: true };
    }
  }

  return { success: true, code: room.code };
}

export async function addPlaylistItem(
  roomCode: string,
  url: string,
  addedBy: string,
) {
  if (!isValidYouTubeUrl(url)) {
    return { error: 'Invalid YouTube URL' };
  }

  const supabase = await createClient();

  const { data: room } = await supabase
    .from('rooms')
    .select('id, playlist_items(*)')
    .eq('code', roomCode)
    .single();

  if (!room) {
    return { error: 'Room not found' };
  }

  const metadata = await fetchYouTubeMetadata(url);
  if (!metadata) {
    return { error: 'Failed to fetch video metadata' };
  }

  const maxPosition =
    room.playlist_items?.reduce(
      (max: number, item: any) => Math.max(max, item.position),
      -1,
    ) ?? -1;

  const { data: item, error } = await supabase
    .from('playlist_items')
    .insert({
      room_id: room.id,
      url,
      title: metadata.title,
      thumbnail_url: metadata.thumbnailUrl || null,
      added_by: addedBy,
      position: maxPosition + 1,
    })
    .select()
    .single();

  if (error) {
    return { error: 'Failed to add item' };
  }

  revalidatePath(`/room/${roomCode}`);

  return { success: true, item };
}

export async function removePlaylistItem(roomCode: string, itemId: string) {
  const supabase = await createClient();

  const { data: room } = await supabase
    .from('rooms')
    .select('id')
    .eq('code', roomCode)
    .single();

  if (!room) {
    return { error: 'Room not found' };
  }

  const { error } = await supabase
    .from('playlist_items')
    .delete()
    .eq('id', itemId)
    .eq('room_id', room.id);

  if (error) {
    return { error: 'Failed to remove item' };
  }

  revalidatePath(`/room/${roomCode}`);

  return { success: true };
}

export async function reorderPlaylistItems(
  roomCode: string,
  itemIds: string[],
) {
  const supabase = await createClient();

  const { data: room } = await supabase
    .from('rooms')
    .select('id')
    .eq('code', roomCode)
    .single();

  if (!room) {
    return { error: 'Room not found' };
  }

  for (let i = 0; i < itemIds.length; i++) {
    await supabase
      .from('playlist_items')
      .update({ position: i })
      .eq('id', itemIds[i]);
  }

  revalidatePath(`/room/${roomCode}`);

  return { success: true };
}

export async function sendMessage(
  roomCode: string,
  author: string,
  text: string,
) {
  if (!text.trim()) {
    return { error: 'Message cannot be empty' };
  }

  if (text.length > 500) {
    return { error: 'Message is too long (max 500 characters)' };
  }

  const supabase = await createClient();

  const { data: room } = await supabase
    .from('rooms')
    .select('id')
    .eq('code', roomCode)
    .single();

  if (!room) {
    return { error: 'Room not found' };
  }

  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      room_id: room.id,
      author,
      text: text.trim(),
    })
    .select()
    .single();

  if (error) {
    return { error: 'Failed to send message' };
  }

  revalidatePath(`/room/${roomCode}`);

  return { success: true, message };
}

export async function clearPlaylist(roomCode: string) {
  const supabase = await createClient();

  const { data: room } = await supabase
    .from('rooms')
    .select('id')
    .eq('code', roomCode)
    .single();

  if (!room) {
    return { error: 'Room not found' };
  }

  const { error } = await supabase
    .from('playlist_items')
    .delete()
    .eq('room_id', room.id);

  if (error) {
    return { error: 'Failed to clear playlist' };
  }

  revalidatePath(`/room/${roomCode}`);

  return { success: true };
}
