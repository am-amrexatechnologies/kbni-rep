<template>
  <div class="auth-wrapper">
    <div class="auth-card card">
      <div class="auth-logo">
        <div class="auth-logo-icon">K</div>
        <div class="auth-logo-name">KBNI</div>
      </div>
      <h2>Willkommen zurück</h2>
      <p>Melde dich in deinem Account an</p>

      <Transition name="fade">
        <div v-if="error" class="alert alert-danger" style="margin-top:1rem">{{ error }}</div>
      </Transition>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label class="form-label">Benutzername</label>
          <input v-model="form.username" class="form-input" type="text" placeholder="dein_username" autocomplete="username" required />
        </div>
        <div class="form-group">
          <label class="form-label">Passwort</label>
          <input v-model="form.password" class="form-input" type="password" placeholder="Passwort" autocomplete="current-password" required />
        </div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%" :disabled="loading">
          {{ loading ? 'Einloggen…' : 'Einloggen' }}
        </button>
      </form>

      <div class="auth-switch">
        Noch kein Account? <RouterLink to="/register">Jetzt registrieren</RouterLink>
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
const form    = ref({ username: '', password: '' })
const error   = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value   = ''
  loading.value = true
  const result  = await auth.login(form.value.username, form.value.password)
  loading.value = false
  if (result.success) router.push('/')
  else error.value = result.message
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
