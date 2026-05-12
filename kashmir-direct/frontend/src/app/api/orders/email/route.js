import { NextResponse } from 'next/server';
import { sendOrderEmail, getOrderEmailTemplate } from '@/lib/email';

export async function POST(request) {
  try {
    const { order, event = 'created' } = await request.json();

    if (!order || !order.id) {
      return NextResponse.json({ error: 'Order details missing' }, { status: 400 });
    }

    const subjectPrefix = event === 'cancelled' ? 'ORDER CANCELLED' : 'Order Confirmed';

    // 1. Send Email to Buyer
    const buyerHtml = getOrderEmailTemplate(order, 'buyer', event);
    await sendOrderEmail({
      to: order.buyer_email,
      subject: `${subjectPrefix}: #${order.id.slice(-8).toUpperCase()}`,
      html: buyerHtml,
    });

    // 2. Send Email to Super Admin
    const adminHtml = getOrderEmailTemplate(order, 'admin', event);
    await sendOrderEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `${event === 'cancelled' ? 'ALERT: Order Cancelled' : 'NEW ORDER'}: #${order.id.slice(-8).toUpperCase()} from ${order.buyer_name}`,
      html: adminHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email API Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
