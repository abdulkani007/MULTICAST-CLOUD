// Track viewers per camera
const cameraViewers = {}; // { cameraId: [{ socketId, username }] }

function initializeSocketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    const username = 'User_' + Math.floor(Math.random() * 1000);
    socket.username = username;

    // Send username to client
    socket.emit('your-username', username);
    
    // Send current viewers for all cameras
    socket.emit('all-viewers', cameraViewers);

    // Handle camera viewing
    socket.on('watch-camera', (cameraId) => {
      console.log(`👁️ ${username} watching camera ${cameraId}`);
      if (!cameraViewers[cameraId]) cameraViewers[cameraId] = [];
      if (!cameraViewers[cameraId].find(v => v.socketId === socket.id)) {
        cameraViewers[cameraId].push({ socketId: socket.id, username });
        console.log(`📊 Camera ${cameraId} viewers:`, cameraViewers[cameraId].length);
        io.emit('camera-viewers', { cameraId, viewers: cameraViewers[cameraId] });
      }
    });

    socket.on('unwatch-camera', (cameraId) => {
      console.log(`👋 ${username} stopped watching camera ${cameraId}`);
      if (cameraViewers[cameraId]) {
        cameraViewers[cameraId] = cameraViewers[cameraId].filter(v => v.socketId !== socket.id);
        console.log(`📊 Camera ${cameraId} viewers:`, cameraViewers[cameraId].length);
        io.emit('camera-viewers', { cameraId, viewers: cameraViewers[cameraId] });
      }
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      
      // Remove from all cameras
      Object.keys(cameraViewers).forEach(cameraId => {
        const before = cameraViewers[cameraId].length;
        cameraViewers[cameraId] = cameraViewers[cameraId].filter(v => v.socketId !== socket.id);
        if (before !== cameraViewers[cameraId].length) {
          console.log(`📊 Camera ${cameraId} viewers:`, cameraViewers[cameraId].length);
          io.emit('camera-viewers', { cameraId, viewers: cameraViewers[cameraId] });
        }
      });
    });
  });
}

module.exports = { initializeSocketHandler };
