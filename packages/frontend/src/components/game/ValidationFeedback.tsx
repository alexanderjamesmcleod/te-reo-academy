import type { ValidationResult } from '@te-reo-academy/shared';

/**
 * ValidationFeedback Component
 * Shows validation results with helpful feedback
 *
 * Props:
 * - validation: Validation result object
 */

interface ValidationFeedbackProps {
  validation: ValidationResult | null;
}

export function ValidationFeedback({ validation }: ValidationFeedbackProps) {
  if (!validation) return null;

  const { valid, feedback, translation, breakdown } = validation;

  const feedbackTypeClasses = {
    success: 'bg-green-50 border-green-400 text-green-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    error: 'bg-red-50 border-red-400 text-red-800',
  };

  return (
    <div
      className={`
        validation-feedback
        ${feedbackTypeClasses[feedback.type]}
        border-2 rounded-lg p-4 mt-4
      `}
    >
      <div className="feedback-message">
        <strong className="text-lg block mb-2">{feedback.message}</strong>
        {feedback.hint && (
          <p className="feedback-hint text-sm mt-1">💡 {feedback.hint}</p>
        )}
      </div>

      {valid && translation && (
        <div className="validation-success mt-4 space-y-3">
          <div className="translation">
            <strong>Translation:</strong> {translation}
          </div>

          {breakdown && breakdown.length > 0 && (
            <div className="breakdown">
              <strong className="block mb-2">Word breakdown:</strong>
              <div className="breakdown-items flex flex-wrap gap-3">
                {breakdown.map((item, i) => (
                  <span
                    key={i}
                    className="breakdown-item inline-flex flex-col bg-white rounded-md p-2 shadow-sm border border-gray-200"
                  >
                    <span className="word-maori font-semibold text-gray-800">
                      {item.word}
                    </span>
                    <span className="word-english text-sm text-gray-600">
                      ({item.meaning})
                    </span>
                    <span className="word-role text-xs text-gray-500 uppercase">
                      {item.role}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {feedback.naturalness && feedback.naturalness !== 'natural' && (
            <div
              className={`
                naturalness p-3 rounded-md
                ${
                  feedback.naturalness === 'unnatural'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }
              `}
            >
              <strong>Note:</strong>{' '}
              {feedback.hint || 'This phrase is less common in everyday speech.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
