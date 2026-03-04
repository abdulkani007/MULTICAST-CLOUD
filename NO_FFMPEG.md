# ⚡ RUNNING WITHOUT FFMPEG

## FFmpeg Not Installed? No Problem!

I've created a **mock stream** that works WITHOUT FFmpeg.

---

## Quick Setup (2 Steps)

### Step 1: Install Canvas Dependency

```bash
cd backend
npm install canvas
```

**Note:** Canvas installation may take 1-2 minutes.

### Step 2: Start Backend

```bash
node server.js
```

Expected output:
```
🚀 Server running on port 5000
📡 WebSocket server ready
🎥 IPCCTV Streaming System initialized
```

### Step 3: Start Frontend

```bash
cd frontend
npm start
```

### Step 4: Click "Start Stream"

You should see:
```
🎬 Starting mock stream (no FFmpeg required)...
✅ Mock stream started successfully
📹 Sent 30 frames to 1 viewer(s)
```

---

## What's Different?

**Mock Stream:**
- ✅ No FFmpeg required
- ✅ Generates frames using Node.js Canvas
- ✅ Animated colorful gradient background
- ✅ Moving pattern overlay
- ✅ Live timestamp
- ✅ "LIVE" indicator
- ✅ 10 FPS (smooth playback)

**Same Features:**
- ✅ Multicast to multiple viewers
- ✅ Real-time viewer count
- ✅ Bandwidth monitoring
- ✅ Stream controls
- ✅ All UI features work

---

## Files Changed

✅ `backend/streamController-mock.js` - New mock controller
✅ `backend/routes.js` - Uses mock controller
✅ `backend/socketHandler.js` - Uses mock controller
✅ `backend/package.json` - Added canvas dependency

---

## If Canvas Installation Fails

Canvas requires build tools. If it fails:

**Windows:**
```bash
npm install --global windows-build-tools
npm install canvas
```

**Alternative:** Use pre-built binaries:
```bash
npm install canvas --canvas_binary_host_mirror=https://registry.npmmirror.com/-/binary/canvas/
```

---

## Switch Back to FFmpeg Later

When you install FFmpeg, switch back:

```javascript
// backend/routes.js
const streamController = require('./streamController');

// backend/socketHandler.js
const streamController = require('./streamController');
```

Then restart backend.

---

## Current Status

✅ **System works WITHOUT FFmpeg**
✅ **Mock stream generates live video**
✅ **All features functional**
✅ **Ready to run NOW**

---

## Run It Now!

```bash
# Terminal 1
cd backend
npm install canvas
node server.js

# Terminal 2
cd frontend
npm start

# Browser: Click "Start Stream"
```

**It will work immediately! 🎉**
