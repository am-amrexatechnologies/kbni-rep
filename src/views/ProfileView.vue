<template>
  <div class="page-wrapper">
    <div class="page-header">
      <h1>Mein Profil</h1>
      <p>Nutzerdaten verwalten und anpassen</p>
    </div>

    <div class="profile-grid">
      <!-- Info -->
      <div class="card profile-info-card">
        <div class="profile-avatar-big">{{ auth.currentUser.username.charAt(0).toUpperCase() }}</div>
        <div class="profile-name">{{ auth.currentUser.username }}</div>
        <div class="profile-email">{{ auth.currentUser.email }}</div>
        <div class="profile-since">Dabei seit {{ formatDate(auth.currentUser.createdAt) }}</div>
        <hr class="divider" />
        <button class="btn btn-danger btn-sm" @click="handleLogout">Abmelden</button>
      </div>

      <!-- Edit -->
      <div class="card profile-edit-card">
        <h3 style="margin-bottom:1.25rem">Profil bearbeiten</h3>

        <Transition name="fade">
          <div v-if="msg.text" :class="['alert', msg.type === 'success' ? 'alert-success' : 'alert-danger']" style="margin-bottom:1rem">
            {{ msg.text }}
          </div>
        </Transition>

        <form @submit.prevent="saveProfile">
          <div class="edit-section">
            <div class="edit-section-title">Allgemeine Daten</div>
            <div class="form-group">
              <label class="form-label">Benutzername</label>
              <input v-model="form.username" class="form-input" type="text" minlength="3" required />
            </div>
            <div class="form-group">
              <label class="form-label">E-Mail</label>
              <input v-model="form.email" class="form-input" type="email" required />
            </div>
          </div>

          <hr class="divider" />

          <div class="edit-section">
            <div class="edit-section-title">Passwort ändern <span class="optional">(optional)</span></div>
            <div class="form-group">
              <label class="form-label">Aktuelles Passwort</label>
              <input v-model="form.currentPassword" class="form-input" type="password" placeholder="Nur ausfüllen wenn Passwort geändert werden soll" />
            </div>
            <div class="form-group">
              <label class="form-label">Neues Passwort</label>
              <input v-model="form.newPassword" class="form-input" type="password" placeholder="Min. 6 Zeichen" />
            </div>
            <div class="form-group">
              <label class="form-label">Neues Passwort bestätigen</label>
              <input v-model="form.confirmPassword" class="form-input" type="password" placeholder="Passwort wiederholen" />
            </div>
          </div>

          <div class="edit-actions">
            <button type="button" class="btn btn-ghost" @click="resetForm">Abbrechen</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Speichern…' : 'Änderungen speichern' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth   = useAuthStore()
const router = useRouter()
const saving = ref(false)
const msg    = ref({ text: '', type: '' })

function initForm() {
  return { username: auth.currentUser.username, email: auth.currentUser.email, currentPassword: '', newPassword: '', confirmPassword: '' }
}
const form = ref(initForm())

function resetForm() { form.value = initForm(); msg.value = { text: '', type: '' } }

async function saveProfile() {
  msg.value = { text: '', type: '' }
  if (form.value.newPassword && form.value.newPassword !== form.value.confirmPassword) {
    msg.value = { text: 'Passwörter stimmen nicht überein.', type: 'error' }; return
  }
  if (form.value.newPassword && !form.value.currentPassword) {
    msg.value = { text: 'Bitte aktuelles Passwort eingeben.', type: 'error' }; return
  }
  saving.value = true
  const updates = { username: form.value.username, email: form.value.email }
  if (form.value.currentPassword && form.value.newPassword) {
    updates.currentPassword = form.value.currentPassword
    updates.newPassword     = form.value.newPassword
  }
  const result = await auth.updateProfile(updates)
  saving.value = false
  if (result.success) {
    msg.value = { text: 'Profil erfolgreich gespeichert.', type: 'success' }
    form.value.currentPassword = ''
    form.value.newPassword     = ''
    form.value.confirmPassword = ''
  } else {
    msg.value = { text: result.message, type: 'error' }
  }
}

function handleLogout() { auth.logout(); router.push('/') }

function formatDate(iso) {
  if (!iso) return '–'
  return new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.profile-grid { display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; align-items: start; }
.profile-info-card { text-align: center; position: sticky; top: calc(var(--nav-height) + 1.5rem); }
.profile-avatar-big {
  width: 72px; height: 72px; border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 1.75rem; font-weight: 700;
  margin: 0 auto 1rem; box-shadow: var(--shadow-md);
}
.profile-name  { font-size: 1.1rem; font-weight: 600; color: var(--color-text); }
.profile-email { font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.2rem; }
.profile-since { font-size: 0.78rem; color: var(--color-text-light); margin-top: 0.4rem; }

.edit-section { margin-bottom: 0.5rem; }
.edit-section-title { font-size: 0.8rem; font-weight: 600; color: var(--color-text-light); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1rem; }
.optional { font-weight: 400; text-transform: none; letter-spacing: 0; font-size: 0.78rem; }
.edit-section .form-group { margin-bottom: 0.85rem; }
.edit-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }

@media (max-width: 768px) { .profile-grid { grid-template-columns: 1fr; } .profile-info-card { position: static; } }
</style>
