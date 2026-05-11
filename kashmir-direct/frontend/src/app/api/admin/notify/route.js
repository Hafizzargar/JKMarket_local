import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// 📧 NODEMAILER CONFIGURATION (GMAIL SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    const payload = await request.json();
    const { email, subject, message, userName } = payload;

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ error: 'SMTP Credentials Missing' }, { status: 500 });
    }

    // 🎨 PREMIUM EMAIL TEMPLATE
    const mailOptions = {
      from: `"Kashmir Direct Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject || 'Notice: Account Update from Kashmir Direct',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #FDFBF7; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 40px 100px rgba(27, 67, 50, 0.08); border: 1px solid #1B4332/0.05; }
            .header { background-color: #1B4332; padding: 60px 40px; text-align: center; position: relative; }
            .logo-text { color: #BC6C25; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; font-style: italic; }
            .logo-sub { color: #ffffff; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 4px; display: block; margin-top: 5px; opacity: 0.6; }
            .content { padding: 60px 50px; color: #1B4332; }
            .greeting { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 20px; }
            .message-box { background-color: #FDFBF7; border-left: 4px solid #BC6C25; padding: 30px; border-radius: 16px; margin: 30px 0; font-size: 16px; line-height: 1.8; color: #1B4332; font-weight: 500; }
            .footer { padding: 40px; background-color: #FDFBF7; text-align: center; border-top: 1px solid rgba(27, 67, 50, 0.05); }
            .footer-text { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: rgba(27, 67, 50, 0.3); }
            .accent-line { width: 40px; h-1px; background: #BC6C25; margin: 20px auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="logo-text">Kashmir Direct</span>
              <span class="logo-sub">Artisanal Marketplace</span>
            </div>
            <div class="content">
              <div class="greeting">Hello ${userName || 'Member'},</div>
              <p style="font-size: 15px; opacity: 0.7; line-height: 1.6;">A governance update has been applied to your account by the Kashmir Direct Super-Admin. Please review the details below:</p>
              
              <div class="message-box">
                "${message}"
              </div>

              <p style="font-size: 14px; opacity: 0.6; line-height: 1.6;">If you have any questions regarding this update or believe this was done in error, please reply to this email to reach our support team.</p>
            </div>
            <div class="footer">
              <div class="accent-line"></div>
              <p class="footer-text">Identity Governance Protocol • secure node</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error('🛡️ [Email Failure]:', error);
    return NextResponse.json({ error: error.message || 'Email Dispatch Failed' }, { status: 500 });
  }
}
