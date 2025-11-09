-- Seed Data for Te Reo Academy
-- Initial modules and lessons for development/testing

-- ============================================================================
-- MODULE 1: Ko Sentences (Identity)
-- ============================================================================
INSERT INTO public.modules (id, title, description, order_index)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Module 1: Ko Sentences',
  'Learn to introduce yourself and identify people and things using Ko sentences',
  1
);

-- Module 1 Lessons
INSERT INTO public.lessons (id, module_id, title, description, order_index, lesson_type)
VALUES
  (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Tutorial: Ko Sentences Basics',
    'Introduction to Ko sentences for identity',
    1,
    'tutorial'
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Practice: Ko + te/ngā + noun',
    'Practice building basic Ko sentences',
    2,
    'practice'
  ),
  (
    '00000000-0000-0000-0001-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Tutorial: He Sentences (Classification)',
    'Learn He sentences for describing what things are',
    3,
    'tutorial'
  ),
  (
    '00000000-0000-0000-0001-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'Practice: He + noun',
    'Practice He classification sentences',
    4,
    'practice'
  ),
  (
    '00000000-0000-0000-0001-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Challenge: Equative Sentences',
    'Build Ko + pronoun + te/ngā + noun sentences',
    5,
    'challenge'
  );

-- ============================================================================
-- MODULE 2: Kei te Sentences (Present Tense)
-- ============================================================================
INSERT INTO public.modules (id, title, description, order_index)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Module 2: Kei te Present Tense',
  'Express actions and states happening right now with Kei te',
  2
);

-- Module 2 Lessons
INSERT INTO public.lessons (id, module_id, title, description, order_index, lesson_type)
VALUES
  (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'Tutorial: Kei te Basics',
    'Introduction to present continuous tense',
    1,
    'tutorial'
  ),
  (
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'Practice: Kei te + verb + pronoun',
    'Practice basic present tense sentences',
    2,
    'practice'
  ),
  (
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0000-000000000002',
    'Practice: Kei te with intensifiers',
    'Add tino and āhua to describe intensity',
    3,
    'practice'
  ),
  (
    '00000000-0000-0000-0002-000000000004',
    '00000000-0000-0000-0000-000000000002',
    'Challenge: Kei te with locations',
    'Build sentences with i/ki location markers',
    4,
    'challenge'
  );

-- ============================================================================
-- SAMPLE CHALLENGES (Module 1, Lesson 2)
-- ============================================================================
INSERT INTO public.challenges (id, lesson_id, order_index, pattern_type, target_maori, target_english, hint)
VALUES
  (
    '00000000-0001-0000-0000-000000000001',
    '00000000-0000-0000-0001-000000000002',
    1,
    'ko',
    'Ko te whare',
    'It is the house',
    'Start with Ko, then te (singular article), then the noun'
  ),
  (
    '00000000-0001-0000-0000-000000000002',
    '00000000-0000-0000-0001-000000000002',
    2,
    'ko',
    'Ko ngā tamariki',
    'They are the children',
    'Use ngā for plural nouns'
  ),
  (
    '00000000-0001-0000-0000-000000000003',
    '00000000-0000-0000-0001-000000000002',
    3,
    'ko',
    'Ko te kurī tēnei',
    'This is the dog',
    'Add tēnei (this) after the noun for demonstratives'
  );

-- Note: Actual word library data will be seeded from the frontend
-- or imported from the v3 data files after TypeScript conversion
