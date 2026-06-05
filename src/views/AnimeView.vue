<template>
  <div>
    <NavBar />
    <main class="page-wrapper">
      <div class="container">
        <div class="anime-header fade-in-up">
          <h1 class="page-title">Anime Rankings</h1>
          <p class="page-subtitle">Bewerte Charaktere · Community Top 10 · Deine persönliche Top 5</p>
        </div>

        <!-- Loading state -->
        <div class="anime-loading" v-if="pageLoading">
          <div class="spinner-ring"></div>
          <span>Daten werden geladen…</span>
        </div>

        <!-- Error state -->
        <div class="anime-error" v-else-if="pageError">
          <span>⚠️ {{ pageError }}</span>
          <button class="btn btn-primary" @click="loadAll">Erneut laden</button>
        </div>

        <div class="anime-layout" v-else>
          <!-- ── Characters ── -->
          <section class="char-section fade-in-up">
            <div class="char-section-header">
              <h2 class="sec-title">Charaktere bewerten</h2>
              <span class="char-count">{{ characters.length }} Charaktere</span>
            </div>

            <!-- Not logged in hint -->
            <div class="auth-hint" v-if="!auth.state.user">
              💙 <RouterLink to="/login" class="auth-hint-link">Einloggen</RouterLink> um Charaktere zu bewerten.
            </div>

            <div class="char-grid">
              <div
                v-for="char in characters"
                :key="char.id"
                class="char-card"
                :class="{ 'char-card--rated': myRatingFor(char.id) > 0 }"
              >
                <div class="char-card__avatar" :style="{ background: charColor(char.id) }">
                  {{ charEmoji(char.animeid) }}
                </div>
                <div class="char-card__body">
                  <div class="char-card__name">{{ fullName(char) }}</div>
                  <div class="char-card__series">{{ animeName(char.animeid) }}</div>
                  <div class="char-card__meta" v-if="char.age">Alter: {{ char.age }}</div>
                  <div class="char-card__stars">
                    <button
                      v-for="star in 5"
                      :key="star"
                      class="star-btn"
                      :class="{ 'star-btn--active': star <= (hoveredRating[char.id] ?? myRatingFor(char.id)) }"
                      :disabled="!auth.state.user"
                      @mouseenter="auth.state.user && (hoveredRating[char.id] = star)"
                      @mouseleave="delete hoveredRating[char.id]"
                      @click="rate(char.id, star)"
                    >★</button>
                    <span class="char-card__avg" v-if="avgFor(char.id) !== null">
                      {{ avgFor(char.id).toFixed(1) }}
                      <span class="char-card__cnt">({{ countFor(char.id) }})</span>
                    </span>
                    <span class="char-card__no-ratings" v-else>Noch keine Bewertung</span>
                  </div>
                </div>
                <span class="char-card__badge" v-if="myRatingFor(char.id) > 0">✓</span>
              </div>
            </div>
          </section>

          <!-- ── Rankings ── -->
          <aside class="rankings-col fade-in-up" style="animation-delay:.1s">
            <!-- Top 10 -->
            <div class="rank-card">
              <h2 class="sec-title">🏆 Community Top 10</h2>
              <ol class="rank-list">
                <li v-for="(item, idx) in top10" :key="item.character_id" class="rank-item">
                  <span class="rank-num" :class="`rank-num--${idx+1}`">{{ idx+1 }}</span>
                  <span class="rank-emoji">{{ charEmoji(charById(item.character_id)?.animeid) }}</span>
                  <div class="rank-info">
                    <span class="rank-name">{{ fullName(charById(item.character_id)) }}</span>
                    <span class="rank-series">{{ animeName(charById(item.character_id)?.animeid) }}</span>
                  </div>
                  <span class="rank-score">{{ item.avg.toFixed(1) }} ★</span>
                </li>
                <li v-if="top10.length === 0" class="rank-empty">Noch keine Bewertungen</li>
              </ol>
            </div>

            <!-- Personal Top 5 -->
            <div class="rank-card rank-card--personal" style="margin-top:20px">
              <h2 class="sec-title">💙 Deine Top 5</h2>
              <template v-if="auth.state.user">
                <ol class="rank-list">
                  <li v-for="(item, idx) in myTop5" :key="item.character_id" class="rank-item">
                    <span class="rank-num rank-num--personal">{{ idx+1 }}</span>
                    <span class="rank-emoji">{{ charEmoji(charById(item.character_id)?.animeid) }}</span>
                    <div class="rank-info">
                      <span class="rank-name">{{ fullName(charById(item.character_id)) }}</span>
                      <span class="rank-series">{{ animeName(charById(item.character_id)?.animeid) }}</span>
                    </div>
                    <span class="rank-score rank-score--personal">{{ item.rating }} ★</span>
                  </li>
                  <li v-if="myTop5.length === 0" class="rank-empty">Noch keine eigenen Bewertungen</li>
                </ol>
              </template>
              <p v-else class="rank-empty">
                <RouterLink to="/login" class="auth-hint-link">Einloggen</RouterLink> für deine Top 5.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { api } from '@/composables/useApi'
import { useAuth } from '@/composables/useAuth'

const auth = useAuth()

// ── State ──
const characters  = ref([])   // { id, name, lastname, age, animeid }
const animes      = ref([])   // { id, animename }
const ratings     = ref([])   // { user_id, character_id, rating }

const pageLoading = ref(true)
const pageError   = ref('')
const hoveredRating = reactive({})

// ── Load ──
async function loadAll() {
  pageLoading.value = true
  pageError.value   = ''
  try {
    const [chars, animeList, ratingList] = await Promise.all([
      api.get('/characters'),
      api.get('/anime'),
      api.get('/ratings'),
    ])
    characters.value = chars
    animes.value     = animeList
    ratings.value    = ratingList
  } catch (e) {
    pageError.value = e.message
  } finally {
    pageLoading.value = false
  }
}

onMounted(loadAll)

// ── Helpers ──
function fullName(char) {
  if (!char) return '–'
  return [char.name, char.lastname].filter(Boolean).join(' ') || '–'
}

function charById(id) {
  return characters.value.find(c => c.id === id)
}

function animeName(animeid) {
  return animes.value.find(a => a.id === animeid)?.animename ?? '–'
}

// Deterministic color palette from char id
const COLOR_PALETTE = [
  '#FEF3C7','#FEE2E2','#DBEAFE','#F3E8FF','#FCE7F3',
  '#D1FAE5','#FFF7ED','#EDE9FE','#ECFDF5','#F0FDF4',
]
function charColor(id) {
  return COLOR_PALETTE[id % COLOR_PALETTE.length]
}

// Emoji per anime id (deterministic fallback)
const EMOJI_BY_ANIME = {}
const DEFAULT_EMOJIS = ['⚡','🔥','💙','⚔️','🌿','👑','🎩','🔴','💫','🗡️','👊','📓','🌊','✨','🎯']
function charEmoji(animeid) {
  if (!animeid) return '⭐'
  if (!EMOJI_BY_ANIME[animeid]) {
    EMOJI_BY_ANIME[animeid] = DEFAULT_EMOJIS[animeid % DEFAULT_EMOJIS.length]
  }
  return EMOJI_BY_ANIME[animeid]
}

// ── Ratings helpers ──
function ratingsForChar(characterId) {
  return ratings.value.filter(r => r.character_id === characterId)
}

function avgFor(characterId) {
  const list = ratingsForChar(characterId)
  if (!list.length) return null
  return list.reduce((s, r) => s + Number(r.rating), 0) / list.length
}

function countFor(characterId) {
  return ratingsForChar(characterId).length
}

function myRatingFor(characterId) {
  if (!auth.state.user) return 0
  const r = ratings.value.find(r => r.character_id === characterId && r.user_id === auth.state.user.id)
  return r ? Number(r.rating) : 0
}

// ── Rate ──
async function rate(characterId, stars) {
  if (!auth.state.user) return
  const userId = auth.state.user.id

  // Optimistic update
  const idx = ratings.value.findIndex(r => r.character_id === characterId && r.user_id === userId)
  if (idx >= 0) {
    ratings.value[idx] = { ...ratings.value[idx], rating: stars }
  } else {
    ratings.value.push({ user_id: userId, character_id: characterId, rating: stars })
  }

  try {
    await api.post('/ratings', { user_id: userId, character_id: characterId, rating: stars })
  } catch (e) {
    console.error('Rating failed:', e)
    // revert on error
    await loadAll()
  }
}

// ── Computed rankings ──
const top10 = computed(() => {
  const map = {}
  for (const r of ratings.value) {
    const cid = r.character_id
    if (!map[cid]) map[cid] = { total: 0, count: 0 }
    map[cid].total += Number(r.rating)
    map[cid].count += 1
  }
  return Object.entries(map)
    .map(([cid, { total, count }]) => ({ character_id: Number(cid), avg: total / count, count }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 10)
})

const myTop5 = computed(() => {
  if (!auth.state.user) return []
  return ratings.value
    .filter(r => r.user_id === auth.state.user.id)
    .map(r => ({ character_id: r.character_id, rating: Number(r.rating) }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)
})
</script>

<style scoped>
.anime-header { margin-bottom: 48px; }

/* Loading / Error */
.anime-loading, .anime-error {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 14px; padding: 80px 0;
  font-size: .95rem; color: var(--slate-500);
}
.anime-error { color: #EF4444; }
.spinner-ring {
  width: 40px; height: 40px;
  border: 3px solid var(--blue-100);
  border-top-color: var(--blue-600);
  border-radius: 50%;
  animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.anime-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
  align-items: start;
}

.char-section-header {
  display: flex; align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.sec-title {
  font-size: 1.1rem; font-weight: 700;
  color: var(--slate-800); margin-bottom: 0;
}
.char-count {
  font-size: .8rem; color: var(--slate-400);
  background: var(--slate-100);
  padding: 3px 10px; border-radius: 99px;
}

/* Auth hint */
.auth-hint {
  font-size: .875rem; color: var(--slate-500);
  background: var(--blue-50);
  border: 1px solid var(--blue-100);
  border-radius: var(--radius-sm);
  padding: 10px 14px; margin-bottom: 20px;
}
.auth-hint-link {
  color: var(--blue-600); font-weight: 600;
}
.auth-hint-link:hover { text-decoration: underline; }

/* Character Grid */
.char-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

.char-card {
  display: flex; align-items: flex-start;
  gap: 14px; padding: 16px;
  background: var(--white);
  border: 1.5px solid var(--slate-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  position: relative;
  transition: box-shadow .2s, border-color .2s;
}
.char-card:hover { box-shadow: var(--shadow-md); border-color: var(--blue-400); }
.char-card--rated { border-color: #86EFAC; }

.char-card__avatar {
  width: 48px; height: 48px; flex-shrink: 0;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
}
.char-card__body { flex: 1; min-width: 0; }
.char-card__name {
  font-weight: 700; font-size: .95rem; color: var(--slate-900);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.char-card__series { font-size: .75rem; color: var(--slate-500); margin-bottom: 2px; }
.char-card__meta   { font-size: .72rem; color: var(--slate-400); margin-bottom: 4px; }

.char-card__stars {
  display: flex; align-items: center; gap: 2px; margin-top: 4px;
}
.star-btn {
  background: none; border: none; cursor: pointer;
  font-size: 1.1rem; color: var(--slate-300);
  padding: 1px; transition: color .1s, transform .1s; line-height: 1;
}
.star-btn--active { color: #F59E0B; }
.star-btn:hover:not(:disabled) { transform: scale(1.2); }
.star-btn:disabled { cursor: default; }

.char-card__avg {
  font-size: .72rem; font-weight: 600; color: #F59E0B; margin-left: 4px;
}
.char-card__cnt { font-weight: 400; color: var(--slate-400); }
.char-card__no-ratings { font-size: .7rem; color: var(--slate-300); margin-left: 4px; }

.char-card__badge {
  position: absolute; top: 8px; right: 10px;
  font-size: .7rem; color: #22C55E; font-weight: 700;
}

/* Rankings */
.rank-card {
  background: var(--white); border: 1px solid var(--slate-200);
  border-radius: var(--radius-lg); padding: 24px;
  box-shadow: var(--shadow-sm);
  position: sticky; top: 84px;
}
.rank-card--personal { position: static; }

.rank-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }

.rank-item { display: flex; align-items: center; gap: 10px; }

.rank-num {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--slate-100); color: var(--slate-600);
  font-size: .75rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.rank-num--1 { background: #FDE68A; color: #92400E; }
.rank-num--2 { background: #E2E8F0; color: #475569; }
.rank-num--3 { background: #FED7AA; color: #7C2D12; }
.rank-num--personal { background: var(--blue-100); color: var(--blue-600); }

.rank-emoji { font-size: 1rem; }

.rank-info { flex: 1; min-width: 0; }
.rank-name   { display: block; font-size: .85rem; font-weight: 600; color: var(--slate-800); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rank-series { display: block; font-size: .72rem; color: var(--slate-400); }

.rank-score          { font-size: .8rem; font-weight: 700; color: #F59E0B; flex-shrink: 0; }
.rank-score--personal { color: var(--blue-500); }

.rank-empty {
  font-size: .85rem; color: var(--slate-400);
  text-align: center; padding: 20px 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .anime-layout { grid-template-columns: 1fr; }
  .rank-card { position: static; }
}
@media (max-width: 600px) {
  .char-grid { grid-template-columns: 1fr; }
}
</style>
