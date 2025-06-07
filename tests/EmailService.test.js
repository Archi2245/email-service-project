const EmailService = require('../src/services/EmailService');
const MockProvider1 = require('../src/providers/MockEmailProvider1');
const MockProvider2 = require('../src/providers/MockEmailProvider2');

describe('EmailService', () => {
  let emailService;

  beforeEach(() => {
    emailService = new EmailService();
  });

  test('should send email using a provider', async () => {
    const response = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Hello',
      body: 'Unit Test',
      idempotencyKey: 'test-1',
    });

    expect(response.status).toBe('SENT');
    expect(['Provider1', 'Provider2']).toContain(response.provider);
  });

  test('should block duplicate sends with same idempotencyKey', async () => {
    await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Dup',
      body: 'Try 1',
      idempotencyKey: 'dup-1',
    });

    const secondAttempt = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Dup',
      body: 'Try 2',
      idempotencyKey: 'dup-1',
    });

    expect(secondAttempt.message).toMatch(/duplicate/i);
    expect(secondAttempt.status).toMatch(/^SENT_VIA_/);

  });
});

