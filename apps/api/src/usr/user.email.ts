
export class EmailService {
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    console.log(`Sending welcome email to ${email} (${name})`);
    // In production: integrate with SendGrid, AWS SES, etc.
  }

  async sendNotification(email: string, message: string): Promise<void> {
    console.log(`Sending notification to ${email}: ${message}`);
  }
}