/**
 * Database Utilities
 * Supabase database operations for MusicJam
 */

import { supabase } from './supabase';
import type {
  Room,
  RoomInsert,
  RoomUpdate,
  RoomMember,
  RoomMemberInsert,
  PlaybackState,
  PlaybackStateInsert,
  PlaybackStateUpdate,
  Message,
  MessageInsert,
  User,
  RoomWithMembers,
  MessageWithUser,
} from '@/types/supabase';

// =============================================
// ROOM OPERATIONS
// =============================================

/**
 * Create a new room
 */
export async function createRoom(
  name: string,
  ownerId: string,
  isPublic: boolean = false,
): Promise<{ data: Room | null; error: string | null }> {
  try {
    const roomData: RoomInsert = {
      name,
      owner_id: ownerId,
      is_public: isPublic,
    };

    const { data, error } = await supabase
      .from('rooms')
      .insert(roomData)
      .select()
      .single();

    if (error) {
      console.error('Error creating room:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error creating room:', err);
    return { data: null, error: 'Failed to create room' };
  }
}

/**
 * Get room by ID
 */
export async function getRoom(
  roomId: string,
): Promise<{ data: Room | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (error) {
      console.error('Error fetching room:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error fetching room:', err);
    return { data: null, error: 'Failed to fetch room' };
  }
}

/**
 * Get room by share link
 */
export async function getRoomByShareLink(
  shareLink: string,
): Promise<{ data: Room | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('share_link', shareLink)
      .single();

    if (error) {
      console.error('Error fetching room by share link:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error fetching room:', err);
    return { data: null, error: 'Failed to fetch room' };
  }
}

/**
 * Update room details
 */
export async function updateRoom(
  roomId: string,
  updates: RoomUpdate,
): Promise<{ data: Room | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', roomId)
      .select()
      .single();

    if (error) {
      console.error('Error updating room:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error updating room:', err);
    return { data: null, error: 'Failed to update room' };
  }
}

/**
 * Delete room
 */
export async function deleteRoom(
  roomId: string,
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('rooms').delete().eq('id', roomId);

    if (error) {
      console.error('Error deleting room:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error deleting room:', err);
    return { error: 'Failed to delete room' };
  }
}

/**
 * Get all public rooms
 */
export async function getPublicRooms(): Promise<{
  data: Room[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching public rooms:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error fetching public rooms:', err);
    return { data: null, error: 'Failed to fetch public rooms' };
  }
}

// =============================================
// ROOM MEMBER OPERATIONS
// =============================================

/**
 * Join a room
 */
export async function joinRoom(
  roomId: string,
  userId: string,
  role: 'dj' | 'listener' = 'listener',
): Promise<{ data: RoomMember | null; error: string | null }> {
  try {
    const memberData: RoomMemberInsert = {
      room_id: roomId,
      user_id: userId,
      role,
    };

    const { data, error } = await supabase
      .from('room_members')
      .insert(memberData)
      .select()
      .single();

    if (error) {
      console.error('Error joining room:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error joining room:', err);
    return { data: null, error: 'Failed to join room' };
  }
}

/**
 * Leave a room
 */
export async function leaveRoom(
  roomId: string,
  userId: string,
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('room_members')
      .delete()
      .eq('room_id', roomId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error leaving room:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error leaving room:', err);
    return { error: 'Failed to leave room' };
  }
}

/**
 * Get all members in a room
 */
export async function getRoomMembers(
  roomId: string,
): Promise<{ data: RoomMember[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('room_members')
      .select('*')
      .eq('room_id', roomId)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('Error fetching room members:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error fetching room members:', err);
    return { data: null, error: 'Failed to fetch room members' };
  }
}

/**
 * Update member role
 */
export async function updateMemberRole(
  roomId: string,
  userId: string,
  role: 'dj' | 'listener',
): Promise<{ data: RoomMember | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('room_members')
      .update({ role })
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating member role:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error updating member role:', err);
    return { data: null, error: 'Failed to update member role' };
  }
}

/**
 * Update member last active timestamp
 */
export async function updateMemberActivity(
  roomId: string,
  userId: string,
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('room_members')
      .update({ last_active: new Date().toISOString() })
      .eq('room_id', roomId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating member activity:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error updating member activity:', err);
    return { error: 'Failed to update member activity' };
  }
}

// =============================================
// PLAYBACK STATE OPERATIONS
// =============================================

/**
 * Get playback state for a room
 */
export async function getPlaybackState(
  roomId: string,
): Promise<{ data: PlaybackState | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('playback_state')
      .select('*')
      .eq('room_id', roomId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned"
      console.error('Error fetching playback state:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error fetching playback state:', err);
    return { data: null, error: 'Failed to fetch playback state' };
  }
}

/**
 * Update playback state
 */
export async function updatePlaybackState(
  roomId: string,
  videoId: string,
  isPlaying: boolean,
  currentTimestamp: number,
  updatedBy: string,
): Promise<{ data: PlaybackState | null; error: string | null }> {
  try {
    const stateData: PlaybackStateInsert = {
      room_id: roomId,
      video_id: videoId,
      is_playing: isPlaying,
      current_timestamp: currentTimestamp,
      updated_by: updatedBy,
    };

    // Try to update first, if not exists then insert
    const { data: existing } = await supabase
      .from('playback_state')
      .select('id')
      .eq('room_id', roomId)
      .single();

    if (existing) {
      const updateData: PlaybackStateUpdate = {
        video_id: videoId,
        is_playing: isPlaying,
        current_timestamp: currentTimestamp,
        updated_by: updatedBy,
      };

      const { data, error } = await supabase
        .from('playback_state')
        .update(updateData)
        .eq('room_id', roomId)
        .select()
        .single();

      if (error) {
        console.error('Error updating playback state:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } else {
      const { data, error } = await supabase
        .from('playback_state')
        .insert(stateData)
        .select()
        .single();

      if (error) {
        console.error('Error inserting playback state:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    }
  } catch (err) {
    console.error('Unexpected error updating playback state:', err);
    return { data: null, error: 'Failed to update playback state' };
  }
}

// =============================================
// MESSAGE OPERATIONS
// =============================================

/**
 * Send a message to a room
 */
export async function sendMessage(
  roomId: string,
  userId: string,
  text: string,
): Promise<{ data: Message | null; error: string | null }> {
  try {
    if (!text.trim()) {
      return { data: null, error: 'Message cannot be empty' };
    }

    if (text.length > 500) {
      return { data: null, error: 'Message is too long (max 500 characters)' };
    }

    const messageData: MessageInsert = {
      room_id: roomId,
      user_id: userId,
      text: text.trim(),
    };

    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error sending message:', err);
    return { data: null, error: 'Failed to send message' };
  }
}

/**
 * Get messages for a room
 */
export async function getMessages(
  roomId: string,
  limit: number = 100,
): Promise<{ data: Message[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching messages:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error fetching messages:', err);
    return { data: null, error: 'Failed to fetch messages' };
  }
}

/**
 * Get messages with user information
 */
export async function getMessagesWithUsers(
  roomId: string,
  limit: number = 100,
): Promise<{ data: MessageWithUser[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(
        `
        *,
        user:users(*)
      `,
      )
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching messages with users:', error);
      return { data: null, error: error.message };
    }

    return { data: data as MessageWithUser[], error: null };
  } catch (err) {
    console.error('Unexpected error fetching messages with users:', err);
    return { data: null, error: 'Failed to fetch messages' };
  }
}

// =============================================
// USER OPERATIONS
// =============================================

/**
 * Get user by ID
 */
export async function getUser(
  userId: string,
): Promise<{ data: User | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error fetching user:', err);
    return { data: null, error: 'Failed to fetch user' };
  }
}

/**
 * Get user by username
 */
export async function getUserByUsername(
  username: string,
): Promise<{ data: User | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error fetching user by username:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error fetching user:', err);
    return { data: null, error: 'Failed to fetch user' };
  }
}

// =============================================
// REAL-TIME SUBSCRIPTIONS
// =============================================

/**
 * Subscribe to playback state changes in a room
 */
export function subscribeToPlaybackState(
  roomId: string,
  callback: (payload: PlaybackState) => void,
) {
  return supabase
    .channel(`playback_state:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'playback_state',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        callback(payload.new as PlaybackState);
      },
    )
    .subscribe();
}

/**
 * Subscribe to new messages in a room
 */
export function subscribeToMessages(
  roomId: string,
  callback: (payload: Message) => void,
) {
  return supabase
    .channel(`messages:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        callback(payload.new as Message);
      },
    )
    .subscribe();
}

/**
 * Subscribe to room member changes (join/leave)
 */
export function subscribeToRoomMembers(
  roomId: string,
  callback: (
    event: 'INSERT' | 'UPDATE' | 'DELETE',
    payload: RoomMember,
  ) => void,
) {
  return supabase
    .channel(`room_members:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'room_members',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        callback(
          payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          payload.new as RoomMember,
        );
      },
    )
    .subscribe();
}
