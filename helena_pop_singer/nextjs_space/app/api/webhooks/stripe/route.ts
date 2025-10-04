
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // In production, you should use the webhook secret
    // For now, we'll just parse the event
    event = JSON.parse(body);
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Parse cart items from metadata
      const cartItems = JSON.parse(session.metadata?.cartItems || '[]');
      const customerName = session.metadata?.customerName || 'Guest';
      const customerEmail = session.customer_email || session.customer_details?.email || 'unknown@example.com';

      // Create order in database
      const order = await prisma.order.create({
        data: {
          customerEmail,
          customerName,
          totalAmount: (session.amount_total || 0) / 100,
          status: 'completed',
          stripeSessionId: session.id,
          stripePaymentIntent: session.payment_intent as string,
          orderItems: {
            create: cartItems.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      // Update inventory
      for (const item of cartItems) {
        await prisma.product.update({
          where: { id: item.id },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        });
      }

      console.log('Order created:', order.id);

      // TODO: Send order confirmation email
      // This would require an email service like SendGrid, AWS SES, etc.
      console.log('Order confirmation email would be sent to:', process.env.ORDER_CONFIRMATION_EMAIL);
      console.log('Customer email:', customerEmail);
    } catch (error) {
      console.error('Error processing order:', error);
    }
  }

  return NextResponse.json({ received: true });
}
