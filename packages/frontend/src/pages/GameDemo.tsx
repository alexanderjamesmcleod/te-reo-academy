import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { CardHand, SentenceBuilder, ChallengeDisplay } from '@/components/game';
import { validateKoSentence } from '@te-reo-academy/shared';
import type { Card, ValidationResult } from '@te-reo-academy/shared';

/**
 * GameDemo Page
 * Demonstrates the card game components with sample data
 * This page tests Phase 4 component integration
 */

// Sample cards for demo - colors MUST match word library!
const demoCards: Card[] = [
  {
    id: '1',
    maori: 'Ko',
    english: 'definite particle',
    type: 'particle',
    color: 'purple', // Particles are purple
  },
  {
    id: '2',
    maori: 'te',
    english: 'the (singular)',
    type: 'article',
    color: 'gray', // Articles are gray
  },
  {
    id: '3',
    maori: 'kuri',
    english: 'dog',
    type: 'noun',
    color: 'blue', // Nouns are blue
  },
  {
    id: '4',
    maori: 'ngā',
    english: 'the (plural)',
    type: 'article',
    color: 'gray', // Articles are gray
  },
  {
    id: '5',
    maori: 'tamariki',
    english: 'children',
    type: 'noun',
    color: 'blue', // Nouns are blue
  },
];

// Sample challenge
const demoChallenge = {
  name: 'Ko Sentence Pattern',
  description: 'Build a sentence using Ko + article + noun to say "It is the dog"',
  hint: 'Remember: Ko is used for definite statements',
  examples: ['Ko te whare (It is the house)', 'Ko te kuri (It is the dog)'],
};

export function GameDemo() {
  const [hand, setHand] = useState<Card[]>(demoCards);
  const [sentence, setSentence] = useState<(Card | null)[]>([null, null, null]);
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>();
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [round] = useState(1);
  const [score] = useState(0);

  const pattern = ['purple', 'gray', 'blue']; // Ko (purple) + article (gray) + noun (blue)

  const handleCardSelect = (id: string) => {
    setSelectedCardId(id);
  };

  const handlePositionClick = (index: number) => {
    if (selectedCardId) {
      // Find the card
      const card = hand.find((c) => c.id === selectedCardId);
      if (card) {
        // Add to sentence
        const newSentence = [...sentence];
        newSentence[index] = card;
        setSentence(newSentence);

        // Remove from hand
        setHand(hand.filter((c) => c.id !== selectedCardId));
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

  const handleValidate = () => {
    // Create a challenge object for validation
    const challenge = {
      id: 'demo-ko',
      instruction: 'Build a Ko sentence',
      pattern: ['purple', 'blue', 'green'],
      target: {
        maori: 'Ko te kuri',
        english: 'It is the dog',
      },
    };

    const result = validateKoSentence(sentence as Card[], challenge);
    setValidation(result);
  };

  const handleReset = () => {
    setHand(demoCards);
    setSentence([null, null, null]);
    setSelectedCardId(undefined);
    setValidation(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4 text-sm font-medium"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Game Components Demo
          </h1>
          <p className="text-gray-600">
            Testing Phase 4: Core Game Components (Card, CardHand, SentenceBuilder)
          </p>
        </div>

        {/* Challenge Display */}
        <ChallengeDisplay challenge={demoChallenge} round={round} score={score} />

        {/* Sentence Builder */}
        <SentenceBuilder
          sentence={sentence}
          pattern={pattern}
          validation={validation}
          onPositionClick={handlePositionClick}
        />

        {/* Controls */}
        <div className="bg-white rounded-lg p-6 shadow-md my-6">
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleValidate}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={sentence.some((card) => card === null)}
            >
              Check Answer
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Card Hand */}
        <CardHand
          cards={hand}
          selectedCardId={selectedCardId}
          onCardSelect={handleCardSelect}
        />

        {/* Instructions */}
        <div className="bg-white rounded-lg p-6 shadow-md mt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            How to Play:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click a card from your hand to select it</li>
            <li>Click an empty slot in the sentence builder to place the card</li>
            <li>
              Build the sentence "Ko te kuri" (It is the dog) using the correct card
              order
            </li>
            <li>Click "Check Answer" when you think you have it right</li>
            <li>Click "Reset" to start over</li>
          </ol>
        </div>
      </div>
    </DashboardLayout>
  );
}
