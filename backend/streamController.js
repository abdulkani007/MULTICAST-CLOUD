const { spawn } = require('child_process');

class StreamController {
  constructor() {
    this.ffmpegProcess = null;
    this.isStreaming = false;
    this.viewers = new Set();
    this.streamStartTime = null;
    this.bytesTransferred = 0;
    this.io = null;
    this.frameBuffer = Buffer.alloc(0);
    this.frameCount = 0;
  }

  // Set Socket.IO instance
  setIO(io) {
    this.io = io;
  }

  // Start FFmpeg stream with test source
  startStream() {
    if (this.isStreaming) {
      console.log('⚠️ Stream already running');
      return { success: false, message: 'Stream already running' };
    }

    try {
      console.log('🎬 Starting FFmpeg process...');
      
      // Simplified FFmpeg command that works on Windows
      // Remove drawtext if it causes issues (font not found)
      this.ffmpegProcess = spawn('ffmpeg', [
        '-f', 'lavfi',
        '-i', 'testsrc=size=640x480:rate=10',
        '-vframes', '3000',
        '-c:v', 'mjpeg',
        '-q:v', '5',
        '-f', 'image2pipe',
        '-vcodec', 'mjpeg',
        'pipe:1'
      ]);

      this.isStreaming = true;
      this.streamStartTime = Date.now();
      this.frameBuffer = Buffer.alloc(0);
      this.frameCount = 0;

      console.log('✅ FFmpeg process spawned');

      // Handle FFmpeg output (video frames)
      this.ffmpegProcess.stdout.on('data', (data) => {
        this.bytesTransferred += data.length;
        this.frameBuffer = Buffer.concat([this.frameBuffer, data]);
        
        // Extract individual JPEG frames
        this.extractFrames();
      });

      // Handle FFmpeg errors
      this.ffmpegProcess.stderr.on('data', (data) => {
        const message = data.toString();
        if (message.includes('error') || message.includes('Error')) {
          console.error('❌ FFmpeg Error:', message);
        }
      });

      // Handle process exit
      this.ffmpegProcess.on('close', (code) => {
        console.log(`FFmpeg process exited with code ${code}`);
        this.isStreaming = false;
        this.frameBuffer = Buffer.alloc(0);
        if (this.io) {
          this.io.emit('stream-stopped');
        }
      });

      // Handle spawn errors
      this.ffmpegProcess.on('error', (error) => {
        console.error('❌ Failed to start FFmpeg:', error.message);
        this.isStreaming = false;
        if (this.io) {
          this.io.emit('stream-stopped');
        }
      });

      console.log('✅ Stream started successfully');
      return { success: true, message: 'Stream started' };

    } catch (error) {
      console.error('❌ Error starting stream:', error);
      this.isStreaming = false;
      return { success: false, message: error.message };
    }
  }

  // Extract JPEG frames from buffer
  extractFrames() {
    const SOI = Buffer.from([0xFF, 0xD8]); // JPEG Start of Image
    const EOI = Buffer.from([0xFF, 0xD9]); // JPEG End of Image

    let startIndex = this.frameBuffer.indexOf(SOI);
    
    while (startIndex !== -1) {
      const endIndex = this.frameBuffer.indexOf(EOI, startIndex + 2);
      
      if (endIndex !== -1) {
        // Extract complete JPEG frame
        const frame = this.frameBuffer.slice(startIndex, endIndex + 2);
        
        // Broadcast frame to all connected clients
        if (this.io && frame.length > 0) {
          this.frameCount++;
          this.io.emit('stream-frame', frame.toString('base64'));
          
          // Log every 30 frames
          if (this.frameCount % 30 === 0) {
            console.log(`📹 Sent ${this.frameCount} frames to ${this.viewers.size} viewer(s)`);
          }
        }
        
        // Remove processed frame from buffer
        this.frameBuffer = this.frameBuffer.slice(endIndex + 2);
        startIndex = this.frameBuffer.indexOf(SOI);
      } else {
        // Incomplete frame, wait for more data
        break;
      }
    }
    
    // Keep buffer size manageable
    if (this.frameBuffer.length > 1024 * 1024) {
      this.frameBuffer = this.frameBuffer.slice(-512 * 1024);
    }
  }

  // Stop the stream
  stopStream() {
    if (!this.isStreaming || !this.ffmpegProcess) {
      console.log('⚠️ No active stream to stop');
      return { success: false, message: 'No active stream' };
    }

    try {
      this.ffmpegProcess.kill('SIGTERM');
      this.isStreaming = false;
      this.streamStartTime = null;
      this.frameBuffer = Buffer.alloc(0);
      
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

  // Get stream status
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

  // Calculate bandwidth in Mbps
  calculateBandwidth() {
    if (!this.streamStartTime) return 0;
    const seconds = (Date.now() - this.streamStartTime) / 1000;
    if (seconds === 0) return 0;
    return ((this.bytesTransferred * 8) / seconds / 1000000).toFixed(2);
  }

  // Add viewer
  addViewer(socketId) {
    this.viewers.add(socketId);
    console.log(`👤 Viewer connected: ${socketId} (Total: ${this.viewers.size})`);
  }

  // Remove viewer
  removeViewer(socketId) {
    this.viewers.delete(socketId);
    console.log(`👋 Viewer disconnected: ${socketId} (Total: ${this.viewers.size})`);
  }

  // Get viewer count
  getViewerCount() {
    return this.viewers.size;
  }
}

// Singleton instance
const streamController = new StreamController();

module.exports = streamController;
