import { useState, useEffect } from 'react'
import LoginPage from '../components/LoginPage'
import AppPage from '../components/AppPage'

export default function Home() {
  const [user, setUser] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('scriptai_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.email) setUser(parsed.email)
      }
    } catch {}
    setChecked(true)
  }, [])

  function handleLogin(email) { setUser(email) }
  function handleLogout() {
    localStorage.removeItem('scriptai_user')
    setUser(null)
  }

  if (!checked) return null // prevents flash

  if (!user) return <LoginPage onLogin={handleLogin} />
  return <AppPage user={user} onLogout={handleLogout} />
}
