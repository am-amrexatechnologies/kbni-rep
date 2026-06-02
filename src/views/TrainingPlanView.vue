<template>
  <div class="tp-page">
    <div class="tp-inner">

      <header class="tp-header">
        <h1>Gym Routine</h1>
      </header>

      <main class="tp-container">

        <!-- Push Day -->
        <div class="workout-card pushDayClass">
          <div class="day-badge">Day 1</div>
          <h2>Push</h2>
          <div class="exercises-list">
            <div
              v-for="ex in pushExercises" :key="ex.name"
              class="exercise"
              @click="openVideo(ex.name)"
            >
              <div class="exercise-name">{{ ex.name }}</div>
              <div class="exercise-detail">{{ ex.detail }}</div>
            </div>
          </div>
        </div>

        <!-- Pull Day -->
        <div class="workout-card pullDayClass">
          <div class="day-badge">Day 2</div>
          <h2>Pull</h2>
          <div class="exercises-list">
            <div
              v-for="ex in pullExercises" :key="ex.name"
              class="exercise"
              @click="openVideo(ex.name)"
            >
              <div class="exercise-name">{{ ex.name }}</div>
              <div class="exercise-detail">{{ ex.detail }}</div>
            </div>
          </div>
        </div>

        <!-- Leg Day -->
        <div class="workout-card legDayClass">
          <div class="day-badge">Day 3</div>
          <h2>Legs</h2>
          <div class="exercises-list">
            <div
              v-for="ex in legExercises" :key="ex.name"
              class="exercise"
              @click="openVideo(ex.name)"
            >
              <div class="exercise-name">{{ ex.name }}</div>
              <div class="exercise-detail">{{ ex.detail }}</div>
            </div>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
const EXERCISE_URLS = {
  'Bench Press':                    'https://www.youtube.com/watch?v=SCVCLChPQFY',
  'Chest Press':                    'https://www.youtube.com/watch?v=n8TOta_pfr4',
  'Shoulder Press':                 'https://www.youtube.com/watch?v=y_NJ7mZYM3I',
  'Lateral Raises':                 'https://www.youtube.com/watch?v=gjXX8g-VPXI',
  'Triceps Pushdown':               'https://www.youtube.com/shorts/Rc7-euA8FDI',
  'Cross Body Triceps Extensions':  'https://www.youtube.com/shorts/HCc3kDzTyTQ',
  'Lat Pulldown':                   'https://www.youtube.com/watch?v=trZQjegcRx0',
  'Rows':                           'https://www.youtube.com/shorts/TXPefiUFMvw',
  'Lat Rows':                       'https://www.youtube.com/watch?v=GZbfZ033f74',
  'Cable Hammer Curls':             'https://www.youtube.com/watch?v=V8AR3SGzboU',
  'Preacher Curls':                 'https://www.youtube.com/shorts/dXGoere0Hxo',
  'Hack-Squats':                    'https://www.youtube.com/shorts/g9i05umL5vc',
  'Leg Extensions':                 'https://www.youtube.com/shorts/uM86QE59Tgc',
  'Leg Curls':                      'https://www.youtube.com/shorts/FMCq0hT3KRU',
  'Calf Raises':                    'https://www.youtube.com/watch?v=pz66Bw6HJ4s',
}

function openVideo(name) {
  const url = EXERCISE_URLS[name]
  if (url) window.open(url, '_blank').focus()
}

const pushExercises = [
  { name: 'Bench Press',                   detail: '4 Sets, 8-10 Reps' },
  { name: 'Chest Press',                   detail: '4 Sets, 8-10 Reps' },
  { name: 'Shoulder Press',                detail: '4 Sets, 8-10 Reps' },
  { name: 'Lateral Raises',                detail: '4 Sets, 8-10 Reps' },
  { name: 'Triceps Pushdown',              detail: '4 Sets, 8-10 Reps' },
  { name: 'Cross Body Triceps Extensions', detail: '4 Sets, 8-10 Reps' },
]

const pullExercises = [
  { name: 'Lat Pulldown',      detail: '4 Sets, 8-10 Reps' },
  { name: 'Rows',              detail: '4 Sets, 8-10 Reps' },
  { name: 'Lat Rows',          detail: '3 Sets, 8-10 Reps' },
  { name: 'Cable Hammer Curls',detail: '4 Sets, 8-10 Reps' },
  { name: 'Preacher Curls',    detail: '4 Sets, 8-10 Reps' },
]

const legExercises = [
  { name: 'Hack-Squats',    detail: '4 Sets, 8-10 Reps' },
  { name: 'Leg Extensions', detail: '6 Sets, 8-10 Reps' },
  { name: 'Leg Curls',      detail: '4 Sets, 8-10 Reps' },
  { name: 'Calf Raises',    detail: '3 Sets, 8-10 Reps' },
]
</script>

<style scoped>
/* Eigener Dark-Background-Bereich, nahtlos unter der Navbar */
.tp-page {
  background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
  min-height: calc(100vh - var(--nav-height));
  padding-top: var(--nav-height);
  flex: 1;
}

.tp-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

/* Header */
.tp-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 2.5rem 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.tp-header h1 {
  font-size: 3em;
  font-weight: 700;
  background: linear-gradient(135deg, #00f0ff, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Grid */
.tp-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.875rem;
}

/* Cards */
.workout-card {
  border-radius: 16px;
  padding: 1.875rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.workout-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.day-badge {
  display: inline-block;
  font-size: 0.75em;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #e0e0e0;
}

.workout-card h2 {
  font-size: 1.8em;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

/* Exercises */
.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.exercise {
  padding: 12px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  border-left: 3px solid;
  transition: all 0.2s ease;
  cursor: pointer;
}

.exercise:hover {
  padding-left: 16px;
}

.exercise-name {
  font-weight: 600;
  font-size: 1em;
  margin-bottom: 6px;
  color: #ffffff;
}

.exercise-detail {
  font-size: 0.85em;
  color: #a0a0b0;
  font-weight: 500;
}

/* Push Day — Orange */
.pushDayClass {
  background: rgba(255, 107, 53, 0.08);
  border-color: rgba(255, 107, 53, 0.3);
}
.pushDayClass .day-badge   { background: rgba(255, 107, 53, 0.2); color: #ff6b35; }
.pushDayClass h2           { color: #ff6b35; }
.pushDayClass .exercise    { border-left-color: #ff6b35; }
.pushDayClass .exercise:hover { background: rgba(255, 107, 53, 0.15); }

/* Pull Day — Blau */
.pullDayClass {
  background: rgba(0, 180, 240, 0.08);
  border-color: rgba(0, 180, 240, 0.3);
}
.pullDayClass .day-badge   { background: rgba(0, 180, 240, 0.2); color: #00b4f0; }
.pullDayClass h2           { color: #00b4f0; }
.pullDayClass .exercise    { border-left-color: #00b4f0; }
.pullDayClass .exercise:hover { background: rgba(0, 180, 240, 0.15); }

/* Leg Day — Lila */
.legDayClass {
  background: rgba(147, 112, 219, 0.08);
  border-color: rgba(147, 112, 219, 0.3);
}
.legDayClass .day-badge   { background: rgba(147, 112, 219, 0.2); color: #9370db; }
.legDayClass h2           { color: #9370db; }
.legDayClass .exercise    { border-left-color: #9370db; }
.legDayClass .exercise:hover { background: rgba(147, 112, 219, 0.15); }

/* Responsive */
@media (max-width: 768px) {
  .tp-header h1       { font-size: 2em; }
  .tp-header          { padding: 1.875rem 0.9375rem; }
  .tp-container       { grid-template-columns: 1fr; gap: 1.25rem; }
  .workout-card       { padding: 1.5625rem; }
}

@media (max-width: 480px) {
  .tp-header h1       { font-size: 1.5em; }
  .workout-card h2    { font-size: 1.3em; }
}
</style>
