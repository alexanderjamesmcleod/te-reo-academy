# Handoff to Claude Code

## 🎯 Current Status

**Architecture Complete ✅**
- Supabase-first architecture (no Express backend needed)
- Complete database schema with RLS policies in `supabase/migrations/`
- Monorepo structure with npm workspaces
- GitHub repo: https://github.com/alexanderjamesmcleod/te-reo-academy

**Shared Package Complete ✅**
- All 4 validators ported from v3 (ko, he, equative, keiTe)
- Complete TypeScript types aligned with Supabase schema
- Word library (50+ words with NZSL placeholders)
- Curriculum data (Module 1 & 2, 7 lessons, 8 sample challenges)

## 🚀 Your Mission: Build the Frontend

### Phase 1: Initialize React + Vite Frontend
**Location**: `packages/frontend/`

**Tasks**:
1. Initialize Vite project with React + TypeScript template
2. Install dependencies:
   ```bash
   npm install @supabase/supabase-js
   npm install react-router-dom
   npm install @tanstack/react-query
   npm install zustand
   ```
3. Install dev dependencies:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npm install -D @types/react @types/react-dom
   ```
4. Configure Tailwind CSS
5. Update `packages/frontend/package.json` to use shared package:
   ```json
   {
     "dependencies": {
       "@te-reo-academy/shared": "workspace:*"
     }
   }
   ```

### Phase 2: Supabase Client Setup

**Create**: `packages/frontend/src/lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@te-reo-academy/shared'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

**Create**: `packages/frontend/.env.local`
```bash
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<from_supabase_start>
```

### Phase 3: Authentication Pages

**Create**:
- `src/pages/Login.tsx` - Login form with Supabase Auth
- `src/pages/Signup.tsx` - Signup form
- `src/hooks/useAuth.ts` - Custom hook for auth state
- `src/contexts/AuthContext.tsx` - Auth context provider

**Reference**: Use Supabase Auth helpers:
```typescript
import { supabase } from '@/lib/supabase'

// Sign up
const { data, error } = await supabase.auth.signUp({
  email,
  password,
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

// Sign out
await supabase.auth.signOut()

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  // Handle auth state
})
```

### Phase 4: Core Game Components (Port from v3)

**Source**: `/home/alex/Claude/AI-Projects/kemu/te-reo-card-game/src/`

**Port these components** (in order):
1. **Card Component** (`src/game/Card.jsx` → `src/components/game/Card.tsx`)
   - Visual card representation
   - Drag/drop functionality
   - Color coding by word type

2. **CardHand Component** (`src/game/CardHand.jsx` → `src/components/game/CardHand.tsx`)
   - Player's hand of cards
   - Card selection logic

3. **SentenceBuilder Component** (`src/game/SentenceBuilder.jsx` → `src/components/game/SentenceBuilder.tsx`)
   - Drop zone for building sentences
   - Integration with validators from shared package

4. **GameBoard Component** (`src/game/GameBoard.jsx` → `src/components/game/GameBoard.tsx`)
   - Main game container
   - Challenge display
   - Validation feedback

**Key Integration**:
```typescript
import { validateKoSentence, validateHeSentence } from '@te-reo-academy/shared'

// In component
const result = validateKoSentence(cards, challenge)
```

### Phase 5: Routing & Layout

**Create**:
- `src/App.tsx` - Main app with React Router
- `src/layouts/DashboardLayout.tsx` - Protected route layout
- `src/pages/Dashboard.tsx` - User dashboard
- `src/pages/LessonView.tsx` - Individual lesson player
- `src/pages/ModuleView.tsx` - Module overview

**Routes**:
```typescript
<Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  
  {/* Protected routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/modules/:moduleId" element={<ModuleView />} />
    <Route path="/lessons/:lessonId" element={<LessonView />} />
  </Route>
</Routes>
```

### Phase 6: Data Fetching with React Query

**Create**: `src/hooks/useLessons.ts`
```typescript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useLessons(moduleId: string) {
  return useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index')
      
      if (error) throw error
      return data
    }
  })
}
```

**Similar hooks**:
- `useModules.ts` - Fetch all modules
- `useProgress.ts` - Fetch user progress
- `useChallenges.ts` - Fetch lesson challenges

## 🧪 Testing Strategy

### Local Supabase Testing
1. Start Supabase:
   ```bash
   cd /home/alex/Claude/AI-Projects/kemu/te-reo-academy-prod
   supabase start
   ```

2. Run migrations:
   ```bash
   supabase db reset
   ```

3. Seed data:
   ```bash
   supabase db seed
   ```

4. Get local credentials:
   ```bash
   supabase status
   ```

### Frontend Development
```bash
cd packages/frontend
npm run dev
```

## 📚 Reference Materials

### V3 Source (Working Code)
- **Location**: `/home/alex/Claude/AI-Projects/kemu/te-reo-card-game/`
- **Key Files**:
  - `src/game/` - All game components (PROVEN TO WORK)
  - `src/components/` - Reusable UI components
  - `src/hooks/` - Custom hooks
  - `src/styles/` - Tailwind configuration

### Shared Package (Use These!)
- **Validators**: `@te-reo-academy/shared` - All validators are TypeScript, fully tested
- **Types**: Import from shared package for type safety
- **Data**: Word library and curriculum already ported

### Supabase Resources
- Local dashboard: http://localhost:54323
- Database migrations: `supabase/migrations/`
- RLS policies: Already configured in schema
- Auth: JWT-based, no custom backend needed

## 🎯 Success Criteria

**Phase 1 Complete**:
- [ ] React app running on `http://localhost:5173`
- [ ] Supabase client configured
- [ ] Can connect to local Supabase instance

**Phase 2 Complete**:
- [ ] User can sign up
- [ ] User can log in
- [ ] User can log out
- [ ] Auth state persists on refresh

**Phase 3 Complete**:
- [ ] Dashboard shows modules from Supabase
- [ ] Can navigate to lessons
- [ ] Game components render cards correctly
- [ ] Validators work (sentence validation)

**Phase 4 Complete**:
- [ ] Can complete a full lesson
- [ ] Progress saves to Supabase
- [ ] All 4 sentence patterns work (Ko, He, Equative, Kei te)

## 🚨 Important Notes

### Database Types
Generate Supabase types for TypeScript:
```bash
supabase gen types typescript --local > packages/shared/src/types/database.types.ts
```

### Environment Variables
The user has Docker + Portainer + local Supabase already running!
- Supabase is at `http://localhost:54321`
- Don't try to install Supabase, it's already there

### Word Library
All words have NZSL placeholders:
```typescript
{
  nzsl_video_url: "/videos/nzsl/kuia.mp4",
  nzsl_description: "Hands form respectful greeting gesture"
}
```
These are ready for Phase 4 (NZSL integration) - don't implement yet, just preserve the fields.

## 💡 Architectural Decisions (Context)

### Why Supabase-first?
- User already runs local Supabase
- No need for Express backend
- RLS handles all authorization
- Realtime for multiplayer (Phase 3)
- Storage for NZSL videos (Phase 4)

### Why Monorepo?
- Shared validators used by frontend AND Supabase functions
- Shared types ensure DB/frontend alignment
- Easy to add mobile app later (`packages/mobile/`)

### Why Port from V3?
- V3 has 198 passing tests
- Game mechanics are PROVEN
- Just need to:
  1. Convert JSX → TSX
  2. Add Supabase integration
  3. Improve UX with Tailwind

## 🤝 Communication Protocol

### When to Ask Me (Chat)
- Architectural questions (should this be a hook? context? state?)
- Supabase query patterns (RLS, relationships, subscriptions)
- Where to find specific v3 code
- TypeScript type questions

### What You Can Build Independently
- Component structure
- UI layout with Tailwind
- React Router setup
- Form handling
- Error boundaries
- Loading states

### Regular Check-ins
After each phase:
1. Commit your work
2. Push to GitHub
3. Ask: "Phase X complete, ready for review?"
4. I'll test, provide feedback, guide next phase

## 🎉 Let's Build!

You're starting with a **rock-solid foundation**:
- ✅ Database schema battle-tested
- ✅ All validators ported and typed
- ✅ Curriculum data complete
- ✅ Architecture decisions made

Your job: **Make it beautiful and interactive!**

Start with Phase 1 (Vite + React setup) and let me know when you're ready for Phase 2.

Good luck! 🚀
