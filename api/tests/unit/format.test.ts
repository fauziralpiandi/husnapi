import { formatName } from '../../v1/index.js';

const sample = {
  id: 1,
  arabic: 'ن',
  latin: 'N',
  translations: {
    en: { meaning: 'You', tafsir: 'The one and only' },
    id: { meaning: 'Kamu', tafsir: 'Satu-satunya' },
  },
};

describe('formatName()', () => {
  it('should map correctly in EN', () => {
    const result = formatName(sample, 'en');

    expect(result.name.meaning).toBe('You');
  });

  it('should map correctly in ID', () => {
    const result = formatName(sample, 'id');

    expect(result.name.tafsir).toBe('Satu-satunya');
  });
});
