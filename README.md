# Project Backend

A lightweight Express backend skeleton configured for local development.

## Quickstart

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template and adjust values as needed:
   ```bash
   cp .env.example .env
   ```
3. Run the database migrations to set up the local SQLite database:
   ```bash
   npm run migrate
   ```
4. Seed the database with demo data:
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

The server listens on the port defined in your `.env` file (defaults to `3000`).

## Database

Prisma is configured to use SQLite with the connection string defined in `DATABASE_URL`. Running the migrations will create `dev.db` in the project root, and the seed script will insert a user, project, and track for quick testing.

## Available scripts

- `npm run dev` &mdash; start the server in watch mode with nodemon.
- `npm start` &mdash; start the server with Node.js.
- `npm run lint` &mdash; run ESLint across the project.
- `npm run format` &mdash; format files with Prettier.
- `npm run migrate` &mdash; run Prisma migrations (`prisma migrate dev --name init`).
- `npm run generate` &mdash; regenerate the Prisma client.
- `npm run seed` &mdash; populate the database with demo data.

## Endpoints

- `GET /health` &mdash; health check endpoint returning `{ "status": "ok" }`.
