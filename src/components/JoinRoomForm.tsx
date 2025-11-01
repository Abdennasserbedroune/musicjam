'use client';

import { useState } from 'react';
import { joinRoom } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function JoinRoomForm() {
  const [roomCode, setRoomCode] = useState('');
  const [passcode, setPasscode] = useState('');
  const [requiresPasscode, setRequiresPasscode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await joinRoom(
        roomCode.toUpperCase(),
        passcode || undefined,
      );

      if (result.error) {
        setError(result.error);
        if (result.requiresPasscode) {
          setRequiresPasscode(true);
        }
      } else if (result.code) {
        router.push(`/room/${result.code}`);
      }
    } catch (err) {
      setError('Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleJoin} className="space-y-4">
      <div>
        <label htmlFor="roomCode" className="block text-sm text-gray-700">
          Room Code
        </label>
        <input
          type="text"
          id="roomCode"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 uppercase focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="ABCD12"
          required
          maxLength={6}
        />
      </div>

      {requiresPasscode && (
        <div>
          <label htmlFor="joinPasscode" className="block text-sm text-gray-700">
            Passcode
          </label>
          <input
            type="password"
            id="joinPasscode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Enter passcode"
            required
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isLoading || !roomCode}
        className="w-full rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
      >
        {isLoading ? 'Joining...' : 'Join Room'}
      </button>
    </form>
  );
}
