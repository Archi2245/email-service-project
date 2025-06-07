class MockEmailProvider2 {
    constructor() {
        this.name = 'Provider2';
    }

    async sendEmail({ to, subject, body }) {
        console.log(`[${this.name}] Trying to send email...`);
        const success = Math.random() > 0.3;
        await new Promise(res => setTimeout(res, 200));

        if (success) {
            console.log(`[${this.name}] Email sent successfully.`);
            return { success: true };
        } else {
            throw new Error(`[${this.name}] Failed to send email.`);
        }
    }
}

module.exports = MockEmailProvider2;
