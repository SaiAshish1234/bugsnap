import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const SEVERITY_CONFIG = {
  low:      { color: '#00ff41', label: 'LOW' },
  medium:   { color: '#ffb700', label: 'MED' },
  high:     { color: '#ff6b00', label: 'HIGH' },
  critical: { color: '#ff3131', label: 'CRIT' },
};

export default function SharedView() {
  const { id } = useParams();
  const [fix, setFix] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('shared_fixes')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else if (new Date(data.expires_at) < new Date()) {
        setExpired(true);
      } else {
        setFix(data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const severity = fix ? SEVERITY_CONFIG[fix.severity] || SEVERITY_CONFIG.medium : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0c0a',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Scanlines overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 4px)',
        pointerEvents: 'none', zIndex: 100,
      }} />

      {/* Top bar */}
      <div style={{
        height: '44px',
        background: '#0d100d',
        borderBottom: '1px solid rgba(0,255,65,0.08)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: '5px', marginRight: '1rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
        </div>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#00ff41', letterSpacing: '0.05em' }}>
          BugSnap
        </span>
        <span style={{ fontSize: '0.6rem', color: 'rgba(0,255,65,0.3)', letterSpacing: '0.1em', marginLeft: '8px' }}>
          // SHARED FIX
        </span>
      </div>

      {/* Content */}
      <main style={{ flex: 1, padding: '2rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '700px', width: '100%' }}>

          {loading && (
            <div style={{ fontSize: '0.7rem', color: 'rgba(0,255,65,0.3)', letterSpacing: '0.08em', textAlign: 'center', marginTop: '3rem' }}>
              // LOADING SHARED FIX...
            </div>
          )}

          {notFound && (
            <div style={{
              background: '#0d100d', border: '1px solid rgba(255,49,49,0.2)',
              borderRadius: '6px', padding: '3rem', textAlign: 'center', marginTop: '2rem',
            }}>
              <div style={{ fontSize: '0.8rem', color: '#ff6b6b', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                [404] FIX NOT FOUND
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(0,255,65,0.25)', letterSpacing: '0.06em' }}>
                This link doesn't exist or was removed.
              </div>
            </div>
          )}

          {expired && (
            <div style={{
              background: '#0d100d', border: '1px solid rgba(255,183,0,0.2)',
              borderRadius: '6px', padding: '3rem', textAlign: 'center', marginTop: '2rem',
            }}>
              <div style={{ fontSize: '0.8rem', color: '#ffb700', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                [410] LINK EXPIRED
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(0,255,65,0.25)', letterSpacing: '0.06em' }}>
                This shared fix is no longer available.
              </div>
            </div>
          )}

          {fix && (
            <>
              {/* Error block */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.6rem', color: 'rgba(0,255,65,0.3)' }}>01</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(0,255,65,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Error
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,65,0.07)' }} />
                <div style={{
                  fontSize: '0.6rem', fontWeight: 700, padding: '2px 10px', borderRadius: '3px',
                  border: `1px solid ${severity.color}44`, background: `${severity.color}12`,
                  color: severity.color, letterSpacing: '0.1em',
                }}>
                  SEVERITY: {severity.label}
                </div>
                <div style={{
                  fontSize: '0.6rem', fontWeight: 700, padding: '2px 10px', borderRadius: '3px',
                  border: '1px solid rgba(255,183,0,0.3)', background: 'rgba(255,183,0,0.08)',
                  color: '#ffb700', letterSpacing: '0.1em',
                }}>
                  {fix.language?.toUpperCase()}
                </div>
              </div>

              <pre style={{
                background: '#0d100d', border: '1px solid rgba(0,255,65,0.12)',
                borderRadius: '6px', padding: '0.875rem',
                fontSize: '0.72rem', color: '#ff6b6b',
                lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre-wrap',
                marginBottom: '1.5rem',
              }}>
                {fix.error_text}
              </pre>

              {/* Analysis block */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.6rem', color: 'rgba(0,255,65,0.3)' }}>02</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(0,255,65,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  AI Analysis
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,65,0.07)' }} />
              </div>

              <div style={{
                background: '#0d100d', border: '1px solid rgba(0,255,65,0.1)',
                borderRadius: '6px', overflow: 'hidden', marginBottom: '2rem',
              }}>
                <div style={{ padding: '0.875rem', borderBottom: '1px solid rgba(0,255,65,0.06)' }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#ffb700', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                    [EXPLANATION]
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(0,255,65,0.6)', lineHeight: 1.75, fontFamily: 'Inter, sans-serif', whiteSpace: 'pre-wrap' }}>
                    {fix.explanation}
                  </div>
                </div>

                <div style={{ padding: '0.875rem', borderBottom: fix.code ? '1px solid rgba(0,255,65,0.06)' : 'none' }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#00ff41', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                    [FIX] SOLUTION
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(0,255,65,0.6)', lineHeight: 1.75, fontFamily: 'Inter, sans-serif', whiteSpace: 'pre-wrap' }}>
                    {fix.fix_suggestion}
                  </div>
                </div>

                {fix.code && (
                  <div style={{ padding: '0.875rem', background: '#080a08' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(0,255,65,0.4)', letterSpacing: '0.1em' }}>
                        [CODE]
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(fix.code)}
                        style={{
                          fontSize: '0.58rem', padding: '2px 8px', background: 'transparent',
                          border: '1px solid rgba(0,255,65,0.15)', borderRadius: '3px',
                          color: 'rgba(0,255,65,0.35)', cursor: 'pointer', letterSpacing: '0.06em',
                        }}
                      >
                        COPY
                      </button>
                    </div>
                    <pre style={{
                      background: '#060806', border: '1px solid rgba(0,255,65,0.08)',
                      borderRadius: '4px', padding: '0.75rem',
                      fontSize: '0.7rem', color: '#00ff41',
                      lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre-wrap',
                    }}>
                      {fix.code}
                    </pre>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div style={{
                textAlign: 'center', padding: '1.5rem',
                border: '1px solid rgba(0,255,65,0.08)', borderRadius: '6px',
                background: '#0d100d',
              }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(0,255,65,0.4)', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                  Analyze your own errors with AI — free
                </div>
                <Link to="/" style={{
                  fontSize: '0.7rem', fontWeight: 700, color: '#00ff41',
                  border: '1px solid rgba(0,255,65,0.3)', borderRadius: '4px',
                  padding: '0.5rem 1.25rem', textDecoration: 'none',
                  letterSpacing: '0.08em', display: 'inline-block',
                }}>
                  TRY BUGSNAP →
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <div style={{
        height: '28px', background: '#0d100d',
        borderTop: '1px solid rgba(0,255,65,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '0.58rem', color: 'rgba(0,255,65,0.2)', letterSpacing: '0.06em' }}>
          BUGSNAP // AI-POWERED ERROR ANALYZER
        </span>
      </div>
    </div>
  );
}
