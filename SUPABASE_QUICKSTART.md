# Supabase Quick Start Guide

Get MusicJam up and running with Supabase in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is fine)

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: `musicjam`
   - **Database Password**: Generate and save it
   - **Region**: Choose closest to you
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

## Step 3: Get API Credentials (1 min)

1. In your Supabase project dashboard:
   - Go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 4: Configure Environment (1 min)

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your credentials
```

Update these lines in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

## Step 5: Run Database Migration (2 min)

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/20240101000000_initial_schema.sql`
4. Paste into the editor
5. Click **Run** (or press Ctrl/Cmd + Enter)
6. Wait for "Success. No rows returned" message

## Step 6: Enable Real-Time (1 min)

In Supabase dashboard:

1. Go to **Database** → **Replication** (left sidebar)
2. Scroll down and find these tables:
3. Toggle ON for:
   - ☑️ `playback_state`
   - ☑️ `messages`
   - ☑️ `room_members`

**Alternative**: Run `supabase/migrations/20240101000001_enable_realtime.sql` in SQL Editor.

## Step 7: Verify Setup (1 min)

In SQL Editor, run this query:

```sql
-- Check that all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'rooms', 'room_members', 'playback_state', 'messages');
```

**Expected**: You should see 5 rows.

## Step 8: Start Development (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ✅ You're Done!

Your Supabase database is now fully configured with:

- ✅ 5 tables created
- ✅ Row-Level Security enabled
- ✅ Real-time subscriptions ready
- ✅ Indexes for performance
- ✅ TypeScript types generated

## Next Steps

### 1. Test the Database

Create a test user and room in SQL Editor:

```sql
-- Insert a test user (you'll need to sign up first via Supabase Auth)
INSERT INTO users (id, email, username)
VALUES ('your-user-id', 'test@example.com', 'testuser');

-- Create a test room
INSERT INTO rooms (name, owner_id, is_public)
VALUES ('Test Room', 'your-user-id', true)
RETURNING *;
```

### 2. Use Database Utilities

In your React components:

```typescript
import { createRoom, joinRoom, sendMessage } from '@/lib/db';

// Create a room
const { data: room, error } = await createRoom('My Room', userId, true);

// Join a room
await joinRoom(room.id, userId, 'listener');

// Send a message
await sendMessage(room.id, userId, 'Hello!');
```

### 3. Implement Real-Time

```typescript
import { subscribeToMessages } from '@/lib/db';
import { useEffect } from 'react';

function ChatComponent({ roomId }) {
  useEffect(() => {
    const channel = subscribeToMessages(roomId, (message) => {
      console.log('New message:', message);
    });

    return () => channel.unsubscribe();
  }, [roomId]);

  return <div>Chat UI</div>;
}
```

## 📚 Documentation

- **Full Setup Guide**: `SUPABASE_SETUP.md`
- **Database API**: `src/lib/README_DB.md`
- **Implementation Details**: `SUPABASE_IMPLEMENTATION.md`
- **Setup Checklist**: `supabase/SETUP_CHECKLIST.md`
- **Test Queries**: `supabase/TEST_QUERIES.sql`
- **Example Component**: `src/components/ExampleRoomUsage.tsx`

## 🐛 Common Issues

### "Missing Supabase environment variables"

**Fix**: Make sure `.env.local` exists with the correct values.

### "Row-level security policy violation"

**Fix**: This is normal! Users must be authenticated. Implement Supabase Auth to create users.

### Real-time not working

**Fix**:

1. Verify replication is enabled in Database → Replication
2. Check browser console for connection errors
3. Make sure you unsubscribe in useEffect cleanup

### Tables not found

**Fix**: Run the migration SQL in Step 5 again.

## 🚀 Deploy to Production

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## 🆘 Need Help?

1. Check the troubleshooting section in `SUPABASE_SETUP.md`
2. Review the example in `src/components/ExampleRoomUsage.tsx`
3. Run test queries from `supabase/TEST_QUERIES.sql`
4. Check Supabase dashboard → Logs for errors

## 📊 Monitor Your Database

In Supabase dashboard:

- **Database** → **Tables**: View and edit data
- **Logs** → **Postgres Logs**: See query logs
- **Reports**: Monitor performance
- **Database** → **Roles**: Manage permissions

---

**Time to complete**: ~10 minutes  
**Difficulty**: Easy  
**Status**: Production-ready
