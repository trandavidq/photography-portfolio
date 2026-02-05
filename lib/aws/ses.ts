import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.SES_REGION || process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const SENDER_EMAIL = process.env.SES_SENDER_EMAIL || 'noreply@yourdomain.com';

/**
 * Send a 2FA verification code via email
 * @param recipientEmail - Email address to send the code to
 * @param code - 6-digit verification code
 */
export async function sendTwoFactorEmail(recipientEmail: string, code: string): Promise<void> {
  const params = {
    Source: SENDER_EMAIL,
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Subject: {
        Data: 'Your Login Code',
        Charset: 'UTF-8',
      },
      Body: {
        Text: {
          Data: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
          Charset: 'UTF-8',
        },
        Html: {
          Data: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .code-box { background: #f5f5f5; border: 2px solid #e0e0e0; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
                  .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #000; font-family: monospace; }
                  .footer { color: #666; font-size: 14px; margin-top: 30px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h2>Your Login Code</h2>
                  <p>Enter this verification code to access your photography admin dashboard:</p>
                  <div class="code-box">
                    <div class="code">${code}</div>
                  </div>
                  <p><strong>This code will expire in 10 minutes.</strong></p>
                  <div class="footer">
                    <p>If you didn't request this code, please ignore this email.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
          Charset: 'UTF-8',
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
}
