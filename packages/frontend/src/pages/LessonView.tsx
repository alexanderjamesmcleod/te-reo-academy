import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { CardHand, SentenceBuilder, ChallengeDisplay } from '@/components/game';
import { useLesson } from '@/hooks/useLesson';
import { useChallenges } from '@/hooks/useChallenges';
import { useSaveProgress, useUpdateProgress } from '@/hooks/useSaveProgress';
import { useLessonProgress } from '@/hooks/useProgress';
import {
  getWordById,
  getWordsByType,
  getWordsByModule,
  validateKoSentence,
  validateHeSentence,
  validateEquativeSentence,
  validateKeiTeSentence,
  ALL_WORDS,
} from '@te-reo-academy/shared';
import type { Card, ValidationResult } from '@te-reo-academy/shared';

/**
 * LessonView - Interactive lesson with integrated game
 *
 * Displays lesson content, grammar explanations, and allows users to
 * practice with the lesson's specific challenges right on the page.
 * Saves progress to Supabase after each attempt.
 */
export function LessonView() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  // Fetch lesson data
  const { data: lesson, isLoading: lessonLoading, error: lessonError } = useLesson(lessonId || '');

  // Fetch challenges for this lesson
  const { data: challengesData, isLoading: challengesLoading, error: challengesError } = useChallenges(lessonId || '');

  // Transform database challenges to expected format (memoized to prevent re-shuffling on every render)
  const challenges = useMemo(() => (challengesData || []).map(dbChallenge => {
    // Parse target sentence to build pattern and required cards
    const words = dbChallenge.target_maori.split(' ');
    const pattern: string[] = [];
    const requiredCards: string[] = [];

    // Word ID mapping for all modules
    const wordIdMap: Record<string, string> = {
      // Module 1: Particles & Articles
      'Ko': 'p_ko',
      'He': 'p_he',
      'te': 'art_te',
      'ngā': 'art_nga',
      // Module 1: Demonstratives
      'tēnei': 'd_tenei',
      'tēnā': 'd_tena',
      'tērā': 'd_tera',
      // Module 1: Pronouns
      'au': 'pr_au',
      'koe': 'pr_koe',
      'ia': 'pr_ia',
      // Module 2: Tense Markers
      'Kei': 'tm_keite', // Special case: "Kei te" will be handled in parsing logic
      // Module 3: Tense Markers
      'I': 'tm_i',
      'Kua': 'tm_kua',
      'Ka': 'tm_ka',
      // Module 2: Verbs
      'haere': 'v_haere',
      'kai': 'v_kai',
      'noho': 'v_noho',
      'oma': 'v_oma',
      'mahi': 'v_mahi',
      'ako': 'v_ako',
      'māhaki': 'v_mahaki',
      // Module 2: Adjectives
      'pai': 'adj_pai',
      'harikoa': 'adj_harikoa',
      'māuiui': 'adj_mauiui',
      'ngenge': 'adj_ngenge',
      'pōuri': 'adj_pouri',
      'riri': 'adj_riri',
      'ora': 'adj_ora',
      'hiamoe': 'adj_hiamoe',
      'matekai': 'adj_matekai',
      'hiainu': 'adj_hiainu',
      // Module 2: Intensifiers
      'tino': 'int_tino',
      'āhua': 'int_ahua',
      // Module 2: Locative Particles
      'i': 'pl_i',
      'ki': 'pl_ki',
      // Module 3: Time Words
      'inanahi': 'tw_inanahi',
      'āpōpō': 'tw_apopo',
      'ināianei': 'tw_inaianei',
      'ānamata': 'tw_anamata',
      // Module 2: Plural Pronouns
      'mātou': 'pr_matou',
      'tātou': 'pr_tatou',
      'koutou': 'pr_koutou',
      'rātou': 'pr_ratou',
    };

    // Parse words and build pattern
    console.log('[LessonView] Parsing target sentence:', dbChallenge.target_maori);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const nextWord = i < words.length - 1 ? words[i + 1] : null;

      // Special case: "Kei te" is a single tense marker
      if (word === 'Kei' && nextWord === 'te') {
        pattern.push('tense_marker');
        requiredCards.push('tm_keite');
        i++; // Skip next word since we consumed it
        continue;
      }

      // Check if word is in our mapping
      if (wordIdMap[word]) {
        const wordId = wordIdMap[word];
        console.log(`[LessonView] Found mapping: "${word}" → "${wordId}"`);
        const wordData = getWordById(wordId);

        if (wordData) {
          console.log(`[LessonView] Found word data for ${wordId}:`, wordData.maori, wordData.type);
          // Determine pattern type from word data
          if (wordData.type === 'particle') {
            pattern.push(word); // Ko, He
          } else if (wordData.type === 'article') {
            pattern.push(word); // te, ngā
          } else if (wordData.type === 'tense_marker') {
            pattern.push('tense_marker');
          } else if (wordData.type === 'verb') {
            pattern.push('verb');
          } else if (wordData.type === 'adjective') {
            pattern.push('adjective');
          } else if (wordData.type === 'intensifier') {
            pattern.push('intensifier');
          } else if (wordData.type === 'particle_locative') {
            pattern.push('locative');
          } else if (wordData.type === 'time_word') {
            pattern.push('time_word');
          } else {
            pattern.push(wordData.type);
          }
          requiredCards.push(wordId);
        } else {
          console.error(`[LessonView] ❌ CRITICAL: Word not found for mapped ID: "${wordId}"`);
          console.error('[LessonView] This means player will NOT have this card!');
          console.error('[LessonView] ALL_WORDS contains:', ALL_WORDS.length, 'words');
        }
      } else {
        // Unknown word - try to find it in word library as a noun
        console.warn(`[LessonView] Word "${word}" not in wordIdMap, trying as noun...`);
        const normalizedWord = word
          .toLowerCase()
          .replace(/ā/g, 'a')
          .replace(/ē/g, 'e')
          .replace(/ī/g, 'i')
          .replace(/ō/g, 'o')
          .replace(/ū/g, 'u');

        const possibleId = `n_${normalizedWord}`;
        console.log(`[LessonView] Trying noun ID: "${possibleId}"`);
        const wordData = getWordById(possibleId);

        if (wordData) {
          console.log(`[LessonView] Found as noun:`, wordData.maori);
          pattern.push('noun');
          requiredCards.push(possibleId);
        } else {
          console.error(`[LessonView] ❌ UNKNOWN WORD: "${word}"`);
          console.error('[LessonView] Player will NOT have this card - challenge impossible!');
          pattern.push('unknown');
          requiredCards.push(`unknown_${word}`);
        }
      }
    }

    // REQUIREMENT: Player must have AT LEAST one card of each color/type needed to complete the sentence
    // This is guaranteed by including ALL requiredCards in the hand

    // Add variation cards (2 similar cards for each type in the sentence)
    // Variation cards make the challenge more realistic - player must choose the correct word
    const variationCards: string[] = [];
    const typesInSentence = new Set(requiredCards.map(id => {
      const word = getWordById(id);
      return word?.type || '';
    }).filter(Boolean));

    // For each type, add up to 2 variation cards (cards not already in requiredCards)
    typesInSentence.forEach(type => {
      const wordsOfType = getWordsByType(type);
      const availableVariations = wordsOfType
        .filter(w => !requiredCards.includes(w.id))
        .slice(0, 2); // Get 2 variations (or fewer if not available)

      variationCards.push(...availableVariations.map(w => w.id));
    });

    // GUARANTEE: All required cards are included, ensuring player can complete the sentence
    // PLUS variation cards for increased difficulty (player must select correct words)
    const allCards = [...requiredCards, ...variationCards];

    // Debug: Log card distribution for verification
    if (allCards.length < requiredCards.length) {
      console.warn('[LessonView] Not all required cards found!', {
        requiredCount: requiredCards.length,
        actualCount: allCards.length,
        missing: requiredCards.filter(id => !allCards.includes(id))
      });
    }

    // Debug: Log challenge card composition
    console.log('[LessonView] Challenge cards:', {
      target: dbChallenge.target_maori,
      requiredCards: requiredCards.length,
      variationCards: variationCards.length,
      totalCards: allCards.length,
      types: Array.from(typesInSentence),
      cards: allCards.map(id => {
        const w = getWordById(id);
        return w ? `${w.maori}(${w.type})` : id;
      })
    });

    return {
      id: dbChallenge.id,
      type: 'build' as const,
      difficulty: 'easy' as const,
      instruction: dbChallenge.hint || `Build the sentence: ${dbChallenge.target_english}`,
      target: {
        maori: dbChallenge.target_maori,
        english: dbChallenge.target_english,
      },
      pattern,
      pattern_type: dbChallenge.pattern_type, // Add pattern_type for validation routing
      requiredCards: allCards, // Now includes variation cards!
      hints: dbChallenge.hint ? [{
        trigger: 'help',
        message: dbChallenge.hint,
      }] : undefined,
    };
  }), [challengesData]);

  // Fetch progress for this lesson
  const { data: progress } = useLessonProgress(lessonId || '');

  // Mutations
  const saveProgress = useSaveProgress();
  const updateProgress = useUpdateProgress();

  const isLoading = lessonLoading || challengesLoading;

  // Game state
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [hand, setHand] = useState<Card[]>([]);
  const [sentence, setSentence] = useState<(Card | null)[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>();
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const currentChallenge = challenges[currentChallengeIndex];

  // Mark lesson as in_progress when viewed
  useEffect(() => {
    if (lesson && !progress && lessonId) {
      updateProgress.mutate({
        moduleId: lesson.module_id,
        lessonId: lessonId,
        status: 'in_progress',
      });
    }
  }, [lesson, progress, lessonId]);

  // Initialize game when challenge changes
  useEffect(() => {
    if (currentChallenge && currentChallenge.requiredCards) {
      // Convert word IDs to Card objects
      const cards: Card[] = currentChallenge.requiredCards
        .map(wordId => {
          const word = getWordById(wordId);
          if (!word) {
            console.error('[LessonView] Word not found for ID:', wordId);
            return null;
          }
          return {
            id: word.id,
            maori: word.maori,
            english: word.english,
            type: word.type,
            color: word.color,
          } as Card;
        })
        .filter((card): card is Card => card !== null);

      // Shuffle cards
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setHand(shuffled);

      // Initialize sentence slots based on pattern length
      setSentence(new Array(currentChallenge.pattern.length).fill(null));
      setValidation(null);
      setSelectedCardId(undefined);
    }
  }, [currentChallenge]);

  // Card selection handler
  const handleCardSelect = (id: string) => {
    setSelectedCardId(id);
  };

  // Position click handler
  const handlePositionClick = (index: number) => {
    if (selectedCardId) {
      // Place card in sentence
      const card = hand.find(c => c.id === selectedCardId);
      if (card) {
        const newSentence = [...sentence];
        newSentence[index] = card;
        setSentence(newSentence);
        setHand(hand.filter(c => c.id !== selectedCardId));
        setSelectedCardId(undefined);
      }
    } else if (sentence[index]) {
      // Return card to hand
      const card = sentence[index];
      if (card) {
        setHand([...hand, card]);
        const newSentence = [...sentence];
        newSentence[index] = null;
        setSentence(newSentence);
      }
    }
  };

  // Validate sentence
  const handleValidate = () => {
    if (!currentChallenge || sentence.some(card => card === null)) {
      toast.error('Please complete the sentence first');
      return;
    }

    if (!lesson || !lessonId) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Determine which validator to use based on challenge pattern_type
    let result: ValidationResult;
    const validChallenge = {
      id: currentChallenge.id,
      instruction: currentChallenge.instruction,
      pattern: currentChallenge.pattern, // Use the actual pattern array, not pattern_type.split
      target: {
        maori: currentChallenge.target.maori,
        english: currentChallenge.target.english,
      },
    };

    // Map pattern_type to appropriate validator
    switch (currentChallenge.pattern_type) {
      case 'ko':
        result = validateKoSentence(sentence as Card[], validChallenge);
        break;
      case 'he':
        result = validateHeSentence(sentence as Card[], validChallenge);
        break;
      case 'equative':
        result = validateEquativeSentence(sentence as Card[], validChallenge);
        break;
      case 'kei_te':
      case 'past_tense':
      case 'future_tense':
      case 'mixed_tense':
        // All tense-based patterns use the same validator
        // (Kei te, I/Kua past, Ka future all follow: tense_marker + verb/adj + pronoun)
        result = validateKeiTeSentence(sentence as Card[], validChallenge);
        break;
      default:
        console.warn('[LessonView] Unknown pattern_type:', currentChallenge.pattern_type);
        result = validateKoSentence(sentence as Card[], validChallenge);
    }

    setValidation(result);

    const newScore = result.correct ? score + 10 : score;
    if (result.correct) {
      setScore(newScore);
    }

    // Save progress to database
    saveProgress.mutate({
      attempt: {
        lessonId: lessonId,
        challengeId: currentChallenge.id,
        userAnswer: (sentence as Card[]).map(c => ({ word: c.maori, type: c.type })),
        isCorrect: result.correct,
      },
      progress: {
        moduleId: lesson.module_id,
        lessonId: lessonId,
        status: currentChallengeIndex === challenges.length - 1 && result.correct
          ? 'completed'
          : 'in_progress',
        score: newScore,
      },
    });
  };

  // Reset current challenge
  const handleReset = () => {
    if (currentChallenge && currentChallenge.requiredCards) {
      const cards: Card[] = currentChallenge.requiredCards
        .map(wordId => getWordById(wordId))
        .filter((word): word is NonNullable<typeof word> => word !== null)
        .map(word => ({
          id: word.id,
          maori: word.maori,
          english: word.english,
          type: word.type,
          color: word.color,
        }));

      setHand([...cards].sort(() => Math.random() - 0.5));
      setSentence(new Array(currentChallenge.pattern.length).fill(null));
      setValidation(null);
      setSelectedCardId(undefined);
    }
  };

  // Next challenge
  const handleNextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      setAttempts(0);
    } else {
      toast.success('All challenges complete!');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-4 text-gray-600">Loading lesson...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error loading lesson
  if (lessonError) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-semibold mb-2">
              Failed to load lesson
            </p>
            <p className="text-red-600 text-sm">
              {lessonError instanceof Error ? lessonError.message : 'Unknown error'}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error loading challenges
  if (challengesError) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-semibold mb-2">
              Failed to load challenges
            </p>
            <p className="text-red-600 text-sm">
              {challengesError instanceof Error ? challengesError.message : 'Unknown error'}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Lesson not found
  if (!lesson) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Lesson not found
            </h2>
            <p className="text-gray-600 mb-6">
              The lesson you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (challenges.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <Link
              to={`/modules/${lesson.module_id}`}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4 text-sm font-medium"
            >
              ← Back to Module
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {lesson.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">{lesson.description}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-800">
                No challenges available for this lesson yet. Check back soon!
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const pattern = currentChallenge.pattern.map(p => {
    // Map pattern to colors for sentence builder - MUST match word library colors exactly!
    if (p === 'Ko' || p === 'He') return 'purple'; // Particles
    if (p === 'te' || p === 'ngā' || p === 'article') return 'gray'; // Articles
    if (p === 'noun') return 'blue'; // Nouns
    if (p === 'pronoun') return 'red'; // Pronouns
    if (p === 'demonstrative') return 'orange'; // Demonstratives (tēnei, tēnā, tērā)
    if (p === 'Kei te') return 'yellow'; // Tense markers
    if (p === 'adjective') return 'lightblue'; // Adjectives
    if (p === 'verb') return 'green'; // Verbs
    if (p === 'intensifier') return 'pink'; // Intensifiers (tino, āhua)
    if (p === 'locative') return 'brown'; // Locatives (i, ki)
    if (p === 'location') return 'blue'; // Locations are nouns (e.g., Tāmaki Makaurau)
    return 'gray'; // Default fallback
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Lesson Header */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <Link
            to={`/modules/${lesson.module_id}`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4 text-sm font-medium"
          >
            ← Back to Module
          </Link>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {lesson.title}
              </h1>
              <p className="text-lg text-gray-600">{lesson.description}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                lesson.lesson_type === 'tutorial'
                  ? 'bg-blue-100 text-blue-700'
                  : lesson.lesson_type === 'practice'
                  ? 'bg-green-100 text-green-700'
                  : lesson.lesson_type === 'challenge'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              {lesson.lesson_type}
            </span>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Challenge {currentChallengeIndex + 1} of {challenges.length}</span>
            <span>•</span>
            <span>Score: {score}</span>
            <span>•</span>
            <span>Attempts: {attempts}</span>
          </div>
        </div>

        {/* Grammar Section */}
        {lesson.grammar && (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📖 Grammar
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Sentence Structure
                </h3>
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                  <code className="text-lg font-mono text-indigo-900">
                    {lesson.grammar.structure}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Explanation
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {lesson.grammar.explanation}
                </p>
              </div>

              {lesson.grammar.tips && lesson.grammar.tips.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    💡 Tips
                  </h3>
                  <ul className="space-y-2">
                    {lesson.grammar.tips.map((tip, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-2 text-gray-700"
                      >
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interactive Game Section */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🎮 Practice Challenge
          </h2>

          {/* Challenge Display */}
          <ChallengeDisplay
            challenge={{
              name: currentChallenge.instruction,
              description: `Build: ${currentChallenge.target?.maori} (${currentChallenge.target?.english})`,
              hint: currentChallenge.hints?.[0]?.message || 'Follow the grammar pattern above',
              examples: [],
            }}
            round={currentChallengeIndex + 1}
            score={score}
          />

          {/* Sentence Builder */}
          <SentenceBuilder
            sentence={sentence}
            pattern={pattern}
            validation={validation}
            onPositionClick={handlePositionClick}
          />

          {/* Controls */}
          <div className="bg-gray-50 rounded-lg p-6 my-6">
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={handleValidate}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={sentence.some(card => card === null)}
              >
                Check Answer
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Reset
              </button>
              {validation?.correct && currentChallengeIndex < challenges.length - 1 && (
                <button
                  onClick={handleNextChallenge}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Next Challenge →
                </button>
              )}
            </div>
          </div>

          {/* Card Hand */}
          <CardHand
            cards={hand}
            selectedCardId={selectedCardId}
            onCardSelect={handleCardSelect}
          />

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              How to Play:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Click a card from your hand to select it</li>
              <li>Click an empty slot in the sentence builder to place the card</li>
              <li>Build the target sentence using the correct card order</li>
              <li>Click "Check Answer" when you think you have it right</li>
              <li>Click "Reset" to start over if needed</li>
            </ol>
          </div>
        </div>

        {/* Lesson Navigation */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Continue Learning
          </h2>

          <div className="flex gap-4 flex-wrap">
            <Link
              to={`/modules/${lesson.module_id}`}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              ← Back to Module
            </Link>

            {/* TODO: Add previous/next lesson navigation
            {previousLesson && (
              <Link
                to={`/lessons/${previousLesson.id}`}
                className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-semibold"
              >
                ← Previous: {previousLesson.title}
              </Link>
            )}

            {nextLesson && (
              <Link
                to={`/lessons/${nextLesson.id}`}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Next: {nextLesson.title} →
              </Link>
            )}
            */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
