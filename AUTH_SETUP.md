# MusicJam Authentication Setup

This document explains how to set up and use the authentication system in MusicJam.

## Features

- **Email/Password Authentication** via Supabase Auth
- **User Profiles** stored in `users` table
- **Protected Routes** that require authentication
- **Creative Neon UI** with smooth animations
- **Responsive Design** for mobile and desktop
- **Real-time Session Management** with automatic refresh

## Setup Instructions

### 1. Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication → Providers**
3. Ensure **Email** provider is enabled (it's enabled by default)
4. Optional: Customize email templates in **Email Templates**

### 2. Set Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from your Supabase project:
- Go to **Settings → API**
- Copy **Project URL** and **anon public** key

### 3. Verify Database Schema

Ensure your Supabase database has the `users` table with the following structure:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Run the Application

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Usage

### Authentication Flow

1. **Sign Up**: Navigate to `/auth/register`
   - Enter email, username, password
   - Validation:
     - Email must be valid format
     - Username: min 3 chars, alphanumeric
     - Password: min 8 chars, 1 uppercase, 1 number
   - On success, redirects to login page

2. **Login**: Navigate to `/auth/login`
   - Enter email and password
   - On success, redirects to `/rooms`

3. **Logout**: Click logout button in navbar
   - Clears session
   - Redirects to home page

### Protected Routes

Use the `ProtectedRoute` component to wrap pages that require authentication:

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

### Using Auth in Components

Use the `useAuth` hook to access authentication state:

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, loading, isAuthenticated, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.username}!</p>
          <button onClick={signOut}>Logout</button>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

## Components

### Core Components

- **`AuthContext`**: Manages authentication state globally
- **`useAuth`**: Hook to access auth state and methods
- **`ProtectedRoute`**: Wrapper for pages requiring authentication
- **`Navbar`**: Shows auth state and navigation
- **`AuthForm`**: Reusable form with validation
- **`NeonButton`**: Styled button with loading state
- **`LoadingSpinner`**: Animated loading indicator

### Styling

The UI uses a neon/music theme with:
- **Colors**: Purple, Cyan, Pink neon colors
- **Font**: Space Grotesk for modern look
- **Animations**: Fade-in, glow effects
- **Dark Mode**: Dark background with neon accents

## API Routes

### Debug Route

`GET /api/auth/user` - Returns current user info (for debugging)

```bash
curl http://localhost:3000/api/auth/user
```

## Troubleshooting

### "Missing Supabase environment variables"

- Ensure `.env.local` exists and has correct values
- Restart the dev server after adding env vars
- Check that keys start with `NEXT_PUBLIC_`

### "User not found" after signup

- Verify the `users` table exists in Supabase
- Check Row Level Security (RLS) policies allow inserts
- Look for errors in Supabase dashboard logs

### Session not persisting

- Clear browser cookies/localStorage
- Check that `persistSession: true` in supabase config
- Verify Supabase URL is correct

### Build Errors

- Run `npm run type-check` to check TypeScript errors
- Run `npm run lint` to check linting errors
- Run `npm run format` to auto-format code

## Security Notes

- Passwords are hashed by Supabase Auth (never stored in plain text)
- Session tokens are stored in localStorage
- Row Level Security (RLS) should be enabled on all tables
- Auth tokens auto-refresh before expiration

## Next Steps

After authentication is working:
1. Add password reset functionality
2. Add social OAuth providers (Google, GitHub)
3. Add user profile editing
4. Add avatar uploads
5. Add email verification
