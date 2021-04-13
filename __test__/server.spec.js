//This test is based on this blog post:
//https://zellwk.com/blog/endpoint-testing/
//and this Knowledge post:
//https://knowledge.udacity.com/questions/71133
const app = require('../src/server/server');
const supertest = require('supertest');
const request = supertest(app);

it('Gets the test endpoint', async done => {
  const res = await request.get('/');
  expect(res.status).toBe(200);
  done()
})
