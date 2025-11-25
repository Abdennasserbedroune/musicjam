'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { signIn, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage(
        'Account created successfully! Please log in to continue.',
      );
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/rooms');
    }
  }, [isAuthenticated, router]);

  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    return null;
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    return null;
  };

  const handleSubmit = async (values: Record<string, string>) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { error } = await signIn(values.email, values.password);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      router.push('/rooms');
    }
  };

  const fields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      icon: '📧',
      validation: validateEmail,
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      icon: '🔒',
      validation: validatePassword,
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-cyan-900/20 to-gray-900 p-4">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="mb-2 text-5xl">🎵</h1>
            <h2 className="gradient-text text-4xl font-bold">MusicJam</h2>
          </Link>
          <p className="mt-4 text-gray-400">
            Login to continue your music journey
          </p>
        </div>

        <div className="rounded-xl border border-neon-cyan/30 bg-gray-800/50 p-8 backdrop-blur-sm">
          <h3 className="mb-6 text-2xl font-bold text-white">Login</h3>

          {successMessage && (
            <div className="mb-4 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-sm text-green-400">
              {successMessage}
            </div>
          )}

          <AuthForm
            fields={fields}
            onSubmit={handleSubmit}
            submitLabel="Login"
            loading={loading}
            error={error}
          />

          <div className="mt-4 text-center">
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-neon-cyan transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="font-semibold text-neon-cyan hover:text-neon-purple transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
