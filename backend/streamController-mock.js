const { createCanvas } = require('canvas');

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

    try {
      console.log('🎬 Starting mock stream (no FFmpeg required)...');
      
      this.isStreaming = true;
      this.streamStartTime = Date.now();
      this.frameCount = 0;

      // Generate frames at 10 FPS
      this.intervalId = setInterval(() => {
        this.generateFrame();
      }, 100);

      console.log('✅ Mock stream started successfully');
      return { success: true, message: 'Stream started' };

    } catch (error) {
      console.error('❌ Error starting stream:', error);
      this.isStreaming = false;
      return { success: false, message: error.message };
    }
  }

  generateFrame() {
    try {
      // Create canvas
      const canvas = createCanvas(640, 480);
      const ctx = canvas.getContext('2d');

      // Animated background
      const time = Date.now() / 1000;
      const hue = (time * 30) % 360;
      
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, 640, 480);
      gradient.addColorStop(0, `hsl(${hue}, 70%, 50%)`);
      gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 70%, 30%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 640, 480);

      // Moving pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        const offset = (time * 50 + i * 50) % 640;
        ctx.beginPath();
        ctx.moveTo(offset, 0);
        ctx.lineTo(offset, 480);
        ctx.stroke();
      }

      // Text overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 400, 80);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('IPCCTV Camera 01', 20, 40);
      
      ctx.font = '18px Arial';
      const timestamp = new Date().toLocaleTimeString();
      ctx.fillText(`Time: ${timestamp}`, 20, 70);

      // Frame counter
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(540, 10, 90, 40);
      ctx.fillStyle = '#00ff00';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`LIVE`, 560, 38);

      // Convert to JPEG buffer
      const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });
      this.bytesTransferred += buffer.length;
      this.frameCount++;

      // Broadcast frame
      if (this.io) {
        this.io.emit('stream-frame', buffer.toString('base64'));
        
        if (this.frameCount % 30 === 0) {
          console.log(`📹 Sent ${this.frameCount} frames to ${this.viewers.size} viewer(s)`);
        }
      }

    } catch (error) {
      console.error('❌ Error generating frame:', error);
    }
  }

  stopStream() {
    if (!this.isStreaming) {
      console.log('⚠️ No active stream to stop');
      return { success: false, message: 'No active stream' };
    }

    try {
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

    } catch (error) {
      console.error('❌ Error stopping stream:', error);
      return { success: false, message: error.message };
    }
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
