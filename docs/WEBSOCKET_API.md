# HypeRate WebSocket API – Heart Rate Only

This document describes how to connect to the **HypeRate WebSocket API**
to **receive real-time heart rate data** for a specific device.

> **Read-only consumer API**  
> Heart rate data is produced by HypeRate devices and streamed to connected clients.  
> Clients **do not send** heart rate data to HypeRate.

No IRL data. No admin endpoints.

---

## Endpoint

```
wss://app.hyperate.io/ws/:deviceId?token=YOUR_API_KEY
```

### Parameters
- `deviceId` — the device ID you want to subscribe to
- `token` — your API key

---

## Get an API Key

Request an API key here:  
👉 https://hyperate.io/api

---

## Connect (JavaScript)

```js
const deviceId = "abc123";
const apiKey = "YOUR_API_KEY";

const ws = new WebSocket(
  `wss://app.hyperate.io/ws/${deviceId}?token=${apiKey}`
);

ws.onopen = () => {
  // Join heart rate channel
  ws.send(JSON.stringify({
    topic: `hr:${deviceId}`,
    event: "phx_join",
    payload: {},
    ref: "1"
  }));
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  // Ignore join confirmation
  if (msg.event === "phx_reply") return;

  // Receive heart rate updates
  if (msg.event === "hr_update") {
    const heartRate = msg.payload.hr;
    console.log("Heart Rate:", heartRate);
  }
};
```

---

## Heart Rate Updates (Server → Client)

After joining `hr:DEVICE_ID`, your client will receive heart rate updates
as `hr_update` events.

- Event name: `hr_update`
- Heart rate value: `payload.hr` (number, BPM)

### Example

```json
{
  "topic": "hr:abc123",
  "event": "hr_update",
  "payload": { "hr": 75 },
  "ref": null
}
```

> You may also receive system messages (e.g. `phx_reply`).  
> These can safely be ignored unless needed for debugging.

---

## Keep the Connection Alive (Heartbeat)

Send a heartbeat every **15 seconds** to keep the connection open.

```js
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      event: "ping",
      payload: { timestamp: Date.now() }
    }));
  }
}, 15000);
```

---

## Disconnect Cleanly

```js
ws.send(JSON.stringify({
  topic: `hr:${deviceId}`,
  event: "phx_leave",
  payload: {},
  ref: Date.now().toString()
}));

setTimeout(() => ws.close(), 100);
```

---

## Notes

- This API is **read-only** for consumers
- Never commit or share API keys in public repos, issues, or screenshots
- Always use `wss://` in production
- Always send heartbeats to avoid idle timeouts
