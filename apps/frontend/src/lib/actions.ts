'use server';

import { prisma } from './prisma';
import { generateRoomCode, hashPasscode, verifyPasscode } from '@/utils/room';
import { fetchYouTubeMetadata, isValidYouTubeUrl } from '@/utils/youtube';
import { revalidatePath } from 'next/cache';

export async function createRoom(passcode?: string) {
  let code = generateRoomCode();
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const existing = await prisma.room.findUnique({ where: { code } });
    if (!existing) break;
    code = generateRoomCode();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    return { error: 'Failed to generate unique room code' };
  }

  const passcodeHash = passcode ? await hashPasscode(passcode) : null;

  const room = await prisma.room.create({
    data: {
      code,
      passcodeHash,
    },
  });

  return { success: true, code: room.code };
}

export async function joinRoom(code: string, passcode?: string) {
  const room = await prisma.room.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!room) {
    return { error: 'Room not found' };
  }

  if (room.passcodeHash) {
    if (!passcode) {
      return { error: 'Passcode required', requiresPasscode: true };
    }

    const isValid = await verifyPasscode(passcode, room.passcodeHash);
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

  const room = await prisma.room.findUnique({
    where: { code: roomCode },
    include: { items: true },
  });

  if (!room) {
    return { error: 'Room not found' };
  }

  const metadata = await fetchYouTubeMetadata(url);
  if (!metadata) {
    return { error: 'Failed to fetch video metadata' };
  }

  const maxPosition = room.items.reduce(
    (max, item) => Math.max(max, item.position),
    -1,
  );

  const item = await prisma.playlistItem.create({
    data: {
      roomId: room.id,
      url,
      title: metadata.title,
      thumbnailUrl: metadata.thumbnailUrl || null,
      addedBy,
      position: maxPosition + 1,
    },
  });

  revalidatePath(`/room/${roomCode}`);

  return { success: true, item };
}

export async function removePlaylistItem(roomCode: string, itemId: string) {
  const room = await prisma.room.findUnique({
    where: { code: roomCode },
  });

  if (!room) {
    return { error: 'Room not found' };
  }

  await prisma.playlistItem.delete({
    where: { id: itemId, roomId: room.id },
  });

  revalidatePath(`/room/${roomCode}`);

  return { success: true };
}

export async function reorderPlaylistItems(
  roomCode: string,
  itemIds: string[],
) {
  const room = await prisma.room.findUnique({
    where: { code: roomCode },
  });

  if (!room) {
    return { error: 'Room not found' };
  }

  await prisma.$transaction(
    itemIds.map((id, index) =>
      prisma.playlistItem.update({
        where: { id },
        data: { position: index },
      }),
    ),
  );

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

  const room = await prisma.room.findUnique({
    where: { code: roomCode },
  });

  if (!room) {
    return { error: 'Room not found' };
  }

  const message = await prisma.message.create({
    data: {
      roomId: room.id,
      author,
      text: text.trim(),
    },
  });

  revalidatePath(`/room/${roomCode}`);

  return { success: true, message };
}

export async function clearPlaylist(roomCode: string) {
  const room = await prisma.room.findUnique({
    where: { code: roomCode },
  });

  if (!room) {
    return { error: 'Room not found' };
  }

  await prisma.playlistItem.deleteMany({
    where: { roomId: room.id },
  });

  revalidatePath(`/room/${roomCode}`);

  return { success: true };
}
