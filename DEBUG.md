# 🔧 DEBUGGING GUIDE - Stream Not Starting

## Quick Fix Steps

### 1. Run Diagnostics

```bash
diagnose.bat
```

This will check:
- ✅ Node.js installed
- ✅ npm installed
- ✅ FFmpeg installed
- ✅ FFmpeg working
- ✅ Dependencies installed

---

### 2. Test FFmpeg Separately

```bash
cd backend
node test-ffmpeg.js
```

**Expected Output:**
```
✅ FFmpeg found!
✅ FFmpeg is installed correctly
✅ Generated test frame: XXXX bytes
🎉 All tests passed!
```

**If it fails:** FFmpeg is not installed or not in PATH

---

### 3. Start Backend with Logging

```bash
cd backend
node server.js
```

**Expected Output:**
```
🚀 Server running on port 5000
📡 WebSocket server ready
🎥 IPCCTV Streaming System initialized
```

**When client connects:**
```
🔌 Client connected: abc123
👤 Viewer connected: abc123 (Total: 1)
```

**When you click "Start Stream":**
```
🎬 Client abc123 requested stream start
🎬 Starting FFmpeg process...
✅ FFmpeg process spawned
✅ Stream started successfully
📹 Sent 30 frames to 1 viewer(s)
📹 Sent 60 frames to 1 viewer(s)
```

---

### 4. Check Frontend Console

Open browser → F12 → Console

**Expected Output:**
```
Connected to server
📊 Received stream status: {isStreaming: false, ...}
👥 Viewer count updated: 1
```

**When clicking "Start Stream":**
```
🎬 Attempting to start stream...
Socket connected: true
📤 Emitted start-stream event
📥 Stream control response: {success: true, ...}
📊 Received stream status: {isStreaming: true, ...}
🖼️ Received frame, size: 12345
🖼️ Updating video frame
```

---

## Common Problems & Solutions

### Problem 1: FFmpeg Not Found

**Symptoms:**
```
❌ Failed to start FFmpeg: spawn ffmpeg ENOENT
```

**Solution:**
1. Download FFmpeg: https://ffmpeg.org/download.html
2. Extract to `C:\ffmpeg`
3. Add `C:\ffmpeg\bin` to system PATH:
   - Windows: System Properties → Environment Variables → Path → Add
4. Restart terminal/VS Code
5. Test: `ffmpeg -version`

---

### Problem 2: No Frames Being Sent

**Symptoms:**
- Backend shows "Stream started successfully"
- But no "Sent X frames" messages
- Frontend shows loading spinner forever

**Solution:**

Check FFmpeg stderr output. If you see font errors:
```
❌ FFmpeg Error: Cannot find font
```

The drawtext filter is failing. Already fixed in latest code (removed drawtext).

---

### Problem 3: Frames Sent But Not Displayed

**Symptoms:**
- Backend: "📹 Sent 30 frames"
- Frontend: "🖼️ Received frame"
- But video doesn't show

**Solution:**

Check browser console for:
```
❌ Error loading frame: ...
```

This means the base64 data is invalid. Check:
1. Frame extraction logic (JPEG markers)
2. Base64 encoding
3. Image src format

---

### Problem 4: Socket Not Connecting

**Symptoms:**
- Frontend shows "Disconnected" (red dot)
- Console: "Socket not connected"

**Solution:**

1. Check backend is running
2. Check SOCKET_URL in Dashboard.jsx:
   ```javascript
   const SOCKET_URL = 'http://localhost:5000';
   ```
3. Check CORS settings in server.js
4. Try refreshing the page

---

### Problem 5: Button Does Nothing

**Symptoms:**
- Click "Start Stream"
- No console logs
- Nothing happens

**Solution:**

Check ControlPanel component:
```javascript
// Dashboard.jsx
<ControlPanel
  isStreaming={streamStatus.isStreaming}
  onStart={handleStartStream}  // ← Must be here
  onStop={handleStopStream}    // ← Must be here
/>
```

Check button onClick:
```javascript
// ControlPanel.jsx
<button onClick={onStart}>  // ← Must call onStart
```

---

## Debug Checklist

Run through this checklist:

- [ ] FFmpeg installed: `ffmpeg -version`
- [ ] Backend running: `node server.js`
- [ ] Frontend running: `npm start`
- [ ] Browser shows "Connected" (green dot)
- [ ] Click "Start Stream" button
- [ ] Backend console shows "Stream started successfully"
- [ ] Backend console shows "Sent X frames"
- [ ] Frontend console shows "Received frame"
- [ ] Frontend console shows "Updating video frame"
- [ ] Video appears in player

---

## Still Not Working?

### Try the Simplified Controller

```bash
cd backend

# Backup current
copy streamController.js streamController-backup.js

# Use simplified version
copy streamController-simple.js streamController.js

# Restart
node server.js
```

The simplified version has:
- No text overlay
- Simpler frame parsing
- More logging
- Better error handling

---

## Manual Frame Test

Test if frames are valid:

```javascript
// Add to backend/streamController.js in extractFrames()
const fs = require('fs');
if (this.frameCount === 1) {
  fs.writeFileSync('test-frame.jpg', frame);
  console.log('✅ Saved first frame to test-frame.jpg');
}
```

Then check if `test-frame.jpg` opens correctly.

---

## Network Debugging

### Check WebSocket Connection

1. Open DevTools → Network tab
2. Filter: WS (WebSocket)
3. Look for: `ws://localhost:5000/socket.io/`
4. Status should be: 101 Switching Protocols
5. Click on it → Messages tab
6. You should see messages flowing

### Check HTTP Requests

1. Network tab → XHR
2. Look for: `http://localhost:5000/socket.io/`
3. Should see polling requests

---

## Environment Check

```bash
# Node version (should be 14+)
node --version

# npm version
npm --version

# FFmpeg version
ffmpeg -version

# Check if ports are free
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

---

## Last Resort: Clean Install

```bash
# Backend
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install

# Frontend
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install

# Restart everything
```

---

## Success Indicators

✅ **Backend Console:**
```
🚀 Server running on port 5000
🔌 Client connected: abc123
🎬 Starting FFmpeg process...
✅ Stream started successfully
📹 Sent 30 frames to 1 viewer(s)
```

✅ **Frontend Console:**
```
Connected to server
🎬 Attempting to start stream...
📥 Stream control response: {success: true}
🖼️ Received frame, size: 12345
🖼️ Updating video frame
```

✅ **Browser:**
- Green "Connected" indicator
- "LIVE" badge appears
- Video feed displays
- Viewer count shows 1

---

**If you see all these, the system is working! 🎉**
