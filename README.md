# 🎵 MusicJam

A collaborative YouTube playlist application built with Next.js 14. Create rooms, add YouTube videos, and chat with friends while building the perfect playlist together!

## Features

- 🎬 **Collaborative Playlists**: Add YouTube videos to shared playlists
- 💬 **Real-time Chat**: Simple text chat within each room
- 🔒 **Optional Passcodes**: Protect your room with a passcode
- 🎯 **Drag & Drop**: Reorder playlist items with ease
- 📱 **Responsive Design**: Works great on desktop and mobile
- 🚀 **No Signup Required**: Just enter a nickname and start jamming

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with dark neon theme)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Anonymous nicknames per room (stored in localStorage)
- **Video Metadata**: YouTube oEmbed API (no API key required)
- **State Management**: Server Actions + Simple Polling

## Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm or pnpm
- Supabase account (free tier available at [supabase.com](https://supabase.com))

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd musicjam
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings → API
   - Copy your project URL and anon key

4. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

5. Create the database schema:

   Run the following SQL in your Supabase SQL Editor:

   ```sql
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

   -- Create indexes
   CREATE INDEX idx_playlist_items_room_id ON playlist_items(room_id);
   CREATE INDEX idx_messages_room_id ON messages(room_id);
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── (marketing)/  # Public landing pages
│   │   ├── (app)/        # App pages (rooms)
│   │   ├── api/          # API routes
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   ├── lib/
│   │   ├── supabase/     # Supabase client utilities
│   │   ├── actions.ts    # Server actions
│   │   └── types.ts      # TypeScript types
│   └── utils/            # Utility functions
└── __tests__/            # Test files
```

## Database Schema

### rooms

- `id`: UUID primary key
- `code`: 6-character room code (e.g., "ABC123")
- `passcode_hash`: Optional bcrypt hash of passcode
- `created_at`: Creation timestamp

### playlist_items

- `id`: UUID primary key
- `room_id`: Reference to rooms
- `url`: YouTube video URL
- `title`: Video title (from oEmbed)
- `thumbnail_url`: Thumbnail URL (from oEmbed)
- `added_by`: Nickname of user who added it
- `position`: Order in playlist
- `created_at`: Creation timestamp

### messages

- `id`: UUID primary key
- `room_id`: Reference to rooms
- `author`: Nickname of message author
- `text`: Message content
- `created_at`: Creation timestamp

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub

2. Import your repository on [Vercel](https://vercel.com)

3. Configure environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. Deploy! Vercel will automatically:
   - Detect Next.js configuration
   - Install dependencies
   - Build and optimize the application
   - Deploy to a global CDN

#### Vercel Deployment Best Practices

- Enable automatic deployments for your main branch
- Use Preview Deployments for PRs to test changes before merging
- Set up Custom Domains in Project Settings
- Monitor performance with Vercel Analytics
- Use environment variables for different stages (development, preview, production)

### Supabase Configuration

Your Supabase project is production-ready out of the box, but consider these optimizations:

- **Database Backups**: Enable automatic backups (free on paid plans)
- **Connection Pooling**: Already enabled by default
- **Row Level Security**: Currently tables are publicly accessible; add RLS policies if needed
- **Edge Functions**: Consider using Supabase Edge Functions for real-time features

### Alternative Platforms

The application works well with:

- Railway
- Render
- Fly.io
- Any platform supporting Node.js and PostgreSQL

## CI/CD

GitHub Actions workflow runs on every PR and push to main/develop:

- Linting (ESLint)
- Format checking (Prettier)
- Type checking (TypeScript)
- Unit tests (Jest)
- Build verification

## Features in Detail

### Room Creation

- Generates unique 6-character room codes
- Optional passcode protection with bcrypt hashing
- No expiration (rooms persist until manually deleted)

### YouTube Integration

- Uses YouTube oEmbed API (no API key needed)
- Validates URLs before adding
- Fetches video title and thumbnail automatically
- Supports various YouTube URL formats

### Chat System

- Simple polling mechanism (3-second intervals)
- No WebSocket dependencies
- Messages scoped to room
- 500 character limit per message

### Playlist Management

- Drag-and-drop reordering
- Remove individual items
- Clear entire playlist
- Persistent ordering

## Theme Customization

The application includes a dark neon theme with customizable tokens in `tailwind.config.js`:

```javascript
neon: {
  pink: '#ff006e',
  purple: '#8338ec',
  blue: '#3a86ff',
  cyan: '#00f5ff',
  green: '#06ffa5',
  yellow: '#ffbe0b',
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Acknowledgments

- YouTube oEmbed API for metadata
- Next.js team for the amazing framework
- Supabase for the excellent backend platform
