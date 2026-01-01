# Web Demo (Browser) — Public Safe (GitHub Pages friendly)

This is a **public-safe** browser demo for the HypeRate WebSocket API (heart rate only).

✅ No keys are bundled with the demo  
✅ Users enter their own `Device ID` and `API Key` locally  
✅ Optional “Remember locally” uses `localStorage` only

---

## Run locally

Because browsers may block `wss://` from `file://` pages, start a local server:

### Option A: Python
```bash
python3 -m http.server 8080
```
Open:
- http://localhost:8080/web/

### Option B: Node
```bash
npx serve .
```

---

## Use the demo

1. Enter your `Device ID`
2. Enter your `API Key`
3. Click **Connect**
4. Watch the **HR** value and **Log**

---

## GitHub Pages (public)

This demo is designed to be published safely.

### Enable Pages
1. GitHub → **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main`
4. **Folder:** `/web`

### Important
Do **not** add real API keys to the repo.  
For public Pages, users should paste keys locally (or run locally).

---

## Endpoint

```
wss://app.hyperate.io/ws/:deviceId?token=YOUR_API_KEY
```
