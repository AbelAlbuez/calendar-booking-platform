import { hasTimeOverlap, validateTimeInterval } from './time';

describe('hasTimeOverlap', () => {
  // Test case 1: No overlap - intervals don't touch
  it('should return false when intervals are completely separate', () => {
    const start1 = new Date('2025-01-20T10:00:00Z');
    const end1 = new Date('2025-01-20T11:00:00Z');
    const start2 = new Date('2025-01-20T12:00:00Z');
    const end2 = new Date('2025-01-20T13:00:00Z');

    expect(hasTimeOverlap(start1, end1, start2, end2)).toBe(false);
  });

  // Test case 2: No overlap - touching endpoints (end1 === start2)
  it('should return false when intervals touch at endpoints', () => {
    const start1 = new Date('2025-01-20T10:00:00Z');
    const end1 = new Date('2025-01-20T11:00:00Z');
    const start2 = new Date('2025-01-20T11:00:00Z'); // Same as end1
    const end2 = new Date('2025-01-20T12:00:00Z');

    expect(hasTimeOverlap(start1, end1, start2, end2)).toBe(false);
  });

  // Test case 3: Overlap - same interval
  it('should return true when intervals are identical', () => {
    const start1 = new Date('2025-01-20T10:00:00Z');
    const end1 = new Date('2025-01-20T11:00:00Z');
    const start2 = new Date('2025-01-20T10:00:00Z');
    const end2 = new Date('2025-01-20T11:00:00Z');

    expect(hasTimeOverlap(start1, end1, start2, end2)).toBe(true);
  });

  // Test case 4: Overlap - partial overlap (start2 before end1)
  it('should return true when intervals partially overlap', () => {
    const start1 = new Date('2025-01-20T10:00:00Z');
    const end1 = new Date('2025-01-20T12:00:00Z');
    const start2 = new Date('2025-01-20T11:00:00Z');
    const end2 = new Date('2025-01-20T13:00:00Z');

    expect(hasTimeOverlap(start1, end1, start2, end2)).toBe(true);
  });

  // Test case 5: Overlap - interval1 contains interval2
  it('should return true when first interval contains second', () => {
    const start1 = new Date('2025-01-20T10:00:00Z');
    const end1 = new Date('2025-01-20T14:00:00Z');
    const start2 = new Date('2025-01-20T11:00:00Z');
    const end2 = new Date('2025-01-20T12:00:00Z');

    expect(hasTimeOverlap(start1, end1, start2, end2)).toBe(true);
  });

  // Test case 6: Overlap - interval2 contains interval1
  it('should return true when second interval contains first', () => {
    const start1 = new Date('2025-01-20T11:00:00Z');
    const end1 = new Date('2025-01-20T12:00:00Z');
    const start2 = new Date('2025-01-20T10:00:00Z');
    const end2 = new Date('2025-01-20T14:00:00Z');

    expect(hasTimeOverlap(start1, end1, start2, end2)).toBe(true);
  });

  // Test case 7: Overlap - intervals start at same time
  it('should return true when intervals start at the same time', () => {
    const start1 = new Date('2025-01-20T10:00:00Z');
    const end1 = new Date('2025-01-20T11:00:00Z');
    const start2 = new Date('2025-01-20T10:00:00Z');
    const end2 = new Date('2025-01-20T12:00:00Z');

    expect(hasTimeOverlap(start1, end1, start2, end2)).toBe(true);
  });

  // Test case 8: Overlap - intervals end at same time
  it('should return true when intervals end at the same time', () => {
    const start1 = new Date('2025-01-20T10:00:00Z');
    const end1 = new Date('2025-01-20T12:00:00Z');
    const start2 = new Date('2025-01-20T11:00:00Z');
    const end2 = new Date('2025-01-20T12:00:00Z');

    expect(hasTimeOverlap(start1, end1, start2, end2)).toBe(true);
  });

  // Test case 9: Invalid interval - start1 >= end1
  it('should throw error when first interval is invalid (start >= end)', () => {
    const start1 = new Date('2025-01-20T11:00:00Z');
    const end1 = new Date('2025-01-20T10:00:00Z'); // Invalid!
    const start2 = new Date('2025-01-20T12:00:00Z');
    const end2 = new Date('2025-01-20T13:00:00Z');

    expect(() => hasTimeOverlap(start1, end1, start2, end2)).toThrow(
      'Invalid interval: start1 must be before end1',
    );
  });

  // Test case 10: Invalid interval - start2 >= end2
  it('should throw error when second interval is invalid (start >= end)', () => {
    const start1 = new Date('2025-01-20T10:00:00Z');
    const end1 = new Date('2025-01-20T11:00:00Z');
    const start2 = new Date('2025-01-20T13:00:00Z');
    const end2 = new Date('2025-01-20T12:00:00Z'); // Invalid!

    expect(() => hasTimeOverlap(start1, end1, start2, end2)).toThrow(
      'Invalid interval: start2 must be before end2',
    );
  });
});

describe('validateTimeInterval', () => {
  it('should not throw error for valid interval', () => {
    const start = new Date('2025-01-20T10:00:00Z');
    const end = new Date('2025-01-20T11:00:00Z');

    expect(() => validateTimeInterval(start, end)).not.toThrow();
  });

  it('should throw error when start equals end', () => {
    const start = new Date('2025-01-20T10:00:00Z');
    const end = new Date('2025-01-20T10:00:00Z');

    expect(() => validateTimeInterval(start, end)).toThrow(
      'Start time must be before end time',
    );
  });

  it('should throw error when start is after end', () => {
    const start = new Date('2025-01-20T11:00:00Z');
    const end = new Date('2025-01-20T10:00:00Z');

    expect(() => validateTimeInterval(start, end)).toThrow(
      'Start time must be before end time',
    );
  });
});
