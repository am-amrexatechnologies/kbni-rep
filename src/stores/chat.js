import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/client'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const loading  = ref(false)

  async function fetchMessages() {
    loading.value = true
    try {
      const { data } = await api.get('/chat/messages')
      messages.value = data
    } finally {
      loading.value = false
    }
  }

  async function sendMessage(text) {
    if (!text.trim()) return
    try {
      const { data } = await api.post('/chat/messages', { text })
      messages.value.push(data)
    } catch (err) {
      throw err
    }
  }

  return { messages, loading, fetchMessages, sendMessage }
})
