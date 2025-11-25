#!/bin/bash
# Monorepo Validation Script
# Validates that the monorepo setup is correct

set -e

echo "🔍 Validating MusicJam Monorepo..."
echo ""

# Check directory structure
echo "✓ Checking directory structure..."
[ -d "apps/frontend" ] || { echo "❌ apps/frontend missing"; exit 1; }
[ -d "apps/backend" ] || { echo "❌ apps/backend missing"; exit 1; }
[ -d "prisma" ] || { echo "❌ prisma directory missing"; exit 1; }
echo "  ✅ Directory structure correct"
echo ""

# Check package.json files
echo "✓ Checking package.json files..."
[ -f "package.json" ] || { echo "❌ Root package.json missing"; exit 1; }
[ -f "apps/frontend/package.json" ] || { echo "❌ Frontend package.json missing"; exit 1; }
[ -f "apps/backend/package.json" ] || { echo "❌ Backend package.json missing"; exit 1; }
echo "  ✅ All package.json files present"
echo ""

# Check TypeScript configs
echo "✓ Checking TypeScript configuration..."
[ -f "tsconfig.base.json" ] || { echo "❌ tsconfig.base.json missing"; exit 1; }
[ -f "tsconfig.json" ] || { echo "❌ Root tsconfig.json missing"; exit 1; }
[ -f "apps/frontend/tsconfig.json" ] || { echo "❌ Frontend tsconfig.json missing"; exit 1; }
[ -f "apps/backend/tsconfig.json" ] || { echo "❌ Backend tsconfig.json missing"; exit 1; }
echo "  ✅ TypeScript configs present"
echo ""

# Check configuration files
echo "✓ Checking configuration files..."
[ -f "turbo.json" ] || { echo "❌ turbo.json missing"; exit 1; }
[ -f "vercel.json" ] || { echo "❌ vercel.json missing"; exit 1; }
[ -f "docker-compose.yml" ] || { echo "❌ docker-compose.yml missing"; exit 1; }
[ -f ".env.example" ] || { echo "❌ .env.example missing"; exit 1; }
echo "  ✅ Configuration files present"
echo ""

# Check backend source files
echo "✓ Checking backend source files..."
[ -f "apps/backend/src/index.ts" ] || { echo "❌ Backend index.ts missing"; exit 1; }
[ -f "apps/backend/src/routes/health.ts" ] || { echo "❌ Backend health route missing"; exit 1; }
echo "  ✅ Backend source files present"
echo ""

# Check documentation
echo "✓ Checking documentation..."
[ -f "README.md" ] || { echo "❌ README.md missing"; exit 1; }
[ -f "QUICKSTART.md" ] || { echo "❌ QUICKSTART.md missing"; exit 1; }
[ -f "DEPLOYMENT.md" ] || { echo "❌ DEPLOYMENT.md missing"; exit 1; }
[ -f "MONOREPO_MIGRATION.md" ] || { echo "❌ MONOREPO_MIGRATION.md missing"; exit 1; }
echo "  ✅ Documentation complete"
echo ""

# Check Prisma
echo "✓ Checking Prisma setup..."
[ -f "prisma/schema.prisma" ] || { echo "❌ Prisma schema missing"; exit 1; }
grep -q "postgresql" prisma/schema.prisma || { echo "❌ Database not set to PostgreSQL"; exit 1; }
echo "  ✅ Prisma configured for PostgreSQL"
echo ""

# Check node_modules
echo "✓ Checking dependencies..."
[ -d "node_modules" ] || { echo "⚠️  Root node_modules not installed (run: npm install)"; }
[ -d "apps/frontend/node_modules" ] || echo "  ℹ️  Frontend node_modules missing (will be created by workspace)"
[ -d "apps/backend/node_modules" ] || echo "  ℹ️  Backend node_modules missing (will be created by workspace)"
[ -d "node_modules/@prisma/client" ] || { echo "⚠️  Prisma client not generated (run: npm run db:generate)"; }
echo "  ✅ Dependencies structure correct"
echo ""

# Check workspace configuration
echo "✓ Checking workspace configuration..."
grep -q '"workspaces"' package.json || { echo "❌ Workspaces not configured in root package.json"; exit 1; }
grep -q '"@musicjam/frontend"' apps/frontend/package.json || { echo "❌ Frontend package name incorrect"; exit 1; }
grep -q '"@musicjam/backend"' apps/backend/package.json || { echo "❌ Backend package name incorrect"; exit 1; }
echo "  ✅ Workspaces configured correctly"
echo ""

echo "🎉 Validation complete! Monorepo structure is correct."
echo ""
echo "📋 Summary:"
echo "  • Root workspace: ✅"
echo "  • Frontend app: ✅"
echo "  • Backend app: ✅"
echo "  • Prisma setup: ✅"
echo "  • Configuration: ✅"
echo "  • Documentation: ✅"
echo ""
echo "🚀 Next steps:"
echo "  1. Ensure dependencies are installed: npm install"
echo "  2. Generate Prisma client: npm run db:generate"
echo "  3. Start PostgreSQL: npm run docker:up"
echo "  4. Run migrations: npm run db:migrate"
echo "  5. Start development: npm run dev"
echo ""
