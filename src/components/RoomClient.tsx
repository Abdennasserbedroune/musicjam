'use client';

import { useEffect, useState } from 'react';
import { RoomWithRelations } from '@/lib/types';
import PlaylistQueue from './PlaylistQueue';
import AddVideoForm from './AddVideoForm';
import ChatSidebar from './ChatSidebar';
import NicknamePrompt from './NicknamePrompt';

export default function RoomClient({ room }: { room: RoomWithRelations }) {
  const [nickname, setNickname] = useState('');
  const [showNicknamePrompt, setShowNicknamePrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedNickname = localStorage.getItem('musicjam_nickname');
    if (storedNickname) {
      setNickname(storedNickname);
    } else {
      setShowNicknamePrompt(true);
    }
  }, []);

  const handleNicknameSet = (newNickname: string) => {
    setNickname(newNickname);
    localStorage.setItem('musicjam_nickname', newNickname);
    setShowNicknamePrompt(false);
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showNicknamePrompt) {
    return <NicknamePrompt onNicknameSet={handleNicknameSet} />;
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🎵 MusicJam Room
            </h1>
            <p className="text-sm text-gray-600">Welcome, {nickname}!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Room Code</p>
              <button
                onClick={handleCopyCode}
                className="text-xl font-bold text-primary-600 hover:text-primary-700"
              >
                {room.code}
              </button>
              {copied && (
                <p className="text-xs text-green-600">Copied to clipboard!</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-gray-200 bg-white p-4">
            <AddVideoForm roomCode={room.code} nickname={nickname} />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <PlaylistQueue
              roomCode={room.code}
              initialItems={room.playlist_items}
              nickname={nickname}
            />
          </div>
        </main>

        <ChatSidebar
          roomCode={room.code}
          initialMessages={room.messages}
          nickname={nickname}
        />
      </div>
    </div>
  );
}
