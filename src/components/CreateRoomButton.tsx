'use client';

import { useState } from 'react';
import { createRoom } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function CreateRoomButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await createRoom(passcode || undefined);

      if (result.error) {
        setError(result.error);
      } else if (result.code) {
        router.push(`/room/${result.code}`);
      }
    } catch (err) {
      setError('Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
      >
        Create New Room
      </button>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h3 className="font-semibold text-gray-900">Create Room</h3>

      <div>
        <label htmlFor="passcode" className="block text-sm text-gray-700">
          Passcode (optional)
        </label>
        <input
          type="password"
          id="passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="Leave empty for public room"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={handleCreate}
          disabled={isLoading}
          className="flex-1 rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create'}
        </button>
        <button
          onClick={() => {
            setIsOpen(false);
            setPasscode('');
            setError('');
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
