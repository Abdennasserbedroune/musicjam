# Supabase Setup Checklist

Use this checklist to verify your Supabase database is correctly configured.

## ☑️ Pre-Setup

- [ ] Supabase account created
- [ ] New project created in Supabase dashboard
- [ ] Project is fully initialized (wait 2-3 minutes after creation)

## ☑️ 1. Database Schema

- [ ] All 5 tables created:
  - [ ] `users`
  - [ ] `rooms`
  - [ ] `room_members`
  - [ ] `playback_state`
  - [ ] `messages`

- [ ] All indexes created:
  - [ ] `idx_rooms_owner_id`
  - [ ] `idx_rooms_share_link`
  - [ ] `idx_room_members_room_id`
  - [ ] `idx_room_members_user_id`
  - [ ] `idx_playback_state_room_id`
  - [ ] `idx_messages_room_id`
  - [ ] `idx_messages_created_at`

## ☑️ 2. Row-Level Security (RLS)

- [ ] RLS enabled on all tables
- [ ] Users table policies:
  - [ ] Can read own profile
  - [ ] Can update own profile
  - [ ] Can insert own profile
- [ ] Rooms table policies:
  - [ ] Can read public/joined rooms
  - [ ] Authenticated users can create rooms
  - [ ] Owners can update their rooms
  - [ ] Owners can delete their rooms
- [ ] Room members table policies:
  - [ ] Can read members in joined rooms
  - [ ] Can join rooms
  - [ ] Can leave rooms
  - [ ] Can update own membership
- [ ] Playback state table policies:
  - [ ] Can read playback state of joined rooms
  - [ ] DJ or owner can update playback state
  - [ ] DJ or owner can insert playback state
- [ ] Messages table policies:
  - [ ] Can read messages in joined rooms
  - [ ] Can send messages to joined rooms

## ☑️ 3. Triggers & Functions

- [ ] `update_updated_at_column()` function created
- [ ] Trigger on `users` table
- [ ] Trigger on `rooms` table
- [ ] Trigger on `playback_state` table

## ☑️ 4. Real-Time Replication

- [ ] Real-time enabled for `playback_state` table
- [ ] Real-time enabled for `messages` table
- [ ] Real-time enabled for `room_members` table

## ☑️ 5. Environment Configuration

- [ ] `.env.local` file created
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set correctly
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set correctly
- [ ] Environment variables start with `NEXT_PUBLIC_` (for client-side access)

## ☑️ 6. Code Integration

- [ ] `@supabase/supabase-js` package installed
- [ ] `src/types/supabase.ts` created
- [ ] `src/lib/supabase.ts` created
- [ ] `src/lib/db.ts` created
- [ ] No TypeScript errors in database files

## ☑️ 7. Testing

- [ ] Can connect to Supabase from Next.js app
- [ ] Can query tables (no RLS errors for authorized users)
- [ ] Can insert test data
- [ ] Can update test data
- [ ] Can delete test data
- [ ] Real-time subscriptions working

## ☑️ 8. Verification Queries

Run these queries in Supabase SQL Editor:

### Check tables exist

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'rooms', 'room_members', 'playback_state', 'messages');
```

**Expected**: 5 rows returned

### Check RLS enabled

```sql
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'rooms', 'room_members', 'playback_state', 'messages');
```

**Expected**: All tables with `rowsecurity = true`

### Check policies exist

```sql
SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public';
```

**Expected**: At least 15 policies

### Check real-time enabled

```sql
SELECT tablename FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
AND tablename IN ('playback_state', 'messages', 'room_members');
```

**Expected**: 3 rows returned

## ☑️ 9. Common Issues Resolved

- [ ] No "Missing Supabase environment variables" error
- [ ] No "row-level security policy violation" errors (for authorized operations)
- [ ] No "relation does not exist" errors
- [ ] Real-time subscriptions receive updates
- [ ] Cascading deletes work correctly

## ☑️ 10. Documentation

- [ ] Read `SUPABASE_SETUP.md`
- [ ] Read `src/lib/README_DB.md`
- [ ] Understand RLS policies
- [ ] Understand real-time subscriptions
- [ ] Know how to use database utilities

## 🎉 Setup Complete!

If all items are checked, your Supabase database is ready for MusicJam!

## Next Steps

1. **Implement Authentication**: Set up Supabase Auth for user sign-up/login
2. **Build UI**: Create React components that use the database utilities
3. **Test Real-time**: Verify real-time updates work across multiple clients
4. **Optimize**: Monitor performance and add indexes as needed
5. **Deploy**: Push to production and update environment variables

## Support

If any items are unchecked or not working:

1. Review the error messages in the browser console
2. Check Supabase dashboard logs (Logs & Monitoring)
3. Verify RLS policies are correctly configured
4. Ensure user is authenticated for protected operations
5. Check `supabase/TEST_QUERIES.sql` for debugging queries

## Quick Commands

```bash
# Install dependencies
npm install

# Check TypeScript types
npm run type-check

# Start development server
npm run dev

# Build for production
npm run build
```

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0
