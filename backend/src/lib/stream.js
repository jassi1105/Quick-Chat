import 'dotenv/config';

const apiKey = process.env.STREAM_API_KEY?.trim();
const apiSecret = process.env.STREAM_API_SECRET?.trim();

const isConfigured = Boolean(apiKey && apiSecret);

if (!isConfigured) {
  console.warn('[stream] STREAM_API_KEY and STREAM_API_SECRET are not configured. Stream integration is disabled.');
}

export const streamConfig = isConfigured
  ? { apiKey, apiSecret }
  : null;

export const streamEnabled = isConfigured;

export function getStreamConfig() {
  return streamConfig;
}
