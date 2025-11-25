-- =============================================
-- ENABLE REAL-TIME REPLICATION
-- =============================================
-- This script enables real-time replication for tables that need instant updates
-- Run this AFTER creating the initial schema

-- Note: You may need superuser permissions to alter publications
-- If this fails, enable real-time manually in the Supabase dashboard:
-- Database → Replication → Enable for: playback_state, messages, room_members

-- Enable real-time for playback_state table
ALTER PUBLICATION supabase_realtime ADD TABLE playback_state;

-- Enable real-time for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable real-time for room_members table
ALTER PUBLICATION supabase_realtime ADD TABLE room_members;

-- Verify real-time is enabled
SELECT tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename IN ('playback_state', 'messages', 'room_members')
ORDER BY tablename;

-- Expected output: 3 rows showing the three tables
