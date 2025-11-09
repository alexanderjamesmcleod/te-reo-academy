/**
 * ChallengeDisplay Component
 * Shows current challenge information
 *
 * Props:
 * - challenge: Challenge object
 * - round: Current round number
 * - score: Player score
 */

interface Challenge {
  name: string;
  description: string;
  hint?: string;
  examples?: string[];
}

interface ChallengeDisplayProps {
  challenge: Challenge | null;
  round?: number;
  score?: number;
}

export function ChallengeDisplay({ challenge, round, score }: ChallengeDisplayProps) {
  if (!challenge) return null;

  return (
    <div className="challenge-display bg-white rounded-lg p-6 shadow-md mb-6">
      <div className="challenge-header flex justify-between items-start mb-4">
        <div className="challenge-info flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{challenge.name}</h2>
          <p className="challenge-description text-gray-600">{challenge.description}</p>
        </div>
        {(round !== undefined || score !== undefined) && (
          <div className="game-stats flex gap-4 ml-6">
            {round !== undefined && (
              <div className="stat text-center bg-blue-50 px-4 py-2 rounded-lg">
                <span className="stat-label block text-xs text-blue-600 uppercase tracking-wide mb-1">
                  Round
                </span>
                <span className="stat-value block text-2xl font-bold text-blue-700">
                  {round}
                </span>
              </div>
            )}
            {score !== undefined && (
              <div className="stat text-center bg-green-50 px-4 py-2 rounded-lg">
                <span className="stat-label block text-xs text-green-600 uppercase tracking-wide mb-1">
                  Score
                </span>
                <span className="stat-value block text-2xl font-bold text-green-700">
                  {score}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {challenge.hint && (
        <div className="challenge-hint bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <strong className="text-yellow-800">Hint:</strong>{' '}
          <span className="text-yellow-700">{challenge.hint}</span>
        </div>
      )}

      {challenge.examples && challenge.examples.length > 0 && (
        <div className="challenge-examples bg-indigo-50 border-l-4 border-indigo-400 p-4">
          <strong className="text-indigo-800 block mb-2">Examples:</strong>
          <ul className="list-disc list-inside space-y-1">
            {challenge.examples.map((example, i) => (
              <li key={i} className="text-indigo-700">
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
