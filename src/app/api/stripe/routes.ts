import prisma from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const data = await request.json();
  const signature = request.headers.get('stripe-signature');

  // verify webhook came from stripe
  let event
  try {
    event = stripe.webhooks.constructEvent(
      data,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.log('Webhook verification failed', error);
    return Response.json(null, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      // fulfill order
      await prisma.user.update({
        where: {
          email: data.data.object.customer_email,
        },
        data: {
          hasAccess: true,
        },
      });
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }


  // return 200 OK
  return Response.json(null, { status: 200 });
}
