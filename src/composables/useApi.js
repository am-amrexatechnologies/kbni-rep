// Base URL: set VITE_API_URL in .env for production.
// In development the Vite proxy forwards /auth, /chat, etc. to localhost:3000.
const BASE = import.meta.env.VITE_API_URL ?? ''

async function request(path, init = {}) {
  const res = await fetch(BASE + path, {
    credentials: 'include', // send session cookie
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    ...init,
  })

  let data
  try { data = await res.json() } catch { data = {} }

  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
  return data
}

export const api = {
  get:    (path)       => request(path),
  post:   (path, body) => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body) => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (path)       => request(path, { method: 'DELETE' }),
}
