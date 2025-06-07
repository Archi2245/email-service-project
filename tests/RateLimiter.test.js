const RateLimiter = require('../src/utils/RateLimiter');

describe('RateLimiter', () => {
  let rateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter(2, 1000); // 2 requests per second
  });

  test('should allow request if under limit', () => {
    expect(rateLimiter.isAllowed()).toBe(true);
    expect(rateLimiter.isAllowed()).toBe(true);
  });

  test('should block request if over limit', () => {
    rateLimiter.isAllowed();
    rateLimiter.isAllowed();
    expect(rateLimiter.isAllowed()).toBe(false);
  });
});
