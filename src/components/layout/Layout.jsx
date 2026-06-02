import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0a0c0a',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Scanlines overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 4px)',
        pointerEvents: 'none', zIndex: 100,
      }} />

      <Sidebar />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '200px',
        minHeight: '100vh',
      }}>
        {/* Top terminal bar */}
        <div style={{
          height: '44px',
          background: '#0d100d',
          borderBottom: '1px solid rgba(0,255,65,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.68rem', color: 'rgba(0,255,65,0.3)' }}>bugsnap@ai:~$</span>
            <span style={{ fontSize: '0.68rem', color: '#00ff41' }}>analyze --lang=auto --ai=gemini</span>
            <span style={{
              display: 'inline-block', width: '7px', height: '13px',
              background: '#00ff41', verticalAlign: 'middle',
              animation: 'blink 1s infinite',
            }} />
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              { label: 'STATUS', value: 'READY' },
              { label: 'MODEL', value: 'GEMINI-1.5' },
              { label: 'BUGS FIXED', value: '0' },
            ].map(({ label, value }) => (
              <div key={label} style={{ fontSize: '0.58rem', color: 'rgba(0,255,65,0.25)', letterSpacing: '0.06em' }}>
                {label}: <span style={{ color: '#00ff41' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          <Outlet />
        </main>

        {/* Status bar */}
        <div style={{
          height: '28px',
          background: '#0d100d',
          borderTop: '1px solid rgba(0,255,65,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '0.58rem', color: 'rgba(0,255,65,0.2)', letterSpacing: '0.06em' }}>
            BUGSNAP v1.0.0 // AI-POWERED ERROR ANALYZER
          </span>
          <span style={{ fontSize: '0.58rem', color: 'rgba(0,255,65,0.2)', letterSpacing: '0.06em' }}>
            POWERED BY GEMINI API
          </span>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}