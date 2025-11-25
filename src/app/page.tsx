'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import NeonButton from '@/components/NeonButton';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/rooms');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-16 text-center animate-fadeIn">
          <h1 className="mb-4 text-7xl">🎵</h1>
          <h2 className="gradient-text mb-6 text-6xl font-bold">MusicJam</h2>
          <p className="mx-auto max-w-2xl text-2xl text-gray-300">
            Synchronized YouTube listening with friends
          </p>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
            Create rooms, share playlists, and enjoy music together in
            real-time
          </p>
        </div>

        <div className="mb-16 flex justify-center gap-4 animate-fadeIn">
          <Link href="/auth/register">
            <NeonButton variant="primary">
              <span className="flex items-center gap-2">
                <span>Get Started</span>
                <span>→</span>
              </span>
            </NeonButton>
          </Link>
          <Link href="/auth/login">
            <NeonButton variant="secondary">Login</NeonButton>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3 animate-fadeIn">
          <div className="group rounded-xl border border-neon-purple/30 bg-gray-800/50 p-8 backdrop-blur-sm transition-all hover:border-neon-purple hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            <div className="mb-4 text-5xl">🎸</div>
            <h3 className="mb-2 text-2xl font-bold text-white">
              Create Rooms
            </h3>
            <p className="text-gray-400">
              Start a music session and invite friends with a simple share link
            </p>
          </div>

          <div className="group rounded-xl border border-neon-cyan/30 bg-gray-800/50 p-8 backdrop-blur-sm transition-all hover:border-neon-cyan hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <div className="mb-4 text-5xl">🎧</div>
            <h3 className="mb-2 text-2xl font-bold text-white">
              Real-time Sync
            </h3>
            <p className="text-gray-400">
              Everyone hears the same thing at the same time. Perfect harmony!
            </p>
          </div>

          <div className="group rounded-xl border border-neon-pink/30 bg-gray-800/50 p-8 backdrop-blur-sm transition-all hover:border-neon-pink hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]">
            <div className="mb-4 text-5xl">💬</div>
            <h3 className="mb-2 text-2xl font-bold text-white">Live Chat</h3>
            <p className="text-gray-400">
              Discuss tracks, share reactions, and vibe together
            </p>
          </div>
        </div>

        <div className="mt-16 rounded-xl border border-gray-700 bg-gray-800/30 p-12 text-center backdrop-blur-sm animate-fadeIn">
          <h3 className="mb-4 text-3xl font-bold text-white">
            Ready to jam?
          </h3>
          <p className="mb-8 text-xl text-gray-400">
            Join thousands creating collaborative playlists
          </p>
          <Link href="/auth/register">
            <NeonButton variant="primary">
              <span className="flex items-center gap-2">
                <span>Create Your First Room</span>
                <span className="text-2xl">🎵</span>
              </span>
            </NeonButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
