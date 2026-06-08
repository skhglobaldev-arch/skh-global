import { handleContactPost } from './lib/handlers';

const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export default async (request: Request) => {
  if (request.method === 'GET') {
    return json({ message: 'Contact API is active. Use POST to submit data.' });
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    return await handleContactPost(request);
  } catch (error) {
    console.error('[NETLIFY-CONTACT] Submission failed', error);
    return json(
      { error: 'Submission Failed', details: error instanceof Error ? error.message : String(error) },
      500,
    );
  }
};

export const config = {
  path: '/api/contact',
};
