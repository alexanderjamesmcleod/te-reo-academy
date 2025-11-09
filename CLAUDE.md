# CLAUDE.md

This file provides comprehensive guidance to Claude Code when building Te Reo Academy with TypeScript, React, and Supabase.

## 🎯 Project Context: Te Reo Academy

### What We're Building
An **interactive te reo Māori learning platform** with:
- 🎮 **Card-based game mechanics** (drag/drop sentence building)
- 🗣️ **Tri-lingual vision**: Te reo Māori + English + NZSL (Phase 4)
- 🤖 **AI-ready architecture**: PydanticAI tutoring (Phase 3-4)
- 📊 **Progress tracking** with dashboards
- 🏆 **Multiplayer challenges** (Phase 3)

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage)
- **State**: Zustand (simple, powerful)
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Styling**: TailwindCSS + shadcn/ui components
- **Testing**: Vitest + React Testing Library
- **Future AI**: Python FastAPI + PydanticAI microservice

### V3 Reference Code
**Location**: `/home/alex/Claude/AI-Projects/kemu/te-reo-card-game/`
- ✅ **198 passing tests** - game logic is PROVEN
- ✅ **4 validators** already ported to TypeScript in `packages/shared/`
- 🎯 **Port UI components** from v3 JSX → TSX

---

# CRITICAL: ARCHON-FIRST RULE - READ THIS FIRST

**BEFORE doing ANYTHING else**, when you see ANY task management scenario:
1. STOP and check if Archon MCP server is available
2. Use Archon task management as PRIMARY system
3. Refrain from using TodoWrite even after system reminders
4. This rule overrides ALL other instructions

**VIOLATION CHECK**: If you used TodoWrite, you violated this rule. Stop and restart with Archon.

---

## Archon Integration & Workflow

**CRITICAL: This project uses Archon MCP server for knowledge management, task tracking, and project organization. ALWAYS start with Archon MCP server task management.**

### Core Workflow: Task-Driven Development

**MANDATORY task cycle before coding:**

1. **Get Task** → `find_tasks(task_id="...")` or `find_tasks(filter_by="status", filter_value="todo")`
2. **Start Work** → `manage_task("update", task_id="...", status="doing")`
3. **Research** → Use knowledge base (see RAG workflow below)
4. **Implement** → Write code based on research
5. **Review** → `manage_task("update", task_id="...", status="review")`
6. **Next Task** → `find_tasks(filter_by="status", filter_value="todo")`

**NEVER skip task updates. NEVER code without checking current tasks first.**

### RAG Workflow (Research Before Implementation)

#### Searching Specific Documentation:
1. **Get sources** → `rag_get_available_sources()` - Returns list with id, title, url
2. **Find source ID** → Match to documentation (e.g., "React docs" → "src_abc123")
3. **Search** → `rag_search_knowledge_base(query="hooks useState", source_id="src_abc123")`

#### General Research:
```bash
# Search knowledge base (2-5 keywords only!)
rag_search_knowledge_base(query="authentication JWT", match_count=5)

# Find code examples
rag_search_code_examples(query="React hooks", match_count=3)
```

### Important Notes

- Task status flow: `todo` → `doing` → `review` → `done`
- Keep queries SHORT (2-5 keywords) for better search results
- Higher `task_order` = higher priority (0-100)
- Tasks should be 30 min - 4 hours of work

---

## Core Development Philosophy

### KISS (Keep It Simple, Stupid)
Simplicity should be a key goal in design. Choose straightforward solutions over complex ones whenever possible. Simple solutions are easier to understand, maintain, and debug.

### YAGNI (You Aren't Gonna Need It)
Avoid building functionality on speculation. Implement features only when they are needed, not when you anticipate they might be useful in the future.

### Design Principles
- **Dependency Inversion**: High-level modules should not depend on low-level modules. Both should depend on abstractions.
- **Open/Closed Principle**: Software entities should be open for extension but closed for modification.
- **Single Responsibility**: Each function, class, and module should have one clear purpose.
- **Fail Fast**: Check for potential errors early and raise exceptions immediately when issues occur.

---

## 🧱 Code Structure & Modularity

### File and Component Limits
- **Never create a file longer than 300 lines**. Split into smaller components/hooks.
- **Components should be under 150 lines** with a single, clear responsibility.
- **Custom hooks should be under 100 lines** and represent a single concern.
- **Organize code by feature**, not by type (components/hooks together).
- **Line length max 100 characters** (Prettier config).
- **Use absolute imports** with `@/` prefix (configured in tsconfig).

### Project Architecture (Frontend)

Feature-based architecture with co-located tests:

```
packages/frontend/src/
    App.tsx
    main.tsx
    
    # Core setup
    lib/
        supabase.ts          # Supabase client
        queryClient.ts       # React Query setup
    
    # Shared UI components
    components/
        ui/                  # shadcn/ui components
            button.tsx
            card.tsx
            dialog.tsx
        game/                # Reusable game components
            Card.tsx
            CardHand.tsx
            SentenceBuilder.tsx
    
    # Feature slices (group by feature)
    features/
        auth/
            Login.tsx
            Signup.tsx
            useAuth.ts
            AuthContext.tsx
            __tests__/
                Login.test.tsx
        
        lessons/
            LessonView.tsx
            LessonCard.tsx
            useLessons.ts
            __tests__/
                LessonView.test.tsx
        
        game/
            GameBoard.tsx
            ChallengeDisplay.tsx
            ValidationFeedback.tsx
            useGameState.ts
            __tests__/
                GameBoard.test.tsx
    
    # Layouts
    layouts/
        DashboardLayout.tsx
        GameLayout.tsx
    
    # Pages (route components)
    pages/
        Dashboard.tsx
        ModuleView.tsx
        LessonView.tsx
```

### Shared Package Structure

```
packages/shared/src/
    index.ts              # Main export
    
    types/                # TypeScript types
        user.types.ts
        lesson.types.ts
        game.types.ts
        validation.types.ts
    
    validators/           # Pure validation functions
        koValidator.ts
        heValidator.ts
        equativeValidator.ts
        keiTeValidator.ts
    
    data/                 # Static data
        wordLibrary.ts
        curriculum.ts
```

---

## 🛠️ Development Environment

### Package Management (npm workspaces)

This project uses **npm workspaces** for monorepo management.

```bash
# Install all dependencies (run from root)
npm install

# Add a package to frontend
cd packages/frontend
npm install react-hot-toast

# Add a package to shared
cd packages/shared
npm install zod

# Add dev dependency
npm install -D @types/node

# Remove a package
npm uninstall package-name

# Run commands from root (uses workspace)
npm run dev -w frontend
npm run test -w shared
```

### Development Commands

```bash
# Frontend development server
cd packages/frontend
npm run dev                    # Start Vite dev server (http://localhost:5173)

# Type checking
npm run type-check             # Run TypeScript compiler check
npm run type-check:watch       # Watch mode

# Linting & Formatting
npm run lint                   # ESLint check
npm run lint:fix               # Auto-fix lint issues
npm run format                 # Prettier format
npm run format:check           # Check formatting

# Testing
npm run test                   # Run Vitest
npm run test:watch             # Watch mode
npm run test:coverage          # Generate coverage report

# Build
npm run build                  # Production build
npm run preview                # Preview production build

# Shared package (validators/types)
cd packages/shared
npm run build                  # Build TypeScript
npm run test                   # Test validators
```

### Supabase Commands

```bash
# Start local Supabase (Docker required)
supabase start                 # Starts PostgreSQL, Auth, Realtime, Storage

# Database management
supabase db reset              # Reset DB and run migrations
supabase db push               # Push schema changes
supabase migration new <name>  # Create new migration

# Generate TypeScript types from database
supabase gen types typescript --local > packages/shared/src/types/database.types.ts

# View local credentials
supabase status

# Stop Supabase
supabase stop
```

---

## 📋 Style & Conventions

### TypeScript/React Style Guide

- **Follow Airbnb React/TypeScript style** with these choices:
  - Line length: 100 characters (Prettier enforced)
  - Use double quotes for JSX attributes, single quotes for TS
  - Trailing commas always
  - Semicolons always
- **Always use TypeScript types** - no `any` unless absolutely necessary
- **Format with Prettier** automatically on save
- **Use Zod** for runtime validation (complements TypeScript)

### Component Documentation Standards

Use JSDoc for exported functions and complex logic:

```typescript
/**
 * Validates a Ko sentence pattern (Ko + te/ngā + noun)
 * 
 * @param cards - Array of cards in the sentence
 * @param challenge - Challenge configuration with target pattern
 * @returns Validation result with success status and detailed feedback
 * 
 * @example
 * ```ts
 * const result = validateKoSentence(
 *   [{ word: 'Ko', type: 'particle' }, { word: 'te', type: 'article' }, { word: 'kuri', type: 'noun' }],
 *   { target: 'Ko te kuri', pattern: 'ko' }
 * );
 * console.log(result.isCorrect); // true
 * ```
 */
export function validateKoSentence(
  cards: Card[],
  challenge: Challenge
): ValidationResult {
  // Implementation
}
```

### Naming Conventions

- **Variables and functions**: `camelCase`
- **Components**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`
- **Private methods**: `_prefixWithUnderscore` (rare in TS)
- **Custom hooks**: `useCamelCase`
- **Context providers**: `PascalCaseProvider`
- **Event handlers**: `handleEventName`
- **Boolean variables**: `isActive`, `hasPermission`, `canEdit`

### React Component Patterns

```typescript
// ✅ Good: Functional component with TypeScript
interface CardProps {
  word: string;
  type: WordType;
  color: string;
  onClick?: () => void;
}

export function Card({ word, type, color, onClick }: CardProps) {
  return (
    <button
      className={`card card-${color}`}
      onClick={onClick}
      aria-label={`${word} (${type})`}
    >
      {word}
    </button>
  );
}

// ✅ Good: Custom hook for logic separation
export function useGameState(lessonId: string) {
  const [cards, setCards] = useState<Card[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  
  const validateSentence = useCallback((selectedCards: Card[]) => {
    const result = validateKoSentence(selectedCards, challenge);
    setValidation(result);
  }, [challenge]);
  
  return { cards, validation, validateSentence };
}
```

---

## 🧪 Testing Strategy

### Test-Driven Development (TDD)

1. **Write the test first** - Define expected behavior before implementation
2. **Watch it fail** - Ensure the test actually tests something
3. **Write minimal code** - Just enough to make the test pass
4. **Refactor** - Improve code while keeping tests green
5. **Repeat** - One test at a time

### Testing Best Practices (Vitest + React Testing Library)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './Card';

describe('Card component', () => {
  const mockProps = {
    word: 'kuri',
    type: 'noun' as const,
    color: 'blue',
  };

  it('renders the word correctly', () => {
    render(<Card {...mockProps} />);
    expect(screen.getByText('kuri')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Card {...mockProps} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('applies correct color class', () => {
    render(<Card {...mockProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('card-blue');
  });
});

// Validator testing example
describe('validateKoSentence', () => {
  const challenge = {
    target: 'Ko te kuri',
    pattern: 'ko',
    type: 'build' as const,
  };

  it('validates correct Ko sentence', () => {
    const cards = [
      { word: 'Ko', type: 'particle' },
      { word: 'te', type: 'article' },
      { word: 'kuri', type: 'noun' },
    ];
    
    const result = validateKoSentence(cards, challenge);
    expect(result.isCorrect).toBe(true);
    expect(result.feedback).toMatch(/Kei te tika/);
  });

  it('rejects sentence without Ko particle', () => {
    const cards = [
      { word: 'te', type: 'article' },
      { word: 'kuri', type: 'noun' },
    ];
    
    const result = validateKoSentence(cards, challenge);
    expect(result.isCorrect).toBe(false);
    expect(result.hint).toMatch(/Ko/);
  });
});
```

### Test Organization

- **Unit tests**: Pure functions (validators, utilities)
- **Component tests**: React components with RTL
- **Integration tests**: Feature workflows with mocked Supabase
- **E2E tests**: Full user journeys (future - Playwright)
- Keep `__tests__/` folders next to features
- Use `vi.fn()` for mocks, `vi.spyOn()` for spies
- Aim for 80%+ coverage on validators/core logic

---

## 🚨 Error Handling

### Error Handling Best Practices

```typescript
// Custom error classes for domain errors
export class GameError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'GameError';
  }
}

export class ValidationError extends GameError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

// Error handling in React components
function LessonView() {
  const { data: lesson, error, isLoading } = useLesson(lessonId);
  
  if (error) {
    return (
      <ErrorDisplay
        title="Failed to load lesson"
        message={error instanceof Error ? error.message : 'Unknown error'}
      />
    );
  }
  
  // ... rest of component
}

// Supabase error handling
async function validateAndSaveProgress(
  lessonId: string,
  cards: Card[]
): Promise<ValidationResult> {
  try {
    const validation = validateKoSentence(cards, challenge);
    
    const { error } = await supabase
      .from('lesson_attempts')
      .insert({
        lesson_id: lessonId,
        is_correct: validation.isCorrect,
        user_sentence: cards.map(c => c.word).join(' '),
      });
    
    if (error) {
      throw new GameError(
        'Failed to save progress',
        'SUPABASE_ERROR',
        error
      );
    }
    
    return validation;
  } catch (error) {
    console.error('Validation error:', error);
    throw error;
  }
}
```

### Toast Notifications

```typescript
import toast from 'react-hot-toast';

// Success notifications
toast.success('Kei te tika! Correct!');

// Error notifications
toast.error('Failed to save progress');

// Loading with promise
const promise = saveProgress();
toast.promise(promise, {
  loading: 'Saving...',
  success: 'Progress saved!',
  error: 'Failed to save',
});
```

---

## 🔧 Configuration Management

### Environment Variables

Create `.env.local` in `packages/frontend/`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Production config
VITE_APP_ENV=development
```

### Supabase Client Setup

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@te-reo-academy/shared';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

---

## 🏗️ Data Models and Validation

### TypeScript Types (from shared package)

```typescript
// Import from shared package
import type { 
  Card, 
  Challenge, 
  ValidationResult,
  Lesson,
  Module 
} from '@te-reo-academy/shared';

// Component props with types
interface GameBoardProps {
  lesson: Lesson;
  availableCards: Card[];
  onComplete: (result: ValidationResult) => void;
}

// State types
interface GameState {
  selectedCards: Card[];
  validation: ValidationResult | null;
  attempts: number;
  isComplete: boolean;
}
```

### Runtime Validation with Zod

```typescript
import { z } from 'zod';

// Define schemas for forms/API responses
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

// Use in forms
function LoginForm() {
  const handleSubmit = (data: unknown) => {
    try {
      const validated = loginSchema.parse(data);
      // validated is now LoginForm type
      login(validated.email, validated.password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Show validation errors
        console.error(error.errors);
      }
    }
  };
}
```

---

## 🗄️ Supabase Database Patterns

### Database Schema (Already Created!)

Schema is in `supabase/migrations/20250109000001_initial_schema.sql` with:
- ✅ 8 tables with UUID primary keys
- ✅ Row Level Security (RLS) policies
- ✅ Auto-updated `updated_at` triggers
- ✅ Indexes for performance

### Field Naming Conventions

```sql
-- Primary keys: {table}_id
profiles.profile_id, modules.module_id, lessons.lesson_id

-- Foreign keys: {referenced_table}_id
user_id REFERENCES auth.users(id)
lesson_id REFERENCES lessons(lesson_id)

-- Timestamps: {action}_at
created_at, updated_at, completed_at

-- Booleans: is_{state}
is_completed, is_locked

-- Order fields: order_index
modules.order_index, lessons.order_index
```

### Supabase Query Patterns

```typescript
// Fetch with relations
const { data: lessons, error } = await supabase
  .from('lessons')
  .select(`
    *,
    module:modules(title, order_index)
  `)
  .eq('module_id', moduleId)
  .order('order_index');

// Insert with return
const { data: attempt, error } = await supabase
  .from('lesson_attempts')
  .insert({
    lesson_id: lessonId,
    user_sentence: sentence,
    is_correct: isCorrect,
  })
  .select()
  .single();

// Update user progress
const { error } = await supabase
  .from('user_progress')
  .upsert({
    lesson_id: lessonId,
    is_completed: true,
    score: 100,
  });

// Real-time subscription
const channel = supabase
  .channel('game_updates')
  .on(
    'postgres_changes',
    { 
      event: 'INSERT',
      schema: 'public',
      table: 'game_moves'
    },
    (payload) => {
      console.log('New move:', payload.new);
    }
  )
  .subscribe();
```

### React Query + Supabase Hooks

```typescript
// Custom hook for lessons
export function useLessons(moduleId: string) {
  return useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
  });
}

// Mutation for saving progress
export function useSaveProgress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (attempt: LessonAttempt) => {
      const { data, error } = await supabase
        .from('lesson_attempts')
        .insert(attempt)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
}
```

---

## 🔄 Git Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring
- `test/*` - Test additions or fixes

### Commit Message Format

**Never include "claude code" or "written by claude code" in commit messages**

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, test, chore

Example:
```
feat(auth): add two-factor authentication

- Implement TOTP generation and validation
- Add QR code generation for authenticator apps
- Update user model with 2FA fields

Closes #123
```

### GitHub Flow Workflow Summary

```
main (protected) ←── PR ←── feature/your-feature
  ↓                              ↑
deploy                      development
```

Daily Workflow:
1. `git checkout main && git pull origin main`
2. `git checkout -b feature/new-feature`
3. Make changes + tests
4. `git push origin feature/new-feature`
5. Create PR → Review → Merge to main

---

## 📝 Documentation Standards

### Code Documentation

- Every module should have a JSDoc comment explaining its purpose
- Exported functions must have complete JSDoc
- Complex logic should have inline comments with `// Reason:` prefix
- Keep README.md updated with setup instructions and examples
- Maintain CHANGELOG.md for version history

### Component Documentation

```typescript
/**
 * GameBoard - Main game interface for lesson challenges
 * 
 * Displays challenge instructions, available cards, and sentence builder.
 * Validates user-built sentences against challenge patterns.
 * Tracks attempts and provides feedback.
 * 
 * @example
 * ```tsx
 * <GameBoard
 *   lesson={lesson}
 *   availableCards={cards}
 *   onComplete={(result) => console.log(result)}
 * />
 * ```
 */
export function GameBoard({ lesson, availableCards, onComplete }: GameBoardProps) {
  // Implementation
}
```

---

## 🚀 Performance Considerations

### Optimization Guidelines

- Profile before optimizing - use React DevTools Profiler
- Use `useMemo` for expensive computations
- Use `useCallback` for stable function references
- Prefer `React.lazy()` for code splitting
- Use virtualization for long lists (react-virtual)
- Optimize images with proper formats and sizes

### Example Optimization

```typescript
import { useMemo, useCallback } from 'react';

function ExpensiveComponent({ data }: Props) {
  // Memoize expensive calculation
  const processedData = useMemo(() => {
    return data.map(item => expensiveTransform(item));
  }, [data]);
  
  // Stable callback reference
  const handleClick = useCallback((id: string) => {
    // Handle click
  }, []);
  
  return <div>{/* Render */}</div>;
}
```

---

## 🛡️ Security Best Practices

### Security Guidelines

- Never commit secrets - use `.env.local` (gitignored)
- Validate all user input with Zod
- Use Supabase RLS policies for authorization
- Implement rate limiting for APIs (Supabase handles this)
- Keep dependencies updated with `npm audit`
- Use HTTPS for all external communications
- Sanitize user-generated content before rendering

### Example Security Implementation

```typescript
// Zod validation for user input
const challengeSubmissionSchema = z.object({
  lessonId: z.string().uuid(),
  cards: z.array(z.object({
    word: z.string().max(50),
    type: z.enum(['particle', 'article', 'noun', 'verb', 'adjective']),
  })),
});

// Supabase RLS ensures users can only access their own data
// See supabase/migrations/20250109000001_initial_schema.sql
```

---

## 🔍 Debugging Tools

### Debugging Commands

```bash
# React DevTools (browser extension)
# Install from Chrome/Firefox web store

# TypeScript errors
npm run type-check

# Console debugging with source maps (enabled by default in Vite)
console.log('Debug:', value);
console.table(arrayOfObjects);
console.trace('Function call trace');

# React Query DevTools
# Add to App.tsx: import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
```

---

## ⚠️ Important Notes

- **NEVER ASSUME OR GUESS** - When in doubt, ask for clarification
- **Always verify file paths** before use
- **Keep CLAUDE.md updated** when adding new patterns or dependencies
- **Test your code** - No feature is complete without tests
- **Document your decisions** - Future developers (including yourself) will thank you
- **Read HANDOFF_TO_CLAUDE_CODE.md** for detailed phase-by-phase build guide

---

## 📚 Useful Resources

### Essential Tools

- **Vite**: https://vitejs.dev/
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/
- **TanStack Query**: https://tanstack.com/query/latest
- **Supabase**: https://supabase.com/docs
- **Zustand**: https://github.com/pmndrs/zustand
- **TailwindCSS**: https://tailwindcss.com/
- **shadcn/ui**: https://ui.shadcn.com/
- **Vitest**: https://vitest.dev/
- **React Testing Library**: https://testing-library.com/react

### Best Practices

- React TypeScript Cheatsheet: https://react-typescript-cheatsheet.netlify.app/
- TanStack Query Best Practices: https://tkdodo.eu/blog/practical-react-query
- Supabase Auth Patterns: https://supabase.com/docs/guides/auth

---

_This document is a living guide. Update it as the project evolves and new patterns emerge._
