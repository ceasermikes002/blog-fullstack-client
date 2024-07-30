import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  const ADMIN_API_URL = process.env.ADMIN_API_URL;

  if (!WEBHOOK_SECRET || !ADMIN_API_URL) {
    throw new Error('Please add WEBHOOK_SECRET and ADMIN_API_URL to .env or .env.local');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', { status: 400 });
  }

  const eventType = evt.type;
  const { id: userId, ...userData } = evt.data;

  try {
    await fetch(`${ADMIN_API_URL}/api/sync-users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, userData, userId }),
    });

    console.log(`Webhook with an ID of ${userId} and type of ${eventType} processed successfully`);
  } catch (error) {
    console.error('Error syncing user:', error);
  }
  console.log('Webhook Payload:', payload);
  return new Response('', { status: 200 });
}
