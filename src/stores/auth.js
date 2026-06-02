import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/client'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(JSON.parse(localStorage.getItem('kbni_user')) || null)
  const isLoggedIn  = computed(() => !!currentUser.value)

  function _persist(user, token) {
    currentUser.value = user
    localStorage.setItem('kbni_user',  JSON.stringify(user))
    localStorage.setItem('kbni_token', token)
  }

  async function register(username, email, password) {
    try {
      await api.post('/auth/register', { username, email, password })
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Fehler bei der Registrierung.' }
    }
  }

  async function login(username, password) {
    try {
      const { data } = await api.post('/auth/login', { username, password })
      _persist(data.user, data.token)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login fehlgeschlagen.' }
    }
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('kbni_user')
    localStorage.removeItem('kbni_token')
  }

  async function updateProfile(updates) {
    try {
      const { data } = await api.put('/auth/profile', updates)
      _persist(data.user, data.token)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Fehler beim Speichern.' }
    }
  }

  return { currentUser, isLoggedIn, register, login, logout, updateProfile }
})
