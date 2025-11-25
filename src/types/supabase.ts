/**
 * Supabase Database Types
 * Generated types matching the database schema for type-safe operations
 */

export type User = {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Room = {
  id: string;
  name: string;
  owner_id: string;
  is_public: boolean;
  share_link: string;
  created_at: string;
  updated_at: string;
};

export type RoomMember = {
  id: string;
  room_id: string;
  user_id: string;
  role: 'dj' | 'listener';
  joined_at: string;
  last_active: string;
};

export type PlaybackState = {
  id: string;
  room_id: string;
  video_id: string;
  is_playing: boolean;
  current_timestamp: number;
  updated_at: string;
  updated_by: string | null;
};

export type Message = {
  id: string;
  room_id: string;
  user_id: string;
  text: string;
  created_at: string;
};

// Insert types (for creating new records - omit auto-generated fields)
export type UserInsert = Omit<User, 'created_at' | 'updated_at'>;

export type RoomInsert = Omit<
  Room,
  'id' | 'share_link' | 'created_at' | 'updated_at'
> & {
  id?: string;
  share_link?: string;
};

export type RoomMemberInsert = Omit<
  RoomMember,
  'id' | 'joined_at' | 'last_active'
> & {
  id?: string;
};

export type PlaybackStateInsert = Omit<PlaybackState, 'id' | 'updated_at'> & {
  id?: string;
};

export type MessageInsert = Omit<Message, 'id' | 'created_at'> & {
  id?: string;
};

// Update types (for updating existing records - all fields optional except id)
export type UserUpdate = Partial<Omit<User, 'id' | 'created_at'>>;
export type RoomUpdate = Partial<Omit<Room, 'id' | 'created_at'>>;
export type RoomMemberUpdate = Partial<Omit<RoomMember, 'id' | 'joined_at'>>;
export type PlaybackStateUpdate = Partial<Omit<PlaybackState, 'id'>>;

// Extended types with related data (for joins)
export type RoomWithOwner = Room & {
  owner: User;
};

export type RoomWithMembers = Room & {
  members: (RoomMember & { user: User })[];
};

export type MessageWithUser = Message & {
  user: User;
};

export type PlaybackStateWithUser = PlaybackState & {
  user: User | null;
};

// Real-time payload types
export type RealtimePayload<T> = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old: T;
  errors: string[] | null;
};
