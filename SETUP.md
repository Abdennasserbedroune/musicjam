# Setup Guide: musicjam

This guide will walk you through setting up musicjam from scratch, including Supabase configuration and Vercel deployment.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Supabase Setup](#supabase-setup)
3. [Vercel Deployment](#vercel-deployment)
4. [Environment Variables](#environment-variables)

---

## Local Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- A Supabase account (free tier)
- A Vercel account (free tier)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd musicjam

# Install dependencies
npm install
```

### Step 2: Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

Don't worry - we'll get these values in the next section!

### Step 3: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app running.

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in the details:
   - **Project Name**: musicjam (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier works great for development
5. Click **"Create new project"** and wait 2-3 minutes for provisioning

### Step 2: Get Your API Keys

1. In your Supabase project dashboard, click **"Project Settings"** (gear icon)
2. Navigate to **"API"** in the sidebar
3. You'll see two important values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy these values into your `.env.local` file

### Step 3: Database Schema (Future)

When you're ready to add database tables for rooms, users, and playback state, you'll:

1. Use the **SQL Editor** in Supabase
2. Or use the **Table Editor** for a visual interface
3. Enable **Row Level Security (RLS)** for security
4. Set up **Real-time subscriptions** for live features

Example tables you'll need:
- `rooms` - Music jam room data
- `room_members` - Who's in each room
- `playback_state` - Current video and timestamp
- `messages` - Chat messages

### Step 4: Authentication Setup (Future)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable providers you want:
   - Email/Password (enabled by default)
   - Google, GitHub, etc. (optional)
3. Configure redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

---

## Vercel Deployment

### Step 1: Prepare Your Repository

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial musicjam setup"
   git push origin main
   ```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in (GitHub login recommended)
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings

### Step 3: Configure Environment Variables

In the Vercel project setup:

1. Expand **"Environment Variables"** section
2. Add your variables:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase project URL
   - Environments: Select all (Production, Preview, Development)
   
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon key
   - Environments: Select all

3. Click **"Deploy"**

### Step 4: Update Supabase with Vercel URL

1. After deployment, copy your Vercel URL (e.g., `your-app.vercel.app`)
2. Go back to Supabase → **Authentication** → **URL Configuration**
3. Add your Vercel URL to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

---

## Environment Variables

### Required Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key | Supabase Dashboard → Settings → API |

### Optional Variables (Future)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | For YouTube search and metadata |
| `SUPABASE_SERVICE_ROLE_KEY` | For admin operations (keep secret!) |

---

## Troubleshooting

### Common Issues

**Issue: "Invalid API key" error**
- Solution: Double-check your `.env.local` file has the correct Supabase keys
- Make sure there are no extra spaces or quotes around the values
- Restart your dev server after changing environment variables

**Issue: Can't connect to Supabase**
- Solution: Verify your Supabase project is active (not paused)
- Check that your keys are for the correct project
- Ensure you're using `NEXT_PUBLIC_` prefix (required for client-side access)

**Issue: Changes not reflecting on Vercel**
- Solution: Redeploy from Vercel dashboard
- Check that environment variables are set for all environments
- Clear Vercel cache and redeploy

**Issue: CORS errors**
- Solution: Add your domain to Supabase's allowed origins
- For development, `localhost:3000` should work by default

---

## Next Steps

Once you have the basic setup running:

1. **Design your database schema** in Supabase
2. **Set up authentication** flows
3. **Build out the room creation** and joining features
4. **Implement YouTube API** integration
5. **Add real-time subscriptions** for synchronized playback
6. **Build the chat system**

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## Need Help?

- Check the [README.md](./README.md) for project overview
- Review Supabase logs in the dashboard
- Check Vercel deployment logs
- Review browser console for client-side errors

---

Happy jamming! 🎵
