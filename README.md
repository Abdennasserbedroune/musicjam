# 🎵 MusicJam

A collaborative YouTube playlist application built with Next.js 14 (frontend) and Express (backend). Create rooms, add YouTube videos, and chat with friends while building the perfect playlist together!

## Architecture

This project is organized as a **monorepo** with two main applications:

- **Frontend** (`apps/frontend`): Next.js 14 application with App Router
- **Backend** (`apps/backend`): Express.js REST API with TypeScript
- **Database**: PostgreSQL with Prisma ORM (schema at root)

## Features

- 🎬 **Collaborative Playlists**: Add YouTube videos to shared playlists
- 💬 **Real-time Chat**: Simple text chat within each room
- 🔒 **Optional Passcodes**: Protect your room with a passcode
- 🎯 **Drag & Drop**: Reorder playlist items with ease
- 📱 **Responsive Design**: Works great on desktop and mobile
- 🚀 **No Signup Required**: Just enter a nickname and start jamming

## Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Server Actions + Simple Polling

### Backend

- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT
- **Real-time**: Socket.IO ready

### Shared

- **Database**: PostgreSQL via Prisma ORM
- **Video Metadata**: YouTube oEmbed API (no API key required)

## Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm 9.x or higher
- Docker (for local PostgreSQL) or PostgreSQL instance

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd musicjam
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   This will install dependencies for both frontend and backend workspaces.

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration. Key variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `NEXT_PUBLIC_BACKEND_URL`: Backend API URL
   - See `.env.example` for full configuration

4. **Start PostgreSQL database:**

   Using Docker (recommended for local development):

   ```bash
   npm run docker:up
   ```

   Or use a cloud provider like [Neon](https://neon.tech/) or [Supabase](https://supabase.com/) and update `DATABASE_URL`.

5. **Generate Prisma client:**

   ```bash
   npm run db:generate
   ```

6. **Run database migrations:**

   ```bash
   npm run db:migrate
   ```

7. **Start both servers:**

   ```bash
   npm run dev
   ```

   This starts:
   - Frontend at [http://localhost:3000](http://localhost:3000)
   - Backend at [http://localhost:3001](http://localhost:3001)

## Available Scripts

### Root Scripts (run from project root)

#### Development

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only the frontend
- `npm run dev:backend` - Start only the backend

#### Building

- `npm run build` - Build both applications
- `npm run build:frontend` - Build frontend only
- `npm run build:backend` - Build backend only

#### Production

- `npm run start` - Start both applications in production mode
- `npm run start:frontend` - Start frontend only
- `npm run start:backend` - Start backend only

#### Quality Checks

- `npm run lint` - Lint all workspaces
- `npm run lint:frontend` - Lint frontend
- `npm run lint:backend` - Lint backend
- `npm run type-check` - Type check all workspaces
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

#### Testing

- `npm run test` - Run all tests
- `npm run test:frontend` - Run frontend tests
- `npm run test:backend` - Run backend tests

#### Database

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations (development)
- `npm run db:migrate:deploy` - Run migrations (production)
- `npm run db:studio` - Open Prisma Studio

#### Docker

- `npm run docker:up` - Start PostgreSQL container
- `npm run docker:down` - Stop PostgreSQL container
- `npm run docker:logs` - View PostgreSQL logs

#### Utilities

- `npm run clean` - Remove all node_modules and build artifacts
- `npm run clean:install` - Clean and reinstall all dependencies

## Project Structure

```
├── apps/
│   ├── frontend/              # Next.js application
│   │   ├── src/
│   │   │   ├── app/          # Next.js App Router pages
│   │   │   ├── components/   # React components
│   │   │   ├── lib/          # Library code (Prisma, actions)
│   │   │   └── utils/        # Utility functions
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.js
│   │   └── tailwind.config.js
│   │
│   └── backend/               # Express API
│       ├── src/
│       │   ├── routes/       # API routes
│       │   ├── middleware/   # Express middleware
│       │   └── index.ts      # Server entry point
│       ├── package.json
│       └── tsconfig.json
│
├── prisma/
│   └── schema.prisma          # Database schema (shared)
│
├── .github/
│   └── workflows/
│       └── ci.yml            # CI/CD pipeline
│
├── docker-compose.yml         # PostgreSQL container
├── turbo.json                 # Turbo build configuration
├── vercel.json                # Vercel deployment config
├── tsconfig.base.json         # Base TypeScript config
├── package.json               # Root workspace config
└── .env.example               # Environment variables template
```

## Database Schema

### Room

- `id`: Unique identifier (cuid)
- `code`: 6-character room code (e.g., "ABC123")
- `passcodeHash`: Optional bcrypt hash of passcode
- `createdAt`: Creation timestamp

### PlaylistItem

- `id`: Unique identifier (cuid)
- `roomId`: Reference to Room
- `url`: YouTube video URL
- `title`: Video title (from oEmbed)
- `thumbnailUrl`: Thumbnail URL (from oEmbed)
- `addedBy`: Nickname of user who added it
- `position`: Order in playlist
- `createdAt`: Creation timestamp

### Message

- `id`: Unique identifier (cuid)
- `roomId`: Reference to Room
- `author`: Nickname of message author
- `text`: Message content
- `createdAt`: Creation timestamp

## Deployment

### Vercel (Recommended)

This monorepo is configured for deployment to Vercel with `vercel.json`:

1. **Install Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Set environment variables in Vercel:**
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - JWT secret key
   - All `NEXT_PUBLIC_*` variables

3. **Deploy:**
   ```bash
   vercel
   ```

The configuration automatically:

- Deploys frontend as a Next.js app
- Deploys backend as serverless functions
- Routes `/api/*` to backend, everything else to frontend

### Database Setup (Production)

Use a managed PostgreSQL service:

- **[Neon](https://neon.tech/)**: Free PostgreSQL with generous limits
- **[Supabase](https://supabase.com/)**: PostgreSQL + additional features
- **[Railway](https://railway.app/)**: Easy PostgreSQL hosting

After creating your database:

1. Update `DATABASE_URL` in Vercel environment variables
2. Run migrations: `npx prisma migrate deploy`

### Alternative Platforms

The monorepo can also be deployed to:

- **Railway**: Supports monorepos natively
- **Render**: Use separate services for frontend/backend
- **Fly.io**: Containerized deployment
- **DigitalOcean App Platform**

## Development Workflow

### Making Database Changes

1. Edit `prisma/schema.prisma`
2. Create migration:
   ```bash
   npm run db:migrate -- --name descriptive_name
   ```
3. Prisma client will be regenerated automatically

### Adding Features

Each workspace has its own dependencies:

```bash
# Add to frontend
npm install <package> --workspace=@musicjam/frontend

# Add to backend
npm install <package> --workspace=@musicjam/backend

# Add to both (dev dependencies)
npm install <package> -D
```

### Running Individual Apps

```bash
# Frontend only
cd apps/frontend
npm run dev

# Backend only
cd apps/backend
npm run dev
```

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every PR and push:

- ✅ Linting (ESLint) for both apps
- ✅ Format checking (Prettier)
- ✅ Type checking (TypeScript)
- ✅ Unit tests (Jest)
- ✅ Build verification
- ✅ PostgreSQL integration tests

## Environment Variables

See `.env.example` for a complete list. Key sections:

### Shared

- `DATABASE_URL`: PostgreSQL connection

### Backend

- `PORT`: API server port (default: 3001)
- `JWT_SECRET`: Secret for JWT tokens
- `FRONTEND_URL`: CORS whitelist

### Frontend

- `NEXT_PUBLIC_BACKEND_URL`: Backend API endpoint
- `NEXT_PUBLIC_SOCKET_URL`: Socket.IO endpoint (future)
- `NEXT_PUBLIC_APP_URL`: App URL for metadata

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes in the appropriate workspace
4. Run checks: `npm run lint && npm run type-check && npm test`
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Troubleshooting

### Port already in use

```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9
```

### Database connection errors

```bash
# Check if PostgreSQL is running
npm run docker:logs

# Restart database
npm run docker:down && npm run docker:up

# Verify connection in .env file
```

### Prisma Client out of sync

```bash
npm run db:generate
# Restart your IDE/editor
```

### Workspace installation issues

```bash
npm run clean:install
```

## License

MIT

## Acknowledgments

- YouTube oEmbed API for metadata
- Next.js team for the amazing framework
- Prisma for the excellent ORM
- Express.js for the robust backend framework
