class StatusTracker {
    constructor() {
        this.statusMap = new Map(); // key = idempotencyKey
    }

    setStatus(key, status) {
        this.statusMap.set(key, status);
    }

    getStatus(key) {
        return this.statusMap.get(key);
    }

    hasKey(key) {
        return this.statusMap.has(key);
    }
}

module.exports = StatusTracker;
