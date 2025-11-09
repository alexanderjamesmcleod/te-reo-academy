import type { Card as CardType } from '@te-reo-academy/shared';

/**
 * Card Component
 * Displays a single playing card with Te Reo Māori word
 *
 * Props:
 * - card: Card object with {maori, english, type, color}
 * - selected: Boolean, whether card is selected
 * - onClick: Click handler
 * - size: 'small' | 'normal' | 'large'
 * - showEnglish: Show English translation instead of Māori
 */

interface CardProps {
  card: CardType;
  selected?: boolean;
  onClick?: (id: string) => void;
  size?: 'small' | 'normal' | 'large';
  showEnglish?: boolean;
}

const sizeClasses = {
  small: 'w-24 h-32 text-sm',
  normal: 'w-32 h-40 text-base',
  large: 'w-40 h-52 text-lg',
};

const colorClasses = {
  blue: 'bg-blue-100 border-blue-400',
  green: 'bg-green-100 border-green-400',
  yellow: 'bg-yellow-100 border-yellow-400',
  red: 'bg-red-100 border-red-400',
  purple: 'bg-purple-100 border-purple-400',
  pink: 'bg-pink-100 border-pink-400',
  orange: 'bg-orange-100 border-orange-400',
  gray: 'bg-gray-100 border-gray-400',
};

export function Card({
  card,
  selected = false,
  onClick,
  size = 'normal',
  showEnglish = false,
}: CardProps) {
  if (!card) return null;

  const handleClick = () => {
    if (onClick) {
      onClick(card.id);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${colorClasses[card.color as keyof typeof colorClasses] || colorClasses.gray}
        ${selected ? 'scale-105 -translate-y-2 shadow-xl ring-2 ring-gray-800' : 'shadow-md'}
        ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''}
        rounded-xl border-2 p-4
        flex flex-col justify-between items-center
        transition-all duration-200 ease-in-out
        select-none relative
      `}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
      onKeyPress={handleKeyPress}
      aria-label={`${card.maori} - ${card.english} (${card.type})`}
    >
      <div className="card-word text-center font-bold text-gray-800">
        {showEnglish ? card.english : card.maori}
      </div>
      <div className="card-translation text-center text-sm text-gray-600 italic">
        {showEnglish ? card.maori : card.english}
      </div>
      <div className="card-type text-xs text-gray-500 uppercase tracking-wide">
        {card.type}
      </div>
    </div>
  );
}
