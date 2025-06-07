class CircuitBreaker {
    constructor(failureThreshold = 3, recoveryTime = 10000) {
        this.failureThreshold = failureThreshold;
        this.recoveryTime = recoveryTime;

        this.failures = 0;
        this.state = 'CLOSED';
        this.lastFailureTime = null;
    }

    canAttempt() {
        if (this.state === 'OPEN') {
            const now = Date.now();
            if (now - this.lastFailureTime > this.recoveryTime) {
                this.state = 'HALF_OPEN';
                return true; // allow test request
            }
            return false;
        }
        return true;
    }

    recordSuccess() {
        this.failures = 0;
        this.state = 'CLOSED';
    }

    recordFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();

        if (this.failures >= this.failureThreshold) {
            this.state = 'OPEN';
            console.log(`⚠️ Circuit opened due to repeated failures`);
        }
    }

    getState() {
        return this.state;
    }
}

module.exports = CircuitBreaker;
