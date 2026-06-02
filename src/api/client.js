import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

// Token automatisch mitsenden
api.interceptors.request.use(config => {
  const token = localStorage.getItem('kbni_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 401 → Logout
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('kbni_token')
      localStorage.removeItem('kbni_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
