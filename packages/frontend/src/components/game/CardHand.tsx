import type { Card as CardType } from '@te-reo-academy/shared';
import { Card } from './Card';

/**
 * CardHand Component
 * Displays the player's hand of cards
 *
 * Props:
 * - cards: Array of card objects
 * - selectedCardId: ID of currently selected card
 * - onCardSelect: Callback when card is clicked
 */

interface CardHandProps {
  cards: CardType[];
  selectedCardId?: string;
  onCardSelect: (id: string) => void;
}

export function CardHand({ cards, selectedCardId, onCardSelect }: CardHandProps) {
  if (!cards || cards.length === 0) {
    return (
      <div className="hand hand-empty bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Your Hand</h3>
        <p className="text-gray-500">No cards remaining</p>
      </div>
    );
  }

  return (
    <div className="hand bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        Your Hand ({cards.length} card{cards.length !== 1 ? 's' : ''})
      </h3>
      <div className="hand-cards flex flex-wrap gap-4 justify-center">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            selected={selectedCardId === card.id}
            onClick={onCardSelect}
          />
        ))}
      </div>
    </div>
  );
}
