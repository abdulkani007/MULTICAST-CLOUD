# TROUBLESHOOTING GUIDE

## Stream Not Starting - Debug Steps

### Step 1: Test FFmpeg Installation

```bash
cd backend
node test-ffmpeg.js
```

Expected output:
```
✅ FFmpeg found!
✅ FFmpeg is installed correctly
✅ Generated test frame: XXXX bytes
🎉 All tests passed!
```

If FFmpeg fails:
- Download from: https://ffmpeg.org/download.html
- Extract to C:\ffmpeg
- Add C:\ffmpeg\bin to system PATH
- Restart terminal/VS Code
- Run test again

---

### Step 2: Check Backend Console

Start backend:
```bash
cd backend
node server.js
```

Expected output:
```
🚀 Server running on port 5000
📡 WebSocket server ready
🎥 IPCCTV Streaming System initialized
```

When you click "Start Stream", you should see:
```
🔌 Client connected: XXXXX
👤 Viewer connected: XXXXX (Total: 1)
🎬 Client XXXXX requested stream start
🎬 Starting FFmpeg process...
✅ FFmpeg process spawned
✅ Stream started successfully
📹 Sent 30 frames
📹 Sent 60 frames
```

---

### Step 3: Check Frontend Console

Open browser DevTools (F12) → Console tab

Expected output when page loads:
```
Connected to server
📊 Received stream status: {isStreaming: false, ...}
👥 Viewer count updated: 1
```

When you click "Start Stream":
```
🎬 Attempting to start stream...
Socket connected: true
📤 Emitted start-stream event
📥 Stream control response: {success: true, message: "Stream started"}
📊 Received stream status: {isStreaming: true, ...}
🖼️ Received frame, size: XXXX
🖼️ Updating video frame
```

---

### Step 4: Check Network Tab

Open DevTools → Network tab → WS (WebSocket)

You should see:
- Connection to `ws://localhost:5000/socket.io/`
- Status: 101 Switching Protocols
- Messages flowing (stream-frame, stream-status, etc.)

---

## Common Issues & Fixes

### Issue 1: FFmpeg Not Found

**Symptoms:**
- Backend shows: "❌ Failed to start FFmpeg"
- Stream doesn't start

**Fix:**
```bash
# Test FFmpeg
ffmpeg -version

# If not found, install and add to PATH
# Windows: Add C:\ffmpeg\bin to PATH
# Restart terminal
```

---

### Issue 2: Port 5000 Already in Use

**Symptoms:**
- Backend error: "EADDRINUSE"

**Fix:**
```javascript
// backend/server.js - Change port
const PORT = 5001;

// frontend/src/pages/Dashboard.jsx - Update URL
const SOCKET_URL = 'http://localhost:5001';
```

---

### Issue 3: CORS Error

**Symptoms:**
- Frontend console: "CORS policy blocked"

**Fix:**
Already configured in backend/server.js:
```javascript
app.use(cors());
io.cors({ origin: "http://localhost:3000" });
```

---

### Issue 4: Socket Not Connecting

**Symptoms:**
- Frontend shows "Disconnected"
- Console: "Socket not connected"

**Fix:**
1. Ensure backend is running
2. Check SOCKET_URL in Dashboard.jsx
3. Check browser console for errors
4. Try refreshing the page

---

### Issue 5: Stream Starts But No Video

**Symptoms:**
- Backend shows frames being sent
- Frontend receives frames
- Video player shows loading

**Fix:**
Check browser console for:
- "❌ Error loading frame"
- Invalid base64 data

Try using the simplified controller:
```javascript
// backend/routes.js
const streamController = require('./streamController-simple');
```

---

### Issue 6: Button Click Does Nothing

**Symptoms:**
- No console logs when clicking button
- No network activity

**Fix:**
Check ControlPanel component is receiving props:
```javascript
// Dashboard.jsx
<ControlPanel
  isStreaming={streamStatus.isStreaming}
  onStart={handleStartStream}  // ← Must be passed
  onStop={handleStopStream}    // ← Must be passed
/>
```

---

## Debug Checklist

- [ ] FFmpeg installed and in PATH
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Browser console shows "Connected to server"
- [ ] WebSocket connection established
- [ ] Clicking button triggers console logs
- [ ] Backend receives start-stream event
- [ ] FFmpeg process starts
- [ ] Frames are being sent
- [ ] Frontend receives frames
- [ ] Video player updates

---

## Alternative: Use Simplified Controller

If issues persist, use the simplified version:

```bash
# Backup current controller
cd backend
copy streamController.js streamController-backup.js

# Use simplified version
copy streamController-simple.js streamController.js

# Restart backend
node server.js
```

The simplified version:
- No text overlay (avoids font issues)
- Simpler frame parsing
- More debug logging
- Better error handling

---

## Still Not Working?

1. Run test-ffmpeg.js to verify FFmpeg
2. Check all console logs (backend + frontend)
3. Check Network tab for WebSocket messages
4. Verify ports 3000 and 5000 are not blocked
5. Try different browser (Chrome recommended)
6. Restart both backend and frontend

---

## Success Indicators

✅ Backend console shows:
- "Stream started successfully"
- "Sent X frames"

✅ Frontend console shows:
- "Received frame, size: XXXX"
- "Updating video frame"

✅ Browser displays:
- Live video feed
- "LIVE" indicator
- Viewer count updates

---

**If all else fails, check the logs and error messages carefully!**
