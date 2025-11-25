-- MusicJam Database Schema
-- This migration creates all tables, indexes, RLS policies, and enables real-time replication

-- =============================================
-- 1. CREATE TABLES
-- =============================================

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

-- Room members table (presence & role tracking)
CREATE TABLE public.room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'listener', -- 'dj' or 'listener'
  joined_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Playback state table (YouTube sync state per room)
CREATE TABLE public.playback_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL UNIQUE REFERENCES rooms(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  is_playing BOOLEAN DEFAULT FALSE,
  current_timestamp FLOAT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- Messages table (chat)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_rooms_owner_id ON rooms(owner_id);
CREATE INDEX idx_rooms_share_link ON rooms(share_link);
CREATE INDEX idx_room_members_room_id ON room_members(room_id);
CREATE INDEX idx_room_members_user_id ON room_members(user_id);
CREATE INDEX idx_playback_state_room_id ON playback_state(room_id);
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- =============================================
-- 3. ENABLE ROW-LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE playback_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. CREATE RLS POLICIES
-- =============================================

-- Users: Can read own profile and update own data
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Rooms: Can read if public OR member, owner can update/delete
CREATE POLICY "Can read public rooms or joined rooms" ON rooms
  FOR SELECT USING (
    is_public = true OR 
    owner_id = auth.uid() OR 
    id IN (SELECT room_id FROM room_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Authenticated users can create rooms" ON rooms
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Room owners can update their rooms" ON rooms
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Room owners can delete their rooms" ON rooms
  FOR DELETE USING (owner_id = auth.uid());

-- Room Members: Can read members in joined rooms, can join/leave rooms
CREATE POLICY "Can read members in joined rooms" ON room_members
  FOR SELECT USING (
    room_id IN (
      SELECT id FROM rooms 
      WHERE owner_id = auth.uid() OR 
      id IN (SELECT room_id FROM room_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Can join rooms" ON room_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Can leave rooms" ON room_members
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Can update own room membership" ON room_members
  FOR UPDATE USING (auth.uid() = user_id);

-- Playback State: Can read if in room, DJ or owner can update
CREATE POLICY "Can read playback state of joined rooms" ON playback_state
  FOR SELECT USING (
    room_id IN (
      SELECT id FROM rooms 
      WHERE owner_id = auth.uid() OR 
      id IN (SELECT room_id FROM room_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "DJ or owner can update playback state" ON playback_state
  FOR UPDATE USING (
    room_id IN (
      SELECT id FROM rooms WHERE owner_id = auth.uid()
    ) OR
    room_id IN (
      SELECT room_id FROM room_members 
      WHERE user_id = auth.uid() AND role = 'dj'
    )
  );

CREATE POLICY "DJ or owner can insert playback state" ON playback_state
  FOR INSERT WITH CHECK (
    room_id IN (
      SELECT id FROM rooms WHERE owner_id = auth.uid()
    ) OR
    room_id IN (
      SELECT room_id FROM room_members 
      WHERE user_id = auth.uid() AND role = 'dj'
    )
  );

-- Messages: Can read if in room, can send if in room
CREATE POLICY "Can read messages in joined rooms" ON messages
  FOR SELECT USING (
    room_id IN (
      SELECT id FROM rooms 
      WHERE owner_id = auth.uid() OR 
      id IN (SELECT room_id FROM room_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Can send messages to joined rooms" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    room_id IN (
      SELECT id FROM rooms 
      WHERE owner_id = auth.uid() OR 
      id IN (SELECT room_id FROM room_members WHERE user_id = auth.uid())
    )
  );

-- =============================================
-- 5. CREATE FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for rooms table
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for playback_state table
CREATE TRIGGER update_playback_state_updated_at
  BEFORE UPDATE ON playback_state
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 6. ENABLE REAL-TIME REPLICATION
-- =============================================
-- Note: This must be done in the Supabase dashboard:
-- Database → Replication → Enable for: playback_state, messages, room_members

-- Alternatively, use the following SQL (if you have the necessary permissions):
-- ALTER PUBLICATION supabase_realtime ADD TABLE playback_state;
-- ALTER PUBLICATION supabase_realtime ADD TABLE messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE room_members;
