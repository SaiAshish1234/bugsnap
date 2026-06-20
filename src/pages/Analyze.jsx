import { useState } from 'react';
import { analyzeError, detectLanguage } from '../lib/ai';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

const LANGUAGES = [
  'Auto',
  'JavaScript', 'TypeScript', 'Python', 'Java', 'React',
  'Node.js', 'Go', 'Rust', 'C++', 'C#', 'PHP', 'Ruby',
  'Swift', 'Kotlin', 'SQL', 'Bash', 'Other'
];

const SEVERITY_CONFIG = {
  low:      { color: '#00ff41', label: 'LOW' },
  medium:   { color: '#ffb700', label: 'MED' },
  high:     { color: '#ff6b00', label: 'HIGH' },
  critical: { color: '#ff3131', label: 'CRIT' },
};

export default function Analyze() {
  const { user } = useAuth();
  const [errorText, setErrorText] = useState('');
  const [language, setLanguage] = useState('Auto');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [sharing, setSharing] = useState(false);

  const handleAnalyze = async () => {
    if (!errorText.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setShareLink('');

    const detectedLang = language === 'Auto' ? detectLanguage(errorText) : language;

    try {
      const analysis = await analyzeError(errorText, detectedLang);
      setResult(analysis);

      // Save to history (Supabase if logged in, else localStorage)
      if (user) {
        await supabase.from('bug_history').insert({
          user_id: user.id,
          error_text: errorText.slice(0, 100),
          language: detectedLang,
          severity: analysis.severity,
          explanation: `${analysis.what}\n\n${analysis.why}`,
          fix_suggestion: analysis.code ? `${analysis.fix}\n\n${analysis.code}` : analysis.fix,
        });
      } else {
        const history = JSON.parse(localStorage.getItem('bugsnap_history') || '[]');
        history.unshift({
          id: Date.now(),
          errorText: errorText.slice(0, 100),
          language: detectedLang,
          result: analysis,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem('bugsnap_history', JSON.stringify(history.slice(0, 50)));
      }
    } catch {
      setError('Analysis failed. Check your API key or try again.');
    }
    setLoading(false);
  };

  const handleShare = async () => {
    if (!user || !result) return;
    setSharing(true);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data, error: shareError } = await supabase
      .from('shared_fixes')
      .insert({
        user_id: user.id,
        error_text: errorText,
        language: result.language,
        severity: result.severity,
        explanation: `${result.what}\n\n${result.why}`,
        fix_suggestion: result.fix,
        code: result.code || null,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    setSharing(false);

    if (!shareError && data) {
      const link = `${window.location.origin}/share/${data.id}`;
      setShareLink(link);
      navigator.clipboard.writeText(link);
    }
  };

  const severity = result ? SEVERITY_CONFIG[result.severity] || SEVERITY_CONFIG.medium : null;

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.6rem', color: 'rgba(0,255,65,0.3)' }}>01</span>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(0,255,65,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Input Error</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,65,0.07)' }} />
      </div>

      {/* Input box */}
      <div style={{
        background: '#0d100d',
        border: '1px solid rgba(0,255,65,0.12)',
        borderRadius: '6px',
        overflow: 'hidden',
        marginBottom: '1.5rem',
      }}>
        {/* Input header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.5rem 0.875rem',
          borderBottom: '1px solid rgba(0,255,65,0.07)',
          background: '#080a08',
        }}>
          <span style={{ fontSize: '0.6rem', color: 'rgba(0,255,65,0.25)', letterSpacing: '0.08em' }}>
            // paste your error or stack trace below
          </span>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '500px' }}>
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                style={{
                  fontSize: '0.58rem',
                  padding: '2px 7px',
                  borderRadius: '3px',
                  border: `1px solid ${language === lang ? 'rgba(0,255,65,0.35)' : 'rgba(0,255,65,0.1)'}`,
                  background: language === lang ? 'rgba(0,255,65,0.1)' : 'transparent',
                  color: language === lang ? '#00ff41' : 'rgba(0,255,65,0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  letterSpacing: '0.04em',
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={errorText}
          onChange={(e) => setErrorText(e.target.value)}
          placeholder={`TypeError: Cannot read properties of undefined (reading 'map')\n    at Dashboard (Dashboard.jsx:47:22)\n    at renderWithHooks...`}
          rows={6}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            padding: '0.875rem',
            fontSize: '0.72rem',
            color: '#ff6b6b',
            lineHeight: 1.7,
            resize: 'vertical',
            outline: 'none',
            letterSpacing: '0.02em',
          }}
        />

        {/* Input footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.5rem 0.875rem',
          borderTop: '1px solid rgba(0,255,65,0.07)',
          background: '#080a08',
        }}>
          <span style={{ fontSize: '0.58rem', color: 'rgba(0,255,65,0.2)', letterSpacing: '0.06em' }}>
            {errorText.length} chars // {errorText.split('\n').length} lines
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {errorText && (
              <button
                onClick={() => { setErrorText(''); setResult(null); setShareLink(''); }}
                style={{
                  fontSize: '0.62rem', padding: '0.3rem 0.75rem',
                  background: 'transparent',
                  border: '1px solid rgba(0,255,65,0.12)',
                  borderRadius: '4px', color: 'rgba(0,255,65,0.3)',
                  cursor: 'pointer', letterSpacing: '0.06em',
                }}
              >
                CLEAR
              </button>
            )}
            <button
              onClick={handleAnalyze}
              disabled={loading || !errorText.trim()}
              style={{
                fontSize: '0.7rem', fontWeight: 700,
                padding: '0.35rem 1.25rem',
                background: loading ? 'rgba(0,255,65,0.05)' : 'rgba(0,255,65,0.1)',
                border: `1px solid ${loading ? 'rgba(0,255,65,0.15)' : 'rgba(0,255,65,0.35)'}`,
                borderRadius: '4px',
                color: loading ? 'rgba(0,255,65,0.4)' : '#00ff41',
                cursor: loading || !errorText.trim() ? 'not-allowed' : 'pointer',
                letterSpacing: '0.08em',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.15s',
              }}
            >
              <i className={`ti ${loading ? 'ti-loader' : 'ti-player-play'}`} style={{ fontSize: '12px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? 'ANALYZING...' : '▶ RUN ANALYSIS'}
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          background: 'rgba(255,49,49,0.08)',
          border: '1px solid rgba(255,49,49,0.2)',
          borderRadius: '4px', padding: '0.65rem 0.875rem',
          fontSize: '0.7rem', color: '#ff6b6b',
          marginBottom: '1.25rem', letterSpacing: '0.04em',
        }}>
          [ERR] {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div style={{
          background: '#0d100d',
          border: '1px solid rgba(0,255,65,0.1)',
          borderRadius: '6px', padding: '2rem',
          textAlign: 'center', marginBottom: '1.25rem',
        }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(0,255,65,0.5)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            RUNNING AI ANALYSIS...
          </div>
          <div style={{ fontSize: '0.62rem', color: 'rgba(0,255,65,0.25)', letterSpacing: '0.06em' }}>
            Sending to Gemini API // Please wait
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.6rem', color: 'rgba(0,255,65,0.3)' }}>02</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(0,255,65,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI Analysis Output</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,65,0.07)' }} />
            {/* Severity badge */}
            <div style={{
              fontSize: '0.6rem', fontWeight: 700,
              padding: '2px 10px', borderRadius: '3px',
              border: `1px solid ${severity.color}44`,
              background: `${severity.color}12`,
              color: severity.color,
              letterSpacing: '0.1em',
            }}>
              SEVERITY: {severity.label}
            </div>
            {/* Language badge */}
            <div style={{
              fontSize: '0.6rem', fontWeight: 700,
              padding: '2px 10px', borderRadius: '3px',
              border: '1px solid rgba(255,183,0,0.3)',
              background: 'rgba(255,183,0,0.08)',
              color: '#ffb700', letterSpacing: '0.1em',
            }}>
              {result.language?.toUpperCase()}
            </div>
            {/* Share button */}
            {user && (
              <button
                onClick={handleShare}
                disabled={sharing}
                style={{
                  fontSize: '0.6rem', fontWeight: 700,
                  padding: '2px 10px', borderRadius: '3px',
                  border: '1px solid rgba(0,255,65,0.25)',
                  background: 'rgba(0,255,65,0.06)',
                  color: '#00ff41',
                  cursor: sharing ? 'default' : 'pointer',
                  letterSpacing: '0.1em',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                <i className="ti ti-link" style={{ fontSize: '11px' }} />
                {sharing ? 'SHARING...' : shareLink ? 'LINK COPIED ✓' : 'SHARE'}
              </button>
            )}
          </div>

          {/* Share link display */}
          {shareLink && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(0,255,65,0.05)',
              border: '1px solid rgba(0,255,65,0.15)',
              borderRadius: '4px', padding: '0.5rem 0.75rem',
              marginBottom: '1rem',
            }}>
              <i className="ti ti-check" style={{ fontSize: '12px', color: '#00ff41' }} />
              <span style={{ fontSize: '0.62rem', color: 'rgba(0,255,65,0.5)', letterSpacing: '0.04em' }}>
                Link copied (expires in 7 days):
              </span>
              <span style={{ fontSize: '0.62rem', color: '#00ff41', letterSpacing: '0.02em', wordBreak: 'break-all' }}>
                {shareLink}
              </span>
            </div>
          )}

          <div style={{
            background: '#0d100d',
            border: '1px solid rgba(0,255,65,0.1)',
            borderRadius: '6px', overflow: 'hidden',
          }}>
            {/* What went wrong */}
            <div style={{ padding: '0.875rem', borderBottom: '1px solid rgba(0,255,65,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.5rem' }}>
                <i className="ti ti-alert-triangle" style={{ fontSize: '12px', color: '#ff6b6b' }} />
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#ff6b6b', letterSpacing: '0.1em' }}>[ERR] WHAT WENT WRONG</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(0,255,65,0.6)', lineHeight: 1.75, fontFamily: 'Inter, sans-serif' }}>
                {result.what}
              </div>
            </div>

            {/* Why */}
            <div style={{ padding: '0.875rem', borderBottom: '1px solid rgba(0,255,65,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.5rem' }}>
                <i className="ti ti-help-circle" style={{ fontSize: '12px', color: '#ffb700' }} />
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#ffb700', letterSpacing: '0.1em' }}>[WHY] ROOT CAUSE</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(0,255,65,0.6)', lineHeight: 1.75, fontFamily: 'Inter, sans-serif' }}>
                {result.why}
              </div>
            </div>

            {/* Fix */}
            <div style={{ padding: '0.875rem', borderBottom: result.code ? '1px solid rgba(0,255,65,0.06)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.5rem' }}>
                <i className="ti ti-check" style={{ fontSize: '12px', color: '#00ff41' }} />
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#00ff41', letterSpacing: '0.1em' }}>[FIX] SOLUTION</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(0,255,65,0.6)', lineHeight: 1.75, fontFamily: 'Inter, sans-serif' }}>
                {result.fix}
              </div>
            </div>

            {/* Code block */}
            {result.code && (
              <div style={{ padding: '0.875rem', background: '#080a08' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(0,255,65,0.4)', letterSpacing: '0.1em' }}>[CODE] SUGGESTED FIX</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(result.code)}
                    style={{
                      fontSize: '0.58rem', padding: '2px 8px',
                      background: 'transparent',
                      border: '1px solid rgba(0,255,65,0.15)',
                      borderRadius: '3px', color: 'rgba(0,255,65,0.35)',
                      cursor: 'pointer', letterSpacing: '0.06em',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    <i className="ti ti-copy" style={{ fontSize: '11px' }} />
                    COPY
                  </button>
                </div>
                <pre style={{
                  background: '#060806',
                  border: '1px solid rgba(0,255,65,0.08)',
                  borderRadius: '4px', padding: '0.75rem',
                  fontSize: '0.7rem', color: '#00ff41',
                  lineHeight: 1.7, overflowX: 'auto',
                  whiteSpace: 'pre-wrap',
                }}>
                  {result.code}
                </pre>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
