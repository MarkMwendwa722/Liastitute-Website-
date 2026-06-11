import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { Resend } from 'resend';

const PORT = Number(process.env.PORT || 8787);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

loadLocalEnv();

const resendApiKey = process.env.RESEND_API_KEY;

const server = createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/api/send-email') {
    sendJson(res, 404, { error: 'Route not found.' });
    return;
  }

  if (!resendApiKey) {
    sendJson(res, 500, { error: 'RESEND_API_KEY is not configured on the server.' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const email = validateEmailBody(body);
    const resend = new Resend(resendApiKey);
    const { data, error } = await resend.emails.send(email);

    if (error) {
      sendJson(res, 400, { error: error.message || 'Resend rejected the email.' });
      return;
    }

    sendJson(res, 200, { id: data?.id });
  } catch (error) {
    sendJson(res, 400, {
      error: error instanceof Error ? error.message : 'Invalid email request.',
    });
  }
});

server.listen(PORT, () => {
  console.log(`Resend email server listening on http://localhost:${PORT}`);
});

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 50_000) {
        req.destroy();
        reject(new Error('Request body is too large.'));
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'));
      } catch {
        reject(new Error('Request body must be valid JSON.'));
      }
    });
    req.on('error', reject);
  });
}

function validateEmailBody(body) {
  const from = requireString(body.from, 'from');
  const to = requireString(body.to, 'to');
  const subject = requireString(body.subject, 'subject');
  const html = requireString(body.html, 'html');

  return { from, to, subject, html };
}

function requireString(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${field} is required.`);
  }
  return value.trim();
}

function loadLocalEnv() {
  if (!existsSync('.env')) return;

  const lines = readFileSync('.env', 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const index = trimmed.indexOf('=');
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
