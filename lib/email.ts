import { Resend } from 'resend';
import { getEmailConfig, isFeatureEnabled } from './env';

let resend: Resend | null = null;

/**
 * Get Resend instance
 */
function getResend(): Resend {
  if (!resend) {
    if (!isFeatureEnabled('email')) {
      throw new Error('Email service is not configured. Please set RESEND_API_KEY or SMTP environment variables.');
    }

    const emailConfig = getEmailConfig();
    resend = new Resend(emailConfig.apiKey);
  }

  return resend;
}

/**
 * Email templates
 */
export const EMAIL_TEMPLATES = {
  WELCOME: {
    subject: 'Welcome to Happy Hour!',
    template: 'welcome'
  },
  EMAIL_VERIFICATION: {
    subject: 'Verify your email address',
    template: 'email-verification'
  },
  PASSWORD_RESET: {
    subject: 'Reset your password',
    template: 'password-reset'
  },
  DEAL_REDEEMED: {
    subject: 'Deal redeemed successfully!',
    template: 'deal-redeemed'
  },
  DEAL_EXPIRING: {
    subject: 'Your deal is expiring soon',
    template: 'deal-expiring'
  },
  SUBSCRIPTION_TRIAL: {
    subject: 'Your free trial has started',
    template: 'subscription-trial'
  },
  SUBSCRIPTION_ACTIVE: {
    subject: 'Subscription activated',
    template: 'subscription-active'
  },
  SUBSCRIPTION_CANCELLED: {
    subject: 'Subscription cancelled',
    template: 'subscription-cancelled'
  },
  NEW_DEAL_APPROVED: {
    subject: 'Your deal has been approved!',
    template: 'deal-approved'
  },
  DEAL_REJECTED: {
    subject: 'Deal submission needs attention',
    template: 'deal-rejected'
  }
} as const;

export type EmailTemplate = keyof typeof EMAIL_TEMPLATES;

/**
 * Send email using Resend
 */
export async function sendEmail(
  to: string | string[],
  template: EmailTemplate,
  data: Record<string, any> = {},
  options: {
    from?: string;
    replyTo?: string;
    tags?: Array<{ name: string; value: string }>;
  } = {}
) {
  if (!isFeatureEnabled('email')) {
    console.warn('Email service not configured, skipping email send');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const resend = getResend();
    const templateConfig = EMAIL_TEMPLATES[template];
    
    const recipients = Array.isArray(to) ? to : [to];
    
    const emailData = {
      from: options.from || 'Happy Hour <noreply@orderhappyhour.com>',
      to: recipients,
      subject: templateConfig.subject,
      html: generateEmailHTML(template, data),
      text: generateEmailText(template, data),
      replyTo: options.replyTo,
      tags: options.tags
    };

    const result = await resend.emails.send(emailData);
    
    console.log(`Email sent successfully: ${template} to ${recipients.join(', ')}`);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Generate HTML email content
 */
function generateEmailHTML(template: EmailTemplate, data: Record<string, any>): string {
  const baseHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Happy Hour</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
        .button:hover { background: #3730a3; }
        .logo { font-size: 24px; font-weight: bold; }
        .emoji { font-size: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🍺 Happy Hour</div>
        </div>
        <div class="content">
          ${getTemplateContent(template, data)}
        </div>
        <div class="footer">
          <p>© 2024 Happy Hour. All rights reserved.</p>
          <p>You received this email because you signed up for Happy Hour.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return baseHTML;
}

/**
 * Generate plain text email content
 */
function generateEmailText(template: EmailTemplate, data: Record<string, any>): string {
  return getTemplateTextContent(template, data);
}

/**
 * Get template content based on template type
 */
function getTemplateContent(template: EmailTemplate, data: Record<string, any>): string {
  switch (template) {
    case 'WELCOME':
      return `
        <h1>Welcome to Happy Hour!</h1>
        <p>Hi ${data.firstName || 'there'},</p>
        <p>Welcome to Happy Hour! We're excited to have you join our community of deal-seekers and restaurant lovers.</p>
        <p>Get started by exploring amazing deals near you:</p>
        <p><a href="${data.exploreUrl || 'https://orderhappyhour.com/explore'}" class="button">Explore Deals</a></p>
        <p>Happy hunting!</p>
        <p>The Happy Hour Team</p>
      `;

    case 'EMAIL_VERIFICATION':
      return `
        <h1>Verify your email address</h1>
        <p>Hi ${data.firstName || 'there'},</p>
        <p>Please verify your email address to complete your account setup:</p>
        <p><a href="${data.verificationUrl}" class="button">Verify Email</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      `;

    case 'PASSWORD_RESET':
      return `
        <h1>Reset your password</h1>
        <p>Hi ${data.firstName || 'there'},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <p><a href="${data.resetUrl}" class="button">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `;

    case 'DEAL_REDEEMED':
      return `
        <h1>Deal redeemed successfully!</h1>
        <p>Hi ${data.firstName || 'there'},</p>
        <p>Great news! You've successfully redeemed your deal at ${data.venueName}.</p>
        <p><strong>Deal:</strong> ${data.dealTitle}</p>
        <p><strong>Discount:</strong> ${data.discount}</p>
        <p>Show this email to the staff when you visit the venue.</p>
        <p>Enjoy your savings!</p>
      `;

    case 'SUBSCRIPTION_TRIAL':
      return `
        <h1>Your free trial has started!</h1>
        <p>Hi ${data.firstName || 'there'},</p>
        <p>Your 14-day free trial for the ${data.planName} plan has started.</p>
        <p>You now have access to all premium features:</p>
        <ul>
          <li>Create unlimited deals</li>
          <li>Advanced analytics</li>
          <li>Multi-venue management</li>
          <li>Priority support</li>
        </ul>
        <p><a href="${data.dashboardUrl || 'https://orderhappyhour.com/merchant/dashboard'}" class="button">Access Dashboard</a></p>
        <p>Your trial ends on ${data.trialEndDate}.</p>
      `;

    case 'SUBSCRIPTION_ACTIVE':
      return `
        <h1>Subscription activated!</h1>
        <p>Hi ${data.firstName || 'there'},</p>
        <p>Your ${data.planName} subscription is now active.</p>
        <p>You can manage your subscription anytime from your dashboard.</p>
        <p><a href="${data.dashboardUrl || 'https://orderhappyhour.com/merchant/dashboard'}" class="button">Manage Subscription</a></p>
        <p>Thank you for choosing Happy Hour!</p>
      `;

    case 'NEW_DEAL_APPROVED':
      return `
        <h1>Your deal has been approved!</h1>
        <p>Hi ${data.firstName || 'there'},</p>
        <p>Great news! Your deal "${data.dealTitle}" has been approved and is now live.</p>
        <p>Customers can now discover and redeem your deal.</p>
        <p><a href="${data.dealUrl}" class="button">View Deal</a></p>
        <p>Keep an eye on your analytics to see how it's performing!</p>
      `;

    default:
      return `
        <h1>Hello from Happy Hour!</h1>
        <p>Hi ${data.firstName || 'there'},</p>
        <p>This is a notification from Happy Hour.</p>
        <p>Visit our website to learn more: <a href="https://orderhappyhour.com">orderhappyhour.com</a></p>
      `;
  }
}

/**
 * Get plain text template content
 */
function getTemplateTextContent(template: EmailTemplate, data: Record<string, any>): string {
  switch (template) {
    case 'WELCOME':
      return `Welcome to Happy Hour!\n\nHi ${data.firstName || 'there'},\n\nWelcome to Happy Hour! We're excited to have you join our community.\n\nGet started by exploring deals near you: ${data.exploreUrl || 'https://orderhappyhour.com/explore'}\n\nHappy hunting!\nThe Happy Hour Team`;

    case 'EMAIL_VERIFICATION':
      return `Verify your email address\n\nHi ${data.firstName || 'there'},\n\nPlease verify your email address: ${data.verificationUrl}\n\nThis link expires in 24 hours.\n\nIf you didn't create an account, you can safely ignore this email.`;

    case 'PASSWORD_RESET':
      return `Reset your password\n\nHi ${data.firstName || 'there'},\n\nReset your password: ${data.resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.`;

    case 'DEAL_REDEEMED':
      return `Deal redeemed successfully!\n\nHi ${data.firstName || 'there'},\n\nYou've successfully redeemed your deal at ${data.venueName}.\n\nDeal: ${data.dealTitle}\nDiscount: ${data.discount}\n\nShow this email to staff when you visit.\nEnjoy your savings!`;

    case 'SUBSCRIPTION_TRIAL':
      return `Your free trial has started!\n\nHi ${data.firstName || 'there'},\n\nYour 14-day free trial for the ${data.planName} plan has started.\n\nAccess your dashboard: ${data.dashboardUrl || 'https://orderhappyhour.com/merchant/dashboard'}\n\nTrial ends: ${data.trialEndDate}`;

    case 'SUBSCRIPTION_ACTIVE':
      return `Subscription activated!\n\nHi ${data.firstName || 'there'},\n\nYour ${data.planName} subscription is now active.\n\nManage subscription: ${data.dashboardUrl || 'https://orderhappyhour.com/merchant/dashboard'}\n\nThank you for choosing Happy Hour!`;

    case 'NEW_DEAL_APPROVED':
      return `Your deal has been approved!\n\nHi ${data.firstName || 'there'},\n\nYour deal "${data.dealTitle}" has been approved and is now live.\n\nView deal: ${data.dealUrl}\n\nKeep an eye on your analytics!`;

    default:
      return `Hello from Happy Hour!\n\nHi ${data.firstName || 'there'},\n\nThis is a notification from Happy Hour.\n\nVisit: https://orderhappyhour.com`;
  }
}
