# Project Backend

A lightweight Express backend skeleton configured for local development.

## Quickstart

1. Copy the environment template and adjust the values if needed:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Apply the database migrations to create the local SQLite database:
   ```bash
   npx prisma migrate dev
   ```
4. Seed the database with demo data:
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open the interactive API explorer at [http://localhost:3000/docs](http://localhost:3000/docs) to review available endpoints, schemas, and example payloads. The raw OpenAPI document is also available at [http://localhost:3000/docs.json](http://localhost:3000/docs.json).

Keep the server running while you experiment with the endpoints. The flow below demonstrates the core features end-to-end.

### Demo curl flow

```bash
# Health check
curl http://localhost:3000/health

# Sign up a new user
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'

# Log in and capture the returned token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}' | jq -r '.token')

echo "Token: $TOKEN"

# Create a project
curl -X POST http://localhost:3000/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My First Project"}'

# List projects
curl http://localhost:3000/projects \
  -H "Authorization: Bearer $TOKEN"
```

Replace the email address if you re-run the flow, and ensure `jq` is installed to capture the token from the login response.

## API documentation

- Interactive Swagger UI: [http://localhost:3000/docs](http://localhost:3000/docs)
- OpenAPI JSON: [http://localhost:3000/docs.json](http://localhost:3000/docs.json)

The documentation covers health, authentication, project, track, and upload endpoints with example payloads to speed up demos.

## Testing

Run the Jest test suite (uses an isolated SQLite database) with:

```bash
npm test
```

## Available scripts

- `npm run dev` — start the server in watch mode with nodemon.
- `npm start` — start the server with Node.js.
- `npm run lint` — run ESLint across the project.
- `npm run format` — format files with Prettier.
- `npm run migrate` — run Prisma migrations (`prisma migrate dev --name init`).
- `npm run generate` — regenerate the Prisma client.
- `npm run seed` — populate the database with demo data.
- `npm test` — run the Jest test suite.
- `npm run test:watch` — run tests in watch mode.

## Database

Prisma is configured to use SQLite with the connection string defined in `DATABASE_URL`. Running the migrations will create `dev.db` in the project root (ignored by Git), and the seed script inserts a user, project, and track for quick testing.
