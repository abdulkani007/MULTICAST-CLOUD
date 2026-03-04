import React, { useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import ViewerStats from '../components/ViewerStats';
import ControlPanel from '../components/ControlPanel';

function Dashboard() {
  const [cameraUrl, setCameraUrl] = useState('http://10.48.118.246:8080/video');
  const [isStreaming, setIsStreaming] = useState(true);

  const handleStartStream = () => {
    setIsStreaming(true);
  };

  const handleStopStream = () => {
    setIsStreaming(false);
  };

  const handleUrlChange = (e) => {
    setCameraUrl(e.target.value);
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
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-slate-300 text-sm">Live Camera</span>
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      <div className="fixed top-20 right-6 z-50"></div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Video Player */}
          <div className="lg:col-span-2">
            <VideoPlayer 
              cameraUrl={cameraUrl}
              isStreaming={isStreaming}
            />
            
            {/* Control Panel */}
            <div className="mt-6">
              <ControlPanel
                isStreaming={isStreaming}
                onStart={handleStartStream}
                onStop={handleStopStream}
              />
              
              {/* Camera URL Input */}
              <div className="mt-4 bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
                <h3 className="text-white font-semibold mb-3">📹 Camera URL</h3>
                <input
                  type="text"
                  value={cameraUrl}
                  onChange={handleUrlChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="http://10.48.118.246:8080/video"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-1">
            <ViewerStats streamStatus={{ isStreaming, viewerCount: 1, uptime: 0, bandwidth: 0, bytesTransferred: 0 }} />
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
