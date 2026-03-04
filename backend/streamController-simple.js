const { spawn } = require('child_process');

class StreamController {
  constructor() {
    this.ffmpegProcess = null;
    this.isStreaming = false;
    this.viewers = new Set();
    this.streamStartTime = null;
    this.bytesTransferred = 0;
    this.io = null;
    this.frameCount = 0;
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
      console.log('🎬 Starting FFmpeg process...');
      
      // Ultra-simple FFmpeg command - no text overlay
      this.ffmpegProcess = spawn('ffmpeg', [
        '-f', 'lavfi',
        '-i', 'testsrc=size=640x480:rate=10',
        '-vframes', '3000',
        '-c:v', 'mjpeg',
        '-q:v', '5',
        '-f', 'image2pipe',
        'pipe:1'
      ]);

      this.isStreaming = true;
      this.streamStartTime = Date.now();
      this.frameCount = 0;
      let frameBuffer = Buffer.alloc(0);

      console.log('✅ FFmpeg process spawned');

      // Handle FFmpeg output
      this.ffmpegProcess.stdout.on('data', (data) => {
        this.bytesTransferred += data.length;
        frameBuffer = Buffer.concat([frameBuffer, data]);
        
        // Look for JPEG markers
        const SOI = Buffer.from([0xFF, 0xD8]);
        const EOI = Buffer.from([0xFF, 0xD9]);
        
        let startIdx = frameBuffer.indexOf(SOI);
        
        while (startIdx !== -1) {
          const endIdx = frameBuffer.indexOf(EOI, startIdx + 2);
          
          if (endIdx !== -1) {
            const frame = frameBuffer.slice(startIdx, endIdx + 2);
            
            if (this.io && frame.length > 0) {
              this.frameCount++;
              this.io.emit('stream-frame', frame.toString('base64'));
              
              if (this.frameCount % 30 === 0) {
                console.log(`📹 Sent ${this.frameCount} frames`);
              }
            }
            
            frameBuffer = frameBuffer.slice(endIdx + 2);
            startIdx = frameBuffer.indexOf(SOI);
          } else {
            break;
          }
        }
        
        // Prevent buffer overflow
        if (frameBuffer.length > 1024 * 1024) {
          frameBuffer = frameBuffer.slice(-512 * 1024);
        }
      });

      this.ffmpegProcess.stderr.on('data', (data) => {
        const msg = data.toString();
        if (msg.includes('error') || msg.includes('Error')) {
          console.error('❌ FFmpeg Error:', msg);
        }
      });

      this.ffmpegProcess.on('close', (code) => {
        console.log(`FFmpeg exited with code ${code}`);
        this.isStreaming = false;
        if (this.io) {
          this.io.emit('stream-stopped');
        }
      });

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

  stopStream() {
    if (!this.isStreaming || !this.ffmpegProcess) {
      console.log('⚠️ No active stream to stop');
      return { success: false, message: 'No active stream' };
    }

    try {
      this.ffmpegProcess.kill('SIGTERM');
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
