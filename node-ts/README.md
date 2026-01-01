# HypeRate WebSocket – Node.js / TypeScript Demo (Heart Rate Only)

A minimal Node.js + TypeScript client that connects to:

```
wss://app.hyperate.io/ws/:deviceId?token=YOUR_API_KEY
```

…and prints `hr_update` messages.

---

## Setup

1. Install dependencies
```bash
npm install
```

2. Create your local env file
```bash
cp .env.example .env
```

3. Edit `.env` and set:
- `DEVICE_ID`
- `API_KEY`

> `.env` is gitignored. Do not commit secrets.

---

## Run

### Dev (ts-node)
```bash
npm run dev
```

### Build + start
```bash
npm run build
npm start
```

---

## What it does

- Connects to the WebSocket endpoint
- Sends `phx_join` to `hr:DEVICE_ID`
- Logs incoming `hr_update` events
- Sends a heartbeat `ping` every 15 seconds
