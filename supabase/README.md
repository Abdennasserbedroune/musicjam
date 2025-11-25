# Supabase Database Files

This directory contains all SQL migrations and documentation for the MusicJam Supabase database.

## 📁 Directory Structure

```
supabase/
├── migrations/
│   ├── 20240101000000_initial_schema.sql    # Complete database schema
│   └── 20240101000001_enable_realtime.sql   # Real-time replication setup
├── README.md                                 # This file
├── SETUP_CHECKLIST.md                        # Verification checklist
└── TEST_QUERIES.sql                          # Testing and debugging queries
```

## 🚀 Quick Start

1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com)
2. **Run Initial Schema**: Copy contents of `migrations/20240101000000_initial_schema.sql` and run in SQL Editor
3. **Enable Real-Time**: Either run `20240101000001_enable_realtime.sql` or use the dashboard
4. **Verify Setup**: Use queries from `TEST_QUERIES.sql`
5. **Check Completion**: Follow `SETUP_CHECKLIST.md`

## 📄 File Descriptions

### Migration Files

#### `migrations/20240101000000_initial_schema.sql`

The complete database schema including:

- **Tables** (5): users, rooms, room_members, playback_state, messages
- **Indexes** (7): Performance optimization for common queries
- **RLS Policies** (15+): Row-level security for all tables
- **Triggers** (3): Auto-update timestamps
- **Functions** (1): Timestamp updater

**Run this first** to create the entire database structure.

#### `migrations/20240101000001_enable_realtime.sql`

Enables real-time subscriptions for:

- `playback_state` - Video sync across users
- `messages` - Live chat
- `room_members` - Presence tracking

**Run this after** the initial schema to enable real-time features.

**Alternative**: Enable manually in Supabase dashboard (Database → Replication).

### Documentation Files

#### `SETUP_CHECKLIST.md`

A comprehensive checklist to verify your Supabase setup:

- ☑️ 60+ verification items
- ☑️ SQL queries to check configuration
- ☑️ Common issues and solutions

Use this to ensure everything is configured correctly.

#### `TEST_QUERIES.sql`

SQL queries for testing and debugging:

- Verify tables exist
- Check RLS policies
- View indexes
- Monitor performance
- Query test data
- Debug issues

**12 sections** with ready-to-run queries.

## 🎯 How to Use

### Option 1: Supabase Dashboard (Recommended)

1. Open your Supabase project
2. Go to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `20240101000000_initial_schema.sql`
5. Paste and click **Run**
6. Repeat for `20240101000001_enable_realtime.sql`

### Option 2: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## ✅ Verification

After running migrations, verify with these queries:

```sql
-- Check tables exist (should return 5 rows)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'rooms', 'room_members', 'playback_state', 'messages');

-- Check RLS is enabled (all should have rowsecurity = true)
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public';

-- Check real-time is enabled (should return 3 rows)
SELECT tablename FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';
```

More queries available in `TEST_QUERIES.sql`.

## 🔄 Making Changes

### Adding a New Table

1. Create a new migration file: `YYYYMMDDHHMMSS_description.sql`
2. Add table definition with indexes and constraints
3. Add RLS policies
4. Enable real-time if needed
5. Update TypeScript types in `src/types/supabase.ts`
6. Add utility functions in `src/lib/db.ts`

### Modifying Existing Tables

```sql
-- Example: Add a column
ALTER TABLE rooms ADD COLUMN description TEXT;

-- Update RLS policies if needed
CREATE POLICY "New policy name" ON rooms ...
```

Always test changes in a development environment first!

## 🔒 Security Notes

- **RLS is mandatory**: Never disable row-level security
- **Test policies**: Verify users can only access authorized data
- **Use anon key**: Only expose the anon/public key to clients
- **Never expose**: Service role key should only be used server-side

## 📊 Database Schema

### Tables Overview

| Table          | Purpose                | Real-time |
| -------------- | ---------------------- | --------- |
| users          | User profiles          | No        |
| rooms          | Music jam rooms        | No        |
| room_members   | User presence in rooms | Yes       |
| playback_state | YouTube video sync     | Yes       |
| messages       | Chat messages          | Yes       |

### Relationships

```
users
  └─ rooms (owner_id)
      ├─ room_members (room_id, user_id)
      ├─ playback_state (room_id, updated_by)
      └─ messages (room_id, user_id)
```

## 🐛 Troubleshooting

### "relation does not exist"

**Solution**: Run the initial migration first.

### "permission denied for table"

**Solution**: Check RLS policies and user authentication.

### "duplicate key value violates unique constraint"

**Solution**: The record already exists. Check before inserting.

### Real-time not working

**Solution**: Verify replication is enabled in dashboard or run the real-time migration.

## 📚 Additional Resources

- [Supabase SQL Documentation](https://supabase.com/docs/guides/database)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Documentation](https://supabase.com/docs/guides/realtime)

## 🔗 Related Files

- **TypeScript Types**: `src/types/supabase.ts`
- **Database Client**: `src/lib/supabase.ts`
- **Utility Functions**: `src/lib/db.ts`
- **Setup Guide**: `../SUPABASE_SETUP.md`
- **Quick Start**: `../SUPABASE_QUICKSTART.md`

---

**Last Updated**: 2024-01-01  
**Database Version**: 1.0.0  
**Status**: Production Ready
