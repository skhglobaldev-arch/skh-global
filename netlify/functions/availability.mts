import { handleAvailabilityGet } from './lib/handlers';

const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export default async (request: Request) => {
  if (request.method === 'GET') {
    try {
      return await handleAvailabilityGet(request);
    } catch (error) {
      console.error('[NETLIFY-AVAILABILITY] Failed', error);
      return json({ error: 'Failed to load availability' }, 500);
    }
  }

  return json({ error: 'Method not allowed' }, 405);
};

export const config = {
  path: '/api/availability',
};
