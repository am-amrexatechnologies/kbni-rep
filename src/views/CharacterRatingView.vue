<template>
  <div class="page-wrapper">
    <div class="page-header">
      <h1>Charakterbewertung</h1>
      <p>Bewerte Anime-Charaktere auf einer Skala von 1 bis 10</p>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button class="tab-btn" :class="{ active: tab === 'ranking' }" @click="tab = 'ranking'">Gesamt-Ranking</button>
      <button class="tab-btn" :class="{ active: tab === 'alle'    }" @click="switchToAlle">Alle Charaktere</button>
      <button class="tab-btn" :class="{ active: tab === 'top5'    }" @click="switchToTop5">Meine Top 5</button>
    </div>

    <div v-if="store.loading" class="loading-hint">Charaktere werden geladen…</div>

    <Transition name="fade" mode="out-in">

      <!-- ── Ranking ── -->
      <div v-if="tab === 'ranking'" key="ranking" class="tab-content">
        <div class="ranking-list">
          <div v-for="(char, idx) in store.sortedByRating" :key="char.id" class="ranking-item card">
            <div class="rank-badge" :class="getRankClass(idx)">
              {{ idx < 3 ? ['#1','#2','#3'][idx] : '#' + (idx + 1) }}
            </div>
            <div class="char-initial-box" :style="{ background: getAnimeColor(char.animename) }">
              {{ char.name.charAt(0) }}
            </div>
            <div class="char-info">
              <div class="char-name">{{ char.name }} {{ char.lastname }}</div>
              <div class="char-meta">
                <span class="badge badge-blue">{{ char.animename }}</span>
                <span v-if="char.age" class="char-age">{{ char.age }} J.</span>
              </div>
            </div>
            <div class="char-rating-display">
              <div class="rating-big">{{ char.avg_rating > 0 ? char.avg_rating : '–' }}</div>
              <div class="rating-bar-wrap">
                <div class="rating-bar" :style="{ width: ratingPct(char.avg_rating) + '%' }"></div>
              </div>
              <div class="rating-count">{{ char.rating_count }} Bewertung{{ char.rating_count != 1 ? 'en' : '' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Alle Charaktere ── -->
      <div v-else-if="tab === 'alle'" key="alle" class="tab-content">
        <div class="filter-row">
          <input v-model="search" class="form-input search-input" placeholder="Name suchen…" />
          <select v-model="filterAnime" class="form-input" style="max-width:220px">
            <option value="">Alle Anime</option>
            <option v-for="a in store.animeList" :key="a.id" :value="a.animename">{{ a.animename }}</option>
          </select>
        </div>

        <div v-if="!auth.isLoggedIn" class="alert alert-info" style="margin-bottom:1rem">
          <RouterLink to="/login">Einloggen</RouterLink>, um Charaktere zu bewerten.
        </div>

        <div class="chars-grid">
          <div v-for="char in filteredChars" :key="char.id" class="char-card card">
            <div class="char-card-top">
              <div class="char-initial-lg" :style="{ background: getAnimeColor(char.animename) }">
                {{ char.name.charAt(0) }}
              </div>
              <div class="char-card-info">
                <div class="char-card-name">{{ char.name }} {{ char.lastname }}</div>
                <div class="char-card-anime">{{ char.animename }}</div>
                <div v-if="char.age" class="char-card-age">Alter: {{ char.age }}</div>
              </div>
            </div>

            <div class="char-rating-section">
              <div class="rating-avg">
                Durchschnitt:
                <strong>{{ char.avg_rating > 0 ? char.avg_rating : '–' }}</strong> / 10
                <span class="rating-count-sm">({{ char.rating_count }})</span>
              </div>
              <div v-if="auth.isLoggedIn" class="user-rating">
                <span class="rating-label">Deine Wertung:</span>
                <div class="score-row">
                  <button
                    v-for="s in 10" :key="s"
                    class="score-btn"
                    :class="{ active: s <= store.getUserRating(char.id), mine: s === store.getUserRating(char.id) }"
                    @click="rateChar(char.id, s)"
                    :title="s + ' / 10'"
                  >{{ s }}</button>
                </div>
              </div>
              <div v-else class="rating-login-hint">
                <RouterLink to="/login">Einloggen</RouterLink> zum Bewerten
              </div>
            </div>
          </div>
        </div>
        <div v-if="filteredChars.length === 0 && !store.loading" class="empty-state">
          Keine Charaktere gefunden.
        </div>
      </div>

      <!-- ── Meine Top 5 ── -->
      <div v-else-if="tab === 'top5'" key="top5" class="tab-content">
        <div v-if="!auth.isLoggedIn" class="alert alert-info">
          <RouterLink to="/login">Einloggen</RouterLink>, um deine Top 5 zu sehen.
        </div>
        <div v-else>
          <p class="top5-hint">
            Deine Top 5 ergeben sich automatisch aus deinen fünf höchsten Bewertungen.
          </p>
          <div v-if="store.myTop5.length === 0" class="top5-empty">
            Noch keine Bewertungen — bewerte Charaktere im Tab "Alle Charaktere".
          </div>
          <div v-else class="top5-list">
            <div v-for="(char, idx) in store.myTop5" :key="char.id" class="top5-item card">
              <div class="top5-rank">{{ idx + 1 }}</div>
              <div class="top5-initial" :style="{ background: getAnimeColor(char.animename) }">
                {{ char.name.charAt(0) }}
              </div>
              <div class="top5-name-info">
                <div class="top5-char-name">{{ char.name }} {{ char.lastname }}</div>
                <div class="top5-char-uni">{{ char.animename }}<span v-if="char.age"> · {{ char.age }} J.</span></div>
              </div>
              <div class="top5-score">
                <span class="score-badge">{{ char.rating }}<span class="score-max">/10</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCharactersStore } from '../stores/characters'
import { useAuthStore }       from '../stores/auth'

const store = useCharactersStore()
const auth  = useAuthStore()

const tab         = ref('ranking')
const search      = ref('')
const filterAnime = ref('')

onMounted(async () => {
  await Promise.all([store.fetchCharacters(), store.fetchAnime()])
  if (auth.isLoggedIn) {
    await Promise.all([store.fetchMyRatings(), store.fetchMyTop5()])
  }
})

async function switchToAlle() {
  tab.value = 'alle'
  if (auth.isLoggedIn && Object.keys(store.myRatings).length === 0) await store.fetchMyRatings()
}
async function switchToTop5() {
  tab.value = 'top5'
  if (auth.isLoggedIn) await store.fetchMyTop5()
}

const filteredChars = computed(() =>
  store.characters.filter(c => {
    const q = search.value.toLowerCase()
    const nameMatch = !q ||
      c.name.toLowerCase().includes(q) ||
      c.lastname.toLowerCase().includes(q) ||
      c.animename.toLowerCase().includes(q)
    const animeMatch = !filterAnime.value || c.animename === filterAnime.value
    return nameMatch && animeMatch
  })
)

async function rateChar(charId, score) {
  if (!auth.isLoggedIn) return
  await store.rateCharacter(charId, score)
}

function getRankClass(idx) { return ['gold', 'silver', 'bronze'][idx] || '' }
function ratingPct(avg)    { return avg > 0 ? (Number(avg) / 10) * 100 : 0 }

// Anime-Farben (kein Emoji, nur Pastell-Hintergründe)
const ANIME_COLORS = [
  '#d4e8ff', '#fde8d4', '#d4f0e8', '#f0d4f0',
  '#fdf0d4', '#d4fdf0', '#f0e8d4', '#e8d4f0',
  '#d4f0ff', '#f0ffd4',
]
const _colorCache = {}
function getAnimeColor(animename) {
  if (!animename) return '#e8e8f0'
  if (!_colorCache[animename]) {
    const idx = Object.keys(_colorCache).length % ANIME_COLORS.length
    _colorCache[animename] = ANIME_COLORS[idx]
  }
  return _colorCache[animename]
}
</script>

<style scoped>
.tabs {
  display: flex; gap: 0.5rem; margin-bottom: 1.5rem;
  background: white; padding: 0.4rem; border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light); box-shadow: var(--shadow-xs);
  width: fit-content; flex-wrap: wrap;
}
.tab-btn { padding: 0.5rem 1.1rem; border: none; background: transparent; border-radius: var(--radius-md); font-size: 0.88rem; font-weight: 500; color: var(--color-text-muted); cursor: pointer; transition: all var(--transition); }
.tab-btn.active { background: var(--color-primary); color: white; box-shadow: var(--shadow-sm); }
.tab-btn:not(.active):hover { background: var(--color-primary-bg); color: var(--color-primary); }

.loading-hint { color: var(--color-text-muted); font-size: 0.9rem; padding: 2rem 0; }

/* ── Ranking ── */
.ranking-list { display: flex; flex-direction: column; gap: 0.75rem; }
.ranking-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; }
.rank-badge { font-size: 0.85rem; font-weight: 700; min-width: 36px; text-align: center; padding: 0.3rem 0.4rem; border-radius: var(--radius-sm); }
.rank-badge.gold   { background: #fef3c7; color: #92400e; }
.rank-badge.silver { background: #f3f4f6; color: #374151; }
.rank-badge.bronze { background: #fde8d4; color: #7c2d12; }

.char-initial-box, .char-initial-lg {
  border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: #2D3748; flex-shrink: 0;
}
.char-initial-box { width: 44px; height: 44px; font-size: 1.1rem; }
.char-initial-lg  { width: 52px; height: 52px; font-size: 1.25rem; }

.char-info { flex: 1; }
.char-name { font-size: 1rem; font-weight: 600; color: var(--color-text); }
.char-meta { font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.2rem; display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.char-age  { color: var(--color-text-light); }

.char-rating-display { text-align: right; min-width: 90px; }
.rating-big { font-size: 1.6rem; font-weight: 700; color: var(--color-primary); line-height: 1; }
.rating-bar-wrap { background: var(--color-border-light); border-radius: 99px; height: 4px; margin: 0.3rem 0; overflow: hidden; }
.rating-bar { height: 100%; background: var(--color-primary); border-radius: 99px; transition: width 0.4s ease; }
.rating-count { font-size: 0.72rem; color: var(--color-text-light); }

/* ── Alle Charaktere ── */
.filter-row { display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap; }
.search-input { flex: 1; min-width: 180px; }
.chars-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 1rem; }
.char-card { display: flex; flex-direction: column; gap: 0.75rem; }
.char-card-top { display: flex; align-items: flex-start; gap: 0.75rem; }
.char-card-name  { font-size: 1rem; font-weight: 600; color: var(--color-text); margin-bottom: 0.1rem; }
.char-card-anime { font-size: 0.8rem; color: var(--color-primary); font-weight: 500; margin-bottom: 0.15rem; }
.char-card-age   { font-size: 0.75rem; color: var(--color-text-light); }

.char-rating-section { border-top: 1px solid var(--color-border-light); padding-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
.rating-avg { font-size: 0.82rem; color: var(--color-text-muted); }
.rating-count-sm { color: var(--color-text-light); font-size: 0.75rem; margin-left: 0.25rem; }

.user-rating  { display: flex; flex-direction: column; gap: 0.3rem; }
.rating-label { font-size: 0.75rem; color: var(--color-text-muted); }
.score-row    { display: flex; gap: 3px; flex-wrap: wrap; }
.score-btn {
  width: 26px; height: 26px; border: 1px solid var(--color-border);
  background: white; border-radius: var(--radius-sm); cursor: pointer;
  font-size: 0.72rem; font-weight: 600; color: var(--color-text-muted);
  transition: all var(--transition); display: flex; align-items: center; justify-content: center;
}
.score-btn:hover  { background: var(--color-primary-bg); border-color: var(--color-primary); color: var(--color-primary); }
.score-btn.active { background: var(--color-primary-bg); border-color: var(--color-primary-light); color: var(--color-primary); }
.score-btn.mine   { background: var(--color-primary); border-color: var(--color-primary); color: white; }

.rating-login-hint { font-size: 0.8rem; color: var(--color-text-muted); }
.empty-state { text-align: center; padding: 3rem; color: var(--color-text-muted); }

/* ── Top 5 ── */
.top5-hint  { font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1rem; }
.top5-empty { color: var(--color-text-light); text-align: center; padding: 2.5rem; background: var(--color-bg); border-radius: var(--radius-md); font-size: 0.9rem; }
.top5-list  { display: flex; flex-direction: column; gap: 0.6rem; max-width: 640px; }
.top5-item  { display: flex; align-items: center; gap: 0.85rem; padding: 0.85rem 1rem; }
.top5-rank  { width: 28px; height: 28px; background: var(--color-primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; }
.top5-initial { width: 34px; height: 34px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; color: #2D3748; }
.top5-name-info { flex: 1; }
.top5-char-name { font-weight: 600; font-size: 0.9rem; color: var(--color-text); }
.top5-char-uni  { font-size: 0.75rem; color: var(--color-text-muted); }
.score-badge    { font-size: 1.2rem; font-weight: 700; color: var(--color-primary); }
.score-max      { font-size: 0.75rem; color: var(--color-text-light); font-weight: 400; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

@media (max-width: 600px) {
  .ranking-item { flex-wrap: wrap; }
  .char-rating-display { text-align: left; min-width: unset; }
}
</style>
