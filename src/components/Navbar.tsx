'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import NeonButton from './NeonButton';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-neon-purple/30 bg-gray-900/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold"
          >
            <span className="text-4xl">🎵</span>
            <span className="gradient-text">MusicJam</span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-400">
                  Welcome,{' '}
                  <span className="font-semibold text-neon-purple">
                    {user?.username}
                  </span>
                </span>
                <Link href="/rooms">
                  <NeonButton variant="secondary">My Rooms</NeonButton>
                </Link>
                <NeonButton onClick={signOut} variant="tertiary">
                  Logout
                </NeonButton>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <NeonButton variant="secondary">Login</NeonButton>
                </Link>
                <Link href="/auth/register">
                  <NeonButton variant="primary">Sign Up</NeonButton>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-gray-800 py-4 md:hidden">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-2 py-2 text-sm text-gray-400">
                  Welcome,{' '}
                  <span className="font-semibold text-neon-purple">
                    {user?.username}
                  </span>
                </div>
                <Link href="/rooms" onClick={() => setIsMenuOpen(false)}>
                  <NeonButton variant="secondary" fullWidth>
                    My Rooms
                  </NeonButton>
                </Link>
                <NeonButton
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  variant="tertiary"
                  fullWidth
                >
                  Logout
                </NeonButton>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                  <NeonButton variant="secondary" fullWidth>
                    Login
                  </NeonButton>
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <NeonButton variant="primary" fullWidth>
                    Sign Up
                  </NeonButton>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
