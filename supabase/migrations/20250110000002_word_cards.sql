-- Migration: Add word_cards table for dynamic challenge generation
-- Created: 2025-11-10

-- ============================================================================
-- WORD CARDS TABLE
-- ============================================================================
-- Stores all vocabulary words with rich metadata for dynamic challenge generation
-- Replaces static wordLibrary.ts with database-driven word management

CREATE TABLE IF NOT EXISTS public.word_cards (
  id TEXT PRIMARY KEY, -- e.g., 'p_ko', 'art_te', 'n_whare', 'v_kai'
  maori TEXT NOT NULL,
  english TEXT NOT NULL,
  type TEXT NOT NULL, -- particle, article, noun, verb, adjective, etc.
  color TEXT NOT NULL, -- UI color coding: purple, gray, blue, green, etc.
  pronunciation TEXT,
  module INTEGER NOT NULL, -- Module number (1, 2, 3, etc.)

  -- Usage and examples
  usage TEXT,
  examples JSONB, -- Array of {maori, english} objects

  -- Linguistic metadata
  plural TEXT, -- For nouns with irregular plurals
  theme TEXT, -- animals, people, places, etc.
  breakdown TEXT, -- Word composition explanation
  person TEXT, -- For pronouns: '1st singular', '2nd plural', etc.
  distance TEXT, -- For demonstratives: 'near speaker', 'near listener', etc.

  -- Cultural and learning context
  cultural_note TEXT,
  note TEXT,

  -- NZSL integration (Phase 4)
  nzsl_video_url TEXT,
  nzsl_description TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_word_cards_module ON public.word_cards(module);
CREATE INDEX idx_word_cards_type ON public.word_cards(type);
CREATE INDEX idx_word_cards_color ON public.word_cards(color);
CREATE INDEX idx_word_cards_theme ON public.word_cards(theme);
CREATE INDEX idx_word_cards_maori ON public.word_cards(maori);

-- Composite index for common queries
CREATE INDEX idx_word_cards_module_type ON public.word_cards(module, type);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_word_cards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER word_cards_updated_at
  BEFORE UPDATE ON public.word_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_word_cards_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.word_cards ENABLE ROW LEVEL SECURITY;

-- Everyone can read word cards (public vocabulary)
CREATE POLICY "Word cards are publicly readable"
  ON public.word_cards
  FOR SELECT
  USING (true);

-- Only authenticated users can insert/update/delete (admin functionality)
CREATE POLICY "Authenticated users can manage word cards"
  ON public.word_cards
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE public.word_cards IS
  'Vocabulary word cards with rich metadata for dynamic challenge generation';

COMMENT ON COLUMN public.word_cards.id IS
  'Unique word ID with type prefix (e.g., p_ko, art_te, n_whare, v_kai)';

COMMENT ON COLUMN public.word_cards.examples IS
  'JSON array of example sentences: [{maori: "...", english: "..."}]';

COMMENT ON COLUMN public.word_cards.color IS
  'UI color for card display: purple (particle), gray (article), blue (noun), green (verb), red (pronoun), etc.';
