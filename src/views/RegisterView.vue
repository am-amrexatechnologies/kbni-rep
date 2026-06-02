<template>
  <div class="auth-wrapper">
    <div class="auth-card card">
      <div class="auth-logo">
        <div class="auth-logo-icon">K</div>
        <div class="auth-logo-name">KBNI</div>
      </div>
      <h2>Account erstellen</h2>
      <p>Kostenlos registrieren und loslegen</p>

      <Transition name="fade">
        <div v-if="error"   class="alert alert-danger"  style="margin-top:1rem">{{ error }}</div>
      </Transition>
      <Transition name="fade">
        <div v-if="success" class="alert alert-success" style="margin-top:1rem">{{ success }}</div>
      </Transition>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label class="form-label">Benutzername</label>
          <input v-model="form.username" class="form-input" type="text" placeholder="max_mustermann" required minlength="3" />
        </div>
        <div class="form-group">
          <label class="form-label">E-Mail</label>
          <input v-model="form.email" class="form-input" type="email" placeholder="max@example.de" required />
        </div>
        <div class="form-group">
          <label class="form-label">Passwort</label>
          <input v-model="form.password" class="form-input" type="password" placeholder="Min. 6 Zeichen" required minlength="6" />
        </div>
        <div class="form-group">
          <label class="form-label">Passwort bestätigen</label>
          <input v-model="form.confirm" class="form-input" type="password" placeholder="Passwort wiederholen" required />
        </div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%" :disabled="loading">
          {{ loading ? 'Registrieren…' : 'Account erstellen' }}
        </button>
      </form>

      <div class="auth-switch">
        Schon registriert? <RouterLink to="/login">Einloggen</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth    = useAuthStore()
const router  = useRouter()
const form    = ref({ username: '', email: '', password: '', confirm: '' })
const error   = ref('')
const success = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value   = ''
  success.value = ''
  if (form.value.password !== form.value.confirm) { error.value = 'Passwörter stimmen nicht überein.'; return }
  loading.value = true
  const result  = await auth.register(form.value.username, form.value.email, form.value.password)
  loading.value = false
  if (result.success) {
    success.value = 'Account erstellt! Du wirst weitergeleitet…'
    setTimeout(() => router.push('/login'), 1200)
  } else {
    error.value = result.message
  }
}
</script>

<style scoped>
.auth-wrapper {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: calc(var(--nav-height) + 2rem) 1.5rem 3rem; min-height: 100vh;
}
.auth-card { width: 100%; max-width: 420px; text-align: center; }
.auth-logo { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem; }
.auth-logo-icon {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 1.1rem; box-shadow: var(--shadow-md);
}
.auth-logo-name { font-size: 1.25rem; font-weight: 700; color: var(--color-text); }
.auth-card h2 { margin-bottom: 0.3rem; }
.auth-form { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; text-align: left; }
.auth-switch { margin-top: 1.25rem; font-size: 0.88rem; color: var(--color-text-muted); }
</style>
