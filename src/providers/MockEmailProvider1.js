class MockEmailProvider1 {
    constructor() {
        this.name = 'Provider1';
    }

    async sendEmail({ to, subject, body }) {
        console.log(`[${this.name}] Trying to send email...`);

        // Simulate random failure
        const success = Math.random() > 0.3; // 70% success
        await new Promise(res => setTimeout(res, 200)); // fake delay

        if (success) {
            console.log(`[${this.name}] Email sent successfully.`);
            return { success: true };
        } else {
            throw new Error(`[${this.name}] Failed to send email.`);
        }
    }
}

module.exports = MockEmailProvider1;
