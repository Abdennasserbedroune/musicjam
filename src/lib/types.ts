export type Room = {
  id: string;
  code: string;
  passcode_hash: string | null;
  created_at: string;
};

export type PlaylistItem = {
  id: string;
  room_id: string;
  url: string;
  title: string;
  thumbnail_url: string | null;
  added_by: string;
  position: number;
  created_at: string;
};

export type Message = {
  id: string;
  room_id: string;
  author: string;
  text: string;
  created_at: string;
};

export type RoomWithRelations = Room & {
  playlist_items: PlaylistItem[];
  messages: Message[];
};
