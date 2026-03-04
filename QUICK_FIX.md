# ⚡ QUICK FIX REFERENCE

## 🚨 Stream Not Starting? Follow These Steps:

### 1️⃣ Test FFmpeg (30 seconds)
```bash
cd backend
node test-ffmpeg.js
```
✅ Should show: "All tests passed!"
❌ If fails: Install FFmpeg and add to PATH

---

### 2️⃣ Check Backend Console
```bash
cd backend
node server.js
```

**When you click "Start Stream", you MUST see:**
```
🎬 Starting FFmpeg process...
✅ FFmpeg process spawned
✅ Stream started successfully
📹 Sent 30 frames to 1 viewer(s)
```

**If you DON'T see this:**
- FFmpeg not installed → Install it
- FFmpeg not in PATH → Add to PATH
- Port 5000 in use → Change port

---

### 3️⃣ Check Frontend Console (F12)

**You MUST see:**
```
🎬 Attempting to start stream...
📤 Emitted start-stream event
📥 Stream control response: {success: true}
🖼️ Received frame, size: XXXX
🖼️ Updating video frame
```

**If you DON'T see this:**
- Socket not connected → Check backend running
- No response → Check SOCKET_URL in Dashboard.jsx
- No frames → Check backend console

---

## 🔍 Quick Diagnostics

```bash
# Run this first!
diagnose.bat
```

Checks everything automatically.

---

## 🛠️ Common Fixes

### Fix 1: FFmpeg Not Found
```bash
# Download from: https://ffmpeg.org/download.html
# Extract to: C:\ffmpeg
# Add to PATH: C:\ffmpeg\bin
# Restart terminal
ffmpeg -version  # Test it
```

### Fix 2: Port Already in Use
```javascript
// backend/server.js
const PORT = 5001;  // Change from 5000

// frontend/src/pages/Dashboard.jsx
const SOCKET_URL = 'http://localhost:5001';  // Update
```

### Fix 3: Dependencies Missing
```bash
cd backend && npm install
cd frontend && npm install
```

---

## ✅ Success Checklist

- [ ] `ffmpeg -version` works
- [ ] Backend shows "Server running on port 5000"
- [ ] Frontend shows green "Connected" dot
- [ ] Click "Start Stream" button
- [ ] Backend shows "Stream started successfully"
- [ ] Backend shows "Sent X frames"
- [ ] Frontend shows "Received frame"
- [ ] Video appears!

---

## 📚 Full Guides

- **Quick Start**: START_HERE.md
- **Debugging**: DEBUG.md
- **Troubleshooting**: TROUBLESHOOTING.md
- **All Fixes**: FIXES_APPLIED.md

---

## 🆘 Still Not Working?

1. Read DEBUG.md (comprehensive guide)
2. Check ALL console logs
3. Run test-ffmpeg.js
4. Try streamController-simple.js

---

**Most common issue: FFmpeg not installed or not in PATH!**

Test it: `ffmpeg -version`
