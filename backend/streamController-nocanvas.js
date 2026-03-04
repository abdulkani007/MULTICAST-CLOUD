// Pure JavaScript mock stream - NO dependencies required!

class StreamController {
  constructor() {
    this.isStreaming = false;
    this.viewers = new Set();
    this.streamStartTime = null;
    this.bytesTransferred = 0;
    this.io = null;
    this.frameCount = 0;
    this.intervalId = null;
  }

  setIO(io) {
    this.io = io;
  }

  startStream() {
    if (this.isStreaming) {
      console.log('⚠️ Stream already running');
      return { success: false, message: 'Stream already running' };
    }

    console.log('🎬 Starting pure JS mock stream (no dependencies)...');
    
    this.isStreaming = true;
    this.streamStartTime = Date.now();
    this.frameCount = 0;

    // Generate frames at 2 FPS (slower but works)
    this.intervalId = setInterval(() => {
      this.generateFrame();
    }, 500);

    console.log('✅ Mock stream started successfully');
    return { success: true, message: 'Stream started' };
  }

  generateFrame() {
    this.frameCount++;
    
    // Generate a minimal valid JPEG (1x1 pixel with changing color)
    const time = Date.now();
    const hue = (time / 50) % 360;
    const r = Math.floor(Math.sin(hue * 0.017) * 127 + 128);
    const g = Math.floor(Math.sin((hue + 120) * 0.017) * 127 + 128);
    const b = Math.floor(Math.sin((hue + 240) * 0.017) * 127 + 128);
    
    // Create SVG with animated content
    const svg = `<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(${r},${g},${b});stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(${b},${r},${g});stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="640" height="480" fill="url(#grad)"/>
      <rect x="10" y="10" width="400" height="80" fill="rgba(0,0,0,0.7)" rx="5"/>
      <text x="20" y="45" font-family="Arial" font-size="24" fill="white" font-weight="bold">IPCCTV Camera 01</text>
      <text x="20" y="75" font-family="Arial" font-size="18" fill="white">Time: ${new Date().toLocaleTimeString()}</text>
      <rect x="540" y="10" width="90" height="40" fill="rgba(0,0,0,0.7)" rx="5"/>
      <text x="560" y="38" font-family="Arial" font-size="20" fill="#00ff00" font-weight="bold">LIVE</text>
      <text x="320" y="250" font-family="Arial" font-size="48" fill="white" text-anchor="middle" opacity="0.3">Frame ${this.frameCount}</text>
    </svg>`;

    // Convert SVG to base64 (browsers can render SVG as image)
    const base64 = Buffer.from(svg).toString('base64');
    const dataUrl = `data:image/svg+xml;base64,${base64}`;
    
    this.bytesTransferred += svg.length;

    // Broadcast frame
    if (this.io) {
      // Send as data URL (works directly in img src)
      this.io.emit('stream-frame', base64);
      
      if (this.frameCount % 10 === 0) {
        console.log(`📹 Sent ${this.frameCount} frames to ${this.viewers.size} viewer(s)`);
      }
    }
  }

  stopStream() {
    if (!this.isStreaming) {
      console.log('⚠️ No active stream to stop');
      return { success: false, message: 'No active stream' };
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isStreaming = false;
    this.streamStartTime = null;
    
    if (this.io) {
      this.io.emit('stream-stopped');
    }

    console.log('⏹️ Stream stopped');
    return { success: true, message: 'Stream stopped' };
  }

  getStatus() {
    const uptime = this.streamStartTime 
      ? Math.floor((Date.now() - this.streamStartTime) / 1000)
      : 0;

    return {
      isStreaming: this.isStreaming,
      viewerCount: this.viewers.size,
      uptime: uptime,
      bandwidth: this.calculateBandwidth(),
      bytesTransferred: this.bytesTransferred
    };
  }

  calculateBandwidth() {
    if (!this.streamStartTime) return 0;
    const seconds = (Date.now() - this.streamStartTime) / 1000;
    if (seconds === 0) return 0;
    return ((this.bytesTransferred * 8) / seconds / 1000000).toFixed(2);
  }

  addViewer(socketId) {
    this.viewers.add(socketId);
    console.log(`👤 Viewer connected: ${socketId} (Total: ${this.viewers.size})`);
  }

  removeViewer(socketId) {
    this.viewers.delete(socketId);
    console.log(`👋 Viewer disconnected: ${socketId} (Total: ${this.viewers.size})`);
  }

  getViewerCount() {
    return this.viewers.size;
  }
}

const streamController = new StreamController();
module.exports = streamController;
