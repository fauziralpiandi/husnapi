import request from 'supertest';
import husnapi from '../../index.js';

describe('App integration', () => {
  it('GET / should return metadata', async () => {
    const res = await request(husnapi).get('/');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data).toHaveProperty('description');
    expect(res.body.data).toHaveProperty('version');
  });

  it('should return 404', async () => {
    const res = await request(husnapi).get('/not-found');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.data).toBe(null);
  });

  it('should set CORS headers', async () => {
    const res = await request(husnapi).get('/');

    expect(res.headers['access-control-allow-origin']).toBe('*');
    expect(res.headers['access-control-allow-methods']).toBe('GET');
  });
});
