# MusicJam Quick Start Guide

## Initial Setup (First Time Only)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → API
4. Copy your credentials:
   - Project URL
   - Anon (public) key
   - Service role key (keep this secret!)

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
```

Your `.env.local` should look like:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 4. Create Database Schema

1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the sidebar
3. Create a new query
4. Copy and paste the schema from README.md (the SQL section)
5. Run the query

Or use this quick schema:

```sql
-- Create rooms table
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  passcode_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create playlist_items table
CREATE TABLE playlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  added_by TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_playlist_items_room_id ON playlist_items(room_id);
CREATE INDEX idx_messages_room_id ON messages(room_id);
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Daily Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## Before Committing

```bash
# Run all checks
npm run lint          # ESLint
npm run type-check    # TypeScript
npm test              # Jest tests
npm run format        # Format code

# Or run all at once:
npm run lint && npm run type-check && npm test && npm run format:check
```

## Common Tasks

### View Database

Use the Supabase dashboard:

1. Go to your project
2. Click "Table Editor" in the sidebar
3. Browse and edit your data

Or use the SQL Editor for queries.

### Clear All Data

In Supabase SQL Editor:

```sql
TRUNCATE TABLE messages, playlist_items, rooms CASCADE;
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure Quick Reference

```
src/
├── app/
│   ├── (marketing)/  # Public pages (landing)
│   ├── (app)/        # App pages (rooms)
│   └── api/          # API routes
├── components/       # React components (client-side)
├── lib/
│   ├── supabase/     # Supabase clients
│   ├── actions.ts    # Server actions
│   └── types.ts      # Type definitions
└── utils/            # Pure utility functions
```

## Key Files

- `src/lib/supabase/client.ts` - Browser Supabase client
- `src/lib/supabase/server.ts` - Server Supabase client
- `src/lib/actions.ts` - All server actions (mutations)
- `src/lib/types.ts` - TypeScript type definitions
- `src/utils/youtube.ts` - YouTube URL parsing and oEmbed
- `src/utils/room.ts` - Room code generation and passcode hashing
- `tailwind.config.js` - Theme customization (including neon colors)

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## Troubleshooting

### Port 3000 already in use

```bash
# Kill the process
lsof -ti:3000 | xargs kill -9
```

### Supabase connection issues

1. Check your `.env.local` file has correct values
2. Verify your Supabase project is active
3. Check the Supabase dashboard for any issues
4. Ensure anon key is public, service role key is secret

### TypeScript errors

```bash
# Restart your IDE/editor
# Check src/lib/types.ts matches your database schema
```

### Build errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## URLs When Running

- **App**: http://localhost:3000
- **Supabase Dashboard**: https://app.supabase.com

## Environment Variables Reference

Required for all environments:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key (public)
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (secret, server-side only)

## Production Deployment

### Vercel

1. Push code to GitHub
2. Import repository on [vercel.com](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

### Other Platforms

For Railway, Render, Fly.io, or similar:

1. Set the same environment variables
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Deploy!

## Database Migrations

When you need to change the schema:

1. Go to Supabase SQL Editor
2. Write your migration SQL
3. Run it
4. Update `src/lib/types.ts` to match
5. Update any affected queries in `src/lib/actions.ts`

## Need Help?

- Check `README.md` for full documentation
- Check `IMPLEMENTATION.md` for technical details
- Review Next.js 14 docs: https://nextjs.org/docs
- Review Supabase docs: https://supabase.com/docs
- Check Supabase Discord: https://discord.supabase.com
