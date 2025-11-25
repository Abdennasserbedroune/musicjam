'use client';

import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import NeonButton from '@/components/NeonButton';
import Link from 'next/link';

function RoomsContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-5xl font-bold">
            <span className="gradient-text">Welcome, {user?.username}!</span>
          </h1>
          <p className="text-xl text-gray-400">
            Ready to create or join a music room?
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="group rounded-xl border border-neon-purple/30 bg-gray-800/50 p-6 backdrop-blur-sm transition-all hover:border-neon-purple hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            <div className="mb-4 text-5xl">🎸</div>
            <h2 className="mb-2 text-2xl font-bold text-white">
              Create New Room
            </h2>
            <p className="mb-4 text-gray-400">
              Start a new music jam session and invite your friends
            </p>
            <NeonButton variant="primary" fullWidth>
              Create Room
            </NeonButton>
          </div>

          <div className="group rounded-xl border border-neon-cyan/30 bg-gray-800/50 p-6 backdrop-blur-sm transition-all hover:border-neon-cyan hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <div className="mb-4 text-5xl">🎹</div>
            <h2 className="mb-2 text-2xl font-bold text-white">
              Join Room
            </h2>
            <p className="mb-4 text-gray-400">
              Enter a room code to join an existing session
            </p>
            <NeonButton variant="secondary" fullWidth>
              Join Room
            </NeonButton>
          </div>

          <div className="group rounded-xl border border-neon-pink/30 bg-gray-800/50 p-6 backdrop-blur-sm transition-all hover:border-neon-pink hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]">
            <div className="mb-4 text-5xl">🎤</div>
            <h2 className="mb-2 text-2xl font-bold text-white">
              My Rooms
            </h2>
            <p className="mb-4 text-gray-400">
              View and manage your existing music rooms
            </p>
            <NeonButton variant="tertiary" fullWidth>
              View Rooms
            </NeonButton>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-gray-700 bg-gray-800/30 p-8 backdrop-blur-sm">
          <h3 className="mb-4 text-xl font-bold text-white">
            🎵 Room List Coming Soon
          </h3>
          <p className="text-gray-400">
            Your rooms will appear here. Create your first room to get started!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <ProtectedRoute>
      <RoomsContent />
    </ProtectedRoute>
  );
}
