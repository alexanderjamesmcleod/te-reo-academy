import type { Card as CardType, ValidationResult } from '@te-reo-academy/shared';
import { Card } from './Card';
import { ValidationFeedback } from './ValidationFeedback';

/**
 * SentenceBuilder Component
 * Displays sentence construction area with slots
 *
 * Props:
 * - sentence: Array of cards (or null for empty slots)
 * - pattern: Color pattern from challenge
 * - validation: Validation result
 * - onPositionClick: Callback when slot is clicked
 */

interface SentenceBuilderProps {
  sentence: (CardType | null)[];
  pattern: string[];
  validation?: ValidationResult | null;
  onPositionClick: (index: number) => void;
}

const slotColorClasses = {
  blue: 'bg-blue-50 border-blue-300',
  green: 'bg-green-50 border-green-300',
  yellow: 'bg-yellow-50 border-yellow-300',
  red: 'bg-red-50 border-red-300',
  purple: 'bg-purple-50 border-purple-300',
  pink: 'bg-pink-50 border-pink-300',
  orange: 'bg-orange-50 border-orange-300',
  gray: 'bg-gray-50 border-gray-300',
};

const colorIndicatorClasses = {
  blue: 'bg-blue-400',
  green: 'bg-green-400',
  yellow: 'bg-yellow-400',
  red: 'bg-red-400',
  purple: 'bg-purple-400',
  pink: 'bg-pink-400',
  orange: 'bg-orange-400',
  gray: 'bg-gray-400',
};

export function SentenceBuilder({
  sentence,
  pattern,
  validation,
  onPositionClick,
}: SentenceBuilderProps) {
  const handleKeyPress = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPositionClick(index);
    }
  };

  return (
    <div className="sentence-builder bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Build Your Sentence</h3>
      <div className="sentence-slots flex flex-wrap gap-3 justify-center">
        {pattern.map((color, index) => (
          <div
            key={index}
            className={`
              sentence-slot
              ${slotColorClasses[color as keyof typeof slotColorClasses] || slotColorClasses.gray}
              ${sentence[index] ? 'filled' : 'empty'}
              w-36 h-44 rounded-xl border-2 border-dashed
              flex items-center justify-center
              cursor-pointer hover:shadow-md
              transition-all duration-200
            `}
            onClick={() => onPositionClick(index)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => handleKeyPress(e, index)}
            aria-label={`Slot ${index + 1} for ${color} card`}
          >
            {sentence[index] ? (
              <Card card={sentence[index]} size="normal" />
            ) : (
              <div className="empty-slot flex flex-col items-center gap-2 p-4">
                <div
                  className={`
                    color-indicator w-12 h-12 rounded-full
                    ${colorIndicatorClasses[color as keyof typeof colorIndicatorClasses] || colorIndicatorClasses.gray}
                  `}
                />
                <span className="color-label text-sm font-medium text-gray-600 capitalize">
                  {color}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {validation && <ValidationFeedback validation={validation} />}
    </div>
  );
}
