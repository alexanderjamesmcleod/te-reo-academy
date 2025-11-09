// Utility helper functions

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function calculateStreak(lastActiveDate: Date, currentDate: Date = new Date()): number {
  const daysDiff = Math.floor(
    (currentDate.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysDiff <= 1 ? 1 : 0; // Simplified - real implementation would track properly
}
