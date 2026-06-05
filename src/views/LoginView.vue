<template>
  <div>
    <NavBar />
    <main class="auth-main">
      <div class="auth-card fade-in-up">
        <!-- Header -->
        <div class="auth-header">
          <div class="auth-logo">K</div>
          <h1 class="auth-title">Willkommen zurück</h1>
          <p class="auth-sub">Meld dich an und mach weiter.</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label class="form-label">Benutzername</label>
            <input
              v-model="form.username"
              type="text"
              class="form-input"
              placeholder="dein_username"
              required
              autocomplete="username"
              autofocus
            />
          </div>

          <div class="form-group">
            <label class="form-label">Passwort</label>
            <div class="input-pw-wrapper">
              <input
                v-model="form.password"
                :type="showPw ? 'text' : 'password'"
                class="form-input"
                placeholder="••••••••"
                required
                autocomplete="current-password"
              />
              <button type="button" class="pw-toggle" @click="showPw = !showPw" tabindex="-1">
                {{ showPw ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- Error -->
          <div class="auth-error" v-if="error">{{ error }}</div>

          <button type="submit" class="btn btn-primary auth-submit" :disabled="auth.state.loading">
            <span v-if="auth.state.loading" class="spinner"></span>
            {{ auth.state.loading ? 'Einen Moment…' : 'Einloggen' }}
          </button>
        </form>

        <p class="auth-footer-text">
          Noch kein Konto?
          <RouterLink to="/register" class="auth-link">Registrieren</RouterLink>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const auth   = useAuth()

const showPw = ref(false)
const error  = ref('')
const form   = reactive({ username: '', password: '' })

async function handleLogin() {
  error.value = ''
  try {
    await auth.login(form.username, form.password)
    router.push('/')
  } catch (e) {
    error.value = e.message
  }
}
</script>

<style scoped>
.auth-main {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  background: var(--slate-100);
}
.auth-card {
  width: 100%; max-width: 440px;
  background: var(--white);
  border: 1px solid var(--slate-200);
  border-radius: var(--radius-xl);
  padding: 40px;
  box-shadow: var(--shadow-lg);
}
.auth-header { text-align: center; margin-bottom: 32px; }
.auth-logo {
  width: 48px; height: 48px; border-radius: 12px;
  background: var(--blue-600); color: white;
  font-weight: 800; font-size: 1.4rem;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}
.auth-title  { font-size: 1.5rem; font-weight: 800; color: var(--slate-900); margin-bottom: 6px; }
.auth-sub    { font-size: .9rem; color: var(--slate-500); }
.auth-form   { margin-bottom: 24px; }
.input-pw-wrapper { position: relative; }
.input-pw-wrapper .form-input { width: 100%; padding-right: 44px; }
.pw-toggle {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; font-size: .95rem;
}
.auth-error {
  background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626;
  border-radius: var(--radius-sm); padding: 10px 14px;
  font-size: .85rem; margin-bottom: 16px;
}
.auth-submit { width: 100%; justify-content: center; padding: 12px; font-size: .95rem; }
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.4); border-top-color: white;
  border-radius: 50%; animation: spin .6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.auth-footer-text { text-align: center; font-size: .875rem; color: var(--slate-500); }
.auth-link { color: var(--blue-600); font-weight: 600; }
.auth-link:hover { text-decoration: underline; }
</style>
