# 🎥 Cloud Multicast IPCCTV Streaming System

## ✅ PROJECT COMPLETE

A fully functional smart-city camera surveillance system with multicast streaming capabilities.

---

## 📦 What's Included

### Backend (Node.js + Express + Socket.IO)
- ✅ FFmpeg video stream controller
- ✅ WebSocket multicast broadcasting
- ✅ REST API endpoints
- ✅ Viewer management
- ✅ Stream health monitoring

### Frontend (React + Tailwind CSS)
- ✅ Professional surveillance dashboard
- ✅ Live video player
- ✅ Real-time statistics
- ✅ Stream controls
- ✅ Viewer counter
- ✅ Bandwidth monitoring
- ✅ Notifications system

### Features
- ✅ Multicast simulation (1 stream → N viewers)
- ✅ FFmpeg test source with timestamp
- ✅ WebSocket real-time communication
- ✅ Auto-reconnect on disconnect
- ✅ Loading animations
- ✅ Error handling
- ✅ Stream health indicators

---

## 🚀 Quick Start

### 1. Install Dependencies

**Option A: Automated (Windows)**
```bash
setup.bat
```

**Option B: Manual**
```bash
cd backend && npm install
cd frontend && npm install
```

### 2. Run Application

**Terminal 1:**
```bash
cd backend
node server.js
```

**Terminal 2:**
```bash
cd frontend
npm start
```

### 3. Use System
- Open http://localhost:3000
- Click "▶️ Start Stream"
- Watch live feed
- Open multiple tabs to test multicast

---

## 📁 File Structure

```
multi-pro/
├── backend/
│   ├── server.js              # Express + Socket.IO server
│   ├── streamController.js    # FFmpeg stream management
│   ├── socketHandler.js       # WebSocket event handlers
│   ├── routes.js              # REST API routes
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoPlayer.jsx      # Live stream display
│   │   │   ├── ViewerStats.jsx      # Statistics panel
│   │   │   └── ControlPanel.jsx     # Stream controls
│   │   ├── pages/
│   │   │   └── Dashboard.jsx        # Main dashboard
│   │   ├── App.jsx            # Root component
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles
│   └── package.json
│
├── setup.bat                  # Automated setup script
├── start-backend.bat          # Start backend
├── start-frontend.bat         # Start frontend
├── README.md                  # Full documentation
├── QUICKSTART.md              # Quick reference
├── INSTALLATION.md            # Installation guide
└── .gitignore                 # Git ignore rules
```

---

## 🔧 Technology Stack

**Backend:**
- Node.js - Runtime
- Express.js - Web framework
- Socket.IO - WebSocket library
- FFmpeg - Video processing
- CORS - Cross-origin support

**Frontend:**
- React 18 - UI framework
- Tailwind CSS - Styling
- Socket.IO Client - WebSocket client
- Axios - HTTP client

---

## 🎯 Key Features Explained

### Multicast Simulation
- Single FFmpeg process generates video
- Stream broadcast to all connected clients
- Bandwidth scales with stream, not viewers
- Efficient resource usage

### Real-time Updates
- WebSocket bidirectional communication
- Live viewer count
- Stream status updates every 2 seconds
- Instant notifications

### Professional UI
- Modern surveillance dashboard design
- Dark theme optimized for monitoring
- Responsive layout (desktop + mobile)
- Real-time statistics visualization

---

## 📊 API Documentation

### REST Endpoints

**POST /api/start-stream**
- Starts FFmpeg video stream
- Returns: `{ success: boolean, message: string }`

**POST /api/stop-stream**
- Stops active stream
- Returns: `{ success: boolean, message: string }`

**GET /api/stream-status**
- Returns current stream status
- Response:
```json
{
  "isStreaming": boolean,
  "viewerCount": number,
  "uptime": number,
  "bandwidth": string,
  "bytesTransferred": number
}
```

**GET /api/health**
- Health check endpoint
- Returns: `{ status: "ok", timestamp: string }`

### WebSocket Events

**Client → Server:**
- `start-stream` - Request to start
- `stop-stream` - Request to stop
- `request-status` - Request status update

**Server → Client:**
- `stream-frame` - Video frame (base64 JPEG)
- `stream-status` - Status object
- `viewer-count` - Current viewer count
- `stream-stopped` - Stream ended notification
- `stream-control-response` - Control action result

---

## 🧪 Testing Multicast

1. Start backend server
2. Start frontend application
3. Click "Start Stream"
4. Open http://localhost:3000 in multiple tabs
5. Observe:
   - Viewer count increases
   - All tabs show same stream
   - Bandwidth remains constant
   - Single FFmpeg process in backend

---

## ⚙️ Configuration

### Change Backend Port
```javascript
// backend/server.js
const PORT = 5001; // Change from 5000
```

### Update Frontend URL
```javascript
// frontend/src/pages/Dashboard.jsx
const SOCKET_URL = 'http://localhost:5001';
```

### Adjust Video Quality
```javascript
// backend/streamController.js
'-i', 'testsrc=size=1280x720:rate=30'  // Higher resolution
'-q:v', '3'  // Lower number = higher quality
```

---

## 🐛 Common Issues

**FFmpeg not found:**
- Install FFmpeg from https://ffmpeg.org/download.html
- Add to system PATH
- Restart terminal

**Port already in use:**
- Change PORT in server.js
- Update SOCKET_URL in Dashboard.jsx

**Dependencies fail to install:**
- Run `npm cache clean --force`
- Delete node_modules folder
- Run `npm install` again

**Stream not displaying:**
- Check backend console for errors
- Open browser DevTools (F12)
- Verify WebSocket connection status

---

## 📚 Documentation Files

- **README.md** - Complete project documentation
- **QUICKSTART.md** - Quick reference guide
- **INSTALLATION.md** - Detailed installation steps
- **PROJECT_SUMMARY.md** - This file

---

## 🎓 Learning Points

This project demonstrates:
- Multicast streaming architecture
- WebSocket real-time communication
- FFmpeg video processing
- React component architecture
- Professional UI/UX design
- Error handling and reconnection
- State management in React
- RESTful API design

---

## 🚀 Future Enhancements

Potential additions:
- Multiple camera support
- Video recording functionality
- Motion detection alerts
- User authentication
- PTZ camera controls
- Video analytics
- Cloud storage integration
- Mobile app version

---

## 📝 Notes

- This is a development/demo system
- For production, add authentication and HTTPS
- FFmpeg test source simulates IP camera
- Multicast is simulated via WebSocket broadcast
- System designed for local network use

---

## ✨ Success Criteria

✅ Backend runs without errors
✅ Frontend displays dashboard
✅ Stream starts and displays video
✅ Multiple viewers can connect
✅ Viewer count updates in real-time
✅ Bandwidth monitoring works
✅ Stream controls function properly
✅ Notifications appear correctly
✅ System handles disconnections
✅ Professional UI appearance

---

## 🎉 You're Ready!

The system is complete and ready to run. Follow the Quick Start section above to begin.

**Enjoy your Cloud Multicast IPCCTV Streaming System!** 🎥

---

*Built with ❤️ for Smart City Surveillance*
