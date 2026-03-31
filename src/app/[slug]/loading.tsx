export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
    }}>
      {/* Header skeleton */}
      <div style={{
        height: '68px',
        background: '#f8f9fa',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        gap: '16px',
      }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e5e7eb' }} />
        <div style={{ width: 120, height: 16, borderRadius: 4, background: '#e5e7eb' }} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 80, height: 14, borderRadius: 4, background: '#e5e7eb' }} />
        <div style={{ width: 80, height: 14, borderRadius: 4, background: '#e5e7eb' }} />
        <div style={{ width: 100, height: 36, borderRadius: 8, background: '#e5e7eb' }} />
      </div>

      {/* Hero skeleton */}
      <div style={{
        height: '360px',
        background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}>
        <div style={{ width: '50%', maxWidth: 400, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.3)' }} />
        <div style={{ width: '35%', maxWidth: 300, height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ width: 140, height: 44, borderRadius: 8, background: 'rgba(255,255,255,0.25)', marginTop: 8 }} />
      </div>

      {/* Content skeleton */}
      <div style={{
        maxWidth: 800,
        margin: '64px auto',
        padding: '0 40px',
        width: '100%',
      }}>
        <div style={{ width: '40%', height: 28, borderRadius: 6, background: '#e5e7eb', margin: '0 auto 32px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ width: '100%', height: 14, borderRadius: 4, background: '#f3f4f6' }} />
          <div style={{ width: '90%', height: 14, borderRadius: 4, background: '#f3f4f6' }} />
          <div style={{ width: '95%', height: 14, borderRadius: 4, background: '#f3f4f6' }} />
        </div>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        div[style] > div[style] {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
