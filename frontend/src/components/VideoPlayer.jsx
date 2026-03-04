import React, { useEffect, useRef } from 'react';

function VideoPlayer({ frameData, isStreaming }) {
  const imgRef = useRef(null);

  useEffect(() => {
    if (frameData && imgRef.current) {
      console.log('🖼️ Updating video frame');
      imgRef.current.src = `data:image/jpeg;base64,${frameData}`;
      imgRef.current.onerror = (e) => {
        console.error('❌ Error loading frame:', e);
      };
    }
  }, [frameData]);

  return (
    <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
      {/* Video Header */}
      <div className="bg-slate-900 px-6 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-red-600 animate-pulse' : 'bg-gray-600'}`}></div>
          <h2 className="text-white font-semibold">Camera 01 - Main Street</h2>
        </div>
        <div className="flex items-center space-x-2">
          {isStreaming && (
            <span className="text-red-500 text-sm font-medium flex items-center">
              <span className="mr-2">●</span> LIVE
            </span>
          )}
        </div>
      </div>

      {/* Video Display */}
      <div className="relative bg-black aspect-video flex items-center justify-center">
        {isStreaming ? (
          <img
            ref={imgRef}
            alt="Live Stream"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">📹</div>
            <p className="text-slate-400 text-lg">Stream Offline</p>
            <p className="text-slate-500 text-sm mt-2">Click "Start Stream" to begin broadcasting</p>
          </div>
        )}
        
        {/* Loading Overlay */}
        {isStreaming && !frameData && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white">Loading stream...</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Footer */}
      <div className="bg-slate-900 px-6 py-3 border-t border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Resolution: 640x480 @ 30fps</span>
          <span className="text-slate-400">Format: MJPEG</span>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
