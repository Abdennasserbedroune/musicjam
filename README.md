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
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM with SQLite (easy to swap to PostgreSQL)
- **Authentication**: Anonymous nicknames per room (stored in localStorage)
- **Video Metadata**: YouTube oEmbed API (no API key required)
- **State Management**: Server Actions + Simple Polling

## Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm or pnpm

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

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

4. Generate Prisma client:

   ```bash
   npm run db:generate
   ```

5. Create the database and run migrations:

   ```bash
   npm run db:migrate
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
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── room/         # Room pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Landing page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   ├── lib/              # Library code (Prisma, server actions)
│   └── utils/            # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
└── __tests__/            # Test files
```

## Database Schema

### Room

- `id`: Unique identifier
- `code`: 6-character room code (e.g., "ABC123")
- `passcodeHash`: Optional bcrypt hash of passcode
- `createdAt`: Creation timestamp

### PlaylistItem

- `id`: Unique identifier
- `roomId`: Reference to Room
- `url`: YouTube video URL
- `title`: Video title (from oEmbed)
- `thumbnailUrl`: Thumbnail URL (from oEmbed)
- `addedBy`: Nickname of user who added it
- `position`: Order in playlist
- `createdAt`: Creation timestamp

### Message

- `id`: Unique identifier
- `roomId`: Reference to Room
- `author`: Nickname of message author
- `text`: Message content
- `createdAt`: Creation timestamp

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Deploy:

   ```bash
   vercel
   ```

3. Set up PostgreSQL database (recommended for production):
   - Use [Neon](https://neon.tech/) or [Supabase](https://supabase.com/) for free PostgreSQL
   - Update `DATABASE_URL` in Vercel environment variables
   - Update `prisma/schema.prisma` datasource provider to `postgresql`
   - Run migrations: `npx prisma migrate deploy`

### Docker

A Dockerfile can be added for containerized deployment. The application works well with:

- Railway
- Render
- Fly.io
- Any platform supporting Node.js

### Database Migration (SQLite → PostgreSQL)

1. Update `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Set `DATABASE_URL` in `.env`:

   ```
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

3. Create and run migrations:
   ```bash
   npm run db:migrate
   ```

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
- Prisma for the excellent ORM
