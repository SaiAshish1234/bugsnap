import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

const SEVERITY_CONFIG = {
  low:      { color: '#00ff41', label: 'LOW' },
  medium:   { color: '#ffb700', label: 'MED' },
  high:     { color: '#ff6b00', label: 'HIGH' },
  critical: { color: '#ff3131', label: 'CRIT' },
};

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    setLoading(true);
    if (user) {
      const { data, error } = await supabase
        .from('bug_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map((row) => ({
          id: row.id,
          errorText: row.error_text,
          language: row.language,
          timestamp: row.created_at,
          result: {
            severity: row.severity,
            what: row.explanation,
            why: row.explanation,
            fix: row.fix_suggestion,
          },
        }));
        setHistory(mapped);
      }
    } else {
      const saved = JSON.parse(localStorage.getItem('bugsnap_history') || '[]');
      setHistory(saved);
    }
    setLoading(false);
  };

  const clearHistory = async () => {
    if (user) {
      await supabase.from('bug_history').delete().eq('user_id', user.id);
    } else {
      localStorage.removeItem('bugsnap_history');
    }
    setHistory([]);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.6rem', color: 'rgba(0,255,65,0.3)' }}>01</span>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(0,255,65,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Error History</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,65,0.07)' }} />
        {!user && (
          <span style={{ fontSize: '0.58rem', color: 'rgba(255,183,0,0.5)', letterSpacing: '0.06em' }}>
            // LOCAL ONLY — LOGIN TO SYNC
          </span>
        )}
        <span style={{ fontSize: '0.6rem', color: 'rgba(0,255,65,0.3)', letterSpacing: '0.06em' }}>
          {history.length} records
        </span>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            style={{
              fontSize: '0.6rem', padding: '2px 8px',
              background: 'rgba(255,49,49,0.08)',
              border: '1px solid rgba(255,49,49,0.2)',
              borderRadius: '3px', color: '#ff6b6b',
              cursor: 'pointer', letterSpacing: '0.06em',
            }}
          >
            CLEAR ALL
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ fontSize: '0.65rem', color: 'rgba(0,255,65,0.3)', letterSpacing: '0.08em' }}>
          // LOADING...
        </div>
      ) : history.length === 0 ? (
        <div style={{
          background: '#0d100d',
          border: '1px solid rgba(0,255,65,0.08)',
          borderRadius: '6px', padding: '3rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(0,255,65,0.3)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            // NO ERRORS IN HISTORY
          </div>
          <div style={{ fontSize: '0.62rem', color: 'rgba(0,255,65,0.15)', letterSpacing: '0.06em' }}>
            Analyzed errors will appear here
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {history.map((item, i) => {
            const sev = SEVERITY_CONFIG[item.result?.severity] || SEVERITY_CONFIG.medium;
            const isExpanded = expanded === item.id;
            return (
              <div
                key={item.id}
                style={{
                  background: '#0d100d',
                  border: `1px solid ${isExpanded ? 'rgba(0,255,65,0.15)' : 'rgba(0,255,65,0.08)'}`,
                  borderRadius: '6px', overflow: 'hidden',
                  transition: 'border-color 0.15s',
                }}
              >
                <div
                  onClick={() => setExpanded(isExpanded ? null : item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '0.75rem 0.875rem', cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '0.6rem', color: 'rgba(0,255,65,0.2)', minWidth: '20px' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div style={{
                    fontSize: '0.58rem', fontWeight: 700,
                    padding: '1px 7px', borderRadius: '3px',
                    border: `1px solid ${sev.color}44`,
                    background: `${sev.color}10`,
                    color: sev.color, letterSpacing: '0.08em',
                    flexShrink: 0,
                  }}>
                    {sev.label}
                  </div>
                  <div style={{
                    fontSize: '0.6rem', padding: '1px 7px', borderRadius: '3px',
                    border: '1px solid rgba(255,183,0,0.2)',
                    background: 'rgba(255,183,0,0.06)',
                    color: '#ffb700', letterSpacing: '0.06em',
                    flexShrink: 0,
                  }}>
                    {item.language?.toUpperCase()}
                  </div>
                  <div style={{
                    flex: 1, fontSize: '0.7rem',
                    color: 'rgba(0,255,65,0.5)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {item.errorText}
                  </div>
                  <div style={{ fontSize: '0.58rem', color: 'rgba(0,255,65,0.2)', flexShrink: 0 }}>
                    {formatDate(item.timestamp)}
                  </div>
                  <i className={`ti ti-chevron-${isExpanded ? 'up' : 'down'}`} style={{ fontSize: '13px', color: 'rgba(0,255,65,0.3)', flexShrink: 0 }} />
                </div>

                {isExpanded && item.result && (
                  <div style={{ borderTop: '1px solid rgba(0,255,65,0.07)', padding: '0.875rem' }}>
                    {[
                      { tag: '[ERR]', color: '#ff6b6b', label: 'WHAT', text: item.result.what },
                      { tag: '[WHY]', color: '#ffb700', label: 'ROOT CAUSE', text: item.result.why },
                      { tag: '[FIX]', color: '#00ff41', label: 'SOLUTION', text: item.result.fix },
                    ].map(({ tag, color, label, text }) => (
                      <div key={label} style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, color, letterSpacing: '0.08em' }}>
                          {tag} {label}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(0,255,65,0.5)', lineHeight: 1.7, marginTop: '3px', fontFamily: 'Inter, sans-serif' }}>
                          {text}
                        </div>
                      </div>
                    ))}
                    {item.result.code && (
                      <pre style={{
                        background: '#060806', border: '1px solid rgba(0,255,65,0.08)',
                        borderRadius: '4px', padding: '0.65rem',
                        fontSize: '0.65rem', color: '#00ff41',
                        lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre-wrap',
                        marginTop: '0.5rem',
                      }}>
                        {item.result.code}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}