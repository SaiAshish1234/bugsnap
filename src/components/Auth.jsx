import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Auth({ onClose }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    const { error } = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else if (mode === 'signup') {
      setInfo('Account created. Check your email to confirm, then log in.');
    } else {
      onClose();
    }
  };

  const inputStyle = {
    width: '100%',
    background: '#060806',
    border: '1px solid rgba(0,255,65,0.12)',
    borderRadius: '4px',
    padding: '0.5rem 0.625rem',
    color: '#00ff41',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#0d100d',
        border: '1px solid rgba(0,255,65,0.15)',
        borderRadius: '6px',
        padding: '1.5rem',
        width: '320px',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '0.75rem', right: '0.75rem',
            background: 'none', border: 'none', color: 'rgba(0,255,65,0.4)',
            fontSize: '0.9rem', cursor: 'pointer', lineHeight: 1,
          }}
        >
          ✕
        </button>

        <div style={{ fontSize: '0.65rem', color: 'rgba(0,255,65,0.3)', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
          {mode === 'login' ? '// LOGIN' : '// CREATE ACCOUNT'}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.6rem', color: 'rgba(0,255,65,0.4)', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.6rem', color: 'rgba(0,255,65,0.4)', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{ fontSize: '0.62rem', color: '#ff6b6b', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
              ERROR: {error}
            </div>
          )}
          {info && (
            <div style={{ fontSize: '0.62rem', color: '#ffb700', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'rgba(0,255,65,0.08)',
              border: '1px solid rgba(0,255,65,0.25)',
              borderRadius: '4px',
              padding: '0.55rem',
              color: '#00ff41',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'PROCESSING...' : mode === 'login' ? 'LOGIN' : 'SIGN UP'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setInfo(''); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.62rem', color: 'rgba(0,255,65,0.4)', letterSpacing: '0.04em',
            }}
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}