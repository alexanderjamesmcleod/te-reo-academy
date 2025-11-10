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
    'He sentences don''t use te/ngā. Pattern: He + noun + tēnei/tēnā'
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

-- ============================================================================
-- CHALLENGES - Module 2: Kei te Sentences (Present Tense)
-- ============================================================================

-- Tutorial: Kei te Basics (Lesson 1)
INSERT INTO public.challenges (id, lesson_id, order_index, pattern_type, target_maori, target_english, hint)
VALUES
  (
    '00000000-0002-0000-0000-000000000001',
    '00000000-0000-0000-0002-000000000001',
    1,
    'kei_te',
    'Kei te kai au',
    'I am eating',
    'Start with Kei te (present tense marker), then kai (eat), then au (I)'
  ),
  (
    '00000000-0002-0000-0000-000000000002',
    '00000000-0000-0000-0002-000000000001',
    2,
    'kei_te',
    'Kei te pai au',
    'I am good/well',
    'Kei te + pai (good/well) + au. Remember: adjectives work like verbs in te reo!'
  );

-- Practice: Kei te + verb + pronoun (Lesson 2)
INSERT INTO public.challenges (id, lesson_id, order_index, pattern_type, target_maori, target_english, hint)
VALUES
  (
    '00000000-0002-0000-0000-000000000003',
    '00000000-0000-0000-0002-000000000002',
    1,
    'kei_te',
    'Kei te haere koe',
    'You are going',
    'Pattern: Kei te + verb (haere) + pronoun (koe = you)'
  ),
  (
    '00000000-0002-0000-0000-000000000004',
    '00000000-0000-0000-0002-000000000002',
    2,
    'kei_te',
    'Kei te mahi ia',
    'He/She is working',
    'Use ia (he/she) - gender neutral! Kei te + mahi (work) + ia'
  );

-- Practice: Kei te with intensifiers (Lesson 3)
INSERT INTO public.challenges (id, lesson_id, order_index, pattern_type, target_maori, target_english, hint)
VALUES
  (
    '00000000-0002-0000-0000-000000000005',
    '00000000-0000-0000-0002-000000000003',
    1,
    'kei_te',
    'Kei te tino pai au',
    'I am very good',
    'Add tino (very) after Kei te to intensify! Pattern: Kei te + tino + adjective + pronoun'
  ),
  (
    '00000000-0002-0000-0000-000000000006',
    '00000000-0000-0000-0002-000000000003',
    2,
    'kei_te',
    'Kei te āhua ngenge koe',
    'You are somewhat tired',
    'Use āhua (somewhat) for moderate intensity. Kei te + āhua + ngenge (tired) + koe'
  );

-- Challenge: Kei te with locations (Lesson 4)
INSERT INTO public.challenges (id, lesson_id, order_index, pattern_type, target_maori, target_english, hint)
VALUES
  (
    '00000000-0002-0000-0000-000000000007',
    '00000000-0000-0000-0002-000000000004',
    1,
    'kei_te',
    'Kei te noho au i te whare',
    'I am staying at home/the house',
    'Use i (at/in) for location. Pattern: Kei te + noho (stay) + au + i + te + whare'
  ),
  (
    '00000000-0002-0000-0000-000000000008',
    '00000000-0000-0000-0002-000000000004',
    2,
    'kei_te',
    'Kei te haere ia ki te kura',
    'He/She is going to school',
    'Use ki (to/towards) for direction. Pattern: Kei te + haere (go) + ia + ki + te + kura'
  );

-- ============================================================================
-- MODULE 3: Past and Future Tense
-- ============================================================================
INSERT INTO public.modules (id, title, description, order_index)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'Module 3: Past and Future Tense',
  'Learn to talk about past events (I/Kua) and future actions (Ka)',
  3
);

-- Module 3 Lessons
INSERT INTO public.lessons (id, module_id, title, description, order_index, lesson_type)
VALUES
  (
    '00000000-0000-0000-0003-000000000001',
    '00000000-0000-0000-0000-000000000003',
    'Tutorial: Past Tense Basics (I/Kua)',
    'Introduction to past tense markers I and Kua',
    1,
    'tutorial'
  ),
  (
    '00000000-0000-0000-0003-000000000002',
    '00000000-0000-0000-0000-000000000003',
    'Practice: Past Tense with Time Markers',
    'Use past tense with inanahi (yesterday) and other time words',
    2,
    'practice'
  ),
  (
    '00000000-0000-0000-0003-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'Tutorial: Future Tense Basics (Ka)',
    'Introduction to future tense marker Ka',
    3,
    'tutorial'
  ),
  (
    '00000000-0000-0000-0003-000000000004',
    '00000000-0000-0000-0000-000000000003',
    'Practice: Future Tense with Time Markers',
    'Use future tense with āpōpō (tomorrow) and other time words',
    4,
    'practice'
  ),
  (
    '00000000-0000-0000-0003-000000000005',
    '00000000-0000-0000-0000-000000000003',
    'Challenge: Mixed Tense Practice',
    'Build sentences combining past, present, and future tenses',
    5,
    'challenge'
  );

-- ============================================================================
-- WORD CARDS - Module 1: Ko/He Sentences
-- ============================================================================

-- Module 1: Particles
INSERT INTO public.word_cards (id, maori, english, type, color, pronunciation, usage, examples, cultural_note, module)
VALUES
  (
    'p_ko',
    'Ko',
    'definite particle',
    'particle',
    'purple',
    'kaw (like "core")',
    'Points to specific things - THE thing',
    '[{"maori": "Ko te whare", "english": "THE house (that specific one)"}, {"maori": "Ko ia", "english": "It is him/her"}]'::jsonb,
    'Ko often begins introductions and formal speeches',
    1
  ),
  (
    'p_he',
    'He',
    'indefinite particle',
    'particle',
    'purple',
    'heh',
    'Classifies things - A/AN thing',
    '[{"maori": "He kaiako ia", "english": "He/she is A teacher (one of many)"}, {"maori": "He whare nui", "english": "A big house"}]'::jsonb,
    NULL,
    1
  );

-- Module 1: Articles
INSERT INTO public.word_cards (id, maori, english, type, color, pronunciation, usage, examples, note, module)
VALUES
  (
    'art_te',
    'te',
    'the (singular)',
    'article',
    'gray',
    'teh',
    'Singular definite article',
    '[{"maori": "te ngeru", "english": "the cat"}, {"maori": "te whare", "english": "the house"}]'::jsonb,
    NULL,
    1
  ),
  (
    'art_nga',
    'ngā',
    'the (plural)',
    'article',
    'gray',
    'ngar',
    'Plural definite article',
    '[{"maori": "ngā ngeru", "english": "the cats"}, {"maori": "ngā whare", "english": "the houses"}]'::jsonb,
    'ng is like "ng" in "singer"',
    1
  );

-- Module 1: Nouns (Basic)
INSERT INTO public.word_cards (id, maori, english, type, color, pronunciation, plural, theme, cultural_note, module)
VALUES
  ('n_whare', 'whare', 'house', 'noun', 'blue', 'fah-reh', 'whare', 'places', 'Also means meeting house on marae', 1),
  ('n_ngeru', 'ngeru', 'cat', 'noun', 'blue', 'nge-roo', 'ngeru', 'animals', NULL, 1),
  ('n_kaiako', 'kaiako', 'teacher', 'noun', 'blue', 'kai-ah-kaw', 'kaiako', 'people', 'Literally "one who feeds learning"', 1),
  ('n_tangata', 'tangata', 'person', 'noun', 'blue', 'tah-nga-tah', 'tangata', 'people', NULL, 1),
  ('n_kuri', 'kuri', 'dog', 'noun', 'blue', 'koo-ree', 'kuri', 'animals', NULL, 1),
  ('n_tamaiti', 'tamaiti', 'child', 'noun', 'blue', 'tah-my-tee', 'tamariki', 'people', NULL, 1),
  ('n_tamariki', 'tamariki', 'children', 'noun', 'blue', 'tah-mah-ree-kee', NULL, 'people', NULL, 1),
  ('n_kaka', 'kākā', 'parrot (native NZ bird)', 'noun', 'blue', 'kar-kar', 'kākā', 'animals', 'Endemic forest parrot, important in Māori culture', 1),
  ('n_manu', 'manu', 'bird', 'noun', 'blue', 'mah-noo', 'manu', 'animals', NULL, 1),
  ('n_pouako', 'pouako', 'teacher', 'noun', 'blue', 'poh-ah-kaw', 'pouako', 'people', NULL, 1),
  ('n_tauira', 'tauira', 'student', 'noun', 'blue', 'tah-oo-ee-rah', 'tauira', 'people', NULL, 1);

-- Module 1: Pronouns
INSERT INTO public.word_cards (id, maori, english, type, color, pronunciation, person, note, module)
VALUES
  ('pr_au', 'au', 'I/me', 'pronoun', 'red', 'ah-oo', '1st singular', NULL, 1),
  ('pr_ia', 'ia', 'he/she/it', 'pronoun', 'red', 'ee-ah', '3rd singular', 'Gender neutral!', 1),
  ('pr_koe', 'koe', 'you (singular)', 'pronoun', 'red', 'kaw-eh', '2nd singular', NULL, 1);

-- Module 1: Demonstratives
INSERT INTO public.word_cards (id, maori, english, type, color, pronunciation, distance, examples, module)
VALUES
  (
    'd_tenei',
    'tēnei',
    'this (near me)',
    'demonstrative',
    'orange',
    'tay-nay',
    'near speaker',
    '[{"maori": "Ko tēnei te whare", "english": "This (here) is the house"}]'::jsonb,
    1
  ),
  (
    'd_tena',
    'tēnā',
    'that (near you)',
    'demonstrative',
    'orange',
    'tay-nar',
    'near listener',
    '[{"maori": "Ko tēnā te whare", "english": "That (by you) is the house"}]'::jsonb,
    1
  ),
  (
    'd_tera',
    'tērā',
    'that (over there)',
    'demonstrative',
    'orange',
    'tay-rar',
    'far from both',
    '[{"maori": "Ko tērā te whare", "english": "That (over there) is the house"}]'::jsonb,
    1
  );

-- ============================================================================
-- WORD CARDS - Module 2: Kei te Present Tense
-- ============================================================================

-- Module 2: Tense Markers
INSERT INTO public.word_cards (id, maori, english, type, color, pronunciation, usage, examples, cultural_note, module)
VALUES
  (
    'tm_keite',
    'Kei te',
    'present continuous marker',
    'tense_marker',
    'yellow',
    'kay teh',
    'Indicates actions happening RIGHT NOW',
    '[{"maori": "Kei te pai au", "english": "I am good (right now)"}, {"maori": "Kei te haere ia", "english": "He/she is going (now)"}]'::jsonb,
    'Kei te is ONLY for present tense - verbs never change form',
    2
  );

-- Module 2: Adjectives
INSERT INTO public.word_cards (id, maori, english, type, color, pronunciation, usage, examples, cultural_note, module)
VALUES
  ('adj_pai', 'pai', 'good', 'adjective', 'lightblue', 'pie', 'Describes something positive/good', '[{"maori": "Kei te pai au", "english": "I am good"}]'::jsonb, NULL, 2),
  ('adj_harikoa', 'harikoa', 'happy', 'adjective', 'lightblue', 'hah-ree-kaw-ah', 'Describes happiness/joy', '[{"maori": "Kei te harikoa ia", "english": "He/she is happy"}]'::jsonb, NULL, 2),
  ('adj_mauiui', 'māuiui', 'sick/unwell', 'adjective', 'lightblue', 'mar-oo-wee', 'Describes illness', '[{"maori": "Kei te māuiui koe?", "english": "Are you sick?"}]'::jsonb, NULL, 2),
  ('adj_ngenge', 'ngenge', 'tired', 'adjective', 'lightblue', 'nge-nge', 'Describes tiredness', '[{"maori": "Kei te ngenge au", "english": "I am tired"}]'::jsonb, NULL, 2),
  ('adj_pouri', 'pōuri', 'sad', 'adjective', 'lightblue', 'paw-oo-ree', 'Describes sadness', '[{"maori": "Kei te pōuri ia", "english": "He/she is sad"}]'::jsonb, NULL, 2),
  ('adj_riri', 'riri', 'angry', 'adjective', 'lightblue', 'ree-ree', 'Describes anger', '[{"maori": "Kei te riri koe?", "english": "Are you angry?"}]'::jsonb, NULL, 2),
  ('adj_ora', 'ora', 'well/alive/healthy', 'adjective', 'lightblue', 'aw-rah', 'Describes wellness/health', '[{"maori": "Kei te ora au", "english": "I am well"}]'::jsonb, 'Ora has deep meaning - wellness, life force, health', 2),
  ('adj_hiamoe', 'hiamoe', 'sleepy', 'adjective', 'lightblue', 'hee-ah-maw-eh', 'Describes sleepiness', '[{"maori": "Kei te hiamoe au", "english": "I am sleepy"}]'::jsonb, NULL, 2),
  ('adj_matekai', 'matekai', 'hungry', 'adjective', 'lightblue', 'mah-teh-kai', 'Describes hunger', '[{"maori": "Kei te matekai au", "english": "I am hungry"}]'::jsonb, NULL, 2),
  ('adj_hiainu', 'hiainu', 'thirsty', 'adjective', 'lightblue', 'hee-ah-ee-noo', 'Describes thirst', '[{"maori": "Kei te hiainu koe?", "english": "Are you thirsty?"}]'::jsonb, NULL, 2);

-- Module 2: Verbs
INSERT INTO public.word_cards (id, maori, english, type, color, pronunciation, usage, examples, cultural_note, module)
VALUES
  ('v_haere', 'haere', 'go', 'verb', 'green', 'high-reh', 'To go/leave/travel', '[{"maori": "Kei te haere au", "english": "I am going"}]'::jsonb, 'Common in greetings: "Haere mai" (welcome)', 2),
  ('v_kai', 'kai', 'eat/food', 'verb', 'green', 'kai (like "kite")', 'To eat (verb) or food (noun)', '[{"maori": "Kei te kai au", "english": "I am eating"}]'::jsonb, 'Kai is central to Māori culture - food and hospitality', 2),
  ('v_noho', 'noho', 'sit/live/stay', 'verb', 'green', 'naw-haw', 'To sit/live/stay in a place', '[{"maori": "Kei te noho au", "english": "I am sitting/staying"}]'::jsonb, NULL, 2),
  ('v_oma', 'oma', 'run', 'verb', 'green', 'aw-mah', 'To run', '[{"maori": "Kei te oma ia", "english": "He/she is running"}]'::jsonb, NULL, 2),
  ('v_mahi', 'mahi', 'work/do', 'verb', 'green', 'mah-hee', 'To work/do something', '[{"maori": "Kei te mahi au", "english": "I am working"}]'::jsonb, NULL, 2),
  ('v_ako', 'ako', 'learn/teach', 'verb', 'green', 'ah-kaw', 'To learn or teach (context dependent)', '[{"maori": "Kei te ako au", "english": "I am learning"}]'::jsonb, 'Learning and teaching are intertwined in Māori worldview', 2),
  ('v_mahaki', 'māhaki', 'rest', 'verb', 'green', 'mar-hah-kee', 'To rest/relax', '[{"maori": "Kei te māhaki ia", "english": "He/she is resting"}]'::jsonb, NULL, 2);

-- Module 2: Locative Particles
INSERT INTO public.word_cards (id, maori, english, type, color, pronunciation, usage, examples, module)
VALUES
  (
    'pl_i',
    'i',
    'at/in (locative)',
    'particle_locative',
    'brown',
    'ee',
    'Indicates location or object',
    '[{"maori": "Kei te noho au i Tāmaki", "english": "I am living in Auckland"}, {"maori": "i te whare", "english": "at the house"}]'::jsonb,
    2
  ),
  (
    'pl_ki',
    'ki',
    'to/towards (directional)',
    'particle_locative',
    'brown',
    'kee',
    'Indicates direction/destination',
    '[{"maori": "Kei te haere ia ki te kura", "english": "He/she is going to school"}, {"maori": "ki te whare", "english": "to the house"}]'::jsonb,
    2
  );

-- Module 2: Intensifiers
INSERT INTO public.word_cards (id, maori, english, type, color, pronunciation, usage, examples, module)
VALUES
  (
    'int_ahua',
    'āhua',
    'somewhat/rather',
    'intensifier',
    'pink',
    'ar-hoo-ah',
    'Moderate intensity - "somewhat/rather"',
    '[{"maori": "Kei te āhua ngenge au", "english": "I am somewhat tired"}]'::jsonb,
    2
  ),
  (
    'int_tino',
    'tino',
    'very',
    'intensifier',
    'pink',
    'tee-naw',
    'High intensity - "very"',
    '[{"maori": "Kei te tino pai au", "english": "I am very good"}]'::jsonb,
    2
  );

-- Module 2: Nouns (Places)
INSERT INTO public.word_cards (id, maori, english, type, color, pronunciation, theme, examples, cultural_note, module)
VALUES
  (
    'n_kura',
    'kura',
    'school',
    'noun',
    'blue',
    'koo-rah',
    'places',
    '[{"maori": "Kei te haere au ki te kura", "english": "I am going to school"}]'::jsonb,
    NULL,
    2
  ),
  (
    'n_tamaki',
    'Tāmaki Makaurau',
    'Auckland',
    'noun',
    'blue',
    'tar-mah-kee mah-kow-row',
    'places',
    NULL,
    'Traditional Māori name for Auckland - "Tāmaki of a hundred lovers"',
    2
  );

-- Module 2: Pronouns (Plural)
INSERT INTO public.word_cards (id, maori, english, type, color, pronunciation, person, note, module)
VALUES
  ('pr_matou', 'mātou', 'we/us (exclusive)', 'pronoun', 'red', 'mar-toh', '1st plural exclusive', 'Does NOT include the listener', 2),
  ('pr_tatou', 'tātou', 'we/us (inclusive)', 'pronoun', 'red', 'tar-toh', '1st plural inclusive', 'INCLUDES the listener - "all of us"', 2),
  ('pr_koutou', 'koutou', 'you (plural)', 'pronoun', 'red', 'koh-toh', '2nd plural', NULL, 2),
  ('pr_ratou', 'rātou', 'they/them', 'pronoun', 'red', 'rar-toh', '3rd plural', NULL, 2);

-- ============================================================================
-- WORD CARDS - Module 3: Past and Future Tense
-- ============================================================================

-- Module 3: Past Tense Markers
INSERT INTO public.word_cards (id, maori, english, type, color, pronunciation, usage, examples, module)
VALUES
  (
    'tm_i',
    'I',
    'simple past marker',
    'tense_marker',
    'yellow',
    'ee',
    'Marks completed actions in past - simple past',
    '[{"maori": "I kai au", "english": "I ate"}, {"maori": "I haere ia", "english": "He/she went"}]'::jsonb,
    3
  ),
  (
    'tm_kua',
    'Kua',
    'perfect past marker',
    'tense_marker',
    'yellow',
    'koo-ah',
    'Marks completed actions with present relevance',
    '[{"maori": "Kua kai au", "english": "I have eaten (already)"}, {"maori": "Kua haere ia", "english": "He/she has gone"}]'::jsonb,
    3
  );

-- Module 3: Future Tense Marker
INSERT INTO public.word_cards (id, maori, english, type, color, pronunciation, usage, examples, module)
VALUES
  (
    'tm_ka',
    'Ka',
    'future tense marker',
    'tense_marker',
    'yellow',
    'kah',
    'Marks actions that will happen',
    '[{"maori": "Ka kai au", "english": "I will eat"}, {"maori": "Ka haere ia", "english": "He/she will go"}]'::jsonb,
    3
  );

-- Module 3: Time Words
INSERT INTO public.word_cards (id, maori, english, type, color, pronunciation, usage, examples, module)
VALUES
  (
    'tw_inanahi',
    'inanahi',
    'yesterday',
    'time_word',
    'teal',
    'ee-nah-nah-hee',
    'Time reference for past',
    '[{"maori": "I kai au inanahi", "english": "I ate yesterday"}]'::jsonb,
    3
  ),
  (
    'tw_apopo',
    'āpōpō',
    'tomorrow',
    'time_word',
    'teal',
    'ar-paw-paw',
    'Time reference for future',
    '[{"maori": "Ka kai au āpōpō", "english": "I will eat tomorrow"}]'::jsonb,
    3
  ),
  (
    'tw_inaianei',
    'ināianei',
    'now',
    'time_word',
    'teal',
    'ee-nai-ah-nay',
    'Time reference for present',
    '[{"maori": "Kei te kai au ināianei", "english": "I am eating now"}]'::jsonb,
    3
  ),
  (
    'tw_anamata',
    'ānamata',
    'future/in the future',
    'time_word',
    'teal',
    'ar-nah-mah-tah',
    'General future time reference',
    '[{"maori": "Ka haere au ki te kura ānamata", "english": "I will go to school in the future"}]'::jsonb,
    3
  );

-- ============================================================================
-- CHALLENGES - Module 3: Past and Future Tense
-- ============================================================================

-- Tutorial: Past Tense Basics (I/Kua) (Lesson 1)
INSERT INTO public.challenges (id, lesson_id, order_index, pattern_type, target_maori, target_english, hint)
VALUES
  (
    '00000000-0003-0000-0000-000000000001',
    '00000000-0000-0000-0003-000000000001',
    1,
    'past_tense',
    'I kai au',
    'I ate',
    'Pattern: I (past marker) + verb + pronoun. Simple completed action.'
  ),
  (
    '00000000-0003-0000-0000-000000000002',
    '00000000-0000-0000-0003-000000000001',
    2,
    'past_tense',
    'Kua haere ia',
    'He/She has gone',
    'Kua shows the action is complete and relevant now. Kua + verb + pronoun.'
  );

-- Practice: Past Tense with Time Markers (Lesson 2)
INSERT INTO public.challenges (id, lesson_id, order_index, pattern_type, target_maori, target_english, hint)
VALUES
  (
    '00000000-0003-0000-0000-000000000003',
    '00000000-0000-0000-0003-000000000002',
    1,
    'past_tense',
    'I kai au inanahi',
    'I ate yesterday',
    'Add inanahi (yesterday) to specify when. Pattern: I + verb + pronoun + inanahi.'
  ),
  (
    '00000000-0003-0000-0000-000000000004',
    '00000000-0000-0000-0003-000000000002',
    2,
    'past_tense',
    'Kua mahi koe',
    'You have worked',
    'Kua + mahi (work) + koe. Action is complete with present relevance.'
  );

-- Tutorial: Future Tense Basics (Ka) (Lesson 3)
INSERT INTO public.challenges (id, lesson_id, order_index, pattern_type, target_maori, target_english, hint)
VALUES
  (
    '00000000-0003-0000-0000-000000000005',
    '00000000-0000-0000-0003-000000000003',
    1,
    'future_tense',
    'Ka kai au',
    'I will eat',
    'Pattern: Ka (future marker) + verb + pronoun. Simple future action.'
  ),
  (
    '00000000-0003-0000-0000-000000000006',
    '00000000-0000-0000-0003-000000000003',
    2,
    'future_tense',
    'Ka haere ia',
    'He/She will go',
    'Ka + haere (go) + ia. This action will happen in the future.'
  );

-- Practice: Future Tense with Time Markers (Lesson 4)
INSERT INTO public.challenges (id, lesson_id, order_index, pattern_type, target_maori, target_english, hint)
VALUES
  (
    '00000000-0003-0000-0000-000000000007',
    '00000000-0000-0000-0003-000000000004',
    1,
    'future_tense',
    'Ka kai au āpōpō',
    'I will eat tomorrow',
    'Add āpōpō (tomorrow) to specify when. Pattern: Ka + verb + pronoun + āpōpō.'
  ),
  (
    '00000000-0003-0000-0000-000000000008',
    '00000000-0000-0000-0003-000000000004',
    2,
    'future_tense',
    'Ka mahi koe ānamata',
    'You will work in the future',
    'Ka + mahi + koe + ānamata (future). General future time reference.'
  );

-- Challenge: Mixed Tense Practice (Lesson 5)
INSERT INTO public.challenges (id, lesson_id, order_index, pattern_type, target_maori, target_english, hint)
VALUES
  (
    '00000000-0003-0000-0000-000000000009',
    '00000000-0000-0000-0003-000000000005',
    1,
    'mixed_tense',
    'I kai au inanahi',
    'I ate yesterday',
    'Past: I + verb + pronoun + time. Review past tense pattern.'
  ),
  (
    '00000000-0003-0000-0000-000000000010',
    '00000000-0000-0000-0003-000000000005',
    2,
    'mixed_tense',
    'Kei te mahi au ināianei',
    'I am working now',
    'Present: Kei te + verb + pronoun + ināianei (now). Review present tense.'
  ),
  (
    '00000000-0003-0000-0000-000000000011',
    '00000000-0000-0000-0003-000000000005',
    3,
    'mixed_tense',
    'Ka haere au āpōpō',
    'I will go tomorrow',
    'Future: Ka + verb + pronoun + time. Review future tense pattern.'
  );

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
-- Total: 3 modules, 14 lessons, 30 challenges
--   - Module 1: 5 lessons, 11 challenges
--   - Module 2: 4 lessons, 8 challenges
--   - Module 3: 5 lessons, 11 challenges
-- Total: 60 word cards (21 Module 1 + 28 Module 2 + 11 Module 3)
