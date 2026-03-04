// Use pure JS controller (NO dependencies required!)
const streamController = require('./streamController-nocanvas');

function initializeSocketHandler(io) {
  // Set IO instance in stream controller for broadcasting
  streamController.setIO(io);

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Add viewer to the multicast group
    streamController.addViewer(socket.id);

    // Broadcast updated viewer count to all clients
    io.emit('viewer-count', streamController.getViewerCount());

    // Send current stream status to new client
    socket.emit('stream-status', streamController.getStatus());

    // Handle client disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      streamController.removeViewer(socket.id);
      
      // Broadcast updated viewer count
      io.emit('viewer-count', streamController.getViewerCount());
    });

    // Handle stream control requests
    socket.on('start-stream', () => {
      console.log(`🎬 Client ${socket.id} requested stream start`);
      const result = streamController.startStream();
      console.log(`📤 Stream start result:`, result);
      io.emit('stream-status', streamController.getStatus());
      socket.emit('stream-control-response', result);
    });

    socket.on('stop-stream', () => {
      console.log(`⏹️ Client ${socket.id} requested stream stop`);
      const result = streamController.stopStream();
      console.log(`📤 Stream stop result:`, result);
      io.emit('stream-status', streamController.getStatus());
      socket.emit('stream-control-response', result);
    });

    // Request status update
    socket.on('request-status', () => {
      socket.emit('stream-status', streamController.getStatus());
    });
  });

  // Broadcast status updates every 2 seconds
  setInterval(() => {
    if (streamController.isStreaming) {
      io.emit('stream-status', streamController.getStatus());
    }
  }, 2000);
}

module.exports = { initializeSocketHandler };
