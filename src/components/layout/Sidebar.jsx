import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'analyze', href: '/', icon: 'ti-bug' },
  { label: 'history', href: '/history', icon: 'ti-history' },
];

export default function Sidebar() {
  return (
    <aside style={{
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      width: '200px',
      background: '#0d100d',
      borderRight: '1px solid rgba(0,255,65,0.08)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid rgba(0,255,65,0.08)',
      }}>
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '0.875rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#00ff41', letterSpacing: '0.05em' }}>
          BugSnap
        </div>
        <div style={{ fontSize: '0.58rem', color: 'rgba(0,255,65,0.3)', letterSpacing: '0.1em', marginTop: '2px' }}>
          ERROR ANALYZER v1.0
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.875rem 0.75rem' }}>
        <div style={{ fontSize: '0.55rem', fontWeight: 700, color: 'rgba(0,255,65,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
          Navigation
        </div>
        {NAV_ITEMS.map(({ label, href, icon }) => (
          <NavLink
            key={label}
            to={href}
            end
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.42rem 0.625rem',
              borderRadius: '4px',
              textDecoration: 'none',
              marginBottom: '2px',
              background: isActive ? 'rgba(0,255,65,0.08)' : 'transparent',
              borderLeft: isActive ? '2px solid #00ff41' : '2px solid transparent',
              color: isActive ? '#00ff41' : 'rgba(0,255,65,0.3)',
              fontSize: '0.72rem',
              letterSpacing: '0.04em',
              transition: 'all 0.15s',
            })}
          >
            <span style={{ color: 'rgba(0,255,65,0.3)', fontSize: '0.65rem' }}>$</span>
            <i className={`ti ${icon}`} style={{ fontSize: '13px' }} />
            {label}
          </NavLink>
        ))}

        <div style={{ height: '1px', background: 'rgba(0,255,65,0.06)', margin: '0.75rem 0' }} />

        <div style={{ fontSize: '0.55rem', fontWeight: 700, color: 'rgba(0,255,65,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
          Recent Bugs
        </div>

        {[
          { lang: 'javascript', title: 'TypeError: Cannot read...' },
          { lang: 'python', title: 'IndexError: list index...' },
          { lang: 'react', title: 'Too many re-renders...' },
        ].map(({ lang, title }) => (
          <div key={title} style={{
            padding: '0.45rem 0.5rem',
            borderRadius: '4px',
            marginBottom: '2px',
            cursor: 'pointer',
            borderLeft: '1px solid transparent',
            transition: 'all 0.15s',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderLeftColor = 'rgba(0,255,65,0.2)';
              e.currentTarget.style.background = 'rgba(0,255,65,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderLeftColor = 'transparent';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,183,0,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>{lang}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(0,255,65,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{
        padding: '0.875rem 1.25rem',
        borderTop: '1px solid rgba(0,255,65,0.06)',
        fontSize: '0.58rem',
        color: 'rgba(0,255,65,0.2)',
        letterSpacing: '0.06em',
      }}>
        <div style={{ marginBottom: '3px' }}>GEMINI AI // ONLINE</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00ff41', boxShadow: '0 0 4px #00ff41' }} />
          ALL SYSTEMS OPERATIONAL
        </div>
      </div>
    </aside>
  );
}