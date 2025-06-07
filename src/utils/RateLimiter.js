class RateLimiter {
  constructor(limit, timeWindowMs) {
    this.limit = limit;
    this.timeWindowMs = timeWindowMs;
    this.requests = [];
  }

  isAllowed() {
    const now = Date.now();
    this.requests = this.requests.filter(timestamp => now - timestamp < this.timeWindowMs);

    if (this.requests.length < this.limit) {
      this.requests.push(now);
      return true;
    }
    return false;
  }
}

module.exports = RateLimiter;
