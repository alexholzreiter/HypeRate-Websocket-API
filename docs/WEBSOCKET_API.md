# HypeRate WebSocket API – Heart Rate Only

This document describes how to connect to the **HypeRate WebSocket API** to receive and optionally send **heart rate data**.

> Public documentation – heart rate only.  
> No IRL data, no admin endpoints.

---

## Endpoint

```
wss://app.hyperate.io/ws/:deviceId?token=YOUR_API_KEY
```

### Parameters
- `deviceId` — the device ID you want to subscribe to
- `token` — your API key

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

  // Join confirmation
  if (msg.event === "phx_reply") return;

  // Heart rate update
  if (msg.event === "hr_update") {
    console.log("Heart Rate:", msg.payload.hr);
  }
};
```

---

## Heart Rate Updates (Server → Client)

Heart rate values are broadcasted on the `hr:DEVICE_ID` topic.

### Example

```json
{
  "topic": "hr:abc123",
  "event": "hr_update",
  "payload": { "hr": 75 },
  "ref": null
}
```

---


## Keep the Connection Alive (Heartbeat)

Send a heartbeat every **15 seconds**:

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

- Never commit or share API keys in public repos/issues/screenshots
- Use `wss://` in production
- Always send heartbeats to avoid idle timeouts
