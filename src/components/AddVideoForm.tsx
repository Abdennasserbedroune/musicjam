'use client';

import { useState } from 'react';
import { addPlaylistItem } from '@/lib/actions';

export default function AddVideoForm({
  roomCode,
  nickname,
}: {
  roomCode: string;
  nickname: string;
}) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await addPlaylistItem(roomCode, url, nickname);

      if (result.error) {
        setError(result.error);
      } else {
        setUrl('');
      }
    } catch (err) {
      setError('Failed to add video');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="Paste YouTube URL..."
          required
        />
        <button
          type="submit"
          disabled={isLoading || !url}
          className="rounded-lg bg-primary-600 px-6 py-2 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
