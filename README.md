# Te Reo Academy - Production Platform

A full-stack, production-ready te reo Māori learning platform with multiplayer capabilities, progress tracking, and comprehensive analytics.

## � Vision: Tri-Lingual Learning Platform

**Building THE comprehensive language learning platform that serves all New Zealanders:**

### Three Languages, One Platform 🤟
- 🇳🇿 **Te Reo Māori** - Learn Aotearoa's indigenous language
- 🏴 **English** - Clear translations and explanations
- 🤟 **NZSL** - New Zealand Sign Language (Phase 4)

### Why This Matters
- **Inclusive Education** - Accessible to Deaf and hard-of-hearing learners
- **Cultural Bridge** - Connects Māori and Deaf communities
- **First of Its Kind** - Pioneering tri-lingual educational tool
- **Community-Driven** - Built WITH communities, not just FOR them

### Our Commitment
- ✅ Build with accessibility from day one
- ✅ Data structures ready for NZSL integration
- ✅ Community consultation central to process
- ✅ Respect for both Māori and Deaf cultures
- ✅ "Nothing about us without us" - authentic partnerships

**Note:** NZSL integration (Phase 4) will be added after community partnerships are established and permissions secured. The technical foundation is being built now.

## �🏗️ Architecture

This is a monorepo containing:
- **Frontend**: React + Vite + TypeScript application with TanStack Query
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Shared**: Common validators, types, and data structures

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui
- **State Management**: Zustand for local state, TanStack Query for server state
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with JWT tokens
- **Real-time**: Supabase Realtime for multiplayer features
- **Testing**: Vitest + React Testing Library

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm 10+

### Installation

```bash
# Install all dependencies
npm install

# Setup environment variables
### Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Start Supabase locally (first time)
supabase start

# This will output:
# - API URL: http://localhost:54321
# - DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# - Studio URL: http://localhost:54323
# - anon key: eyJ...
# - service_role key: eyJ...

# 3. Create .env.local file in packages/frontend
cd packages/frontend
cat > .env.local << EOF
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_ANON_KEY=<your-anon-key-from-step-2>
EOF

# 4. Start frontend development server
npm run dev

# 5. Access the app
# Frontend: http://localhost:5173
# Supabase Studio: http://localhost:54323
```

### Docker Production Setup

```bash
# Build and run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## Project Structure

```
te-reo-academy-prod/
├── packages/
│   ├── shared/          # Shared TypeScript types, validators & data
│   │   ├── src/
│   │   │   ├── types/       # TypeScript interfaces
│   │   │   ├── validators/  # Sentence validators
│   │   │   ├── data/        # Word library, modules
│   │   │   └── constants/   # Colors, patterns
│   │   └── package.json
│   └── frontend/        # React + Vite + Supabase client
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── hooks/       # Custom hooks (useSupabase, etc.)
│       │   ├── lib/         # Supabase client setup
│       │   └── pages/       # Route pages
│       ├── Dockerfile
│       └── package.json
├── supabase/            # Supabase configuration
│   ├── migrations/      # Database schema migrations
│   ├── seed.sql         # Initial data
│   └── config.toml      # Supabase config
├── docker-compose.yml   # Docker orchestration
├── package.json         # Root workspace config
└── README.md
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific package
npm test --workspace=@te-reo-academy/shared
npm test --workspace=@te-reo-academy/frontend
```

## 📚 Supabase Commands

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset database (WARNING: deletes all data)
supabase db reset

# Create new migration
supabase migration new <migration_name>

# Apply migrations
supabase db push

# Access Supabase Studio
# Open http://localhost:54323 in browser
```

## 📚 Documentation

- [Setup Complete Guide](./SETUP_COMPLETE.md)
- [NZSL Integration Guide](./NZSL_INTEGRATION_GUIDE.md)
- [Quick Reference](./QUICK_REFERENCE.md)

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Axios
- Socket.io-client
- Recharts

### Backend
- Node.js + TypeScript
- Express
- Prisma
- PostgreSQL
- Socket.io
- JWT Authentication

### Shared
- TypeScript
- Te Reo validators (ported from v3)
- Word library and curriculum data

## 📝 License

MIT

## 🤝 Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for development guidelines.
