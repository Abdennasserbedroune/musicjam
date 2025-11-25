# Supabase Database Setup Guide

This guide provides step-by-step instructions for setting up the Supabase PostgreSQL database with complete schema, RLS policies, and real-time subscriptions for MusicJam.

## Table of Contents

1. [Supabase Project Setup](#1-supabase-project-setup)
2. [Create Database Schema](#2-create-database-schema)
3. [Enable Real-Time Replication](#3-enable-real-time-replication)
4. [Configure Environment Variables](#4-configure-environment-variables)
5. [Verify Setup](#5-verify-setup)
6. [Testing](#6-testing)

---

## 1. Supabase Project Setup

### Step 1.1: Create a new Supabase project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in the details:
   - **Organization**: Select or create an organization
   - **Name**: `musicjam` (or your preferred name)
   - **Database Password**: Generate a strong password (save it securely)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development

### Step 1.2: Get API credentials

1. Wait for the project to finish setting up (2-3 minutes)
2. Go to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Project API keys** → `anon` `public` (this is safe to use in the browser)

---

## 2. Create Database Schema

### Step 2.1: Open SQL Editor

1. In your Supabase dashboard, navigate to **SQL Editor** (left sidebar)
2. Click **New Query**

### Step 2.2: Run the migration script

Copy the entire contents of `supabase/migrations/20240101000000_initial_schema.sql` and paste it into the SQL Editor, then click **Run**.

Alternatively, you can run it in sections:

#### Section 1: Create Tables

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT FALSE,
  share_link TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Room members table
CREATE TABLE public.room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'listener',
  joined_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Playback state table
CREATE TABLE public.playback_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL UNIQUE REFERENCES rooms(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  is_playing BOOLEAN DEFAULT FALSE,
  current_timestamp FLOAT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Section 2: Create Indexes

```sql
CREATE INDEX idx_rooms_owner_id ON rooms(owner_id);
CREATE INDEX idx_rooms_share_link ON rooms(share_link);
CREATE INDEX idx_room_members_room_id ON room_members(room_id);
CREATE INDEX idx_room_members_user_id ON room_members(user_id);
CREATE INDEX idx_playback_state_room_id ON playback_state(room_id);
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

#### Section 3: Enable RLS

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE playback_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

#### Section 4: Create RLS Policies

Run all the RLS policy creation statements from the migration file.

#### Section 5: Create Triggers

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playback_state_updated_at
  BEFORE UPDATE ON playback_state
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Step 2.3: Verify tables

1. Navigate to **Database** → **Tables** in the Supabase dashboard
2. You should see 5 tables:
   - `users`
   - `rooms`
   - `room_members`
   - `playback_state`
   - `messages`

---

## 3. Enable Real-Time Replication

Real-time subscriptions allow your app to receive instant updates when data changes.

### Step 3.1: Enable replication for tables

1. Go to **Database** → **Replication** in the Supabase dashboard
2. Find and enable replication for the following tables:
   - ☑️ `playback_state`
   - ☑️ `messages`
   - ☑️ `room_members`

Alternatively, run this SQL in the SQL Editor:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE playback_state;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE room_members;
```

---

## 4. Configure Environment Variables

### Step 4.1: Create .env.local file

Create a `.env.local` file in the project root (if it doesn't exist):

```bash
cp .env.example .env.local
```

### Step 4.2: Add Supabase credentials

Edit `.env.local` and add your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

Replace:

- `your-project-id` with your actual project ID
- `your-anon-key-here` with the anon/public key from Step 1.2

---

## 5. Verify Setup

### Step 5.1: Verify RLS is working

1. Go to **SQL Editor** in Supabase
2. Run this query to check RLS status:

```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'rooms', 'room_members', 'playback_state', 'messages');
```

All tables should have `rowsecurity = true`.

### Step 5.2: Check RLS policies

```sql
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

You should see multiple policies for each table.

### Step 5.3: Verify indexes

```sql
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('rooms', 'room_members', 'playback_state', 'messages')
ORDER BY tablename, indexname;
```

You should see all the indexes created in Step 2.

---

## 6. Testing

### Step 6.1: Test database connection

Create a test script or use the Supabase dashboard:

1. Go to **SQL Editor**
2. Try inserting a test user (you'll need to sign up first):

```sql
-- First, get your user ID from auth.users
SELECT id, email FROM auth.users LIMIT 1;

-- Then insert into public.users (replace the UUID with your actual user ID)
INSERT INTO public.users (id, email, username, avatar_url)
VALUES ('your-user-id-here', 'test@example.com', 'testuser', NULL);
```

### Step 6.2: Test RLS policies

Try to query data from your Next.js application using the utility functions in `src/lib/db.ts`.

Example in a React component:

```typescript
import { getPublicRooms } from '@/lib/db';

const { data: rooms, error } = await getPublicRooms();
console.log('Public rooms:', rooms);
```

### Step 6.3: Test real-time subscriptions

```typescript
import { subscribeToMessages } from '@/lib/db';

const channel = subscribeToMessages('room-id-here', (message) => {
  console.log('New message:', message);
});

// Don't forget to unsubscribe when done
channel.unsubscribe();
```

---

## Database Schema Overview

### Tables

| Table            | Description                           |
| ---------------- | ------------------------------------- |
| `users`          | User profiles (extends Supabase auth) |
| `rooms`          | Music jam rooms                       |
| `room_members`   | Tracks who's in each room             |
| `playback_state` | YouTube player state sync             |
| `messages`       | Chat messages                         |

### Key Features

- ✅ **Row-Level Security (RLS)**: Ensures users can only access data they're authorized to see
- ✅ **Real-time subscriptions**: Instant updates for playback state, messages, and room members
- ✅ **Cascading deletes**: Removing a room automatically removes all related data
- ✅ **Automatic timestamps**: `created_at` and `updated_at` fields managed automatically
- ✅ **Indexed queries**: Fast lookups for common queries

---

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Make sure `.env.local` exists and contains the correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` values.

### Issue: "Row-level security policy violation"

**Solution**: This means RLS is working correctly but the current user doesn't have permission. Make sure:

1. The user is authenticated
2. The user has the correct role (e.g., room member, DJ, or owner)
3. RLS policies are correctly configured

### Issue: Real-time subscriptions not working

**Solution**:

1. Verify replication is enabled for the table (Step 3)
2. Check that you're subscribed to the correct channel
3. Make sure the filter matches your data (e.g., `room_id`)

### Issue: "relation 'auth.users' does not exist"

**Solution**: The `auth.users` table is automatically created by Supabase. If you see this error, your project may not be fully initialized. Wait a few minutes and try again.

---

## Next Steps

1. **Authentication**: Set up Supabase Auth for user registration and login
2. **Storage**: Configure Supabase Storage for user avatars
3. **Edge Functions**: Deploy serverless functions for complex operations
4. **Production**: Deploy your Next.js app to Vercel and update environment variables

---

## Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

---

## Support

If you encounter any issues:

1. Check the [Supabase Discord](https://discord.supabase.com)
2. Review the [troubleshooting section](#troubleshooting) above
3. Check browser console for error messages
4. Verify your Supabase project is active and not paused
