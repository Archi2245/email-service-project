class EmailQueue {
    constructor(emailService) {
        this.queue = [];
        this.emailService = emailService;
        this.isProcessing = false;
    }

    addToQueue(emailData) {
        console.log(`📩 Queued email to: ${emailData.to}`);
        this.queue.push(emailData);
        this.processQueue();
    }

    async processQueue() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const emailData = this.queue.shift();
            console.log(`📤 Retrying email to: ${emailData.to}`);
            const result = await this.emailService.sendEmail(emailData);

            if (result.status === 'FAILED') {
                console.log(`🔁 Email to ${emailData.to} failed again. Re-queuing.`);
                this.queue.push(emailData);
            } else {
                console.log(`✅ Email to ${emailData.to} sent successfully from queue.`);
            }

            await this.delay(2000); // wait between retries
        }

        this.isProcessing = false;
    }

    delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }
}

module.exports = EmailQueue;
