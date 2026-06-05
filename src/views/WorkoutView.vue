<template>
  <div>
    <NavBar />
    <main class="page-wrapper">
      <div class="container">

        <!-- Header -->
        <div class="workout-header fade-in-up">
          <div>
            <h1 class="page-title">Gym Routine</h1>
            <p class="page-subtitle">Push · Pull · Legs — klick auf eine Übung für das Tutorial-Video.</p>
          </div>
          <div class="header-badges">
            <span class="stat-badge">
              <span class="stat-badge__dot stat-badge__dot--push"></span>
              {{ pushExercises.length }} Push
            </span>
            <span class="stat-badge">
              <span class="stat-badge__dot stat-badge__dot--pull"></span>
              {{ pullExercises.length }} Pull
            </span>
            <span class="stat-badge">
              <span class="stat-badge__dot stat-badge__dot--legs"></span>
              {{ legExercises.length }} Legs
            </span>
          </div>
        </div>

        <!-- Cards -->
        <div class="workout-grid fade-in-up" style="animation-delay:.1s">

          <!-- Push -->
          <div class="day-card day-card--push">
            <div class="day-card__head">
              <div class="day-card__icon">🔥</div>
              <div>
                <div class="day-card__label">Day 1</div>
                <h2 class="day-card__title">Push</h2>
              </div>
              <span class="day-badge day-badge--push">{{ pushExercises.length }} Übungen</span>
            </div>
            <div class="exercises">
              <button
                v-for="ex in pushExercises"
                :key="ex.name"
                class="exercise exercise--push"
                @click="openVideo(ex)"
              >
                <div class="exercise__left">
                  <div class="exercise__dot exercise__dot--push"></div>
                  <div>
                    <div class="exercise__name">{{ ex.name }}</div>
                    <div class="exercise__detail">{{ ex.detail }}</div>
                  </div>
                </div>
                <div class="exercise__link">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <!-- Pull -->
          <div class="day-card day-card--pull">
            <div class="day-card__head">
              <div class="day-card__icon">💪</div>
              <div>
                <div class="day-card__label">Day 2</div>
                <h2 class="day-card__title">Pull</h2>
              </div>
              <span class="day-badge day-badge--pull">{{ pullExercises.length }} Übungen</span>
            </div>
            <div class="exercises">
              <button
                v-for="ex in pullExercises"
                :key="ex.name"
                class="exercise exercise--pull"
                @click="openVideo(ex)"
              >
                <div class="exercise__left">
                  <div class="exercise__dot exercise__dot--pull"></div>
                  <div>
                    <div class="exercise__name">{{ ex.name }}</div>
                    <div class="exercise__detail">{{ ex.detail }}</div>
                  </div>
                </div>
                <div class="exercise__link">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <!-- Legs -->
          <div class="day-card day-card--legs">
            <div class="day-card__head">
              <div class="day-card__icon">⚡</div>
              <div>
                <div class="day-card__label">Day 3</div>
                <h2 class="day-card__title">Legs</h2>
              </div>
              <span class="day-badge day-badge--legs">{{ legExercises.length }} Übungen</span>
            </div>
            <div class="exercises">
              <button
                v-for="ex in legExercises"
                :key="ex.name"
                class="exercise exercise--legs"
                @click="openVideo(ex)"
              >
                <div class="exercise__left">
                  <div class="exercise__dot exercise__dot--legs"></div>
                  <div>
                    <div class="exercise__name">{{ ex.name }}</div>
                    <div class="exercise__detail">{{ ex.detail }}</div>
                  </div>
                </div>
                <div class="exercise__link">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'

function openVideo({ url }) {
  if (url) window.open(url, '_blank')
}

const pushExercises = [
  { name: 'Bench Press',                   detail: '4 Sets · 8–10 Reps', url: 'https://www.youtube.com/watch?v=SCVCLChPQFY' },
  { name: 'Chest Press',                   detail: '4 Sets · 8–10 Reps', url: 'https://www.youtube.com/watch?v=n8TOta_pfr4' },
  { name: 'Shoulder Press',                detail: '4 Sets · 8–10 Reps', url: 'https://www.youtube.com/watch?v=y_NJ7mZYM3I' },
  { name: 'Lateral Raises',                detail: '4 Sets · 8–10 Reps', url: 'https://www.youtube.com/watch?v=gjXX8g-VPXI' },
  { name: 'Triceps Pushdown',              detail: '4 Sets · 8–10 Reps', url: 'https://www.youtube.com/shorts/Rc7-euA8FDI' },
  { name: 'Cross Body Triceps Extensions', detail: '4 Sets · 8–10 Reps', url: 'https://www.youtube.com/shorts/HCc3kDzTyTQ' },
]

const pullExercises = [
  { name: 'Lat Pulldown',       detail: '4 Sets · 8–10 Reps', url: 'https://www.youtube.com/watch?v=trZQjegcRx0' },
  { name: 'Rows',               detail: '4 Sets · 8–10 Reps', url: 'https://www.youtube.com/shorts/TXPefiUFMvw' },
  { name: 'Lat Rows',           detail: '3 Sets · 8–10 Reps', url: 'https://www.youtube.com/watch?v=GZbfZ033f74' },
  { name: 'Cable Hammer Curls', detail: '4 Sets · 8–10 Reps', url: 'https://www.youtube.com/watch?v=V8AR3SGzboU' },
  { name: 'Preacher Curls',     detail: '4 Sets · 8–10 Reps', url: 'https://www.youtube.com/shorts/dXGoere0Hxo' },
]

const legExercises = [
  { name: 'Hack-Squats',    detail: '4 Sets · 8–10 Reps', url: 'https://www.youtube.com/shorts/g9i05umL5vc' },
  { name: 'Leg Extensions', detail: '6 Sets · 8–10 Reps', url: 'https://www.youtube.com/shorts/uM86QE59Tgc' },
  { name: 'Leg Curls',      detail: '4 Sets · 8–10 Reps', url: 'https://www.youtube.com/shorts/FMCq0hT3KRU' },
  { name: 'Calf Raises',    detail: '3 Sets · 8–10 Reps', url: 'https://www.youtube.com/watch?v=pz66Bw6HJ4s' },
]
</script>

<style scoped>
/* ── Header ── */
.workout-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
}

.header-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 6px;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: var(--white);
  border: 1px solid var(--slate-200);
  border-radius: 99px;
  font-size: .8rem;
  font-weight: 600;
  color: var(--slate-600);
  box-shadow: var(--shadow-sm);
}

.stat-badge__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.stat-badge__dot--push { background: #F97316; }
.stat-badge__dot--pull { background: #3B82F6; }
.stat-badge__dot--legs { background: #8B5CF6; }

/* ── Grid ── */
.workout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
}

/* ── Day Card ── */
.day-card {
  background: var(--white);
  border: 1px solid var(--slate-200);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow .25s, transform .25s;
}

.day-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
}

/* coloured top stripe */
.day-card--push { border-top: 3px solid #F97316; }
.day-card--pull { border-top: 3px solid #3B82F6; }
.day-card--legs { border-top: 3px solid #8B5CF6; }

.day-card__head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 24px 18px;
  border-bottom: 1px solid var(--slate-100);
}

.day-card__icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.day-card--push .day-card__icon { background: #FFF7ED; }
.day-card--pull .day-card__icon { background: #EFF6FF; }
.day-card--legs .day-card__icon { background: #F5F3FF; }

.day-card__label {
  font-size: .72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .6px;
  color: var(--slate-400);
  margin-bottom: 2px;
}

.day-card__title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--slate-900);
}

.day-badge {
  margin-left: auto;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: .72rem;
  font-weight: 600;
  flex-shrink: 0;
}

.day-badge--push { background: #FFF7ED; color: #C2410C; }
.day-badge--pull { background: #EFF6FF; color: #1D4ED8; }
.day-badge--legs { background: #F5F3FF; color: #6D28D9; }

/* ── Exercises ── */
.exercises {
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 4px;
}

.exercise {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background .15s, padding-left .15s;
  gap: 12px;
}

.exercise__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.exercise__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.exercise__dot--push { background: #F97316; }
.exercise__dot--pull { background: #3B82F6; }
.exercise__dot--legs { background: #8B5CF6; }

.exercise__name {
  font-size: .92rem;
  font-weight: 600;
  color: var(--slate-800);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.exercise__detail {
  font-size: .78rem;
  color: var(--slate-400);
  margin-top: 1px;
  font-weight: 500;
}

.exercise__link {
  color: var(--slate-300);
  flex-shrink: 0;
  transition: color .15s, transform .15s;
  display: flex;
  align-items: center;
}

/* Hover states per day */
.exercise--push:hover {
  background: #FFF7ED;
  padding-left: 18px;
}
.exercise--push:hover .exercise__link { color: #F97316; transform: scale(1.15); }
.exercise--push:hover .exercise__name { color: #C2410C; }

.exercise--pull:hover {
  background: #EFF6FF;
  padding-left: 18px;
}
.exercise--pull:hover .exercise__link { color: #3B82F6; transform: scale(1.15); }
.exercise--pull:hover .exercise__name { color: #1D4ED8; }

.exercise--legs:hover {
  background: #F5F3FF;
  padding-left: 18px;
}
.exercise--legs:hover .exercise__link { color: #8B5CF6; transform: scale(1.15); }
.exercise--legs:hover .exercise__name { color: #6D28D9; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .workout-grid {
    grid-template-columns: 1fr;
  }
  .workout-header {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
