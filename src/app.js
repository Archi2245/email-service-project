const express = require('express');
const EmailService = require('./services/EmailService');
const EmailQueue = require('./utils/EmailQueue');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize services
const emailService = new EmailService();
const queue = new EmailQueue(emailService);

// Health check endpoint
app.get('/', (req, res) => {
    res.send('📨 Email Service is running!');
});

// Main email sending route
app.post('/send-email', async (req, res) => {
    const { to, subject, body, idempotencyKey } = req.body;

    if (!to || !subject || !body || !idempotencyKey) {
        return res.status(400).json({
            error: 'Missing required fields: to, subject, body, idempotencyKey'
        });
    }

    // Call the service
    const result = await emailService.sendEmail({ to, subject, body, idempotencyKey });

    // If failed, add to retry queue
    if (result.status === 'FAILED') {
        queue.addToQueue({ to, subject, body, idempotencyKey });
    }

    return res.json(result);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Email Service listening at http://localhost:${PORT}`);
});
