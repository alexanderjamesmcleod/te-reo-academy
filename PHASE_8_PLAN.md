# Phase 8: Advanced Features - Implementation Plan

**Created**: 2025-11-10
**Architecture**: Supabase-First (Frontend → Supabase)
**Status**: Planning

---

## 🎯 Overview

Phase 8 builds on the solid Supabase-first foundation established in Phases 1-7. All features leverage Supabase's built-in capabilities: RLS for security, Realtime for multiplayer, and PostgreSQL for analytics.

**Recommended Priority Order**:
1. **Challenge Editor** (Highest Impact) - Unlocks content creation velocity
2. **Enhanced Analytics** (High Value) - Improves retention and engagement
3. **Leaderboards** (Medium Effort) - Adds competitive motivation
4. **Multiplayer** (Already 60% complete!) - Tables exist, just need UI

---

## Feature 1: Challenge Editor 🎨

### Why This First?
- **Current bottleneck**: Creating 30 challenges required manual SQL editing
- **Impact**: 10x faster content creation (5 min vs 30+ min per challenge)
- **Foundation**: Enables teachers/admins to scale content without developer help

### Architecture

**Database Schema**: ✅ No changes needed! Challenges table already supports everything.

**Optional Enhancement**:
```sql
-- Add admin role to profiles (if not exists)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student'
CHECK (role IN ('student', 'admin', 'teacher'));
```

**RLS Policies**:
```sql
-- Admin read/write access
CREATE POLICY "Admins can manage challenges"
ON challenges FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role IN ('admin', 'teacher')
  )
);
```

### React Query Hooks

```typescript
// packages/frontend/src/hooks/useChallenges.ts (extend existing)

export function useCreateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challenge: NewChallenge) => {
      const { data, error } = await supabase
        .from('challenges')
        .insert(challenge)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('Challenge created successfully!');
    }
  });
}

export function useUpdateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateChallenge) => {
      const { data, error } = await supabase
        .from('challenges')
        .update(updates)
        .eq('challenge_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('Challenge updated!');
    }
  });
}
```

### Component Structure

```
packages/frontend/src/
├── pages/
│   ├── admin/
│   │   ├── ChallengeList.tsx        # List all challenges
│   │   ├── ChallengeEditor.tsx      # Create/Edit form
│   │   └── Dashboard.tsx            # Admin home
│   └── ...
├── components/
│   ├── admin/
│   │   ├── ChallengeForm.tsx        # Multi-step form
│   │   ├── WordSelector.tsx         # Word picker with search
│   │   ├── ChallengePreview.tsx     # Live preview
│   │   └── CardValidator.tsx        # Guarantee validation
│   └── ...
├── hooks/
│   ├── useChallenges.ts             # ✅ Exists, extend it
│   └── useAdmin.ts                  # New: Admin-specific hooks
└── layouts/
    └── AdminLayout.tsx               # New: Admin dashboard layout
```

### Implementation Tasks

| Task | Hours | Dependencies |
|------|-------|--------------|
| 1. Add admin role to profiles | 1 | None |
| 2. Create AdminLayout component | 2 | None |
| 3. Build ChallengeList page | 4 | AdminLayout |
| 4. Create ChallengeForm (multi-step) | 8 | None |
| 5. Build WordSelector component | 6 | wordLibrary.ts |
| 6. Add CardValidator component | 4 | Game logic |
| 7. ChallengePreview integration | 4 | Game components |
| 8. RLS policies + testing | 3 | None |
| **Total** | **32 hours** | **~1 week** |

---

## Feature 2: Enhanced Progress Analytics 📊

### Why This Matters?
- **Current state**: Basic is_completed tracking
- **Gap**: No streaks, time tracking, or detailed insights
- **Impact**: +20% retention through gamification

### Database Schema

```sql
-- Learning streaks (new table)
CREATE TABLE learning_streaks (
  streak_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhance lesson_attempts with timing
ALTER TABLE lesson_attempts
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS time_seconds INTEGER;

-- Achievement system
CREATE TABLE achievements (
  achievement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- 'first_lesson', 'module1_complete'
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Emoji
  category TEXT, -- 'completion', 'streak', 'accuracy'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_achievements (
  user_achievement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(achievement_id),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- RLS policies
CREATE POLICY "Users can read own streaks"
ON learning_streaks FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can read own achievements"
ON user_achievements FOR SELECT
TO authenticated
USING (user_id = auth.uid());
```

### Streak Update Function

```sql
CREATE OR REPLACE FUNCTION update_learning_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_last_activity DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
BEGIN
  SELECT last_activity_date, current_streak, longest_streak
  INTO v_last_activity, v_current_streak, v_longest_streak
  FROM learning_streaks
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    INSERT INTO learning_streaks (user_id, current_streak, longest_streak, last_activity_date)
    VALUES (p_user_id, 1, 1, CURRENT_DATE);
    RETURN;
  END IF;

  IF v_last_activity = CURRENT_DATE THEN
    RETURN; -- Already logged today
  END IF;

  IF v_last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
    v_current_streak := v_current_streak + 1;
    v_longest_streak := GREATEST(v_current_streak, v_longest_streak);
  ELSE
    v_current_streak := 1; -- Streak broken
  END IF;

  UPDATE learning_streaks
  SET current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_activity_date = CURRENT_DATE,
      updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### React Query Hooks

```typescript
// packages/frontend/src/hooks/useStreaks.ts

export function useStreak() {
  const { data: user } = useUser();

  return useQuery({
    queryKey: ['streak', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_streaks')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || { current_streak: 0, longest_streak: 0 };
    },
    enabled: !!user?.id
  });
}

export function useUpdateStreak() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.rpc('update_learning_streak', {
        p_user_id: userId
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streak'] });
    }
  });
}
```

### Component Structure

```
packages/frontend/src/
├── pages/
│   └── Analytics.tsx                # New: Student analytics page
├── components/
│   ├── analytics/
│   │   ├── StreakDisplay.tsx        # Streak visualization
│   │   ├── ProgressChart.tsx        # Charts with Recharts
│   │   ├── AchievementCard.tsx      # Achievement showcase
│   │   └── StatsOverview.tsx        # Summary cards
│   └── ...
└── hooks/
    ├── useStreaks.ts                # Streak queries
    └── useAchievements.ts           # Achievement queries
```

### Implementation Tasks

| Task | Hours | Dependencies |
|------|-------|--------------|
| 1. Create streaks table + function | 3 | None |
| 2. Create achievements tables | 2 | None |
| 3. Seed initial achievements | 2 | None |
| 4. Build useStreaks hook | 2 | None |
| 5. Create StreakDisplay component | 3 | Recharts |
| 6. Build Analytics page | 6 | Components |
| 7. Add achievement unlock triggers | 4 | SQL functions |
| 8. Add time tracking to attempts | 2 | useS saveProgress |
| **Total** | **24 hours** | **~3 days** |

---

## Feature 3: Leaderboards 🏆

### Why Leaderboards?
- **Motivation**: Competitive element drives engagement
- **Social**: See friends' progress
- **Low complexity**: Leverages existing data

### Database Schema

```sql
-- Privacy setting (add to profiles if not exists)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS show_on_leaderboard BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Materialized view for performance
CREATE MATERIALIZED VIEW leaderboard_global AS
SELECT
  p.user_id,
  COALESCE(p.display_name, SPLIT_PART(p.email, '@', 1)) as display_name,
  COUNT(DISTINCT up.lesson_id) FILTER (WHERE up.is_completed = true) as lessons_completed,
  COALESCE(ls.current_streak, 0) as current_streak,
  COALESCE(
    100.0 * SUM(CASE WHEN la.is_correct THEN 1 ELSE 0 END) / NULLIF(COUNT(la.*), 0),
    0
  ) as accuracy_percentage,
  MAX(up.updated_at) as last_activity
FROM profiles p
LEFT JOIN user_progress up ON p.user_id = up.user_id
LEFT JOIN lesson_attempts la ON p.user_id = la.user_id
LEFT JOIN learning_streaks ls ON p.user_id = ls.user_id
WHERE p.show_on_leaderboard = true
GROUP BY p.user_id, p.display_name, p.email, ls.current_streak;

CREATE UNIQUE INDEX idx_leaderboard_global_user ON leaderboard_global(user_id);

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_leaderboards()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_global;
END;
$$ LANGUAGE plpgsql;

-- RLS: Leaderboard is public (read-only)
ALTER MATERIALIZED VIEW leaderboard_global OWNER TO authenticated;
CREATE POLICY "Leaderboard is publicly readable"
ON leaderboard_global FOR SELECT
TO authenticated
USING (true);
```

### React Query Hooks

```typescript
// packages/frontend/src/hooks/useLeaderboard.ts

export function useLeaderboard(orderBy: 'lessons' | 'streak' | 'accuracy' = 'lessons') {
  return useQuery({
    queryKey: ['leaderboard', orderBy],
    queryFn: async () => {
      const orderColumn = {
        lessons: 'lessons_completed',
        streak: 'current_streak',
        accuracy: 'accuracy_percentage'
      }[orderBy];

      const { data, error } = await supabase
        .from('leaderboard_global')
        .select('*')
        .order(orderColumn, { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useUserRank(userId: string, orderBy: 'lessons' | 'streak' | 'accuracy') {
  return useQuery({
    queryKey: ['userRank', userId, orderBy],
    queryFn: async () => {
      // Get user's rank by counting users ahead
      const { data: user } = await supabase
        .from('leaderboard_global')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!user) return null;

      const orderColumn = {
        lessons: 'lessons_completed',
        streak: 'current_streak',
        accuracy: 'accuracy_percentage'
      }[orderBy];

      const { count } = await supabase
        .from('leaderboard_global')
        .select('*', { count: 'exact', head: true })
        .gt(orderColumn, user[orderColumn]);

      return {
        rank: (count || 0) + 1,
        stats: user
      };
    },
    enabled: !!userId
  });
}
```

### Implementation Tasks

| Task | Hours | Dependencies |
|------|-------|--------------|
| 1. Add privacy fields to profiles | 1 | None |
| 2. Create materialized view | 2 | Analytics tables |
| 3. Build useLeaderboard hooks | 3 | None |
| 4. Create Leaderboard page | 4 | None |
| 5. Add category tabs (lessons/streak/accuracy) | 2 | None |
| 6. Build UserRankCard component | 2 | None |
| 7. Add privacy toggle to settings | 2 | None |
| 8. Schedule view refresh (cron) | 1 | None |
| **Total** | **17 hours** | **~2 days** |

---

## Feature 4: Multiplayer Challenges 🎮

### Current State
✅ **60% Complete!** Database tables already exist:
- `game_sessions` (formerly multiplayer_games)
- `game_players`

### Missing Pieces
- Frontend UI (game lobby, room, realtime sync)
- Supabase Realtime subscriptions
- Game state management

### Architecture (Already Designed!)

**Database Schema**: ✅ Tables exist from Phase 1!

```sql
-- Verify existing tables
SELECT * FROM game_sessions; -- ✅
SELECT * FROM game_players;  -- ✅
```

**Add game participants tracking**:
```sql
CREATE TABLE IF NOT EXISTS game_participants (
  participant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES game_sessions(session_id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  score INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);
```

### Supabase Realtime Setup

```typescript
// packages/frontend/src/hooks/useGameSession.ts

export function useGameSession(sessionId: string) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);

  useEffect(() => {
    // Subscribe to game updates
    const channel = supabase
      .channel(`game:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          setSession(payload.new as GameSession);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_moves'
        },
        (payload) => {
          setMoves(prev => [...prev, payload.new as Move]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const submitMove = async (challengeId: string, userSentence: string, isCorrect: boolean) => {
    const { error } = await supabase
      .from('game_moves')
      .insert({
        session_id: sessionId,
        challenge_id: challengeId,
        user_sentence: userSentence,
        is_correct: isCorrect
      });

    if (error) throw error;
  };

  return { session, participants, moves, submitMove };
}
```

### Component Structure

```
packages/frontend/src/
├── pages/
│   └── multiplayer/
│       ├── Lobby.tsx                # Game room list
│       ├── Room.tsx                 # Live game room
│       └── Results.tsx              # Match results
├── components/
│   └── multiplayer/
│       ├── GameLobby.tsx            # Room browser
│       ├── CreateGameModal.tsx      # Create room
│       ├── GameBoard.tsx            # Live game UI
│       ├── OpponentProgress.tsx     # Opponent state
│       └── MatchResults.tsx         # End screen
└── hooks/
    ├── useGameSession.ts            # Realtime game hook
    ├── useGameLobby.ts              # Lobby queries
    └── useCreateGame.ts             # Create/join mutations
```

### Implementation Tasks

| Task | Hours | Dependencies |
|------|-------|--------------|
| 1. Create game_participants table | 1 | Existing tables |
| 2. Build useGameSession hook | 6 | Supabase Realtime |
| 3. Create Lobby page | 4 | None |
| 4. Build CreateGameModal | 3 | None |
| 5. Adapt LessonView for multiplayer | 6 | Game components |
| 6. Add OpponentProgress component | 4 | Realtime |
| 7. Build MatchResults component | 3 | None |
| 8. Test realtime sync (2 clients) | 4 | All above |
| 9. Handle edge cases (disconnect, etc) | 3 | None |
| **Total** | **34 hours** | **~1 week** |

---

## 📅 Implementation Roadmap

### Week 1: Challenge Editor
- **Goal**: Admins can create challenges without SQL
- **Deliverable**: Fully functional CRUD interface
- **Testing**: Create 5 new challenges via UI

### Week 2: Enhanced Analytics
- **Goal**: Students see streaks and achievements
- **Deliverable**: Analytics dashboard with charts
- **Testing**: Track 7-day streak, unlock 3 achievements

### Week 3: Leaderboards
- **Goal**: Global rankings go live
- **Deliverable**: Leaderboard page with privacy controls
- **Testing**: Verify top 100 rankings accuracy

### Week 4: Multiplayer
- **Goal**: 2-player live challenges work
- **Deliverable**: Lobby + game room with realtime sync
- **Testing**: Complete 5 multiplayer matches

---

## 🎯 Success Metrics

| Feature | Metric | Target |
|---------|--------|--------|
| **Challenge Editor** | Time to create challenge | <5 min (was 30+) |
| **Challenge Editor** | Challenges created/week | 10+ (was 2-3) |
| **Analytics** | Daily active users | +20% |
| **Analytics** | 7-day retention | +15% |
| **Leaderboards** | Participation rate | 40% opt-in |
| **Leaderboards** | Session duration | +10% |
| **Multiplayer** | Players trying feature | 30% |
| **Multiplayer** | Games per active player | 3+ |

---

## 🔧 Dependencies

### NPM Packages (New)
```json
{
  "dependencies": {
    "recharts": "^2.10.3",          // Charts for analytics
    "react-hook-form": "^7.49.2",   // Challenge editor forms
    "zod": "^3.22.4",               // Form validation
    "date-fns": "^3.0.6"            // Date handling
  }
}
```

### Supabase Configuration
- ✅ PostgreSQL (existing)
- ✅ RLS policies (existing pattern)
- ⚠️  **Realtime** (enable for multiplayer)
- ⚠️  **pg_cron** (optional, for leaderboard refresh)

### Environment Variables
```bash
# No new variables needed!
# Uses existing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

---

## ⚠️ Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Realtime complexity | High | Start with simple 1v1, test thoroughly |
| Leaderboard query performance | Medium | Materialized views + indexes |
| Achievement trigger bugs | Medium | Thorough testing, simple criteria first |
| Admin security | High | RLS policies, role verification |

---

## 🚀 Getting Started

### Phase 8 Kickoff Checklist

- [ ] Review this plan with stakeholders
- [ ] Install new dependencies (`recharts`, `react-hook-form`, `zod`, `date-fns`)
- [ ] Create Phase 8 branch: `git checkout -b phase-8-advanced-features`
- [ ] Set up admin role in profiles table
- [ ] Create AdminLayout component scaffold
- [ ] Begin Challenge Editor implementation

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/challenge-editor

# 2. Make changes, test locally
npm run dev

# 3. Run type check
npm run type-check

# 4. Commit and push
git add .
git commit -m "feat(admin): Add challenge editor"
git push origin feature/challenge-editor

# 5. Create PR, merge to phase-8 branch
```

---

## 📚 References

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [RLS Examples](https://supabase.com/docs/guides/auth/row-level-security)
- [Recharts Documentation](https://recharts.org/)
- [React Hook Form](https://react-hook-form.com/)

---

**Next Step**: Begin Week 1 - Challenge Editor implementation! 🚀

_Last Updated: 2025-11-10_
