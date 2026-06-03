<template>
  <div class="chat-room">
    <div class="chat-header">
      <h3>Live Chat</h3>
      <span class="badge badge-blue">{{ chatStore.messages.length }} Nachrichten</span>
    </div>

    <div class="chat-messages" ref="messagesEl">
      <div v-if="chatStore.loading" class="chat-empty">Nachrichten werden geladen…</div>
      <div v-else-if="chatStore.messages.length === 0" class="chat-empty">
        Noch keine Nachrichten. Sei der Erste!
      </div>
      <TransitionGroup name="msg" tag="div">
        <div
          v-for="msg in chatStore.messages"
          :key="msg.id"
          class="chat-msg"
          :class="{ 'chat-msg--own': auth.isLoggedIn && msg.username === auth.currentUser.username }"
        >
          <div class="chat-msg-avatar">{{ msg.username.charAt(0).toUpperCase() }}</div>
          <div class="chat-msg-body">
            <div class="chat-msg-meta">
              <span class="chat-msg-name">{{ msg.username }}</span>
              <span class="chat-msg-time">{{ formatTime(msg.timeposted) }}</span>
            </div>
            <div class="chat-msg-text">{{ msg.text }}</div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <div v-if="auth.isLoggedIn" class="chat-input-area">
      <input
        v-model="inputText"
        class="form-input chat-input"
        placeholder="Nachricht schreiben…"
        @keydown.enter.prevent="send"
        maxlength="500"
        :disabled="sending"
      />
      <button class="btn btn-primary" @click="send" :disabled="!inputText.trim() || sending">
        Senden
      </button>
    </div>
    <div v-else class="chat-login-hint">
      <RouterLink to="/login">Einloggen</RouterLink> oder
      <RouterLink to="/register">Registrieren</RouterLink>, um zu chatten.
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'
import { useChatStore }  from '../stores/chat'
import { useAuthStore }  from '../stores/auth'

const chatStore  = useChatStore()
const auth       = useAuthStore()
const inputText  = ref('')
const messagesEl = ref(null)
const sending    = ref(false)

onMounted(async () => {
  await chatStore.fetchMessages()
  nextTick(scrollToBottom)
})

async function send() {
  if (!inputText.value.trim() || sending.value) return
  sending.value = true
  try {
    await chatStore.sendMessage(inputText.value)
    inputText.value = ''
    nextTick(scrollToBottom)
  } finally {
    sending.value = false
  }
}

function scrollToBottom() {
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

watch(() => chatStore.messages.length, () => nextTick(scrollToBottom))
</script>

<style scoped>
.chat-room {
  background: white; border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light); box-shadow: var(--shadow-sm);
  display: flex; flex-direction: column; height: 480px; overflow: hidden;
}
.chat-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-border-light); background: var(--color-bg);
}
.chat-header h3 { color: var(--color-text); font-size: 1rem; margin: 0; }

.chat-messages { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
.chat-empty    { text-align: center; color: var(--color-text-light); font-size: 0.88rem; margin: auto 0; }

.chat-msg      { display: flex; gap: 0.6rem; align-items: flex-start; }
.chat-msg--own { flex-direction: row-reverse; }

.chat-msg-avatar {
  width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 0.75rem; font-weight: 700;
}
.chat-msg--own .chat-msg-avatar { background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary)); }

.chat-msg-body { max-width: 75%; }
.chat-msg-meta { display: flex; gap: 0.5rem; align-items: baseline; margin-bottom: 0.25rem; }
.chat-msg--own .chat-msg-meta { flex-direction: row-reverse; }
.chat-msg-name { font-size: 0.78rem; font-weight: 600; color: var(--color-primary); }
.chat-msg-time { font-size: 0.7rem; color: var(--color-text-light); }
.chat-msg-text {
  background: var(--color-bg); border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md); padding: 0.5rem 0.75rem;
  font-size: 0.88rem; color: var(--color-text); word-break: break-word; line-height: 1.5;
}
.chat-msg--own .chat-msg-text { background: var(--color-primary-bg); border-color: var(--color-primary-light); }

.chat-input-area {
  display: flex; gap: 0.5rem; padding: 0.75rem 1rem;
  border-top: 1px solid var(--color-border-light); background: white;
}
.chat-input { flex: 1; }
.chat-login-hint {
  padding: 0.9rem 1rem; border-top: 1px solid var(--color-border-light);
  font-size: 0.85rem; color: var(--color-text-muted); text-align: center; background: var(--color-bg);
}
.msg-enter-active { transition: all 0.25s ease; }
.msg-enter-from   { opacity: 0; transform: translateY(10px); }
</style>
