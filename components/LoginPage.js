import { useState } from 'react'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCode, setShowCode] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        localStorage.setItem('scriptai_user', JSON.stringify({ email: data.email, ts: Date.now() }))
        onLogin(data.email)
      } else {
        setError(data.error || 'Login gagal')
      }
    } catch {
      setError('Gagal terhubung ke server')
    }

    setLoading(false)
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.bg1} />
      <div style={styles.bg2} />

      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <span style={styles.logo}>Script<span style={{ color: '#ff3c6e' }}>AI</span></span>
          <span style={styles.badge}>✦ v2.0</span>
        </div>

        <h2 style={styles.title}>Masuk ke Akun Kamu</h2>
        <p style={styles.subtitle}>Masukkan email & kode akses yang diberikan admin</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="emailkamu@gmail.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Kode Akses</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCode ? 'text' : 'password'}
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Masukkan kode dari admin"
                required
                style={{ ...styles.input, paddingRight: '44px', fontFamily: 'monospace', letterSpacing: '0.08em' }}
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                style={styles.eyeBtn}
              >
                {showCode ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.btnLogin, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Memverifikasi...' : 'Masuk →'}
          </button>
        </form>

        <p style={styles.hint}>
          Belum punya akses? Hubungi admin untuk mendapatkan kode.
        </p>
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    background: '#0a0a0f',
  },
  bg1: {
    position: 'fixed', top: '-20%', left: '-10%',
    width: '50%', height: '60%',
    background: 'radial-gradient(ellipse, rgba(255,60,110,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bg2: {
    position: 'fixed', bottom: '-20%', right: '-10%',
    width: '50%', height: '60%',
    background: 'radial-gradient(ellipse, rgba(78,240,180,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: '#13131c',
    border: '1px solid #2a2a38',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    position: 'relative',
    zIndex: 1,
  },
  logoWrap: {
    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px',
  },
  logo: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em', color: '#f0f0f5',
  },
  badge: {
    fontSize: '0.7rem',
    background: 'linear-gradient(135deg, #ff3c6e, #ff8c42)',
    color: 'white', padding: '3px 10px', borderRadius: '99px', fontWeight: 600,
  },
  title: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.5rem',
    letterSpacing: '-0.02em', marginBottom: '8px', color: '#f0f0f5',
  },
  subtitle: {
    color: '#6b6b82', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '24px',
  },
  errorBox: {
    background: 'rgba(255,60,110,0.1)', border: '1px solid rgba(255,60,110,0.3)',
    borderRadius: '10px', padding: '12px 16px', color: '#ff3c6e',
    fontSize: '0.85rem', marginBottom: '16px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: {
    fontSize: '0.75rem', fontWeight: 500, color: '#6b6b82',
    letterSpacing: '0.04em', textTransform: 'uppercase',
  },
  input: {
    width: '100%', background: '#18181f', border: '1px solid #2a2a38',
    borderRadius: '12px', color: '#f0f0f5', fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.92rem', padding: '12px 16px', outline: 'none',
  },
  eyeBtn: {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#6b6b82',
  },
  btnLogin: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #ff3c6e, #ff8c42)',
    border: 'none', borderRadius: '12px', color: 'white',
    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem',
    cursor: 'pointer', marginTop: '4px', transition: 'all 0.2s',
  },
  hint: {
    textAlign: 'center', color: '#6b6b82', fontSize: '0.78rem',
    marginTop: '20px', lineHeight: 1.5,
  },
}
