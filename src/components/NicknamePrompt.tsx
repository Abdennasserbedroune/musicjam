'use client';

import { useState } from 'react';

export default function NicknamePrompt({
  onNicknameSet,
}: {
  onNicknameSet: (nickname: string) => void;
}) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      onNicknameSet(nickname.trim());
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Welcome to the room!
        </h2>
        <p className="mb-6 text-gray-600">
          Please enter a nickname to continue:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Your nickname"
            maxLength={20}
            required
            autoFocus
          />

          <button
            type="submit"
            disabled={!nickname.trim()}
            className="w-full rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
