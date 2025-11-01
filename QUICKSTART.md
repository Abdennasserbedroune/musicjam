# MusicJam Quick Start Guide

## Initial Setup (First Time Only)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Generate Prisma client
npm run db:generate

# 4. Run database migrations
npm run db:migrate
```

## Daily Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## Before Committing

```bash
# Run all checks
npm run lint          # ESLint
npm run type-check    # TypeScript
npm test              # Jest tests
npm run format        # Format code

# Or run all at once:
npm run lint && npm run type-check && npm test && npm run format:check
```

## Common Tasks

### View Database

```bash
npm run db:studio
# Opens Prisma Studio at http://localhost:5555
```

### Reset Database

```bash
rm dev.db
npm run db:migrate
```

### Add a New Database Field

1. Edit `prisma/schema.prisma`
2. Run `npm run db:migrate -- --name descriptive_name`
3. Restart dev server

### Build for Production

```bash
npm run build
npm start
```

## Project Structure Quick Reference

```
src/
├── app/              # Pages and API routes
├── components/       # React components (client-side)
├── lib/              # Server actions and Prisma
└── utils/            # Pure utility functions
```

## Key Files

- `src/lib/actions.ts` - All server actions (mutations)
- `src/lib/prisma.ts` - Database client
- `src/utils/youtube.ts` - YouTube URL parsing and oEmbed
- `src/utils/room.ts` - Room code generation and passcode hashing
- `prisma/schema.prisma` - Database schema

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## Troubleshooting

### Port 3000 already in use

```bash
# Kill the process
lsof -ti:3000 | xargs kill -9
```

### Prisma Client out of sync

```bash
npm run db:generate
```

### TypeScript errors after schema change

```bash
npm run db:generate
# Restart your IDE/editor
```

## URLs When Running

- **App**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (when running `npm run db:studio`)

## Environment Variables

Only one required:

- `DATABASE_URL` - Database connection string (default: `file:./dev.db`)

## Production Deployment

See README.md for full deployment instructions.

Quick version:

1. Set up PostgreSQL database (Neon, Supabase, etc.)
2. Update `DATABASE_URL` environment variable
3. Change Prisma provider to `postgresql` in schema
4. Run migrations: `npx prisma migrate deploy`
5. Deploy to Vercel/Railway/Render

## Need Help?

- Check `README.md` for full documentation
- Check `IMPLEMENTATION.md` for technical details
- Review Next.js 14 docs: https://nextjs.org/docs
- Review Prisma docs: https://www.prisma.io/docs
