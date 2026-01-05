import { render } from '@react-email/components';
import { Resend } from 'resend';
import { VerificationEmail } from './templates/verification-email.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@example.com';

export interface SendVerificationEmailParams {
  to: string;
  verificationUrl: string;
  userName?: string;
}

export async function sendVerificationEmail({
  to,
  verificationUrl,
  userName,
}: SendVerificationEmailParams): Promise<void> {
  console.log('[Email] Sending verification email to:', to);
  console.log('[Email] Verification URL:', verificationUrl);
  console.log('[Email] RESEND_API_KEY set:', !!process.env.RESEND_API_KEY);

  const html = await render(VerificationEmail({ verificationUrl, userName }));

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Verify your email address',
    html,
  });

  if (error) {
    console.error('Failed to send verification email:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}
