<template>
  <div class="chat">
    <!-- Messages -->
    <div class="chat__messages" ref="messagesEl">
      <!-- Loading -->
      <div class="chat__status" v-if="loading && messages.length === 0">
        <div class="spinner-blue"></div>
        <span>Nachrichten werden geladen…</span>
      </div>

      <!-- Error -->
      <div class="chat__status chat__status--error" v-else-if="loadError">
        <span>⚠️ {{ loadError }}</span>
        <button class="btn btn-ghost btn--xs" @click="loadMessages">Erneut versuchen</button>
      </div>

      <!-- Empty -->
      <div class="chat__empty" v-else-if="messages.length === 0">
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <p>Noch keine Nachrichten. Sei der Erste!</p>
      </div>

      <!-- Messages -->
      <template v-else>
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="chat__msg"
          :class="msg.self ? 'chat__msg--self' : 'chat__msg--other'"
        >
          <div class="chat__msg-avatar" v-if="!msg.self">
            {{ msg.username[0].toUpperCase() }}
          </div>
          <div class="chat__msg-body">
            <div class="chat__msg-meta" v-if="!msg.self">
              <span class="chat__msg-author">{{ msg.username }}</span>
              <span class="chat__msg-time">{{ msg.time }}</span>
            </div>
            <div class="chat__msg-bubble">{{ msg.text }}</div>
            <div class="chat__msg-meta chat__msg-meta--right" v-if="msg.self">
              <span class="chat__msg-time">{{ msg.time }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Login hint -->
    <div class="chat__login-hint" v-if="!auth.state.user">
      <span>💬 <RouterLink to="/login" class="chat__login-link">Einloggen</RouterLink>, um mitzuschreiben.</span>
    </div>

    <!-- Input -->
    <form v-else class="chat__input-row" @submit.prevent="send">
      <input
        v-model="draft"
        class="chat__input"
        placeholder="Nachricht schreiben…"
        maxlength="500"
        autocomplete="off"
        :disabled="sending"
      />
      <button type="submit" class="chat__send-btn" :disabled="!draft.trim() || sending">
        <span v-if="sending" class="spinner-sm"></span>
        <svg v-else width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/composables/useApi'
import { useAuth } from '@/composables/useAuth'

const auth = useAuth()

const rawMessages = ref([])  // raw rows from API
const draft       = ref('')
const loading     = ref(false)
const sending     = ref(false)
const loadError   = ref('')
const messagesEl  = ref(null)
let pollTimer     = null

// Format a raw API row for display
function formatMsg(row) {
  const d = new Date(row.timeposted)
  const time = isNaN(d)
    ? ''
    : `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  return {
    id:       row.id,
    username: row.username,
    text:     row.text ?? '',
    time,
    self: auth.state.user?.username === row.username,
  }
}

const messages = computed(() => rawMessages.value.map(formatMsg))

async function loadMessages() {
  loadError.value = ''
  if (rawMessages.value.length === 0) loading.value = true
  try {
    rawMessages.value = await api.get('/chat')
    await nextTick()
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    }
  } catch (e) {
    loadError.value = e.message
  } finally {
    loading.value = false
  }
}

async function send() {
  const text = draft.value.trim()
  if (!text || !auth.state.user) return

  sending.value = true
  try {
    await api.post('/chat', {
      username:   auth.state.user.username,
      text,
      type:       'text',
      timeposted: new Date().toISOString(),
    })
    draft.value = ''
    await loadMessages()
  } catch (e) {
    console.error('Send failed:', e)
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  loadMessages()
  pollTimer = setInterval(loadMessages, 5000)
})

onUnmounted(() => clearInterval(pollTimer))
</script>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  height: 460px;
  background: var(--white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--slate-200);
  overflow: hidden;
}

.chat__messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chat__status {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--slate-500);
  font-size: .9rem;
}
.chat__status--error { color: #EF4444; }

.chat__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--slate-400);
  font-size: .9rem;
}

/* Messages */
.chat__msg {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 72%;
}
.chat__msg--self  { align-self: flex-end;  flex-direction: row-reverse; }
.chat__msg--other { align-self: flex-start; }

.chat__msg-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--blue-100);
  color: var(--blue-600);
  font-weight: 700; font-size: .8rem;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.chat__msg-body { display: flex; flex-direction: column; gap: 3px; }

.chat__msg-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 4px;
}
.chat__msg-meta--right { justify-content: flex-end; }
.chat__msg-author { font-size: .75rem; font-weight: 600; color: var(--slate-600); }
.chat__msg-time   { font-size: .7rem; color: var(--slate-400); }

.chat__msg-bubble {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: .9rem;
  line-height: 1.45;
  word-break: break-word;
}
.chat__msg--other .chat__msg-bubble {
  background: var(--slate-100);
  color: var(--slate-800);
  border-bottom-left-radius: 4px;
}
.chat__msg--self .chat__msg-bubble {
  background: var(--blue-600);
  color: white;
  border-bottom-right-radius: 4px;
}

/* Login hint */
.chat__login-hint {
  padding: 14px 20px;
  border-top: 1px solid var(--slate-200);
  background: var(--slate-50);
  font-size: .875rem;
  color: var(--slate-500);
  text-align: center;
}
.chat__login-link {
  color: var(--blue-600);
  font-weight: 600;
}
.chat__login-link:hover { text-decoration: underline; }

/* Input */
.chat__input-row {
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid var(--slate-200);
  background: var(--slate-50);
}
.chat__input {
  flex: 1;
  padding: 10px 14px;
  border: 1.5px solid var(--slate-200);
  border-radius: 99px;
  font-size: .9rem; font-family: inherit;
  background: var(--white);
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.chat__input:focus {
  border-color: var(--blue-500);
  box-shadow: 0 0 0 3px rgba(59,130,246,.12);
}

.chat__send-btn {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--blue-600);
  color: white; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background .2s, transform .15s;
}
.chat__send-btn:hover:not(:disabled) { background: #1D4ED8; transform: scale(1.05); }
.chat__send-btn:disabled { background: var(--slate-300); cursor: default; }

/* Spinners */
.spinner-blue {
  width: 28px; height: 28px;
  border: 3px solid var(--blue-100);
  border-top-color: var(--blue-600);
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
.spinner-sm {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin .6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.btn--xs { padding: 5px 10px; font-size: .8rem; }
</style>
