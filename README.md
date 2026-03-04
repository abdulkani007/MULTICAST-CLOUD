# Cloud Multicast IPCCTV Streaming System

A professional smart-city camera surveillance system that simulates IP camera streaming with multicast capabilities. One camera stream is efficiently distributed to multiple viewers simultaneously using WebSocket broadcasting.

## 🎯 Features

- **Multicast Streaming**: Single stream source distributed to multiple clients efficiently
- **Real-time Video**: FFmpeg-powered test video stream with live timestamp overlay
- **WebSocket Communication**: Low-latency bidirectional communication
- **Professional Dashboard**: Modern surveillance monitoring interface
- **Live Statistics**: Real-time viewer count, bandwidth usage, and stream health
- **Stream Controls**: Start/Stop streaming with instant feedback
- **Auto-reconnect**: Handles connection drops gracefully
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

```
┌─────────────┐
│   FFmpeg    │ (Simulated IP Camera)
│  Test Source│
└──────┬──────┘
       │ MJPEG Stream
       ▼
┌─────────────────┐
│  Node.js Server │
│   + Socket.IO   │ (Multicast Controller)
└────────┬────────┘
         │ WebSocket Broadcast
         ├──────┬──────┬──────┐
         ▼      ▼      ▼      ▼
     Client Client Client Client
     (React) (React) (React) (React)
```

## 📋 Prerequisites

Before running this project, ensure you have:

1. **Node.js** (v14 or higher)
   - Download: https://nodejs.org/

2. **FFmpeg** (Required for video streaming)
   - Windows: Download from https://ffmpeg.org/download.html
   - Extract and add to PATH environment variable
   - Verify installation: `ffmpeg -version`

3. **npm** (comes with Node.js)

## 🚀 Installation

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
```

## ▶️ Running the Application

### Terminal 1 - Start Backend Server

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

### Terminal 2 - Start Frontend Application

```bash
cd frontend
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## 🎮 Usage

1. **Open the Dashboard**: Navigate to `http://localhost:3000`
2. **Start Stream**: Click the "▶️ Start Stream" button
3. **View Live Feed**: The camera feed will appear with live timestamp
4. **Monitor Stats**: Check viewer count, bandwidth, and stream health in the right panel
5. **Multiple Viewers**: Open multiple browser tabs to see multicast in action
6. **Stop Stream**: Click "⏹️ Stop Stream" to end the broadcast

## 📁 Project Structure

```
multi-pro/
├── backend/
│   ├── server.js              # Main Express + Socket.IO server
│   ├── streamController.js    # FFmpeg stream management
│   ├── socketHandler.js       # WebSocket event handlers
│   ├── routes.js              # REST API endpoints
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoPlayer.jsx      # Live stream display
│   │   │   ├── ViewerStats.jsx      # Statistics panel
│   │   │   └── ControlPanel.jsx     # Stream controls
│   │   ├── pages/
│   │   │   └── Dashboard.jsx        # Main dashboard
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### REST API

- `POST /api/start-stream` - Start the video stream
- `POST /api/stop-stream` - Stop the video stream
- `GET /api/stream-status` - Get current stream status
- `GET /api/health` - Health check endpoint

### WebSocket Events

**Client → Server:**
- `start-stream` - Request to start streaming
- `stop-stream` - Request to stop streaming
- `request-status` - Request current status

**Server → Client:**
- `stream-frame` - Video frame data (base64)
- `stream-status` - Stream status update
- `viewer-count` - Current viewer count
- `stream-stopped` - Stream has stopped
- `stream-control-response` - Response to control requests

## 🎨 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - WebSocket library
- **FFmpeg** - Video processing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling (via CDN)
- **Socket.IO Client** - WebSocket client
- **Axios** - HTTP client

## 🔧 Configuration

### Backend Port
Default: `5000`
Change in `backend/server.js`:
```javascript
const PORT = process.env.PORT || 5000;
```

### Frontend API URL
Default: `http://localhost:5000`
Change in `frontend/src/pages/Dashboard.jsx`:
```javascript
const SOCKET_URL = 'http://localhost:5000';
```

### Video Settings
Modify FFmpeg parameters in `backend/streamController.js`:
```javascript
'-i', 'testsrc=size=640x480:rate=30'  // Change resolution and framerate
```

## 🐛 Troubleshooting

### FFmpeg not found
- Ensure FFmpeg is installed and added to system PATH
- Restart terminal after installation
- Test: `ffmpeg -version`

### Port already in use
- Change backend port in `server.js`
- Update frontend SOCKET_URL accordingly

### Stream not displaying
- Check browser console for errors
- Verify backend is running
- Check WebSocket connection status

### High CPU usage
- Reduce video resolution or framerate in streamController.js
- Lower JPEG quality: `-q:v 5` (higher = lower quality)

## 📊 Performance

- **Single Stream Source**: One FFmpeg process regardless of viewer count
- **Multicast Efficiency**: Bandwidth scales with stream, not viewers
- **Low Latency**: WebSocket provides near real-time delivery
- **Memory Efficient**: Frames are not stored, only broadcast

## 🔐 Security Notes

This is a development/demo system. For production:
- Add authentication/authorization
- Use HTTPS/WSS
- Implement rate limiting
- Add input validation
- Use environment variables for configuration

## 📝 License

MIT License - Free to use and modify

## 👨‍💻 Development

### Adding New Cameras
Modify the camera list in `Dashboard.jsx`:
```javascript
{ id: 4, name: 'Camera 04', location: 'New Location', status: 'inactive' }
```

### Customizing UI
- Colors: Modify Tailwind classes in components
- Layout: Adjust grid layouts in Dashboard.jsx
- Styling: Add custom CSS in index.css

## 🎯 Future Enhancements

- Multiple camera support
- Recording functionality
- Motion detection
- User authentication
- Camera PTZ controls
- Video analytics
- Cloud storage integration

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all prerequisites are installed
3. Check console logs for errors

---

**Built with ❤️ for Smart City Surveillance**
