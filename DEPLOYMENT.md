# Deployment Guide

This guide covers deploying the MusicJam monorepo to various platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Vercel Deployment](#vercel-deployment-recommended)
- [Railway Deployment](#railway-deployment)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- PostgreSQL database (Neon, Supabase, Railway, etc.)
- Git repository pushed to GitHub/GitLab/Bitbucket
- Node.js 18.x or 20.x

## Vercel Deployment (Recommended)

Vercel provides excellent support for monorepo deployments with Next.js.

### 1. Database Setup

Choose a PostgreSQL provider:

#### Option A: Neon (Recommended)

1. Visit [neon.tech](https://neon.tech/)
2. Create a free account
3. Create a new project
4. Copy the connection string

#### Option B: Supabase

1. Visit [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (use transaction pooling URL for serverless)

#### Option C: Railway

1. Visit [railway.app](https://railway.app/)
2. Create a new project
3. Add PostgreSQL service
4. Copy the connection string from Variables tab

### 2. Run Migrations

```bash
# Set your production DATABASE_URL
export DATABASE_URL="postgresql://..."

# Run migrations
npx prisma migrate deploy
```

### 3. Install Vercel CLI

```bash
npm i -g vercel
```

### 4. Deploy

```bash
# From project root
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name: musicjam (or your choice)
# - Directory: ./ (root)
# - Override settings? No
```

### 5. Configure Environment Variables

Go to your Vercel project settings → Environment Variables and add:

**Production Environment:**

```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
FRONTEND_URL=https://your-app.vercel.app
NEXT_PUBLIC_BACKEND_URL=https://your-app.vercel.app/api
NEXT_PUBLIC_SOCKET_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

### 6. Redeploy

```bash
vercel --prod
```

### Notes on Vercel Monorepo

The `vercel.json` configuration handles:

- Frontend: Deployed as Next.js app
- Backend: Deployed as serverless functions at `/api/*`
- Both share the same domain
- Automatic SSL/HTTPS
- CDN caching for static assets

## Railway Deployment

Railway offers native monorepo support with separate services.

### 1. Install Railway CLI

```bash
npm i -g @railway/cli
```

### 2. Initialize Project

```bash
railway login
railway init
```

### 3. Add PostgreSQL

```bash
railway add --database postgres
```

### 4. Configure Services

Create `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### 5. Deploy Services

**Frontend:**

```bash
railway up --service frontend
```

**Backend:**

```bash
railway up --service backend
```

### 6. Set Environment Variables

```bash
# Add variables via Railway dashboard or CLI
railway variables set DATABASE_URL="postgresql://..."
railway variables set JWT_SECRET="your-secret"
```

## Database Setup

### Production Migration Workflow

1. **Make Schema Changes** (locally):

   ```bash
   # Edit prisma/schema.prisma
   npm run db:migrate -- --name your_change_name
   ```

2. **Commit Migration Files**:

   ```bash
   git add prisma/migrations
   git commit -m "Add migration: your_change_name"
   git push
   ```

3. **Deploy Migration** (production):
   ```bash
   DATABASE_URL="your-production-url" npx prisma migrate deploy
   ```

### Database Connection Pooling

For serverless deployments (Vercel, AWS Lambda), use connection pooling:

**Neon**: Use the pooled connection string (default)
**Supabase**: Use the "Transaction" pooling URL
**Railway**: Configure PgBouncer

Update `prisma/schema.prisma` for pooling:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL") // Optional: for migrations
}
```

## Environment Variables

### Required Variables

| Variable                  | Description                          | Example                               |
| ------------------------- | ------------------------------------ | ------------------------------------- |
| `DATABASE_URL`            | PostgreSQL connection string         | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET`              | Secret for JWT tokens (min 32 chars) | `your-super-secret-key-change-this`   |
| `FRONTEND_URL`            | Frontend URL for CORS                | `https://musicjam.vercel.app`         |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL                      | `https://musicjam.vercel.app/api`     |
| `NEXT_PUBLIC_APP_URL`     | App URL for metadata                 | `https://musicjam.vercel.app`         |

### Optional Variables

| Variable                 | Description         | Default         |
| ------------------------ | ------------------- | --------------- |
| `PORT`                   | Backend server port | `3001`          |
| `NODE_ENV`               | Environment         | `production`    |
| `SOCKET_PORT`            | Socket.IO port      | `3002`          |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO URL       | Same as backend |
| `JWT_EXPIRES_IN`         | JWT expiration      | `7d`            |

## Build Commands

Different platforms may require specific build commands:

**Vercel** (auto-detected):

```bash
npm run db:generate && npm run build
```

**Railway**:

```bash
# Frontend
npm run db:generate && npm run build:frontend

# Backend
npm run db:generate && npm run build:backend
```

**Generic**:

```bash
npm ci
npm run db:generate
npm run build
```

## Start Commands

**Frontend (Next.js)**:

```bash
npm run start:frontend
```

**Backend (Express)**:

```bash
npm run start:backend
```

**Both**:

```bash
npm run start
```

## Health Checks

### Frontend Health Check

```
GET https://your-app.vercel.app/
```

Expected: Next.js landing page

### Backend Health Check

```
GET https://your-app.vercel.app/api/health
```

Expected:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "uptime": 123.456
}
```

## Monitoring

### Logs

**Vercel**:

- Dashboard → Your Project → Logs
- Real-time function logs

**Railway**:

- Dashboard → Service → Logs
- `railway logs --service backend`

### Performance

**Vercel Analytics**:

```bash
npm install @vercel/analytics --workspace=@musicjam/frontend
```

Add to `apps/frontend/src/app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Rollback

### Vercel

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Railway

```bash
# Railway auto-keeps previous deployments
# Use dashboard to rollback
```

## Security Checklist

- [ ] `JWT_SECRET` is unique and >= 32 characters
- [ ] Database credentials are secure
- [ ] `DATABASE_URL` uses SSL (`?sslmode=require`)
- [ ] Environment variables are not committed to git
- [ ] CORS `FRONTEND_URL` is restricted to your domain
- [ ] Database has proper access controls
- [ ] API rate limiting is configured (future)

## Scaling Considerations

### Database

- Start with Neon/Supabase free tier
- Monitor connection count
- Enable connection pooling
- Consider read replicas for high traffic

### Frontend

- Vercel auto-scales
- Use Next.js Image optimization
- Enable caching headers
- Consider CDN for static assets

### Backend

- Vercel serverless auto-scales
- For persistent connections, use Railway/Render
- Consider Redis for session storage (future)
- Implement rate limiting

## Troubleshooting

### Build Fails

**Prisma client not generated**:

```bash
# Add to build command
npm run db:generate && npm run build
```

**Workspace not found**:

```bash
# Ensure package.json has workspaces field
# Run from root directory
```

### Database Connection Issues

**SSL Required**:

```
# Add to DATABASE_URL
?sslmode=require
```

**Too Many Connections**:

- Use connection pooling URL
- Reduce `connection_limit` in DATABASE_URL

**Connection Timeout**:

- Check database firewall rules
- Ensure proper network access

### Environment Variables Not Loading

**Vercel**:

- Variables must be set in dashboard
- Redeploy after adding variables
- `NEXT_PUBLIC_*` prefix required for client-side

**Railway**:

- Set per service
- Check service logs for errors

## Cost Estimates

### Hobby/Development

| Service         | Cost                   |
| --------------- | ---------------------- |
| Neon PostgreSQL | Free (0.5GB)           |
| Vercel          | Free (100GB bandwidth) |
| **Total**       | **$0/month**           |

### Production (Small)

| Service         | Cost                      |
| --------------- | ------------------------- |
| Neon PostgreSQL | $19/month (10GB)          |
| Vercel Pro      | $20/month (1TB bandwidth) |
| **Total**       | **~$40/month**            |

### Production (Medium)

| Service            | Cost              |
| ------------------ | ----------------- |
| Railway PostgreSQL | $5-20/month       |
| Railway Apps (2x)  | $10-30/month      |
| **Total**          | **~$40-50/month** |

## Support

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Railway**: [railway.app/help](https://railway.app/help)
- **Neon**: [neon.tech/docs](https://neon.tech/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)

## Further Reading

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Monorepo](https://vercel.com/docs/monorepos)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Railway Docs](https://docs.railway.app/)
