import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [cameras, setCameras] = useState([
    { id: 1, name: 'Camera 01', location: 'Main Entrance', url: 'http://10.48.118.246:8080/video', online: false, motion: false },
    { id: 2, name: 'Camera 02', location: 'Parking Area', url: 'http://192.168.1.100:8080/video', online: false, motion: false },
    { id: 3, name: 'Camera 03', location: 'Back Gate', url: 'http://192.168.1.101:8080/video', online: false, motion: false }
  ]);
  const [alertCount, setAlertCount] = useState(0);
  const [events, setEvents] = useState([]);
  const [nextCameraId, setNextCameraId] = useState(4);

  useEffect(() => {
    addEvent('System initialized successfully', 'system');
    
    const motionInterval = setInterval(() => {
      setCameras(prev => {
        const updated = [...prev];
        updated.forEach(cam => {
          if (cam.online && Math.random() > 0.85 && !cam.motion) {
            cam.motion = true;
            setAlertCount(c => c + 1);
            addEvent(`⚠️ Motion detected in ${cam.name} - ${cam.location}`, 'motion');
            setTimeout(() => {
              setCameras(p => p.map(c => c.id === cam.id ? {...c, motion: false} : c));
            }, 5000);
          }
        });
        return updated;
      });
    }, 8000);

    return () => clearInterval(motionInterval);
  }, []);

  const addEvent = (message, type = 'system') => {
    setEvents(prev => [{ message, type, time: new Date().toLocaleString() }, ...prev.slice(0, 99)]);
  };

  const toggleCamera = (id) => {
    setCameras(prev => prev.map(cam => {
      if (cam.id === id) {
        const newOnline = !cam.online;
        addEvent(`${cam.name} ${newOnline ? 'connected' : 'disconnected'}`, newOnline ? 'system' : 'warning');
        return { ...cam, online: newOnline, motion: false };
      }
      return cam;
    }));
  };

  const captureSnapshot = (id) => {
    const cam = cameras.find(c => c.id === id);
    const img = document.getElementById(`stream${id}`);
    if (img && img.complete) {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1280;
      canvas.height = img.naturalHeight || 720;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cam.name.replace(/\s/g, '_')}_${Date.now()}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
        addEvent(`Snapshot captured from ${cam.name}`, 'snapshot');
      });
    }
  };

  const updateCameraUrl = (id, url) => {
    setCameras(prev => prev.map(cam => cam.id === id ? {...cam, url} : cam));
  };

  const addNewCamera = () => {
    const url = prompt('Enter camera URL (e.g., http://192.168.1.X:8080/video):');
    if (url) {
      setCameras(prev => [...prev, {
        id: nextCameraId,
        name: `Camera ${prev.length + 1}`,
        location: 'New Location',
        url,
        online: false,
        motion: false
      }]);
      setNextCameraId(prev => prev + 1);
      addEvent(`New camera added`, 'system');
    }
  };

  const removeCamera = (id) => {
    if (window.confirm('Remove this camera?')) {
      setCameras(prev => prev.filter(c => c.id !== id));
      addEvent('Camera removed', 'warning');
    }
  };

  const onlineCameras = cameras.filter(c => c.online).length;
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%)', color: 'white' }}>
      {/* Header */}
      <div style={{ background: 'rgba(10, 14, 39, 0.95)', borderBottom: '2px solid #2563eb', padding: '20px 30px', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: '1920px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🏙️</span>
            <div>
              <h1 style={{ fontSize: '26px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Smart City CCTV Surveillance</h1>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Real-Time Multi-Camera Monitoring System</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '30px' }}>
            <div style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Cameras</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>{cameras.length}</div>
            </div>
            <div style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Online</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>{onlineCameras}</div>
            </div>
            <div style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Alerts</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>{alertCount}</div>
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
              <div style={{ background: 'rgba(10, 14, 39, 0.8)', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cam.online ? '#10b981' : '#ef4444', boxShadow: cam.online ? '0 0 10px #10b981' : 'none' }}></div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{cam.name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>📍 {cam.location}</div>
                  </div>
                </div>
                {cam.online && <div style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>● LIVE</div>}
              </div>
              <div style={{ position: 'relative', background: '#000', aspectRatio: '16/9' }}>
                {cam.online ? (
                  <>
                    <img id={`stream${cam.id}`} src={`${cam.url}?t=${Date.now()}`} alt={cam.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setTimeout(() => { const img = document.getElementById(`stream${cam.id}`); if(img) img.src = cam.url + '?t=' + Date.now(); }, 3000)} />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0, 0, 0, 0.8)', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', color: '#10b981', fontWeight: 'bold', border: '1px solid #10b981' }}>🔴 RECORDING</div>
                    {cam.motion && <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(239, 68, 68, 0.95)', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', animation: 'blink 1s infinite' }}>⚠️ MOTION DETECTED</div>}
                  </>
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '60px', opacity: 0.5 }}>📹</div>
                    <div style={{ color: '#94a3b8', fontSize: '14px' }}>Camera Offline</div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>Click Start to connect</div>
                  </div>
                )}
              </div>
              <div style={{ padding: '14px 18px', background: 'rgba(10, 14, 39, 0.6)', display: 'flex', gap: '10px', borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <button onClick={() => toggleCamera(cam.id)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: cam.online ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>
                  {cam.online ? '⏹️ Stop' : '▶️ Start'}
                </button>
                <button onClick={() => captureSnapshot(cam.id)} disabled={!cam.online} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', opacity: cam.online ? 1 : 0.5 }}>
                  📸 Snapshot
                </button>
                <button onClick={() => removeCamera(cam.id)} style={{ padding: '10px 15px', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: '#ef4444', color: 'white' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Events */}
          <div style={{ background: 'rgba(26, 31, 58, 0.9)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#3b82f6' }}>📊 System Events</div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {events.map((evt, i) => (
                <div key={i} style={{ padding: '12px', marginBottom: '10px', background: 'rgba(10, 14, 39, 0.6)', borderLeft: `3px solid ${evt.type === 'motion' ? '#ef4444' : evt.type === 'snapshot' ? '#10b981' : evt.type === 'warning' ? '#f59e0b' : '#3b82f6'}`, borderRadius: '6px', fontSize: '13px' }}>
                  <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px' }}>{evt.time}</div>
                  <div>{evt.message}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Config */}
          <div style={{ background: 'rgba(26, 31, 58, 0.9)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#3b82f6' }}>⚙️ Camera Configuration</div>
            {cameras.map(cam => (
              <div key={cam.id} style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', display: 'block' }}>{cam.name} URL</label>
                <input type="text" value={cam.url} onChange={(e) => updateCameraUrl(cam.id, e.target.value)} placeholder="http://IP:8080/video" style={{ width: '100%', padding: '10px 14px', background: 'rgba(10, 14, 39, 0.6)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', color: 'white', fontSize: '13px' }} />
              </div>
            ))}
            <button onClick={addNewCamera} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>➕ Add New Camera</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
