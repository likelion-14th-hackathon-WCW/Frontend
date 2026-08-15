import { useState } from 'react'

// ponytail: read-only — the real login flow lives in a separate repo and is
// expected to write { name } to localStorage['wcw_user'] once it's wired up.
export function useAuth() {
  const [user] = useState(() => {
    try {
      const raw = localStorage.getItem('wcw_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  return { user }
}
