import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const MulticastDashboard = () => {
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState('Connecting...');
  const [cameras, setCameras] = useState([
    { id: 1, name: 'Camera 01', location: 'Main Entrance', url: 'http://10.48.118.246:8080/video', online: false, viewers: [] },
    { id: 2, name: 'Camera 02', location: 'Parking Area', url: 'http://192.168.1.100:8080/video', online: false, viewers: [] },
    { id: 3, name: 'Camera 03', location: 'Back Gate', url: 'http://192.168.1.101:8080/video', online: false, viewers: [] }
  ]);

  const STREAM_SIZE = 2.5;

  useEffect(() => {
    // Use window.location.hostname to connect to backend on same host
    const backendUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000'
      : `http://${window.location.hostname}:5000`;
    
    console.log('🔗 Connecting to:', backendUrl);
    
    const newSocket = io(backendUrl, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to server:', backendUrl);
    });

    newSocket.on('your-username', (username) => {
      setCurrentUser(username);
      console.log('👤 Your username:', username);
    });

    newSocket.on('all-viewers', (allViewers) => {
      console.log('📊 All viewers:', allViewers);
      setCameras(prev => prev.map(cam => ({
        ...cam,
        viewers: allViewers[cam.id] ? allViewers[cam.id].map(v => v.username) : []
      })));
    });

    newSocket.on('camera-viewers', (data) => {
      console.log(`👁️ Camera ${data.cameraId} viewers:`, data.viewers);
      setCameras(prev => prev.map(cam =>
        cam.id === data.cameraId
          ? { ...cam, viewers: data.viewers.map(v => v.username) }
          : cam
      ));
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const toggleCamera = (id) => {
    setCameras(prev => prev.map(cam => {
      if (cam.id === id) {
        const newOnline = !cam.online;
        if (newOnline) {
          socket.emit('watch-camera', id);
          console.log(`📹 Watching camera ${id}`);
        } else {
          socket.emit('unwatch-camera', id);
          console.log(`⏹️ Stopped watching camera ${id}`);
        }
        return { ...cam, online: newOnline, viewers: newOnline ? cam.viewers : [] };
      }
      return cam;
    }));
  };

  const totalViewers = cameras.reduce((sum, cam) => sum + cam.viewers.length, 0);
  const onlineCameras = cameras.filter(c => c.online).length;
  const withoutMulticast = totalViewers * STREAM_SIZE;
  const withMulticast = onlineCameras * STREAM_SIZE;
  const saved = totalViewers > 0 ? ((withoutMulticast - withMulticast) / withoutMulticast * 100).toFixed(0) : 0;

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%)', color: 'white', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'rgba(10, 14, 39, 0.95)', borderBottom: '2px solid #2563eb', padding: '20px 30px', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: '1920px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🏙️</span>
            <div>
              <h1 style={{ fontSize: '26px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Smart City CCTV - Multicast System
              </h1>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>One Stream → Multiple Viewers (Bandwidth Optimized)</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
              📡 MULTICAST ENABLED
            </div>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Viewers</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>{totalViewers}</div>
            </div>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Bandwidth Saved</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>{saved}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1920px', margin: '0 auto', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
        {/* Cameras Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px' }}>
          {cameras.map(cam => (
            <div key={cam.id} style={{ background: 'rgba(26, 31, 58, 0.9)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', overflow: 'hidden' }}>
              {/* Camera Header */}
              <div style={{ background: 'rgba(10, 14, 39, 0.8)', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cam.online ? '#10b981' : '#ef4444', boxShadow: cam.online ? '0 0 10px #10b981' : 'none' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{cam.name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>📍 {cam.location}</div>
                  </div>
                </div>
                {cam.online && (
                  <div style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                    ● LIVE
                  </div>
                )}
              </div>

              {/* Stream Container */}
              <div style={{ position: 'relative', background: '#000', aspectRatio: '16/9' }}>
                {cam.online ? (
                  <>
                    <img src={`${cam.url}?t=${Date.now()}`} alt={cam.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0, 0, 0, 0.8)', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', color: '#10b981', fontWeight: 'bold', border: '1px solid #10b981' }}>
                      🔴 MULTICAST
                    </div>
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(59, 130, 246, 0.9)', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                      👥 {cam.viewers.length} Viewer{cam.viewers.length !== 1 ? 's' : ''}
                    </div>
                  </>
                ) : (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '60px', opacity: 0.5 }}>📹</div>
                    <div style={{ color: '#94a3b8' }}>Camera Offline</div>
                  </div>
                )}
              </div>

              {/* Viewer List */}
              {cam.online && cam.viewers.length > 0 && (
                <div style={{ padding: '10px', background: '#1e293b', borderTop: '1px solid #334155', maxHeight: '80px', overflowY: 'auto' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '5px', fontWeight: 600 }}>ACTIVE VIEWERS:</div>
                  {cam.viewers.map((viewer, idx) => (
                    <span key={idx} style={{ display: 'inline-block', background: '#0f172a', padding: '2px 6px', borderRadius: '4px', margin: '2px', fontSize: '10px', color: viewer === currentUser ? '#10b981' : '#64748b' }}>
                      {viewer === currentUser ? '🟢' : '👤'} {viewer}
                    </span>
                  ))}
                </div>
              )}

              {/* Controls */}
              <div style={{ padding: '14px 18px', background: 'rgba(10, 14, 39, 0.6)', display: 'flex', gap: '10px', borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <button
                  onClick={() => toggleCamera(cam.id)}
                  style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: cam.online ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}
                >
                  {cam.online ? '⏹️ Stop' : '▶️ Start'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(26, 31, 58, 0.9)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#3b82f6' }}>📊 Multicast Efficiency</div>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '8px', padding: '16px' }}>
              <h4 style={{ color: '#10b981', marginBottom: '12px', fontSize: '16px' }}>🎯 Bandwidth Optimization</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span>Active Viewers:</span>
                <strong>{totalViewers}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span>Without Multicast:</span>
                <strong>{withoutMulticast.toFixed(1)} Mbps</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span>With Multicast:</span>
                <strong style={{ color: '#10b981' }}>{withMulticast.toFixed(1)} Mbps</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span>Bandwidth Saved:</span>
                <strong style={{ color: '#10b981', fontSize: '18px' }}>{saved}%</strong>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, marginTop: '16px' }}>
              ✅ <strong>Multicast:</strong> One camera stream is shared by all viewers.<br />
              ✅ <strong>Efficiency:</strong> Bandwidth = Stream size (not Stream × Viewers)<br />
              ✅ <strong>Result:</strong> Massive bandwidth savings!
            </p>
          </div>

          <div style={{ background: 'rgba(26, 31, 58, 0.9)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#3b82f6' }}>👤 Your Identity</div>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>You are:</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>{currentUser}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MulticastDashboard;
