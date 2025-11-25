-- =============================================
-- SUPABASE TEST QUERIES
-- Quick reference for testing database setup
-- =============================================

-- =============================================
-- 1. VERIFY TABLES EXIST
-- =============================================

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'rooms', 'room_members', 'playback_state', 'messages')
ORDER BY table_name;

-- =============================================
-- 2. VERIFY RLS IS ENABLED
-- =============================================

SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'rooms', 'room_members', 'playback_state', 'messages')
ORDER BY tablename;

-- Expected: All tables should have rowsecurity = true

-- =============================================
-- 3. CHECK RLS POLICIES
-- =============================================

SELECT 
  tablename, 
  policyname, 
  permissive,
  cmd AS operation,
  qual AS using_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =============================================
-- 4. VERIFY INDEXES
-- =============================================

SELECT 
  tablename, 
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('rooms', 'room_members', 'playback_state', 'messages')
ORDER BY tablename, indexname;

-- =============================================
-- 5. CHECK TRIGGERS
-- =============================================

SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- =============================================
-- 6. VERIFY FOREIGN KEYS
-- =============================================

SELECT
  tc.table_name, 
  tc.constraint_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- =============================================
-- 7. TEST DATA INSERTION (for authenticated users)
-- =============================================

-- First, check your user ID
SELECT id, email FROM auth.users LIMIT 5;

-- Create a test user profile (replace UUID with your actual user ID from auth.users)
-- INSERT INTO public.users (id, email, username, avatar_url)
-- VALUES ('YOUR-USER-ID-HERE', 'test@example.com', 'testuser', NULL);

-- Create a test room (replace owner_id with your user ID)
-- INSERT INTO public.rooms (name, owner_id, is_public)
-- VALUES ('Test Room', 'YOUR-USER-ID-HERE', true)
-- RETURNING *;

-- =============================================
-- 8. QUERY TEST DATA
-- =============================================

-- View all users
SELECT id, email, username, created_at FROM users ORDER BY created_at DESC;

-- View all rooms
SELECT id, name, owner_id, is_public, share_link, created_at 
FROM rooms 
ORDER BY created_at DESC;

-- View room members
SELECT rm.*, u.username, r.name as room_name
FROM room_members rm
JOIN users u ON u.id = rm.user_id
JOIN rooms r ON r.id = rm.room_id
ORDER BY rm.joined_at DESC;

-- View playback states
SELECT ps.*, r.name as room_name
FROM playback_state ps
JOIN rooms r ON r.id = ps.room_id
ORDER BY ps.updated_at DESC;

-- View messages with user info
SELECT m.*, u.username, r.name as room_name
FROM messages m
JOIN users u ON u.id = m.user_id
JOIN rooms r ON r.id = m.room_id
ORDER BY m.created_at DESC
LIMIT 50;

-- =============================================
-- 9. CHECK REAL-TIME REPLICATION
-- =============================================

-- Check which tables have real-time enabled
SELECT 
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- Expected: Should include playback_state, messages, room_members

-- =============================================
-- 10. CLEAN UP TEST DATA (USE WITH CAUTION)
-- =============================================

-- Delete test messages
-- DELETE FROM messages WHERE room_id = 'YOUR-ROOM-ID';

-- Delete test room members
-- DELETE FROM room_members WHERE room_id = 'YOUR-ROOM-ID';

-- Delete test playback state
-- DELETE FROM playback_state WHERE room_id = 'YOUR-ROOM-ID';

-- Delete test rooms
-- DELETE FROM rooms WHERE id = 'YOUR-ROOM-ID';

-- Delete test users (will cascade delete all related data)
-- DELETE FROM users WHERE id = 'YOUR-USER-ID';

-- =============================================
-- 11. USEFUL MONITORING QUERIES
-- =============================================

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'rooms', COUNT(*) FROM rooms
UNION ALL
SELECT 'room_members', COUNT(*) FROM room_members
UNION ALL
SELECT 'playback_state', COUNT(*) FROM playback_state
UNION ALL
SELECT 'messages', COUNT(*) FROM messages;

-- Find inactive room members (not active in last hour)
SELECT rm.*, u.username, r.name as room_name
FROM room_members rm
JOIN users u ON u.id = rm.user_id
JOIN rooms r ON r.id = rm.room_id
WHERE rm.last_active < NOW() - INTERVAL '1 hour'
ORDER BY rm.last_active DESC;

-- Find rooms with most messages
SELECT r.id, r.name, COUNT(m.id) as message_count
FROM rooms r
LEFT JOIN messages m ON m.room_id = r.id
GROUP BY r.id, r.name
ORDER BY message_count DESC
LIMIT 10;

-- Find most active users
SELECT u.id, u.username, COUNT(m.id) as message_count
FROM users u
LEFT JOIN messages m ON m.user_id = u.id
GROUP BY u.id, u.username
ORDER BY message_count DESC
LIMIT 10;

-- =============================================
-- 12. PERFORMANCE ANALYSIS
-- =============================================

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
