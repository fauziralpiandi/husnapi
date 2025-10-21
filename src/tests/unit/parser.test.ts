import { parseLang, parseQuery } from '../../v1/index.js';

describe('parseLang()', () => {
  it('returns "en" for invalid input', () => {
    expect(parseLang(undefined)).toBe('en');
    expect(parseLang('fr')).toBe('en');
  });

  it('returns "id" for valid input', () => {
    expect(parseLang('id')).toBe('id');
  });
});

describe('parseQuery()', () => {
  it('returns clean string for valid input', () => {
    expect(parseQuery('asma')).toBe('asma');
  });

  it('removes invalid chars', () => {
    expect(parseQuery('abc@')).toBe('');
  });

  it('returns empty string for non-string', () => {
    expect(parseQuery(123)).toBe('');
  });
});
