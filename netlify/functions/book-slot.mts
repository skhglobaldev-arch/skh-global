import { handleBookSlotPost } from './lib/handlers';

const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export default async (request: Request) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    return await handleBookSlotPost(request);
  } catch (error) {
    console.error('[NETLIFY-BOOK-SLOT] Failed', error);
    return json({ error: 'Booking failed' }, 500);
  }
};

export const config = {
  path: '/api/book-slot',
};
