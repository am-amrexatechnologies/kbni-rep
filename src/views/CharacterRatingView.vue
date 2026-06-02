<template>
  <div class="page-wrapper">
    <div class="page-header">
      <h1>Charakterbewertung</h1>
      <p>Bewerte fiktive Charaktere und erstelle deine persönliche Top 5</p>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button class="tab-btn" :class="{ active: tab === 'ranking' }" @click="tab = 'ranking'">Gesamt-Ranking</button>
      <button class="tab-btn" :class="{ active: tab === 'alle'    }" @click="switchToAlle">Alle Charaktere</button>
      <button class="tab-btn" :class="{ active: tab === 'top5'    }" @click="switchToTop5">Meine Top 5</button>
    </div>

    <div v-if="store.loading" class="loading-hint">Charaktere werden geladen…</div>

    <Transition name="fade" mode="out-in">
      <!-- Ranking -->
      <div v-if="tab === 'ranking'" key="ranking" class="tab-content">
        <div class="ranking-list">
          <div v-for="(char, idx) in store.sortedByRating" :key="char.id" class="ranking-item card">
            <div class="rank-badge" :class="getRankClass(idx)">
              {{ idx < 3 ? ['#1','#2','#3'][idx] : '#' + (idx + 1) }}
            </div>
            <div class="char-initial-box" :style="{ background: getCategoryColor(char.category) }">
              {{ char.name.charAt(0) }}
            </div>
            <div class="char-info">
              <div class="char-name">{{ char.name }}</div>
              <div class="char-meta">{{ char.universe }} · <span class="badge badge-blue">{{ char.category }}</span></div>
              <div class="char-desc">{{ char.description }}</div>
            </div>
            <div class="char-rating-display">
              <div class="rating-big">{{ char.avg_rating > 0 ? char.avg_rating : '–' }}</div>
              <div class="rating-stars-row">
                <span v-for="s in 5" :key="s" class="star-display" :class="{ filled: s <= Math.round(char.avg_rating) }">&#9733;</span>
              </div>
              <div class="rating-count">{{ char.rating_count }} Bewertung{{ char.rating_count != 1 ? 'en' : '' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alle -->
      <div v-else-if="tab === 'alle'" key="alle" class="tab-content">
        <div class="filter-row">
          <input v-model="search" class="form-input search-input" placeholder="Charakter suchen…" />
          <select v-model="filterCat" class="form-input" style="max-width:200px">
            <option value="">Alle Kategorien</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <div v-if="!auth.isLoggedIn" class="alert alert-info" style="margin-bottom:1rem">
          <RouterLink to="/login">Einloggen</RouterLink>, um Charaktere zu bewerten.
        </div>

        <div class="chars-grid">
          <div v-for="char in filteredChars" :key="char.id" class="char-card card">
            <div class="char-card-top">
              <div class="char-initial-lg" :style="{ background: getCategoryColor(char.category) }">
                {{ char.name.charAt(0) }}
              </div>
              <div class="char-card-info">
                <div class="char-card-name">{{ char.name }}</div>
                <div class="char-card-universe">{{ char.universe }}</div>
                <span class="badge badge-blue">{{ char.category }}</span>
              </div>
            </div>
            <p class="char-card-desc">{{ char.description }}</p>
            <div class="char-rating-section">
              <div class="rating-avg">
                Durchschnitt: {{ char.avg_rating > 0 ? char.avg_rating : '–' }}
                <span class="star filled">&#9733;</span>
                <span class="rating-count-sm">({{ char.rating_count }})</span>
              </div>
              <div class="user-rating">
                <span class="rating-label">Deine Wertung:</span>
                <div class="stars-row">
                  <button
                    v-for="s in 5" :key="s"
                    class="star-btn"
                    :class="{ active: s <= store.getUserRating(char.id) }"
                    @click="rateChar(char.id, s)"
                    :disabled="!auth.isLoggedIn"
                    :title="auth.isLoggedIn ? s + ' Sterne' : 'Bitte einloggen'"
                  >&#9733;</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="filteredChars.length === 0" class="empty-state">Keine Charaktere gefunden.</div>
      </div>

      <!-- Top 5 -->
      <div v-else-if="tab === 'top5'" key="top5" class="tab-content">
        <div v-if="!auth.isLoggedIn" class="alert alert-info">
          <RouterLink to="/login">Einloggen</RouterLink>, um deine Top 5 zu erstellen.
        </div>
        <div v-else class="top5-layout">
          <!-- Aktuelle Liste -->
          <div class="top5-current">
            <h3 style="margin-bottom:1rem">Meine Top 5</h3>
            <div v-if="store.top5Characters.length === 0" class="top5-empty">
              Noch leer. Füge Charaktere aus der Liste hinzu.
            </div>
            <TransitionGroup name="list" tag="div" class="top5-list">
              <div v-for="(entry, idx) in store.top5Characters" :key="entry.characterId" class="top5-item card">
                <div class="top5-rank">{{ idx + 1 }}</div>
                <div class="top5-initial" :style="{ background: getCategoryColor(entry.character?.category) }">
                  {{ entry.character?.name.charAt(0) }}
                </div>
                <div class="top5-name-info">
                  <div class="top5-char-name">{{ entry.character?.name }}</div>
                  <div class="top5-char-uni">{{ entry.character?.universe }}</div>
                </div>
                <div class="top5-actions">
                  <button class="icon-btn" @click="moveUp(idx)"   :disabled="idx === 0"                           title="Nach oben">&#8593;</button>
                  <button class="icon-btn" @click="moveDown(idx)" :disabled="idx === store.top5Characters.length - 1" title="Nach unten">&#8595;</button>
                  <button class="icon-btn danger" @click="removeFromTop5(idx)" title="Entfernen">&#215;</button>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- Picker -->
          <div class="top5-picker">
            <h3 style="margin-bottom:1rem">Charakter hinzufügen</h3>
            <input v-model="searchTop5" class="form-input" placeholder="Suchen…" style="margin-bottom:0.75rem" />
            <div class="picker-list">
              <div
                v-for="char in availableForTop5" :key="char.id"
                class="picker-item"
                @click="addToTop5(char.id)"
                :class="{ disabled: store.top5Characters.length >= 5 }"
              >
                <div class="picker-initial" :style="{ background: getCategoryColor(char.category) }">{{ char.name.charAt(0) }}</div>
                <div class="picker-info">
                  <div class="picker-name">{{ char.name }}</div>
                  <div class="picker-uni">{{ char.universe }}</div>
                </div>
                <span class="picker-add">+</span>
              </div>
              <div v-if="availableForTop5.length === 0" class="picker-empty">Keine weiteren Charaktere verfügbar.</div>
            </div>
            <div v-if="store.top5Characters.length >= 5" class="alert alert-info" style="margin-top:0.75rem;font-size:0.82rem">
              Top 5 ist voll. Entferne einen Eintrag, um einen anderen hinzuzufügen.
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
const tab        = ref('ranking')
const search     = ref('')
const filterCat  = ref('')
const searchTop5 = ref('')

onMounted(async () => {
  await store.fetchCharacters()
  if (auth.isLoggedIn) {
    await store.fetchMyRatings()
    await store.fetchMyTop5()
  }
})

async function switchToAlle() {
  tab.value = 'alle'
  if (auth.isLoggedIn && Object.keys(store.myRatings).length === 0) await store.fetchMyRatings()
}
async function switchToTop5() {
  tab.value = 'top5'
  if (auth.isLoggedIn && store.myTop5.length === 0) await store.fetchMyTop5()
}

const categories = computed(() => [...new Set(store.characters.map(c => c.category))].sort())
const filteredChars = computed(() =>
  store.characters.filter(c => {
    const q = search.value.toLowerCase()
    return (!q || c.name.toLowerCase().includes(q) || c.universe.toLowerCase().includes(q))
        && (!filterCat.value || c.category === filterCat.value)
  })
)

async function rateChar(charId, score) {
  if (!auth.isLoggedIn) return
  await store.rateCharacter(charId, score)
}

function getRankClass(idx) { return ['gold', 'silver', 'bronze'][idx] || '' }

// Kategorie-Farben ohne Emojis
const CATEGORY_COLORS = {
  'Fantasy':     '#d4e8ff',
  'Serie':       '#fde8d4',
  'Film':        '#d4f0e8',
  'Literatur':   '#f0d4f0',
  'Comic / Film':'#fdf0d4',
  'Film / Buch': '#d4fdf0',
}
function getCategoryColor(cat) { return CATEGORY_COLORS[cat] || '#e8e8f0' }

// Top 5
const currentTop5Ids = computed(() => store.top5Characters.map(e => e.characterId))
const availableForTop5 = computed(() =>
  store.characters.filter(c => {
    const q = searchTop5.value.toLowerCase()
    return !currentTop5Ids.value.includes(c.id)
        && (!q || c.name.toLowerCase().includes(q) || c.universe.toLowerCase().includes(q))
  })
)

async function addToTop5(charId) {
  if (store.top5Characters.length >= 5) return
  const newList = [...currentTop5Ids.value, charId]
  await store.saveTop5(newList)
}
async function removeFromTop5(idx) {
  const newList = [...currentTop5Ids.value]
  newList.splice(idx, 1)
  await store.saveTop5(newList)
}
async function moveUp(idx) {
  if (idx === 0) return
  const list = [...currentTop5Ids.value];
  [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]]
  await store.saveTop5(list)
}
async function moveDown(idx) {
  const list = [...currentTop5Ids.value]
  if (idx === list.length - 1) return
  ;[list[idx], list[idx + 1]] = [list[idx + 1], list[idx]]
  await store.saveTop5(list)
}
</script>

<style scoped>
.tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; background: white; padding: 0.4rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border-light); box-shadow: var(--shadow-xs); width: fit-content; flex-wrap: wrap; }
.tab-btn { padding: 0.5rem 1.1rem; border: none; background: transparent; border-radius: var(--radius-md); font-size: 0.88rem; font-weight: 500; color: var(--color-text-muted); cursor: pointer; transition: all var(--transition); }
.tab-btn.active { background: var(--color-primary); color: white; box-shadow: var(--shadow-sm); }
.tab-btn:not(.active):hover { background: var(--color-primary-bg); color: var(--color-primary); }

.loading-hint { color: var(--color-text-muted); font-size: 0.9rem; padding: 2rem 0; }

/* Ranking */
.ranking-list { display: flex; flex-direction: column; gap: 0.75rem; }
.ranking-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; }
.rank-badge { font-size: 0.9rem; font-weight: 700; min-width: 36px; text-align: center; padding: 0.3rem 0.4rem; border-radius: var(--radius-sm); }
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
.char-meta { font-size: 0.8rem; color: var(--color-text-muted); margin: 0.15rem 0; display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
.char-desc { font-size: 0.82rem; color: var(--color-text-light); }

.char-rating-display { text-align: center; }
.rating-big { font-size: 1.6rem; font-weight: 700; color: var(--color-primary); line-height: 1; }
.rating-stars-row { display: flex; gap: 2px; justify-content: center; margin: 0.2rem 0; }
.star-display { color: #e2e8f0; font-size: 0.85rem; }
.star-display.filled { color: #f6ad55; }
.rating-count { font-size: 0.72rem; color: var(--color-text-light); }

/* All Grid */
.filter-row { display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap; }
.search-input { flex: 1; min-width: 200px; }
.chars-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.char-card { display: flex; flex-direction: column; gap: 0.75rem; }
.char-card-top { display: flex; align-items: flex-start; gap: 0.75rem; }
.char-card-info {}
.char-card-name    { font-size: 1rem; font-weight: 600; color: var(--color-text); margin-bottom: 0.15rem; }
.char-card-universe{ font-size: 0.78rem; color: var(--color-text-muted); margin-bottom: 0.3rem; }
.char-card-desc    { font-size: 0.82rem; color: var(--color-text-muted); flex: 1; }
.char-rating-section { border-top: 1px solid var(--color-border-light); padding-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
.rating-avg { font-size: 0.82rem; color: var(--color-text-muted); display: flex; align-items: center; gap: 0.3rem; }
.star { color: #e2e8f0; }
.star.filled { color: #f6ad55; }
.rating-count-sm { color: var(--color-text-light); font-size: 0.75rem; }
.user-rating { display: flex; align-items: center; gap: 0.5rem; }
.rating-label { font-size: 0.78rem; color: var(--color-text-muted); }
.stars-row { display: flex; gap: 2px; }
.star-btn { font-size: 1.2rem; color: #e2e8f0; background: none; border: none; cursor: pointer; transition: color var(--transition), transform var(--transition); line-height: 1; padding: 0 1px; }
.star-btn:hover:not(:disabled), .star-btn.active { color: #f6ad55; transform: scale(1.15); }
.star-btn:disabled { cursor: not-allowed; opacity: 0.5; }
.empty-state { text-align: center; padding: 3rem; color: var(--color-text-muted); }

/* Top 5 */
.top5-layout { display: grid; grid-template-columns: 1fr 320px; gap: 1.5rem; align-items: start; }
.top5-empty { color: var(--color-text-light); text-align: center; padding: 2rem; background: var(--color-bg); border-radius: var(--radius-md); font-size: 0.9rem; }
.top5-list { display: flex; flex-direction: column; gap: 0.6rem; }
.top5-item { display: flex; align-items: center; gap: 0.85rem; padding: 0.85rem 1rem; }
.top5-rank { width: 28px; height: 28px; background: var(--color-primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; }
.top5-initial { width: 34px; height: 34px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; color: #2D3748; }
.top5-name-info { flex: 1; }
.top5-char-name { font-weight: 600; font-size: 0.9rem; color: var(--color-text); }
.top5-char-uni  { font-size: 0.75rem; color: var(--color-text-muted); }
.top5-actions { display: flex; gap: 0.25rem; }
.icon-btn { width: 26px; height: 26px; border: 1px solid var(--color-border); background: white; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; transition: all var(--transition); }
.icon-btn:hover:not(:disabled) { background: var(--color-primary-bg); border-color: var(--color-primary); color: var(--color-primary); }
.icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.icon-btn.danger:hover:not(:disabled) { background: var(--color-danger-bg); border-color: var(--color-danger); color: var(--color-danger); }

.top5-picker { background: white; border-radius: var(--radius-lg); border: 1px solid var(--color-border-light); padding: 1.25rem; box-shadow: var(--shadow-xs); position: sticky; top: calc(var(--nav-height) + 1.5rem); }
.picker-list { max-height: 380px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.4rem; }
.picker-item { display: flex; align-items: center; gap: 0.65rem; padding: 0.6rem 0.75rem; border-radius: var(--radius-md); cursor: pointer; transition: background var(--transition); border: 1px solid transparent; }
.picker-item:hover:not(.disabled) { background: var(--color-primary-bg); border-color: var(--color-primary-light); }
.picker-item.disabled { opacity: 0.4; cursor: not-allowed; }
.picker-initial { width: 30px; height: 30px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; color: #2D3748; flex-shrink: 0; }
.picker-info { flex: 1; }
.picker-name  { font-size: 0.85rem; font-weight: 500; color: var(--color-text); }
.picker-uni   { font-size: 0.72rem; color: var(--color-text-muted); }
.picker-add   { color: var(--color-primary); font-size: 1.1rem; font-weight: 600; }
.picker-empty { font-size: 0.82rem; color: var(--color-text-light); text-align: center; padding: 1rem; }

.list-enter-active, .list-leave-active { transition: all 0.25s ease; }
.list-enter-from,   .list-leave-to     { opacity: 0; transform: translateX(-15px); }

@media (max-width: 900px) { .top5-layout { grid-template-columns: 1fr; } .top5-picker { position: static; } }
@media (max-width: 600px) { .ranking-item { flex-wrap: wrap; } }
</style>
