/**
 * Example Component: Room with Real-time Features
 *
 * This is a reference implementation showing how to use the Supabase database utilities.
 * It demonstrates:
 * - Room creation and joining
 * - Real-time playback state sync
 * - Real-time chat messages
 * - Real-time member presence
 *
 * DO NOT USE THIS IN PRODUCTION - This is for reference only!
 */

'use client';

import { useEffect, useState } from 'react';
import {
  createRoom,
  joinRoom,
  leaveRoom,
  getRoomMembers,
  updatePlaybackState,
  getPlaybackState,
  sendMessage,
  getMessages,
  subscribeToPlaybackState,
  subscribeToMessages,
  subscribeToRoomMembers,
} from '@/lib/db';
import type {
  Room,
  RoomMember,
  PlaybackState,
  Message,
} from '@/types/supabase';

interface ExampleRoomProps {
  userId: string; // Current user's ID (from Supabase Auth)
  roomId?: string; // Optional: Join existing room
}

export default function ExampleRoomUsage({ userId, roomId }: ExampleRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =============================================
  // 1. ROOM SETUP
  // =============================================

  const handleCreateRoom = async () => {
    setLoading(true);
    setError(null);

    const { data, error: createError } = await createRoom(
      'My Music Room',
      userId,
      true, // Make it public
    );

    if (createError) {
      setError(createError);
      setLoading(false);
      return;
    }

    setRoom(data);
    setLoading(false);

    // Automatically join the room as owner
    await handleJoinRoom(data!.id);
  };

  const handleJoinRoom = async (targetRoomId: string) => {
    setLoading(true);
    setError(null);

    const { error: joinError } = await joinRoom(
      targetRoomId,
      userId,
      'listener',
    );

    if (joinError) {
      setError(joinError);
      setLoading(false);
      return;
    }

    // Load initial data
    await loadRoomData(targetRoomId);
    setLoading(false);
  };

  const loadRoomData = async (targetRoomId: string) => {
    // Load members
    const { data: membersData } = await getRoomMembers(targetRoomId);
    if (membersData) setMembers(membersData);

    // Load playback state
    const { data: stateData } = await getPlaybackState(targetRoomId);
    if (stateData) setPlaybackState(stateData);

    // Load messages
    const { data: messagesData } = await getMessages(targetRoomId, 50);
    if (messagesData) setMessages(messagesData);
  };

  const handleLeaveRoom = async () => {
    if (!room) return;

    await leaveRoom(room.id, userId);
    setRoom(null);
    setMembers([]);
    setPlaybackState(null);
    setMessages([]);
  };

  // =============================================
  // 2. PLAYBACK CONTROL
  // =============================================

  const handlePlayVideo = async (videoId: string) => {
    if (!room) return;

    const { error: updateError } = await updatePlaybackState(
      room.id,
      videoId,
      true, // is_playing
      0, // start from beginning
      userId,
    );

    if (updateError) {
      setError(updateError);
    }
  };

  const handlePauseVideo = async () => {
    if (!room || !playbackState) return;

    const { error: updateError } = await updatePlaybackState(
      room.id,
      playbackState.video_id,
      false, // is_playing
      playbackState.current_timestamp,
      userId,
    );

    if (updateError) {
      setError(updateError);
    }
  };

  // =============================================
  // 3. CHAT
  // =============================================

  const handleSendMessage = async () => {
    if (!room || !messageText.trim()) return;

    const { error: sendError } = await sendMessage(
      room.id,
      userId,
      messageText,
    );

    if (sendError) {
      setError(sendError);
      return;
    }

    setMessageText('');
  };

  // =============================================
  // 4. REAL-TIME SUBSCRIPTIONS
  // =============================================

  useEffect(() => {
    if (!room) return;

    // Subscribe to playback state changes
    const playbackChannel = subscribeToPlaybackState(room.id, (state) => {
      console.log('Playback state updated:', state);
      setPlaybackState(state);

      // TODO: Update your YouTube player here
      // if (state.is_playing) {
      //   youtubePlayer.playVideo();
      // } else {
      //   youtubePlayer.pauseVideo();
      // }
      // youtubePlayer.seekTo(state.current_timestamp);
    });

    // Subscribe to new messages
    const messageChannel = subscribeToMessages(room.id, (message) => {
      console.log('New message:', message);
      setMessages((prev) => [...prev, message]);
    });

    // Subscribe to member changes
    const memberChannel = subscribeToRoomMembers(room.id, (event, member) => {
      console.log('Member event:', event, member);

      if (event === 'INSERT') {
        setMembers((prev) => [...prev, member]);
      } else if (event === 'DELETE') {
        setMembers((prev) => prev.filter((m) => m.id !== member.id));
      } else if (event === 'UPDATE') {
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? member : m)),
        );
      }
    });

    // Cleanup: Unsubscribe when component unmounts or room changes
    return () => {
      playbackChannel.unsubscribe();
      messageChannel.unsubscribe();
      memberChannel.unsubscribe();
    };
  }, [room]);

  // =============================================
  // 5. RENDER UI (EXAMPLE ONLY)
  // =============================================

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Example Room Usage</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!room ? (
        <div className="space-y-4">
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create New Room'}
          </button>

          <div>
            <p className="text-sm text-gray-600">
              Or join an existing room by passing roomId prop
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Room Info */}
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold">Room: {room.name}</h2>
            <p className="text-sm text-gray-600">ID: {room.id}</p>
            <p className="text-sm text-gray-600">
              Share Link: {room.share_link}
            </p>
            <button
              onClick={handleLeaveRoom}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded text-sm"
            >
              Leave Room
            </button>
          </div>

          {/* Members */}
          <div>
            <h3 className="font-bold mb-2">Members ({members.length})</h3>
            <ul className="space-y-1">
              {members.map((member) => (
                <li key={member.id} className="text-sm">
                  User {member.user_id} - {member.role}
                  {member.user_id === userId && ' (you)'}
                </li>
              ))}
            </ul>
          </div>

          {/* Playback State */}
          <div>
            <h3 className="font-bold mb-2">Playback</h3>
            {playbackState ? (
              <div className="space-y-2">
                <p className="text-sm">Video: {playbackState.video_id}</p>
                <p className="text-sm">
                  Status: {playbackState.is_playing ? 'Playing' : 'Paused'}
                </p>
                <p className="text-sm">
                  Time: {playbackState.current_timestamp.toFixed(1)}s
                </p>
                <div className="space-x-2">
                  <button
                    onClick={() => handlePlayVideo('dQw4w9WgXcQ')}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Play Test Video
                  </button>
                  <button
                    onClick={handlePauseVideo}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Pause
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No video playing</p>
            )}
          </div>

          {/* Chat */}
          <div>
            <h3 className="font-bold mb-2">Chat</h3>
            <div className="bg-gray-50 p-4 rounded h-64 overflow-y-auto mb-2">
              {messages.map((msg) => (
                <div key={msg.id} className="mb-2">
                  <span className="text-xs text-gray-500">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                  <p className="text-sm">
                    <strong>User {msg.user_id}:</strong> {msg.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 border rounded px-3 py-2 text-sm"
                maxLength={500}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
