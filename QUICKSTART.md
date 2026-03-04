# QUICK START GUIDE

## Prerequisites Check

1. **Node.js installed?**
   ```bash
   node --version
   ```
   Should show v14 or higher

2. **FFmpeg installed?**
   ```bash
   ffmpeg -version
   ```
   If not installed:
   - Download from: https://ffmpeg.org/download.html
   - Add to system PATH
   - Restart terminal

## Installation (Run Once)

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

## Running the Application

### Step 1: Start Backend (Terminal 1)
```bash
cd backend
node server.js
```

Wait for:
```
🚀 Server running on port 5000
📡 WebSocket server ready
🎥 IPCCTV Streaming System initialized
```

### Step 2: Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```

Browser will open automatically at http://localhost:3000

## Using the System

1. Click **"▶️ Start Stream"** button
2. Watch the live camera feed appear
3. Open multiple browser tabs to see multicast in action
4. Monitor viewer count and bandwidth in real-time
5. Click **"⏹️ Stop Stream"** to end

## Troubleshooting

**FFmpeg not found:**
- Install FFmpeg and add to PATH
- Restart terminal/VS Code

**Port 5000 already in use:**
- Change PORT in backend/server.js
- Update SOCKET_URL in frontend/src/pages/Dashboard.jsx

**Stream not showing:**
- Check backend terminal for errors
- Verify FFmpeg is working: `ffmpeg -version`
- Check browser console (F12)

## Testing Multicast

1. Start the stream
2. Open http://localhost:3000 in multiple browser tabs/windows
3. Watch viewer count increase
4. Notice bandwidth stays constant (multicast efficiency!)

---

**Need help?** Check README.md for detailed documentation
