# Database Utilities Documentation

This document provides usage examples for the Supabase database utilities in `db.ts`.

## Table of Contents

- [Setup](#setup)
- [Room Operations](#room-operations)
- [Room Member Operations](#room-member-operations)
- [Playback State Operations](#playback-state-operations)
- [Message Operations](#message-operations)
- [User Operations](#user-operations)
- [Real-time Subscriptions](#real-time-subscriptions)

---

## Setup

All functions automatically use the Supabase client configured in `lib/supabase.ts`. Make sure your environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

---

## Room Operations

### Create a Room

```typescript
import { createRoom } from '@/lib/db';

const { data: room, error } = await createRoom(
  'My Awesome Room', // Room name
  userId, // Owner user ID
  true, // Is public? (default: false)
);

if (error) {
  console.error('Failed to create room:', error);
} else {
  console.log('Room created:', room);
  console.log('Share link:', room.share_link);
}
```

### Get Room by ID

```typescript
import { getRoom } from '@/lib/db';

const { data: room, error } = await getRoom(roomId);
```

### Get Room by Share Link

```typescript
import { getRoomByShareLink } from '@/lib/db';

const { data: room, error } = await getRoomByShareLink('abc-123-xyz');
```

### Update Room

```typescript
import { updateRoom } from '@/lib/db';

const { data: room, error } = await updateRoom(roomId, {
  name: 'New Room Name',
  is_public: true,
});
```

### Delete Room

```typescript
import { deleteRoom } from '@/lib/db';

const { error } = await deleteRoom(roomId);
```

### Get All Public Rooms

```typescript
import { getPublicRooms } from '@/lib/db';

const { data: rooms, error } = await getPublicRooms();
```

---

## Room Member Operations

### Join a Room

```typescript
import { joinRoom } from '@/lib/db';

const { data: member, error } = await joinRoom(
  roomId,
  userId,
  'listener', // Role: 'dj' or 'listener' (default: 'listener')
);
```

### Leave a Room

```typescript
import { leaveRoom } from '@/lib/db';

const { error } = await leaveRoom(roomId, userId);
```

### Get Room Members

```typescript
import { getRoomMembers } from '@/lib/db';

const { data: members, error } = await getRoomMembers(roomId);

// members is an array of RoomMember objects
members?.forEach((member) => {
  console.log(`User ${member.user_id} is a ${member.role}`);
});
```

### Update Member Role

```typescript
import { updateMemberRole } from '@/lib/db';

// Promote a user to DJ
const { data: member, error } = await updateMemberRole(roomId, userId, 'dj');

// Demote back to listener
const { data: member2, error: error2 } = await updateMemberRole(
  roomId,
  userId,
  'listener',
);
```

### Update Member Activity

Use this to track when users are active:

```typescript
import { updateMemberActivity } from '@/lib/db';

// Update last_active timestamp to now
const { error } = await updateMemberActivity(roomId, userId);
```

---

## Playback State Operations

### Get Playback State

```typescript
import { getPlaybackState } from '@/lib/db';

const { data: state, error } = await getPlaybackState(roomId);

if (state) {
  console.log('Current video:', state.video_id);
  console.log('Is playing:', state.is_playing);
  console.log('Timestamp:', state.current_timestamp);
}
```

### Update Playback State

```typescript
import { updatePlaybackState } from '@/lib/db';

const { data: state, error } = await updatePlaybackState(
  roomId,
  'dQw4w9WgXcQ', // YouTube video ID
  true, // Is playing
  42.5, // Current timestamp in seconds
  userId, // User who updated it
);
```

This function automatically handles both insert (first time) and update (subsequent times).

---

## Message Operations

### Send a Message

```typescript
import { sendMessage } from '@/lib/db';

const { data: message, error } = await sendMessage(
  roomId,
  userId,
  'Hello, everyone!',
);

// Validation errors
if (error === 'Message cannot be empty') {
  // Handle empty message
}
if (error === 'Message is too long (max 500 characters)') {
  // Handle long message
}
```

### Get Messages

```typescript
import { getMessages } from '@/lib/db';

// Get last 100 messages (default)
const { data: messages, error } = await getMessages(roomId);

// Get last 50 messages
const { data: messages2, error: error2 } = await getMessages(roomId, 50);
```

### Get Messages with User Info

```typescript
import { getMessagesWithUsers } from '@/lib/db';

const { data: messages, error } = await getMessagesWithUsers(roomId);

messages?.forEach((msg) => {
  console.log(`${msg.user.username}: ${msg.text}`);
});
```

---

## User Operations

### Get User by ID

```typescript
import { getUser } from '@/lib/db';

const { data: user, error } = await getUser(userId);
```

### Get User by Username

```typescript
import { getUserByUsername } from '@/lib/db';

const { data: user, error } = await getUserByUsername('johndoe');
```

---

## Real-time Subscriptions

Real-time subscriptions allow you to receive instant updates when data changes.

### Subscribe to Playback State

Get notified when the playback state changes (play/pause, seek, video change):

```typescript
import { subscribeToPlaybackState } from '@/lib/db';
import { useEffect } from 'react';

function RoomPlayer({ roomId }) {
  useEffect(() => {
    const channel = subscribeToPlaybackState(roomId, (state) => {
      console.log('Playback state updated:', state);
      // Update your player UI
      if (state.is_playing) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
      player.seekTo(state.current_timestamp);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [roomId]);

  return <div>Player UI</div>;
}
```

### Subscribe to Messages

Get notified when new messages are sent:

```typescript
import { subscribeToMessages } from '@/lib/db';
import { useEffect, useState } from 'react';

function ChatBox({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const channel = subscribeToMessages(roomId, (message) => {
      console.log('New message:', message);
      setMessages(prev => [...prev, message]);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [roomId]);

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.text}</div>
      ))}
    </div>
  );
}
```

### Subscribe to Room Members

Get notified when users join/leave or change roles:

```typescript
import { subscribeToRoomMembers } from '@/lib/db';
import { useEffect, useState } from 'react';

function MemberList({ roomId }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const channel = subscribeToRoomMembers(roomId, (event, member) => {
      if (event === 'INSERT') {
        console.log('User joined:', member);
        setMembers(prev => [...prev, member]);
      } else if (event === 'DELETE') {
        console.log('User left:', member);
        setMembers(prev => prev.filter(m => m.id !== member.id));
      } else if (event === 'UPDATE') {
        console.log('Member updated:', member);
        setMembers(prev => prev.map(m => m.id === member.id ? member : m));
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [roomId]);

  return (
    <ul>
      {members.map(member => (
        <li key={member.id}>
          User {member.user_id} ({member.role})
        </li>
      ))}
    </ul>
  );
}
```

---

## Error Handling

All database functions return an object with `{ data, error }` or `{ error }`.

### Recommended Pattern

```typescript
const { data, error } = await someFunction();

if (error) {
  // Handle error
  console.error('Operation failed:', error);
  toast.error(error);
  return;
}

// Use data
console.log('Success:', data);
```

### Common Errors

| Error                                              | Cause                      | Solution                                |
| -------------------------------------------------- | -------------------------- | --------------------------------------- |
| `"Missing Supabase environment variables"`         | ENV vars not set           | Check `.env.local`                      |
| `"new row violates row-level security policy"`     | User not authorized        | Check user permissions and RLS policies |
| `"Room not found"`                                 | Invalid room ID            | Verify room exists                      |
| `"duplicate key value violates unique constraint"` | Trying to insert duplicate | Check for existing records first        |

---

## Best Practices

### 1. Always Handle Errors

```typescript
const { data, error } = await createRoom('My Room', userId);
if (error) {
  // Show error to user
  return;
}
// Proceed with data
```

### 2. Unsubscribe from Real-time Channels

```typescript
useEffect(() => {
  const channel = subscribeToMessages(roomId, handleMessage);

  return () => {
    channel.unsubscribe(); // Cleanup
  };
}, [roomId]);
```

### 3. Check User Authorization

Before calling update/delete functions, verify the user has permission:

```typescript
if (room.owner_id !== currentUserId) {
  console.error('Not authorized');
  return;
}

await deleteRoom(room.id);
```

### 4. Use Type Safety

Import types for better development experience:

```typescript
import type { Room, Message, PlaybackState } from '@/types/supabase';

const [room, setRoom] = useState<Room | null>(null);
```

---

## Performance Tips

1. **Limit message queries**: Use the `limit` parameter to avoid fetching too many messages
2. **Use indexes**: All common queries are already indexed
3. **Batch operations**: Use Supabase transactions for multiple related operations
4. **Cache data**: Store frequently accessed data in React state/context
5. **Unsubscribe**: Always unsubscribe from real-time channels when component unmounts

---

## Example: Complete Room Flow

```typescript
import {
  createRoom,
  joinRoom,
  updatePlaybackState,
  sendMessage,
  subscribeToPlaybackState,
  subscribeToMessages,
  leaveRoom,
} from '@/lib/db';

// 1. Create a room
const { data: room, error } = await createRoom('Party Room', userId, true);

// 2. Join the room (for other users)
await joinRoom(room.id, otherUserId, 'listener');

// 3. Update playback state
await updatePlaybackState(room.id, 'dQw4w9WgXcQ', true, 0, userId);

// 4. Send a message
await sendMessage(room.id, userId, 'Welcome to the party!');

// 5. Subscribe to updates
const playbackChannel = subscribeToPlaybackState(room.id, (state) => {
  console.log('Playback changed:', state);
});

const messageChannel = subscribeToMessages(room.id, (message) => {
  console.log('New message:', message);
});

// 6. Cleanup when done
playbackChannel.unsubscribe();
messageChannel.unsubscribe();
await leaveRoom(room.id, userId);
```

---

## TypeScript Types

All types are available in `@/types/supabase`:

```typescript
import type {
  User,
  Room,
  RoomMember,
  PlaybackState,
  Message,
  RoomInsert,
  MessageInsert,
  // ... and more
} from '@/types/supabase';
```

See `src/types/supabase.ts` for complete type definitions.
