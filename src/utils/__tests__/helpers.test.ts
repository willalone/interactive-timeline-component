import { padNumber, clamp, lerp, formatYear, calculateAngle } from '../helpers';

describe('Helper functions', () => {
  describe('padNumber', () => {
    it('should pad single digit numbers with zeros', () => {
      expect(padNumber(5)).toBe('05');
      expect(padNumber(5, 3)).toBe('005');
    });

    it('should not pad numbers that already have enough digits', () => {
      expect(padNumber(123)).toBe('123');
      expect(padNumber(123, 2)).toBe('123');
    });
  });

  describe('clamp', () => {
    it('should return value within bounds', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it('should clamp values outside bounds', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('lerp', () => {
    it('should interpolate between values', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
    });
  });

  describe('formatYear', () => {
    it('should format positive years', () => {
      expect(formatYear(2023)).toBe('2023');
    });

    it('should format negative years with BC notation', () => {
      expect(formatYear(-100)).toBe('100 до н.э.');
    });
  });

  describe('calculateAngle', () => {
    it('should calculate angle between two points', () => {
      expect(calculateAngle(0, 0, 1, 0)).toBe(0);
      expect(calculateAngle(0, 0, 0, 1)).toBe(90);
      expect(calculateAngle(0, 0, -1, 0)).toBe(180);
    });
  });
});
