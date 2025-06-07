const MockEmailProvider1 = require('../providers/MockEmailProvider1');
const MockEmailProvider2 = require('../providers/MockEmailProvider2');
const RateLimiter = require('../utils/RateLimiter');
const StatusTracker = require('../utils/StatusTracker');
const CircuitBreaker = require('../utils/CircuitBreaker');

class EmailService {
    constructor() {
        this.providers = [new MockEmailProvider1(), new MockEmailProvider2()];
        this.rateLimiter = new RateLimiter(5, 10000); // 5 emails per 10 seconds
        this.statusTracker = new StatusTracker();

        // Circuit breakers for each provider
        this.circuitBreakers = new Map(
            this.providers.map(p => [p.name, new CircuitBreaker()])
        );
    }

    async sendEmail(emailData) {
        const { to, subject, body, idempotencyKey } = emailData;

        // 1. Idempotency check
        if (this.statusTracker.hasKey(idempotencyKey)) {
            return {
                message: 'Duplicate request. Returning existing status.',
                status: this.statusTracker.getStatus(idempotencyKey)
            };
        }

        // 2. Rate limiting check
        if (!this.rateLimiter.isAllowed()) {
            this.statusTracker.setStatus(idempotencyKey, 'RATE_LIMITED');
            return { error: 'Rate limit exceeded', status: 'RATE_LIMITED' };
        }

        let lastError = null;

        // 3. Try providers with circuit breakers and retry logic
        for (const provider of this.providers) {
            const cb = this.circuitBreakers.get(provider.name);

            if (!cb.canAttempt()) {
                console.log(`⛔ ${provider.name} is temporarily disabled (Circuit OPEN)`);
                continue;
            }

            let attempt = 0;
            let success = false;

            while (attempt < 3 && !success) {
                try {
                    console.log(`Attempt ${attempt + 1} with ${provider.name}`);
                    await this.delay(2 ** attempt * 500); // exponential backoff

                    await provider.sendEmail({ to, subject, body });

                    cb.recordSuccess(); // mark success for circuit breaker
                    this.statusTracker.setStatus(idempotencyKey, `SENT_VIA_${provider.name}`);
                    return { status: 'SENT', provider: provider.name };
                } catch (err) {
                    cb.recordFailure(); // mark failure
                    lastError = err;
                    attempt++;
                    console.log(`❌ Error from ${provider.name} on attempt ${attempt}: ${err.message}`);
                }
            }

            console.log(`🔁 Switching to fallback provider after ${provider.name} failed.`);
        }

        // 4. All providers failed
        this.statusTracker.setStatus(idempotencyKey, 'FAILED');
        return { error: 'All providers failed', status: 'FAILED', details: lastError?.message || 'Unknown error' };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = EmailService;
