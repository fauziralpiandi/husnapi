import * as fs from 'fs/promises';

// trigger the top-level hook `await loadNames()`
const loadRoutes = async () => await import('../../v1/index.js');

vi.mock('fs/promises');

describe('loadNames()', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('should load and freeze names correctly', async () => {
    const fakeData = JSON.stringify([
      {
        id: 1,
        arabic: 'ن',
        latin: 'N',
        translations: {
          en: { meaning: 'You', tafsir: 'The one and only' },
          id: { meaning: 'Kamu', tafsir: 'Satu-satunya' },
        },
      },
    ]);

    (fs.readFile as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      fakeData,
    );

    const mod = await loadRoutes();

    expect(mod.v1).toBeDefined();
  });

  it('should handle readFile error gracefully', async () => {
    (fs.readFile as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('file not found'),
    );

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mod = await loadRoutes();

    expect(mod.v1).toBeDefined();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
