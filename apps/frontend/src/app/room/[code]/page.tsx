import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import RoomClient from '@/components/RoomClient';

export const dynamic = 'force-dynamic';

async function getRoom(code: string) {
  const room = await prisma.room.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      items: {
        orderBy: { position: 'asc' },
      },
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 100,
      },
    },
  });

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
