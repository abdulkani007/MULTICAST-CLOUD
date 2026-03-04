import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import VideoPlayer from '../components/VideoPlayer';
import ViewerStats from '../components/ViewerStats';
import ControlPanel from '../components/ControlPanel';

const SOCKET_URL = 'http://localhost:5000';

function Dashboard() {
  const [socket, setSocket] = useState(null);
  const [streamStatus, setStreamStatus] = useState({
    isStreaming: false,
    viewerCount: 0,
    uptime: 0,
    bandwidth: 0,
    bytesTransferred: 0
  });
  const [notification, setNotification] = useState(null);
  const [frameData, setFrameData] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server');
      showNotification('Connected to streaming server', 'success');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      showNotification('Disconnected from server', 'error');
    });

    newSocket.on('stream-status', (status) => {
      console.log('📊 Received stream status:', status);
      setStreamStatus(status);
    });

    newSocket.on('viewer-count', (count) => {
      console.log('👥 Viewer count updated:', count);
      setStreamStatus(prev => ({ ...prev, viewerCount: count }));
    });

    newSocket.on('stream-frame', (frame) => {
      console.log('🖼️ Received frame, size:', frame.length);
      setFrameData(frame);
    });

    newSocket.on('stream-stopped', () => {
      console.log('⏹️ Stream stopped event received');
      setStreamStatus(prev => ({ ...prev, isStreaming: false }));
      setFrameData(null);
      showNotification('Stream stopped', 'info');
    });

    newSocket.on('stream-control-response', (response) => {
      console.log('📥 Stream control response:', response);
      showNotification(response.message, response.success ? 'success' : 'error');
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStartStream = () => {
    console.log('🎬 Attempting to start stream...');
    console.log('Socket connected:', socket?.connected);
    if (socket) {
      socket.emit('start-stream');
      console.log('📤 Emitted start-stream event');
      showNotification('Starting stream...', 'info');
    } else {
      console.error('❌ Socket not connected');
      showNotification('Socket not connected', 'error');
    }
  };

  const handleStopStream = () => {
    console.log('⏹️ Attempting to stop stream...');
    if (socket) {
      socket.emit('stop-stream');
      console.log('📤 Emitted stop-stream event');
      showNotification('Stopping stream...', 'info');
    } else {
      console.error('❌ Socket not connected');
      showNotification('Socket not connected', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">📹</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Cloud Multicast IPCCTV</h1>
                <p className="text-sm text-slate-400">Smart City Surveillance System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${socket?.connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              <span className="text-slate-300 text-sm">
                {socket?.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-slide-in">
          <div className={`px-6 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-600' :
            notification.type === 'error' ? 'bg-red-600' :
            'bg-blue-600'
          }`}>
            <p className="text-white font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Video Player */}
          <div className="lg:col-span-2">
            <VideoPlayer 
              frameData={frameData}
              isStreaming={streamStatus.isStreaming}
            />
            
            {/* Control Panel */}
            <div className="mt-6">
              <ControlPanel
                isStreaming={streamStatus.isStreaming}
                onStart={handleStartStream}
                onStop={handleStopStream}
              />
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-1">
            <ViewerStats streamStatus={streamStatus} />
          </div>
        </div>

        {/* Camera List */}
        <div className="mt-8">
          <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4">📷 Camera Sources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 1, name: 'Camera 01', location: 'Main Street', status: 'active' },
                { id: 2, name: 'Camera 02', location: 'Park Avenue', status: 'inactive' },
                { id: 3, name: 'Camera 03', location: 'City Center', status: 'inactive' }
              ].map(camera => (
                <div key={camera.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">{camera.name}</h3>
                    <div className={`w-2 h-2 rounded-full ${
                      camera.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  <p className="text-slate-400 text-sm">📍 {camera.location}</p>
                  <p className="text-slate-500 text-xs mt-2">
                    Status: <span className={camera.status === 'active' ? 'text-green-400' : 'text-gray-400'}>
                      {camera.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
