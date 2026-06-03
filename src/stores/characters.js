import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/client'

export const useCharactersStore = defineStore('characters', () => {
  const characters = ref([])   // anime_characters + animename + avg/count
  const animeList  = ref([])   // [{ id, animename }]
  const myRatings  = ref({})   // { characterId: rating }
  const myTop5     = ref([])   // [{ id, name, lastname, animename, rating }]
  const loading    = ref(false)

  async function fetchCharacters() {
    loading.value = true
    try {
      const { data } = await api.get('/characters')
      characters.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchAnime() {
    try {
      const { data } = await api.get('/characters/anime')
      animeList.value = data
    } catch { /* ignore */ }
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

    // Lokale Vorschau aktualisieren
    const char = characters.value.find(c => c.id === characterId)
    if (char) {
      const prev  = char._prevRating
      const count = Number(char.rating_count) || 0
      if (prev) {
        char.avg_rating = ((Number(char.avg_rating) * count - prev + rating) / count).toFixed(1)
      } else {
        char.avg_rating   = ((Number(char.avg_rating) * count + rating) / (count + 1)).toFixed(1)
        char.rating_count = count + 1
      }
      char._prevRating = rating
    }
    // Top5 direkt nach Rating-Änderung nachladen
    await fetchMyTop5()
  }

  async function fetchMyTop5() {
    try {
      const { data } = await api.get('/characters/top5')
      myTop5.value = data
    } catch { /* nicht eingeloggt */ }
  }

  // Sortierung nach Durchschnittsbewertung
  const sortedByRating = computed(() =>
    [...characters.value].sort((a, b) => {
      const diff = Number(b.avg_rating || 0) - Number(a.avg_rating || 0)
      return diff !== 0 ? diff : Number(b.rating_count || 0) - Number(a.rating_count || 0)
    })
  )

  function getUserRating(characterId) {
    return myRatings.value[characterId] || 0
  }

  return {
    characters, animeList, myRatings, myTop5, loading,
    fetchCharacters, fetchAnime, fetchMyRatings, rateCharacter, fetchMyTop5,
    sortedByRating, getUserRating,
  }
})
