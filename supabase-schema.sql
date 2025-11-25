-- MusicJam Database Schema for Supabase
-- Run this in your Supabase SQL Editor to set up the database

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

-- Create indexes for better query performance
CREATE INDEX idx_playlist_items_room_id ON playlist_items(room_id);
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_rooms_code ON rooms(code);

-- Optional: Add Row Level Security (RLS) policies
-- Uncomment these if you want to enable RLS

-- ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables
-- CREATE POLICY "Allow public read access on rooms" ON rooms FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access on playlist_items" ON playlist_items FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access on messages" ON messages FOR SELECT USING (true);

-- Allow public write access (you may want to restrict this in production)
-- CREATE POLICY "Allow public insert on rooms" ON rooms FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public insert on playlist_items" ON playlist_items FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public insert on messages" ON messages FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public update on playlist_items" ON playlist_items FOR UPDATE USING (true);
-- CREATE POLICY "Allow public delete on playlist_items" ON playlist_items FOR DELETE USING (true);
-- CREATE POLICY "Allow public delete on messages" ON messages FOR DELETE USING (true);
