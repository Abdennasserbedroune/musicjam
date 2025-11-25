'use client';

import { useState, useEffect } from 'react';
import { PlaylistItem } from '@/lib/types';
import {
  removePlaylistItem,
  reorderPlaylistItems,
  clearPlaylist,
} from '@/lib/actions';
import Image from 'next/image';

export default function PlaylistQueue({
  roomCode,
  initialItems,
  nickname,
}: {
  roomCode: string;
  initialItems: PlaylistItem[];
  nickname: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setItems(newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex !== null) {
      await reorderPlaylistItems(
        roomCode,
        items.map((item) => item.id),
      );
      setDraggedIndex(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    await removePlaylistItem(roomCode, itemId);
  };

  const handleClear = async () => {
    if (confirm('Are you sure you want to clear the entire playlist?')) {
      await clearPlaylist(roomCode);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg">No videos in the playlist yet</p>
          <p className="text-sm">Add a YouTube URL to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Playlist ({items.length})
        </h2>
        <button
          onClick={handleClear}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className="flex cursor-move items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex-shrink-0 text-lg font-bold text-gray-400">
              {index + 1}
            </div>

            {item.thumbnail_url && (
              <Image
                src={item.thumbnail_url}
                alt={item.title}
                width={120}
                height={90}
                className="flex-shrink-0 rounded"
              />
            )}

            <div className="flex-1 min-w-0">
              <h3 className="truncate font-medium text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">Added by {item.added_by}</p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Open in YouTube →
              </a>
            </div>

            <button
              onClick={() => handleRemove(item.id)}
              className="flex-shrink-0 rounded px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
