import React from 'react';

function ViewerStats({ streamStatus }) {
  const formatUptime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Stream Health */}
      <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">📊 Stream Health</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status</span>
            <span className={`font-semibold ${streamStatus.isStreaming ? 'text-green-400' : 'text-gray-400'}`}>
              {streamStatus.isStreaming ? '● Online' : '○ Offline'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Uptime</span>
            <span className="text-white font-mono">{formatUptime(streamStatus.uptime)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Health</span>
            <span className="text-green-400 font-semibold">
              {streamStatus.isStreaming ? 'Excellent' : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Viewer Stats */}
      <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">👥 Active Viewers</h2>
        <div className="text-center">
          <div className="text-5xl font-bold text-blue-400 mb-2">
            {streamStatus.viewerCount}
          </div>
          <p className="text-slate-400">Connected Clients</p>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Multicast Mode</span>
            <span className="text-green-400">✓ Active</span>
          </div>
        </div>
      </div>

      {/* Bandwidth */}
      <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">📡 Bandwidth</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">Current</span>
              <span className="text-white font-semibold">{streamStatus.bandwidth} Mbps</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((streamStatus.bandwidth / 10) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Total Transferred</span>
            <span className="text-white">{formatBytes(streamStatus.bytesTransferred)}</span>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">⚙️ System Info</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Protocol</span>
            <span className="text-white">WebSocket</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Codec</span>
            <span className="text-white">MJPEG</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Resolution</span>
            <span className="text-white">640x480</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">FPS</span>
            <span className="text-white">30</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewerStats;
