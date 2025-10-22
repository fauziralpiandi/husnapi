import request from 'supertest';
import husnapi from '../../index.js';

describe('v1 routes', () => {
  describe('GET /v1/names', () => {
    it('should return all names', async () => {
      const res = await request(husnapi).get('/v1/names');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0]).toHaveProperty('arabic');
    });

    it('should return names in Indonesian when lang=id', async () => {
      const res = await request(husnapi).get('/v1/names?lang=id');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].name).toHaveProperty('meaning');
    });

    it('should filter names by query', async () => {
      const res = await request(husnapi).get('/v1/names?q=allah');

      expect(res.status).toBe(200);
      expect(
        res.body.data.some((n: any) =>
          n.name.meaning.toLowerCase().includes('allah'),
        ),
      ).toBe(true);
    });

    it('should filter names in Indonesian by query', async () => {
      const res = await request(husnapi).get('/v1/names?lang=id&q=maha');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 if query not found', async () => {
      const res = await request(husnapi).get('/v1/names?q=nonexistentterm');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should handle invalid language parameter gracefully', async () => {
      const res = await request(husnapi).get('/v1/names?lang=fr');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /v1/names/:id', () => {
    it('should return specific name by ID', async () => {
      const res = await request(husnapi).get('/v1/names/1');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('arabic', 'ٱللّٰهُ');
    });

    it('should return name in Indonesian when lang=id', async () => {
      const res = await request(husnapi).get('/v1/names/1?lang=id');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toHaveProperty('meaning');
    });

    it('should return 404 for missing ID', async () => {
      const res = await request(husnapi).get('/v1/names/99999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid ID', async () => {
      const res = await request(husnapi).get('/v1/names/abc');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return partial property if prop specified', async () => {
      const res = await request(husnapi).get('/v1/names/1?prop=meaning');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('meaning');
    });

    it('should return 400 if prop invalid', async () => {
      const res = await request(husnapi).get('/v1/names/1?prop=invalid');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should handle all valid props from name object', async () => {
      const props = ['meaning', 'tafsir'];

      for (const prop of props) {
        const res = await request(husnapi).get(`/v1/names/1?prop=${prop}`);
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty(prop);
      }
    });
  });

  describe('GET /v1/names/random', () => {
    it('should return 1 random name by default', async () => {
      const res = await request(husnapi).get('/v1/names/random');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it('should return random names in Indonesian when lang=id', async () => {
      const res = await request(husnapi).get('/v1/names/random?lang=id');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].name).toHaveProperty('meaning');
    });

    it('should respect count param', async () => {
      const res = await request(husnapi).get('/v1/names/random?count=3');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(3);
    });

    it('should not exceed available data', async () => {
      const res = await request(husnapi).get('/v1/names/random?count=999');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(99);
    });

    it('should default to 1 when count=0', async () => {
      const res = await request(husnapi).get('/v1/names/random?count=0');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('GET /v1/health', () => {
    it('should show uptime and memory usage', async () => {
      const res = await request(husnapi).get('/v1/health');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('memory');
      expect(res.body.data.memory).toHaveProperty('rss');
    });
  });
});
