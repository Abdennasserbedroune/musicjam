# musicjam 🎵

**Synchronized YouTube listening with friends**

musicjam is a collaborative music experience where you can create rooms and listen to YouTube videos together in real-time with your friends. Perfect for music discovery, DJ sessions, and shared listening experiences.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Tailwind CSS** - Utility-first styling with custom music-vibe theme
- **Vercel** - Optimized deployment platform

## Features (Planned)

- 🎧 Real-time synchronized YouTube playback
- 🎪 Create and share music rooms
- 💬 Live chat within rooms
- 👥 See who's listening with you
- 🎛️ DJ controls for room creators
- 📱 Responsive, mobile-friendly design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd musicjam
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   See [SETUP.md](./SETUP.md) for detailed instructions on getting these values from Supabase.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Project Structure

```
musicjam/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── auth/         # Authentication pages
│   │   ├── rooms/        # Room pages
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # Reusable React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and clients
│   │   ├── supabase.ts       # Browser Supabase client
│   │   └── supabaseServer.ts # Server Supabase client
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── vercel.json          # Vercel deployment config
```

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables in Vercel's project settings
4. Deploy!

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

## Contributing

This is an open-source project. Contributions are welcome!

## License

MIT License - feel free to use this project for your own purposes.

---

Built with ❤️ for music lovers everywhere
