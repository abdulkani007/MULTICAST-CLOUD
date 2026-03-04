# 🎬 START HERE - Cloud Multicast IPCCTV System

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies

**Windows Users:**
```bash
setup.bat
```

**Manual Installation:**
```bash
cd backend
npm install

cd ../frontend
npm install
```

### Step 2: Start Backend (Terminal 1)

```bash
cd backend
node server.js
```

✅ Wait for: `🚀 Server running on port 5000`

### Step 3: Start Frontend (Terminal 2)

```bash
cd frontend
npm start
```

✅ Browser opens at: http://localhost:3000

---

## 🎮 Using the System

1. **Click "▶️ Start Stream"** - Begins video streaming
2. **Watch Live Feed** - Camera feed appears with timestamp
3. **Open Multiple Tabs** - Test multicast (viewer count increases)
4. **Monitor Stats** - Check bandwidth and stream health
5. **Click "⏹️ Stop Stream"** - Ends streaming

---

## ⚠️ Prerequisites

### Required:
- ✅ **Node.js** (v14+) - https://nodejs.org/
- ✅ **FFmpeg** - https://ffmpeg.org/download.html (Add to PATH!)

### Verify Installation:
```bash
node --version
npm --version
ffmpeg -version
```

---

## 📂 Project Files

```
multi-pro/
├── backend/              # Node.js server
├── frontend/             # React app
├── setup.bat            # Auto setup
├── start-backend.bat    # Start server
├── start-frontend.bat   # Start app
├── README.md            # Full docs
├── QUICKSTART.md        # Quick guide
└── INSTALLATION.md      # Install guide
```

---

## 🆘 Troubleshooting

**FFmpeg not found?**
- Download: https://ffmpeg.org/download.html
- Add to system PATH
- Restart terminal

**Port 5000 in use?**
- Change PORT in `backend/server.js`
- Update SOCKET_URL in `frontend/src/pages/Dashboard.jsx`

**Dependencies fail?**
```bash
npm cache clean --force
npm install
```

---

## 📚 Documentation

- **PROJECT_SUMMARY.md** - Complete overview
- **README.md** - Full documentation
- **QUICKSTART.md** - Quick reference
- **INSTALLATION.md** - Detailed setup

---

## ✨ Features

✅ Live video streaming with FFmpeg
✅ Multicast to multiple viewers
✅ Real-time viewer count
✅ Bandwidth monitoring
✅ Professional surveillance UI
✅ WebSocket communication
✅ Auto-reconnect
✅ Stream health indicators

---

## 🎯 What You'll See

**Dashboard includes:**
- 📹 Live camera feed (640x480 @ 30fps)
- 👥 Active viewer counter
- 📊 Stream health status
- 📡 Bandwidth usage graph
- 🎛️ Start/Stop controls
- 📷 Camera source list
- 🔔 Real-time notifications

---

## 🚀 Ready to Start?

1. Run `setup.bat` (or manual install)
2. Start backend: `cd backend && node server.js`
3. Start frontend: `cd frontend && npm start`
4. Open http://localhost:3000
5. Click "Start Stream"
6. Enjoy! 🎉

---

**Need Help?** Check README.md for detailed documentation.

**Built for Smart City Surveillance** 🎥
