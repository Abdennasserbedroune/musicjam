# MusicJam Quick Start Guide

## 🚀 First Time Setup

### 1. Install Dependencies

```bash
npm install
```

This installs dependencies for the entire monorepo (frontend, backend, and root).

### 2. Set Up Environment

```bash
cp .env.example .env
```

Review and update `.env` if needed. The defaults work for local development.

### 3. Start PostgreSQL Database

Using Docker (recommended):

```bash
npm run docker:up
```

Or use a cloud database (Neon, Supabase, etc.) and update `DATABASE_URL` in `.env`.

### 4. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

### 5. Start Development Servers

```bash
npm run dev
```

This starts both:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

That's it! 🎉

---

## 📅 Daily Development

```bash
# Start both servers
npm run dev

# Or start them individually:
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
```

---

## ✅ Before Committing

Run all checks:

```bash
npm run lint
npm run type-check
npm test
npm run format:check
```

Or fix issues automatically:

```bash
npm run format  # Auto-format code
```

---

## 🗄️ Common Database Tasks

### View Database in Browser

```bash
npm run db:studio
# Opens at http://localhost:5555
```

### Add a New Field to Schema

1. Edit `prisma/schema.prisma`
2. Create migration:
   ```bash
   npm run db:migrate -- --name add_new_field
   ```
3. Prisma client regenerates automatically

### Reset Database

```bash
# Stop database
npm run docker:down

# Start fresh
npm run docker:up
npm run db:migrate
```

### Check Docker Logs

```bash
npm run docker:logs
```

---

## 📦 Working with Workspaces

### Install Package in Frontend

```bash
npm install <package> --workspace=@musicjam/frontend
```

### Install Package in Backend

```bash
npm install <package> --workspace=@musicjam/backend
```

### Install Root-Level Package

```bash
npm install <package>
```

---

## 🏗️ Building

### Build Everything

```bash
npm run build
```

### Build Individual Apps

```bash
npm run build:frontend
npm run build:backend
```

### Test Production Build

```bash
npm run build
npm run start  # Both servers in production mode
```

---

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Frontend Tests

```bash
npm run test:frontend
```

### Run Backend Tests

```bash
npm run test:backend
```

### Watch Mode

```bash
cd apps/frontend
npm run test:watch
```

---

## 📂 Project Structure at a Glance

```
apps/
├── frontend/        # Next.js app
│   └── src/
│       ├── app/    # Pages & API routes
│       ├── components/
│       ├── lib/    # Server actions
│       └── utils/
│
└── backend/         # Express API
    └── src/
        ├── routes/
        ├── middleware/
        └── index.ts

prisma/
└── schema.prisma    # Shared database schema
```

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9

# Backend (port 3001)
lsof -ti:3001 | xargs kill -9
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
npm run docker:logs

# Restart database
npm run docker:down
npm run docker:up
```

### Prisma Client Out of Sync

```bash
npm run db:generate
# Then restart your editor/IDE
```

### TypeScript Errors After Package Install

```bash
# Restart TypeScript server in your editor
# Or regenerate Prisma client
npm run db:generate
```

### Workspace Issues

```bash
# Clean everything and reinstall
npm run clean:install
```

### Module Not Found (Frontend)

If you see module errors in frontend, ensure paths in `tsconfig.json` are correct:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

---

## 🌐 URLs When Running

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Backend Health**: http://localhost:3001/health
- **Prisma Studio**: http://localhost:5555 (when running `npm run db:studio`)

---

## 📝 Key Files to Know

### Configuration

- `package.json` - Root workspace config
- `apps/frontend/package.json` - Frontend dependencies
- `apps/backend/package.json` - Backend dependencies
- `.env` - Environment variables
- `tsconfig.base.json` - Base TypeScript config

### Code

- `apps/frontend/src/lib/actions.ts` - Server actions
- `apps/frontend/src/lib/prisma.ts` - Database client (frontend)
- `apps/backend/src/index.ts` - API server entry
- `apps/backend/src/routes/health.ts` - Health check endpoint
- `prisma/schema.prisma` - Database schema

### Tools

- `docker-compose.yml` - Local PostgreSQL
- `turbo.json` - Build orchestration
- `vercel.json` - Deployment config
- `.github/workflows/ci.yml` - CI/CD pipeline

---

## 🚢 Deployment Quick Reference

### Vercel

```bash
vercel
```

Make sure to set environment variables in Vercel dashboard:

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_BACKEND_URL`
- `NEXT_PUBLIC_SOCKET_URL`

### Database (Production)

1. Create PostgreSQL on [Neon](https://neon.tech/) or [Supabase](https://supabase.com/)
2. Update `DATABASE_URL` in Vercel
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

---

## 💡 Pro Tips

1. **Use `turbo` for faster builds:**

   ```bash
   npx turbo build
   ```

2. **Run specific workspace script:**

   ```bash
   npm run dev --workspace=@musicjam/frontend
   ```

3. **Check all workspace package versions:**

   ```bash
   npm list --workspaces
   ```

4. **Format only changed files:**

   ```bash
   git diff --name-only | grep -E '\.(ts|tsx|js|jsx)$' | xargs prettier --write
   ```

5. **Database schema visualization:**
   ```bash
   npm run db:studio
   ```

---

## 📚 More Information

- Full docs: See `README.md`
- Implementation details: See `IMPLEMENTATION.md`
- Next.js docs: https://nextjs.org/docs
- Express docs: https://expressjs.com/
- Prisma docs: https://www.prisma.io/docs

---

## 🆘 Need Help?

Check the logs:

```bash
# Frontend logs (in terminal where you ran npm run dev)
# Backend logs (same terminal, different color)
# Docker logs
npm run docker:logs
```

Still stuck? Check:

1. `.env` file is configured correctly
2. PostgreSQL is running
3. Dependencies are installed (`npm install`)
4. Prisma client is generated (`npm run db:generate`)
