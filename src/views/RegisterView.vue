<template>
  <div>
    <NavBar />
    <main class="auth-main">
      <div class="auth-card fade-in-up">
        <!-- Header -->
        <div class="auth-header">
          <div class="auth-logo">K</div>
          <h1 class="auth-title">Konto erstellen</h1>
          <p class="auth-sub">Kostenlos registrieren und loslegen.</p>
        </div>

        <!-- Steps -->
        <div class="steps">
          <div class="step" :class="{ 'step--active': step >= 1, 'step--done': step > 1 }">
            <span class="step-num">{{ step > 1 ? '✓' : '1' }}</span>
            <span class="step-label">Konto</span>
          </div>
          <div class="step-line" :class="{ 'step-line--active': step >= 2 }"></div>
          <div class="step" :class="{ 'step--active': step >= 2 }">
            <span class="step-num">2</span>
            <span class="step-label">Passwort</span>
          </div>
        </div>

        <!-- Step 1 -->
        <form v-if="step === 1" @submit.prevent="nextStep" class="auth-form">
          <div class="form-group">
            <label class="form-label">Benutzername</label>
            <input
              v-model="form.username"
              type="text"
              class="form-input"
              placeholder="z. B. cooluser42"
              required
              minlength="3"
              autocomplete="username"
              autofocus
            />
            <span class="form-hint">Mindestens 3 Zeichen – wird zum Einloggen verwendet.</span>
          </div>
          <div class="form-group">
            <label class="form-label">E-Mail</label>
            <input
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="du@example.com"
              required
              autocomplete="email"
            />
          </div>
          <button type="submit" class="btn btn-primary auth-submit">Weiter →</button>
        </form>

        <!-- Step 2 -->
        <form v-if="step === 2" @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label class="form-label">Passwort</label>
            <div class="input-pw-wrapper">
              <input
                v-model="form.password"
                :type="showPw ? 'text' : 'password'"
                class="form-input"
                placeholder="Mindestens 8 Zeichen"
                required
                minlength="8"
                autocomplete="new-password"
              />
              <button type="button" class="pw-toggle" @click="showPw = !showPw" tabindex="-1">
                {{ showPw ? '🙈' : '👁️' }}
              </button>
            </div>
            <div class="pw-strength">
              <div class="pw-bar"><div class="pw-bar-fill" :style="{ width: pwStrength.pct + '%', background: pwStrength.color }"></div></div>
              <span class="pw-label" :style="{ color: pwStrength.color }">{{ pwStrength.label }}</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Passwort wiederholen</label>
            <div class="input-pw-wrapper">
              <input
                v-model="form.confirm"
                :type="showPw ? 'text' : 'password'"
                class="form-input"
                :class="{ 'form-input--error': form.confirm && form.confirm !== form.password }"
                placeholder="••••••••"
                required
                autocomplete="new-password"
              />
            </div>
            <span class="form-hint form-hint--error" v-if="form.confirm && form.confirm !== form.password">
              Passwörter stimmen nicht überein.
            </span>
          </div>

          <label class="tos-row">
            <input v-model="form.tos" type="checkbox" required class="tos-check" />
            <span>Ich akzeptiere die <RouterLink to="/datenschutz" class="auth-link">Datenschutzerklärung</RouterLink>.</span>
          </label>

          <div class="auth-error" v-if="error">{{ error }}</div>
          <div class="auth-success" v-if="success">{{ success }}</div>

          <div class="step-btns">
            <button type="button" class="btn btn-ghost" @click="step = 1">← Zurück</button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="auth.state.loading || form.password !== form.confirm"
            >
              <span v-if="auth.state.loading" class="spinner"></span>
              {{ auth.state.loading ? 'Registrieren…' : 'Konto erstellen' }}
            </button>
          </div>
        </form>

        <p class="auth-footer-text">
          Bereits registriert?
          <RouterLink to="/login" class="auth-link">Einloggen</RouterLink>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { useAuth } from '@/composables/useAuth'

const router  = useRouter()
const auth    = useAuth()
const step    = ref(1)
const showPw  = ref(false)
const error   = ref('')
const success = ref('')

const form = reactive({ username: '', email: '', password: '', confirm: '', tos: false })

function nextStep() {
  if (form.username.trim().length < 3) return
  step.value = 2
}

async function handleRegister() {
  if (form.password !== form.confirm) return
  error.value   = ''
  success.value = ''
  try {
    await auth.register(form.username.trim(), form.email.trim(), form.password)
    success.value = '✅ Konto erstellt! Du wirst weitergeleitet…'
    setTimeout(() => router.push('/login'), 1500)
  } catch (e) {
    error.value = e.message
  }
}

const pwStrength = computed(() => {
  const pw = form.password
  if (!pw) return { pct: 0, label: '', color: 'transparent' }
  let score = 0
  if (pw.length >= 8)          score++
  if (pw.length >= 12)         score++
  if (/[A-Z]/.test(pw))        score++
  if (/[0-9]/.test(pw))        score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { pct: 20,  label: 'Schwach',    color: '#EF4444' }
  if (score <= 2) return { pct: 45,  label: 'Mittel',     color: '#F59E0B' }
  if (score <= 3) return { pct: 70,  label: 'Gut',        color: '#3B82F6' }
  return             { pct: 100, label: 'Sehr stark',  color: '#22C55E' }
})
</script>

<style scoped>
.auth-main {
  min-height: calc(100vh - 64px);
  display: flex; align-items: center; justify-content: center;
  padding: 40px 16px; background: var(--slate-100);
}
.auth-card {
  width: 100%; max-width: 460px;
  background: var(--white); border: 1px solid var(--slate-200);
  border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--shadow-lg);
}
.auth-header { text-align: center; margin-bottom: 28px; }
.auth-logo {
  width: 48px; height: 48px; border-radius: 12px;
  background: var(--blue-600); color: white;
  font-weight: 800; font-size: 1.4rem;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}
.auth-title  { font-size: 1.5rem; font-weight: 800; color: var(--slate-900); margin-bottom: 6px; }
.auth-sub    { font-size: .9rem; color: var(--slate-500); }

/* Steps */
.steps {
  display: flex; align-items: center; justify-content: center;
  gap: 0; margin-bottom: 32px;
}
.step { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.step-num {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; font-weight: 700;
  background: var(--slate-200); color: var(--slate-500);
  transition: all .25s;
}
.step--active .step-num { background: var(--blue-600); color: white; }
.step--done   .step-num { background: #22C55E; color: white; }
.step-label   { font-size: .72rem; color: var(--slate-500); font-weight: 500; }
.step-line    { width: 60px; height: 2px; background: var(--slate-200); margin: 0 8px; margin-bottom: 16px; transition: background .25s; }
.step-line--active { background: var(--blue-400); }

.auth-form { margin-bottom: 24px; }
.form-hint { font-size: .75rem; color: var(--slate-400); margin-top: 4px; display: block; }
.form-hint--error { color: #EF4444; }
.form-input--error { border-color: #FCA5A5 !important; }
.input-pw-wrapper { position: relative; }
.input-pw-wrapper .form-input { width: 100%; padding-right: 44px; }
.pw-toggle {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; font-size: .95rem;
}
.pw-strength { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
.pw-bar { flex: 1; height: 4px; background: var(--slate-200); border-radius: 999px; overflow: hidden; }
.pw-bar-fill { height: 100%; border-radius: 999px; transition: width .35s ease, background .35s; }
.pw-label { font-size: .72rem; font-weight: 600; min-width: 56px; }

.tos-row {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: .875rem; color: var(--slate-600);
  margin-bottom: 20px; cursor: pointer; line-height: 1.4;
}
.tos-check { margin-top: 2px; accent-color: var(--blue-600); flex-shrink: 0; }

.step-btns { display: flex; gap: 10px; justify-content: space-between; }
.auth-submit { width: 100%; justify-content: center; padding: 12px; font-size: .95rem; }

.auth-error {
  background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626;
  border-radius: var(--radius-sm); padding: 10px 14px;
  font-size: .85rem; margin-bottom: 16px;
}
.auth-success {
  background: #F0FDF4; border: 1px solid #86EFAC; color: #15803D;
  border-radius: var(--radius-sm); padding: 10px 14px;
  font-size: .85rem; margin-bottom: 16px;
}

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
