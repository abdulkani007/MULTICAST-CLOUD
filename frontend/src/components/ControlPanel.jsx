import React from 'react';

function ControlPanel({ isStreaming, onStart, onStop }) {
  return (
    <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6">
      <h2 className="text-xl font-bold text-white mb-4">🎛️ Stream Controls</h2>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={onStart}
          disabled={isStreaming}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            isStreaming
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          ▶️ Start Stream
        </button>
        
        <button
          onClick={onStop}
          disabled={!isStreaming}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            !isStreaming
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          ⏹️ Stop Stream
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🎥</div>
          <p className="text-slate-400 text-xs">Camera</p>
          <p className="text-white text-sm font-semibold">Active</p>
        </div>
        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">📡</div>
          <p className="text-slate-400 text-xs">Multicast</p>
          <p className="text-white text-sm font-semibold">Enabled</p>
        </div>
        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🔒</div>
          <p className="text-slate-400 text-xs">Security</p>
          <p className="text-white text-sm font-semibold">Secure</p>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
