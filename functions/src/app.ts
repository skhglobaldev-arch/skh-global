import express from 'express';
import cors from 'cors';
import {
  handleAdminRequest,
  handleAuditPost,
  handleAvailabilityGet,
  handleBookSlotPost,
  handleContactPost,
} from './lib/handlers';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getBaseUrl = (req: express.Request) => {
  const proto = req.get('x-forwarded-proto') || req.protocol || 'https';
  const host = req.get('x-forwarded-host') || req.get('host') || 'localhost';
  return `${proto}://${host}`;
};

const toWebRequest = (req: express.Request, path: string): Request => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) headers.set(key, Array.isArray(value) ? value[0] : value);
  }

  const init: RequestInit = { method: req.method, headers };
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    init.body = JSON.stringify(req.body);
    if (!headers.has('content-type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  return new Request(`${getBaseUrl(req)}${path}`, init);
};

const sendWebResponse = async (webResponse: Response, res: express.Response) => {
  const body = await webResponse.text();
  res.status(webResponse.status);
  webResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'transfer-encoding') {
      res.setHeader(key, value);
    }
  });
  res.send(body);
};

app.get('/api/audit', (_req, res) => {
  res.json({ message: 'Audit API is active. Use POST to submit data.' });
});

app.post('/api/audit', async (req, res) => {
  try {
    await sendWebResponse(await handleAuditPost(toWebRequest(req, '/api/audit')), res);
  } catch (error) {
    console.error('[API-AUDIT] Submission failed', error);
    res.status(500).json({
      error: 'Submission Failed',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

app.get('/api/contact', (_req, res) => {
  res.json({ message: 'Contact API is active. Use POST to submit data.' });
});

app.post('/api/contact', async (req, res) => {
  try {
    await sendWebResponse(await handleContactPost(toWebRequest(req, '/api/contact')), res);
  } catch (error) {
    console.error('[API-CONTACT] Submission failed', error);
    res.status(500).json({
      error: 'Submission Failed',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

app.get('/api/availability', async (_req, res) => {
  try {
    await sendWebResponse(await handleAvailabilityGet(), res);
  } catch (error) {
    console.error('[API-AVAILABILITY] Failed', error);
    res.status(500).json({ error: 'Failed to load availability' });
  }
});

app.post('/api/book-slot', async (req, res) => {
  try {
    await sendWebResponse(await handleBookSlotPost(toWebRequest(req, '/api/book-slot')), res);
  } catch (error) {
    console.error('[API-BOOK-SLOT] Failed', error);
    res.status(500).json({ error: 'Booking failed' });
  }
});

app.use('/api/admin', async (req, res) => {
  try {
    await sendWebResponse(await handleAdminRequest(toWebRequest(req, req.originalUrl)), res);
  } catch (error) {
    console.error('[API-ADMIN] Failed', error);
    res.status(500).json({ error: 'Admin request failed' });
  }
});

app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

export { app };
