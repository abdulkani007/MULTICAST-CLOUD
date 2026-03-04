# ⚡ START NOW - No FFmpeg Required!

## 🚀 Quick Start (Works Immediately!)

### Step 1: Install Canvas
```bash
cd backend
npm install canvas
```

**Note:** This may take 1-2 minutes. Canvas is used to generate video frames.

### Step 2: Start Backend
```bash
cd backend
node server.js
```

Expected:
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

Browser opens at http://localhost:3000

### Step 4: Click "Start Stream"

You'll see:
```
🎬 Starting mock stream (no FFmpeg required)...
✅ Mock stream started successfully
📹 Sent 30 frames to 1 viewer(s)
```

**Video will appear immediately!** ✅

---

## What You Get

✅ **Live animated video stream**
- Colorful gradient background
- Moving pattern overlay
- Live timestamp
- "LIVE" indicator
- 10 FPS smooth playback

✅ **All features work:**
- Multicast to multiple viewers
- Real-time viewer count
- Bandwidth monitoring
- Stream controls
- Professional UI

✅ **No FFmpeg needed!**

---

## If Canvas Installation Fails

**Windows:**
```bash
npm install --global windows-build-tools
npm install canvas
```

**Alternative:**
```bash
npm install canvas --canvas_binary_host_mirror=https://registry.npmmirror.com/-/binary/canvas/
```

---

## Test Multicast

1. Start stream
2. Open http://localhost:3000 in 3 tabs
3. Watch viewer count: 1 → 2 → 3
4. All tabs show same stream
5. Bandwidth stays constant!

---

## Switch to FFmpeg Later

When you install FFmpeg:

1. Edit `backend/routes.js`:
```javascript
const streamController = require('./streamController');
```

2. Edit `backend/socketHandler.js`:
```javascript
const streamController = require('./streamController');
```

3. Restart backend

---

## Current Setup

✅ Using: `streamController-mock.js`
✅ Generates frames with Node.js Canvas
✅ No external dependencies
✅ Works on all systems
✅ Ready to run NOW!

---

## Run It!

```bash
# Option 1: Automated
setup-no-ffmpeg.bat

# Option 2: Manual
cd backend
npm install canvas
node server.js

# New terminal
cd frontend
npm start
```

**Click "Start Stream" and enjoy! 🎉**
