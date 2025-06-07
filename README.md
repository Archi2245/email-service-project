
# email-service-project

# 📧 Email Service API

A robust Node.js-based Email Sending Service that features **provider fallback**, **retry with exponential backoff**, **circuit breaker**, **rate limiting**, and **idempotency handling**. Designed to ensure high availability and fault tolerance when sending emails through unreliable third-party providers.

---

## 🚀 Features

- ✅ **Multiple Providers**: Automatically switches to fallback if the primary fails.
- 🔁 **Retry Logic**: Exponential backoff with up to 3 retry attempts.
- 🚦 **Circuit Breaker**: Temporarily disables a failing provider.
- ⏳ **Rate Limiting**: Restricts request rate to avoid abuse (5 requests per 10 seconds).
- 🆔 **Idempotency**: Prevents duplicate emails using `idempotencyKey`.
- 📊 **Status Tracking**: Maintains state for each email attempt.
- 🧪 **Unit Tests**: Powered by Jest.

---

## 🛠️ Technologies

- Node.js
- Express.js
- Jest (for testing)
- Mock Providers (simulated)

---

## 📁 Project Structure
email-service-project/
│
├── src/
│ ├── app.js # Express server
│ ├── services/
│ │ └── EmailService.js # Core email logic with all features
│ ├── providers/
│ │ ├── MockEmailProvider1.js
│ │ └── MockEmailProvider2.js
│ └── utils/
│ ├── RateLimiter.js
│ ├── StatusTracker.js
│ └── CircuitBreaker.js
│
├── tests/
│ ├── EmailService.test.js
│ └── RateLimiter.test.js
│
├── package.json
└── README.md
## 📦 Installation

```bash
git clone https://github.com/yourusername/email-service-project
cd email-service-project
npm install

## 🧪 Run Tests
npm test
All core components and edge cases are tested using Jest.

## ▶️ Running the Server
node src/app.js

##📬 API Endpoint

POST /send-email
Headers:
Content-Type: application/json

Body:
{
  "to": "user@example.com",
  "subject": "Hello!",
  "body": "This is a test email.",
  "idempotencyKey": "unique-key-123"
}

example output:
POST /send-email

✔️  Email sent via Provider1
✔️  Rate limit exceeded
✔️  Duplicate request
✔️  Fallback to Provider2
✔️  All providers failed

🧑‍💻 Author
Archi2245
💼 Email delivery system with real-world resilience features
