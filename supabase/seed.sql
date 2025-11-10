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
-- CHALLENGES - Module 1: Ko Sentences
-- ============================================================================

-- Tutorial: Ko Sentences Basics (Lesson 1)
INSERT INTO public.challenges (id, lesson_id, order_index, pattern_type, target_maori, target_english, hint)
VALUES
  (
    '00000000-0001-0000-0000-000000000004',
    '00000000-0000-0000-0001-000000000001',
    1,
    'ko',
    'Ko te kākā',
    'It is the kākā (parrot)',
    'Start with Ko, then te, then the noun'
  ),
  (
    '00000000-0001-0000-0000-000000000005',
    '00000000-0000-0000-0001-000000000001',
    2,
    'ko',
    'Ko ngā manu',
    'They are the birds',
    'Use ngā for plural - it means "the (plural)"'
  );

-- Practice: Ko + te/ngā + noun (Lesson 2)
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

-- Tutorial: He Sentences (Lesson 3)
INSERT INTO public.challenges (id, lesson_id, order_index, pattern_type, target_maori, target_english, hint)
VALUES
  (
    '00000000-0001-0000-0000-000000000006',
    '00000000-0000-0000-0001-000000000003',
    1,
    'he',
    'He kuri tēnei',
    'This is a dog',
    'He sentences don't use te/ngā. Pattern: He + noun + tēnei/tēnā'
  ),
  (
    '00000000-0001-0000-0000-000000000007',
    '00000000-0000-0000-0001-000000000003',
    2,
    'he',
    'He whare tēnā',
    'That is a house',
    'Use tēnā for "that" (near you)'
  );

-- Practice: He + noun (Lesson 4)
INSERT INTO public.challenges (id, lesson_id, order_index, pattern_type, target_maori, target_english, hint)
VALUES
  (
    '00000000-0001-0000-0000-000000000008',
    '00000000-0000-0000-0001-000000000004',
    1,
    'he',
    'He tamaiti',
    'A child',
    'Simple He + noun pattern'
  ),
  (
    '00000000-0001-0000-0000-000000000009',
    '00000000-0000-0000-0001-000000000004',
    2,
    'he',
    'He manu',
    'A bird',
    'Classification: He + noun (no article)'
  );

-- Challenge: Equative Sentences (Lesson 5)
INSERT INTO public.challenges (id, lesson_id, order_index, pattern_type, target_maori, target_english, hint)
VALUES
  (
    '00000000-0001-0000-0000-000000000010',
    '00000000-0000-0000-0001-000000000005',
    1,
    'equative',
    'Ko au te pouako',
    'I am the teacher',
    'Pattern: Ko + pronoun + te/ngā + noun'
  ),
  (
    '00000000-0001-0000-0000-000000000011',
    '00000000-0000-0000-0001-000000000005',
    2,
    'equative',
    'Ko koe te tauira',
    'You are the student',
    'Ko + koe (you) + te + noun'
  );

-- Note: Module 2 (Kei te) challenges will be added in future seed updates
-- Word library data will be seeded from the frontend or imported from v3 data files
