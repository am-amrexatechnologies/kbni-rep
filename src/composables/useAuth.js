import { reactive, readonly } from 'vue'
import { api } from './useApi'

const USER_KEY = 'kbni_user'

// Non-sensitive UI state: id, username, email
const state = reactive({ user: null, loading: false })

// Rehydrate from localStorage so the user stays "logged in" on refresh.
// The real auth is the httpOnly cookie; localStorage is only for the UI.
try {
  const stored = localStorage.getItem(USER_KEY)
  if (stored) state.user = JSON.parse(stored)
} catch { /* ignore */ }

async function login(username, password) {
  state.loading = true
  try {
    const data = await api.post('/auth/login', { username, password })
    state.user = data.user
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return data
  } finally {
    state.loading = false
  }
}

async function register(username, email, password) {
  state.loading = true
  try {
    return await api.post('/auth/register', { username, email, password })
  } finally {
    state.loading = false
  }
}

async function logout() {
  try { await api.post('/auth/logout') } catch { /* ignore */ }
  state.user = null
  localStorage.removeItem(USER_KEY)
}

export function useAuth() {
  return { state: readonly(state), login, register, logout }
}
