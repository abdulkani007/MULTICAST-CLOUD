# INSTALLATION GUIDE

## Cloud Multicast IPCCTV Streaming System

### Prerequisites

1. **Node.js (v14+)**
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **FFmpeg (Required)**
   - Download: https://ffmpeg.org/download.html
   - Windows: Extract and add to PATH
   - Verify: `ffmpeg -version`

3. **npm (comes with Node.js)**
   - Verify: `npm --version`

---

## Quick Setup (Windows)

### Option 1: Automated Setup

Double-click `setup.bat` - it will:
- Check prerequisites
- Install all dependencies
- Prepare the system

### Option 2: Manual Setup

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

---

## Running the Application

### Method 1: Using Batch Files (Windows)

1. Double-click `start-backend.bat`
2. Double-click `start-frontend.bat`

### Method 2: Manual Start

**Terminal 1 - Backend:**
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

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Browser opens at: http://localhost:3000

---

## First Time Usage

1. **Open Dashboard**: http://localhost:3000
2. **Check Connection**: Green dot = Connected
3. **Start Stream**: Click "▶️ Start Stream"
4. **View Feed**: Live camera feed appears
5. **Test Multicast**: Open multiple browser tabs
6. **Monitor Stats**: Check viewer count and bandwidth
7. **Stop Stream**: Click "⏹️ Stop Stream"

---

## Project Structure

```
multi-pro/
├── backend/                    # Node.js server
│   ├── server.js              # Main server
│   ├── streamController.js    # FFmpeg management
│   ├── socketHandler.js       # WebSocket events
│   ├── routes.js              # REST API
│   └── package.json
│
├── frontend/                   # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # Dashboard page
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
├── setup.bat                   # Automated setup
├── start-backend.bat          # Start backend
├── start-frontend.bat         # Start frontend
├── README.md                  # Full documentation
└── QUICKSTART.md              # Quick reference

```

---

## Troubleshooting

### FFmpeg Not Found
```bash
# Check if installed
ffmpeg -version

# If not found:
# 1. Download from https://ffmpeg.org/download.html
# 2. Extract to C:\ffmpeg
# 3. Add C:\ffmpeg\bin to PATH
# 4. Restart terminal/VS Code
```

### Port Already in Use
```javascript
// backend/server.js - Change port
const PORT = 5001; // Change from 5000

// frontend/src/pages/Dashboard.jsx - Update URL
const SOCKET_URL = 'http://localhost:5001';
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
npm cache clean --force
npm install
```

### Stream Not Displaying
1. Check backend terminal for errors
2. Open browser console (F12)
3. Verify WebSocket connection
4. Check FFmpeg is running

---

## Testing Multicast

1. Start the stream
2. Open http://localhost:3000 in Tab 1
3. Open http://localhost:3000 in Tab 2
4. Open http://localhost:3000 in Tab 3
5. Watch viewer count increase to 3
6. Notice bandwidth stays constant (multicast!)

---

## Development

### Backend Development
```bash
cd backend
npm install nodemon --save-dev
npm run dev
```

### Frontend Development
```bash
cd frontend
npm start
```

---

## API Reference

### REST Endpoints
- POST `/api/start-stream` - Start streaming
- POST `/api/stop-stream` - Stop streaming
- GET `/api/stream-status` - Get status
- GET `/api/health` - Health check

### WebSocket Events
**Client → Server:**
- `start-stream` - Start request
- `stop-stream` - Stop request
- `request-status` - Status request

**Server → Client:**
- `stream-frame` - Video frame (base64)
- `stream-status` - Status update
- `viewer-count` - Viewer count
- `stream-stopped` - Stream ended

---

## Performance Tips

1. **Lower CPU Usage**: Reduce resolution in streamController.js
2. **Lower Bandwidth**: Increase JPEG quality value (lower quality)
3. **Faster Startup**: Use nodemon for development

---

## Security Notes

This is a development system. For production:
- Add authentication
- Use HTTPS/WSS
- Implement rate limiting
- Add input validation
- Use environment variables

---

## Support

Check these in order:
1. README.md - Full documentation
2. QUICKSTART.md - Quick reference
3. Console logs - Error messages
4. Browser DevTools - Network/Console

---

## Next Steps

After successful setup:
1. Explore the dashboard UI
2. Test with multiple viewers
3. Monitor bandwidth usage
4. Check stream health indicators
5. Customize camera settings

---

**Built for Smart City Surveillance** 🎥
