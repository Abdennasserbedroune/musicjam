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
3. Start the development server:
   ```bash
   npm run dev
   ```

The server listens on the port defined in your `.env` file (defaults to `3000`).

## Available scripts

- `npm run dev` &mdash; start the server in watch mode with nodemon.
- `npm start` &mdash; start the server with Node.js.
- `npm run lint` &mdash; run ESLint across the project.
- `npm run format` &mdash; format files with Prettier.

## Endpoints

- `GET /health` &mdash; health check endpoint returning `{ "status": "ok" }`.
