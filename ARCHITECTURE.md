# Te Reo Academy - Architecture Documentation

**Date:** 2025-11-09  
**Architecture:** Supabase-First (Frontend → Supabase)

---

## 🎯 Overview

Te Reo Academy is a comprehensive platform for learning Te Reo Māori through interactive card-based games, with built-in progress tracking, multiplayer capabilities, and future NZSL (New Zealand Sign Language) integration.

**Vision:** Tri-lingual learning platform (Te Reo Māori + English + NZSL)

---

## 🏗️ Architecture Decision: Supabase-First

### Why Supabase?

**Previous Plan:** React → Express → Prisma → PostgreSQL  
**Current Architecture:** React → Supabase Client → Supabase

### Benefits

- ✅ **70% less code** - No custom API layer
- ✅ **Built-in Auth** - JWT, email, OAuth ready
- ✅ **Realtime** - Multiplayer without Socket.io
- ✅ **Storage** - Ready for NZSL videos
- ✅ **RLS Security** - Database-level authorization
- ✅ **Auto APIs** - REST + GraphQL included
- ✅ **Local Dev** - Full Supabase stack in Docker
- ✅ **Scalability** - Managed infrastructure

---

## 📦 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI framework & build tool |
| **Language** | TypeScript | Type safety across stack |
| **Database** | Supabase PostgreSQL | Data storage |
| **Auth** | Supabase Auth | JWT + social providers |
| **Realtime** | Supabase Realtime | Live multiplayer updates |
| **Storage** | Supabase Storage | NZSL video hosting (Phase 4) |
| **Validation** | Shared TS Package | Pure function validators |
| **Styling** | TailwindCSS | Utility-first CSS |
| **Deployment** | Docker + Portainer | Container orchestration |

---

## 📁 Project Structure

```
te-reo-academy-prod/
├── packages/
│   ├── shared/                  # Shared TypeScript code
│   │   ├── src/
│   │   │   ├── types/           # TypeScript interfaces
│   │   │   │   ├── user.types.ts
│   │   │   │   ├── progress.types.ts
│   │   │   │   ├── lesson.types.ts
│   │   │   │   ├── game.types.ts
│   │   │   │   └── validation.types.ts
│   │   │   ├── validators/      # Sentence validators
│   │   │   │   ├── koValidator.ts       (✅ Ported)
│   │   │   │   ├── heValidator.ts       (✅ Ported)
│   │   │   │   ├── equativeValidator.ts (✅ Ported)
│   │   │   │   └── keiTeValidator.ts    (✅ Ported)
│   │   │   ├── data/            # Word library & modules
│   │   │   │   ├── wordLibrary.ts       (⏳ To port)
│   │   │   │   ├── module1.ts           (⏳ To port)
│   │   │   │   └── module2.ts           (⏳ To port)
│   │   │   └── constants/
│   │   │       ├── colors.ts
│   │   │       └── patterns.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/                # React application
│       ├── src/
│       │   ├── lib/
│       │   │   └── supabase.ts          # Supabase client
│       │   ├── hooks/
│       │   │   ├── useAuth.ts           # Auth hooks
│       │   │   ├── useProgress.ts       # Progress tracking
│       │   │   └── useLessons.ts        # Lesson queries
│       │   ├── components/
│       │   │   ├── Card/                # Card components
│       │   │   ├── Game/                # Game logic
│       │   │   └── Layout/              # Layout components
│       │   ├── pages/
│       │   │   ├── Login.tsx
│       │   │   ├── Dashboard.tsx
│       │   │   ├── Lesson.tsx
│       │   │   └── Multiplayer.tsx
│       │   └── main.tsx
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
│
├── supabase/                    # Database configuration
│   ├── config.toml              # Local dev config
│   ├── seed.sql                 # Initial data
│   └── migrations/
│       └── 20250109000001_initial_schema.sql
│
├── docker-compose.yml           # Frontend container
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🗄️ Database Schema

### Tables

1. **profiles** - User profiles (extends auth.users)
   - Stores username, full_name, avatar_url
   - Auto-created on signup via trigger

2. **modules** - Learning modules
   - Module 1: Ko Sentences
   - Module 2: Kei te Present Tense

3. **lessons** - Individual lessons
   - Types: tutorial, practice, challenge, test
   - Ordered within modules

4. **challenges** - Sentence-building challenges
   - Pattern type (ko, he, equative, kei_te)
   - Target sentences with hints
   - NZSL fields ready for Phase 4

5. **user_progress** - Progress tracking
   - Per-lesson status (not_started, in_progress, completed)
   - Score and attempt tracking

6. **lesson_attempts** - Detailed history
   - Stores each attempt as JSONB
   - Time tracking for analytics

7. **multiplayer_games** - Game sessions (future)
   - Realtime and turn-based modes
   - Game state management

8. **game_players** - Player participation
   - Links users to games
   - Score tracking per player

### Row Level Security (RLS)

All tables have RLS policies:
- ✅ Users can only access their own data
- ✅ Public content (modules, lessons) readable by all
- ✅ Multiplayer games visible to participants only

### Functions & Triggers

- **handle_new_user()** - Auto-creates profile on signup
- **handle_updated_at()** - Auto-updates timestamps
- Indexes on all foreign keys for performance

---

## 🔐 Authentication Flow

```typescript
// Sign up (auto-creates profile)
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    data: { full_name: 'User Name' }
  }
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
})

// Get session
const { data: { user } } = await supabase.auth.getUser()

// Sign out
await supabase.auth.signOut()
```

---

## 📊 Data Access Patterns

### Query Examples

```typescript
// Get all modules with lessons
const { data } = await supabase
  .from('modules')
  .select('*, lessons(*)')
  .order('order_index')

// Get user progress (RLS auto-filters by user_id)
const { data } = await supabase
  .from('user_progress')
  .select('*, lessons(*, modules(*))')
  .eq('status', 'completed')

// Update progress
await supabase
  .from('user_progress')
  .upsert({
    user_id: userId,
    lesson_id: lessonId,
    status: 'completed',
    score: 95,
    completed_at: new Date().toISOString()
  })

// Record attempt
await supabase
  .from('lesson_attempts')
  .insert({
    user_id: userId,
    lesson_id: lessonId,
    challenge_id: challengeId,
    user_answer: cards, // JSONB
    is_correct: true,
    time_taken_ms: 5400
  })
```

### Realtime Subscriptions

```typescript
// Subscribe to multiplayer game updates
const channel = supabase
  .channel('game-room-123')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'game_players',
    filter: `game_id=eq.${gameId}`
  }, (payload) => {
    console.log('Player action:', payload)
  })
  .subscribe()

// Cleanup
channel.unsubscribe()
```

---

## 🎮 Game Logic Architecture

### Validators (Pure Functions)

All validators follow the same pattern:

```typescript
// Main validator
export function validateXxxSentence(
  cards: Card[],
  challenge: Challenge | null
): ValidationResult

// Pattern checker
export function isXxxPattern(cards: Card[]): boolean

// Hint generator
export function getXxxHint(cards: Card[]): string | null
```

**Benefits:**
- ✅ Client-side validation (instant feedback)
- ✅ Pure functions (easy to test)
- ✅ Reusable across frontend
- ✅ Can be called server-side if needed (PostgreSQL functions)

### Validators Completed

1. **koValidator.ts** - Ko + te/ngā + noun
   - 3-4 card sentences
   - Handles demonstratives (tēnei, tēnā, tērā)

2. **heValidator.ts** - He + noun (classification)
   - 2-3 card sentences
   - Enforces no articles after He

3. **equativeValidator.ts** - Ko + pronoun + te/ngā + noun
   - Exactly 4 cards
   - Handles all pronouns including dual (tāua, rāua)

4. **keiTeValidator.ts** - Kei te + verb/adjective
   - 3, 4, or 5 card patterns
   - Verb conjugation (makeVerbContinuous)
   - Intensifiers (tino, āhua)
   - Location markers (i, ki)

---

## 🚀 Development Workflow

### Local Setup

```bash
# 1. Install dependencies
npm install
npm install -g supabase

# 2. Start Supabase
npm run supabase:start

# 3. Configure frontend
cd packages/frontend
cp .env.example .env
# Add SUPABASE_URL and SUPABASE_ANON_KEY

# 4. Run dev server
npm run dev
```

### Available Commands

```bash
# Supabase
npm run supabase:start   # Start local Supabase
npm run supabase:stop    # Stop Supabase
npm run supabase:reset   # Reset database
npm run supabase:status  # Check services

# Docker
npm run docker:build     # Build containers
npm run docker:up        # Start with Portainer
npm run docker:down      # Stop containers
npm run docker:logs      # View logs

# Development
npm run dev              # Start frontend
npm run build            # Build all packages
npm test                 # Run tests
```

---

## 🌏 NZSL Integration (Phase 4)

### Data Structure Ready

All card/challenge data includes NZSL fields:

```typescript
interface Card {
  maori: string
  english: string
  type: string
  nzsl_video_url?: string       // Ready for Phase 4
  nzsl_description?: string     // Accessibility text
}

interface Challenge {
  target_maori: string
  target_english: string
  target_nzsl_video_url?: string
  target_nzsl_description?: string
}
```

### Storage Setup

Supabase Storage configured for video files:
- Bucket: `nzsl-videos`
- Public access for educational content
- CDN delivery for performance

### Implementation Plan

1. **Community Consultation** - Partner with Deaf community
2. **Content Creation** - Record NZSL videos with experts
3. **UI Enhancement** - Video player components
4. **Accessibility** - Captions, descriptions, keyboard nav

---

## 🐳 Docker Deployment

### Development

```bash
# Terminal 1: Supabase
npm run supabase:start

# Terminal 2: Frontend
npm run dev
```

### Production

```bash
# 1. Build frontend container
npm run docker:build

# 2. Start with Portainer
npm run docker:up

# 3. Monitor
npm run docker:logs
```

### docker-compose.yml

- Frontend container (Nginx serving React build)
- Connects to external Supabase instance
- Managed via Portainer

---

## 📈 Scalability

### Performance Optimizations

- ✅ Database indexes on all foreign keys
- ✅ RLS policies prevent over-fetching
- ✅ Supabase CDN for static assets
- ✅ PostgreSQL connection pooling
- ✅ Client-side validation (reduces DB load)

### Future Considerations

- Redis caching for leaderboards
- Read replicas for analytics queries
- Edge functions for complex logic
- CDN for NZSL videos

---

## 🔄 Migration from V3

### Porting Strategy

1. **Validators** ✅ - Complete (all 4 ported)
2. **Data files** ⏳ - Next (wordLibrary, modules)
3. **Components** ⏳ - Card, Game, UI
4. **Tests** ⏳ - Jest → Vitest migration
5. **Styling** ⏳ - CSS → TailwindCSS

### Maintaining V3

- V3 remains stable in `te-reo-card-game/`
- Production project in `te-reo-academy-prod/`
- Clean separation, no breaking changes to V3

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React 18 Docs](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [TailwindCSS](https://tailwindcss.com)

---

**Status:** Architecture complete, validators ported, ready for frontend setup! 🚀
