'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const router = useRouter();

  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    return null;
  };

  const validateUsername = (username: string) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    const alphanumericRegex = /^[a-zA-Z0-9_]+$/;
    if (!alphanumericRegex.test(username))
      return 'Username must be alphanumeric';
    return null;
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password))
      return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(password))
      return 'Password must contain at least one number';
    return null;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (values: Record<string, string>) => {
    setLoading(true);
    setError(null);

    const confirmPasswordError = validateConfirmPassword(
      values.confirmPassword,
      values.password,
    );
    if (confirmPasswordError) {
      setError(confirmPasswordError);
      setLoading(false);
      return;
    }

    const { error } = await signUp(
      values.email,
      values.password,
      values.username,
    );

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      router.push('/auth/login?registered=true');
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
      name: 'username',
      type: 'text',
      label: 'Username',
      icon: '👤',
      validation: validateUsername,
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      icon: '🔒',
      validation: validatePassword,
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password',
      icon: '🔒',
      validation: (value: string) => {
        return null;
      },
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-4">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="mb-2 text-5xl">🎵</h1>
            <h2 className="gradient-text text-4xl font-bold">MusicJam</h2>
          </Link>
          <p className="mt-4 text-gray-400">
            Create your account and start jamming
          </p>
        </div>

        <div className="rounded-xl border border-neon-purple/30 bg-gray-800/50 p-8 backdrop-blur-sm">
          <h3 className="mb-6 text-2xl font-bold text-white">Sign Up</h3>

          <AuthForm
            fields={fields}
            onSubmit={handleSubmit}
            submitLabel="Create Account"
            loading={loading}
            error={error}
          />

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-neon-purple hover:text-neon-pink transition-colors"
            >
              Login here
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}
