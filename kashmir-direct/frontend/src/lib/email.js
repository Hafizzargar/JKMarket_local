import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Kashmir Direct" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return { success: false, error: error.message };
  }
}

export function getOrderEmailTemplate(order, type = 'buyer', event = 'created') {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  let title = 'Order Confirmed';
  let greeting = `Hello ${order.buyer_name},`;
  let subtext = 'Your sovereign order has been secured and is now awaiting verification from our artisans.';

  if (event === 'cancelled') {
    title = 'Order Cancelled';
    subtext = type === 'buyer' 
      ? 'Your order has been successfully cancelled as per your request. If this was a mistake, please contact support.'
      : `Order #${order.id.slice(-8).toUpperCase()} has been cancelled by the buyer (${order.buyer_name}).`;
  } else if (type === 'admin') {
    title = 'New Order Received';
    greeting = 'Hello Super Admin,';
    subtext = `A new order has been placed by ${order.buyer_name}. Please review and approve it.`;
  }

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #1B4332/10; border-radius: 20px; overflow: hidden;">
      <div style="background-color: #1B4332; color: white; padding: 40px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">${title}</h1>
        <p style="margin: 10px 0 0; font-size: 14px; opacity: 0.8;">Order Identifier: #${order.id.slice(-8).toUpperCase()}</p>
      </div>
      <div style="padding: 40px; background-color: #FDFBF7;">
        <p style="font-size: 16px; color: #1B4332;">${greeting}</p>
        <p style="font-size: 14px; color: #1B4332/60; line-height: 1.6;">${subtext}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
          <thead>
            <tr style="background-color: #1B4332/5;">
              <th style="padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase;">Item</th>
              <th style="padding: 10px; text-align: center; font-size: 12px; text-transform: uppercase;">Qty</th>
              <th style="padding: 10px; text-align: right; font-size: 12px; text-transform: uppercase;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 20px 10px; font-weight: bold; text-align: right;">Total Amount:</td>
              <td style="padding: 20px 10px; font-weight: bold; text-align: right; font-size: 18px; color: #1B4332;">₹${order.total_amount}</td>
            </tr>
          </tfoot>
        </table>

        <div style="border-top: 1px solid #eee; pt: 30px;">
          <p style="font-size: 12px; color: #1B4332/40; text-transform: uppercase; margin-bottom: 5px;">Shipping Address:</p>
          <p style="font-size: 14px; color: #1B4332; margin: 0;">${order.shipping_address}</p>
          <p style="font-size: 14px; color: #1B4332; margin: 5px 0 0;">Phone: ${order.contact_phones}</p>
        </div>
      </div>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">
        Kashmir Direct • Authentic • Sovereign • Direct
      </div>
    </div>
  `;
}
