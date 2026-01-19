/**
 * Interface for checking time slot conflicts
 * Enables dependency injection and testing
 */
export interface ConflictChecker {
  /**
   * Check if a time slot has conflicts
   * @param userId User ID to check
   * @param start Start time (UTC)
   * @param end End time (UTC)
   * @returns true if there is a conflict, false otherwise
   * @throws Error if check fails (for fail-closed policy)
   */
  checkConflict(userId: string, start: Date, end: Date): Promise<boolean>;
}

export const CONFLICT_CHECKER = 'CONFLICT_CHECKER';
