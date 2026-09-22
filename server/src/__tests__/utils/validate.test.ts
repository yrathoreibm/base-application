import { assertNonEmpty, assertValidStatus, assertMaxLength } from '../../utils/validate';

describe('assertNonEmpty', () => {
  it('should not throw for a valid non-empty string', () => {
    expect(() => assertNonEmpty('hello', 'name')).not.toThrow();
  });

  it('should throw when value is empty string', () => {
    expect(() => assertNonEmpty('', 'name')).toThrow('name must not be empty');
  });

  it('should throw when value is whitespace only', () => {
    expect(() => assertNonEmpty('   ', 'name')).toThrow('name must not be empty');
  });
});

describe('assertValidStatus', () => {
  it.each(['active', 'pending', 'inactive'])('should not throw for valid status "%s"', (s) => {
    expect(() => assertValidStatus(s)).not.toThrow();
  });

  it('should throw for an invalid status', () => {
    expect(() => assertValidStatus('deleted')).toThrow(
      'Invalid status "deleted". Must be one of: pending, active, inactive.'
    );
  });
});

describe('assertMaxLength', () => {
  it('should not throw when value is within limit', () => {
    expect(() => assertMaxLength('hello', 'name', 10)).not.toThrow();
  });

  it('should throw when value exceeds the max length', () => {
    expect(() => assertMaxLength('a'.repeat(121), 'name', 120)).toThrow(
      'name must not exceed 120 characters.'
    );
  });

  it('should not throw when value is exactly at the limit', () => {
    expect(() => assertMaxLength('a'.repeat(120), 'name', 120)).not.toThrow();
  });
});

// Made with Bob
