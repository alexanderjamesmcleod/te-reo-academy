import { useState, useEffect } from 'react';
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
  validateKoSentence,
  validateHeSentence,
  validateEquativeSentence,
  validateKeiTeSentence,
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

  // Transform database challenges to expected format
  const challenges = (challengesData || []).map(dbChallenge => {
    // Parse target sentence to build pattern and required cards
    const words = dbChallenge.target_maori.split(' ');
    const pattern: string[] = [];
    const requiredCards: string[] = [];

    words.forEach(word => {
      // Map actual words to pattern slots and word IDs
      // Word library uses prefixed IDs: p_ for particles, art_ for articles, n_ for nouns, etc.
      if (word === 'Ko') {
        pattern.push('Ko');
        requiredCards.push('p_ko');
      } else if (word === 'He') {
        pattern.push('He');
        requiredCards.push('p_he');
      } else if (word === 'te') {
        pattern.push('te');
        requiredCards.push('art_te');
      } else if (word === 'ngā') {
        pattern.push('ngā');
        requiredCards.push('art_nga');
      } else if (word === 'tēnei') {
        pattern.push('demonstrative');
        requiredCards.push('d_tenei');
      } else if (word === 'tēnā') {
        pattern.push('demonstrative');
        requiredCards.push('d_tena');
      } else if (word === 'tērā') {
        pattern.push('demonstrative');
        requiredCards.push('d_tera');
      } else if (word === 'au') {
        pattern.push('pronoun');
        requiredCards.push('pr_au');
      } else if (word === 'koe') {
        pattern.push('pronoun');
        requiredCards.push('pr_koe');
      } else if (word === 'ia') {
        pattern.push('pronoun');
        requiredCards.push('pr_ia');
      } else {
        // It's a noun - convert to word library ID format
        pattern.push('noun');
        // Convert macrons: ā→a, ē→e, ī→i, ō→o, ū→u
        const normalizedWord = word
          .toLowerCase()
          .replace(/ā/g, 'a')
          .replace(/ē/g, 'e')
          .replace(/ī/g, 'i')
          .replace(/ō/g, 'o')
          .replace(/ū/g, 'u');
        requiredCards.push(`n_${normalizedWord}`);
      }
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
      requiredCards,
      hints: dbChallenge.hint ? [{
        trigger: 'help',
        message: dbChallenge.hint,
      }] : undefined,
    };
  });

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
      instruction: '',
      pattern: currentChallenge.pattern_type.split('_'),
      target: {
        maori: currentChallenge.target_maori,
        english: currentChallenge.target_english,
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
        result = validateKeiTeSentence(sentence as Card[], validChallenge);
        break;
      default:
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
