import 'dotenv/config';
import WebSocket from 'ws';

const DEVICE_ID = process.env.DEVICE_ID?.trim();
const API_KEY = process.env.API_KEY?.trim();

if (!DEVICE_ID || !API_KEY) {
  console.error('Missing DEVICE_ID or API_KEY. Copy .env.example to .env and fill in values.');
  process.exit(1);
}

const url = `wss://app.hyperate.io/ws/${encodeURIComponent(DEVICE_ID)}?token=${encodeURIComponent(API_KEY)}`;

console.log('Connecting to:', url);

const ws = new WebSocket(url);

const joinRef = '1';
let heartbeatTimer: NodeJS.Timeout | null = null;

function startHeartbeat() {
  stopHeartbeat();
  heartbeatTimer = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        event: 'ping',
        payload: { timestamp: Date.now() }
      }));
      console.log('[ping] sent');
    }
  }, 15000);
}

function stopHeartbeat() {
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  heartbeatTimer = null;
}

ws.on('open', () => {
  console.log('[open] connected');

  // Join heart rate channel
  const joinMsg = {
    topic: `hr:${DEVICE_ID}`,
    event: 'phx_join',
    payload: {},
    ref: joinRef
  };

  ws.send(JSON.stringify(joinMsg));
  console.log('[send] phx_join', joinMsg);

  startHeartbeat();
});

ws.on('message', (data) => {
  const text = data.toString('utf8');

  let msg: any;
  try {
    msg = JSON.parse(text);
  } catch {
    console.log('[message] non-JSON:', text);
    return;
  }

  if (msg.event === 'phx_reply' && msg.ref === joinRef) {
    console.log('[reply] Joined heart rate channel');
    return;
  }

  if (msg.event === 'hr_update') {
    const hr = msg?.payload?.hr;
    console.log('[hr_update]', hr);
    return;
  }

  console.log('[message]', msg);
});

ws.on('close', (code, reason) => {
  console.log('[close]', { code, reason: reason.toString() });
  stopHeartbeat();
});

ws.on('error', (err) => {
  console.error('[error]', err);
});
