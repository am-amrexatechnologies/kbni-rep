import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/client'

export const useCharactersStore = defineStore('characters', () => {
  const characters  = ref([])
  const myRatings   = ref({})   // { characterId: rating }
  const myTop5      = ref([])   // [{ characterId, position }]
  const loading     = ref(false)

  async function fetchCharacters() {
    loading.value = true
    try {
      const { data } = await api.get('/characters')
      characters.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchMyRatings() {
    try {
      const { data } = await api.get('/characters/my-ratings')
      myRatings.value = data
    } catch { /* nicht eingeloggt */ }
  }

  async function rateCharacter(characterId, rating) {
    await api.post('/characters/rate', { characterId, rating })
    myRatings.value[characterId] = rating
    // Durchschnitt lokal aktualisieren
    const char = characters.value.find(c => c.id === characterId)
    if (char) {
      const prevRating = char._prevRating
      const count = Number(char.rating_count) || 0
      if (prevRating) {
        // Update existing
        char.avg_rating = ((Number(char.avg_rating) * count - prevRating + rating) / count).toFixed(1)
      } else {
        // New rating
        char.avg_rating  = ((Number(char.avg_rating) * count + rating) / (count + 1)).toFixed(1)
        char.rating_count = count + 1
      }
      char._prevRating = rating
    }
  }

  async function fetchMyTop5() {
    try {
      const { data } = await api.get('/characters/top5')
      myTop5.value = data
    } catch { /* nicht eingeloggt */ }
  }

  async function saveTop5(list) { // list = Array von character_ids
    await api.put('/characters/top5', { list })
    await fetchMyTop5()
  }

  const sortedByRating = computed(() =>
    [...characters.value].sort((a, b) => {
      const diff = Number(b.avg_rating || 0) - Number(a.avg_rating || 0)
      return diff !== 0 ? diff : Number(b.rating_count || 0) - Number(a.rating_count || 0)
    })
  )

  const top5Characters = computed(() =>
    myTop5.value
      .sort((a, b) => a.position - b.position)
      .map(entry => ({
        ...entry,
        character: characters.value.find(c => c.id === entry.characterId)
      }))
      .filter(e => e.character)
  )

  function getUserRating(characterId) {
    return myRatings.value[characterId] || 0
  }

  return {
    characters, myRatings, myTop5, loading,
    fetchCharacters, fetchMyRatings, rateCharacter,
    fetchMyTop5, saveTop5,
    sortedByRating, top5Characters, getUserRating
  }
})
