/**
 * Check if two time intervals overlap
 * 
 * Two intervals overlap if: start1 < end2 AND start2 < end1
 * 
 * Edge cases:
 * - Touching endpoints (end1 === start2): NO overlap
 * - Same interval: YES overlap
 * - Partial overlap: YES overlap
 * - One contains other: YES overlap
 * 
 * @param start1 Start of first interval
 * @param end1 End of first interval
 * @param start2 Start of second interval
 * @param end2 End of second interval
 * @returns true if intervals overlap
 */
export function hasTimeOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date,
): boolean {
  // Validate intervals
  if (start1 >= end1) {
    throw new Error('Invalid interval: start1 must be before end1');
  }
  if (start2 >= end2) {
    throw new Error('Invalid interval: start2 must be before end2');
  }

  // Check for overlap: start1 < end2 AND start2 < end1
  return start1 < end2 && start2 < end1;
}

/**
 * Validate that start time is before end time
 */
export function validateTimeInterval(start: Date, end: Date): void {
  if (start >= end) {
    throw new Error('Start time must be before end time');
  }
}

/**
 * Check if a time is in the past
 */
export function isPast(date: Date): boolean {
  return date < new Date();
}

/**
 * Format a date to ISO string (UTC)
 */
export function toISOString(date: Date): string {
  return date.toISOString();
}

/**
 * Parse ISO string to Date
 */
export function parseISOString(isoString: string): Date {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid ISO date string');
  }
  return date;
}
