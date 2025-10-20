import request from 'supertest';
import { husnapi } from '../../index.js';

describe('App integration', () => {
  it('GET / should return metadata', async () => {
    const res = await request(husnapi).get('/');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data).toHaveProperty('description');
    expect(res.body.data).toHaveProperty('version');
  });
});
