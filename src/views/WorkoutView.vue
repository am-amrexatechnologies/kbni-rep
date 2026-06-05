<template>
  <div class="workout-page">
    <NavBar />

    <!-- Uses the original dark gym CSS, scoped via .workout-page wrapper -->
    <header id="idHeaderDiv">
      <div class="header-content">
        <h1>Gym Routine</h1>
        <p>Push · Pull · Legs</p>
      </div>
    </header>

    <main id="idBodyDiv" class="container">
      <!-- Push Day -->
      <div class="workout-card pushDayClass">
        <div class="day-badge">Day 1</div>
        <h2>Push</h2>
        <div class="exercises-list">
          <div
            v-for="ex in pushExercises"
            :key="ex.name"
            class="exercise"
            @click="openVideo(ex)"
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
            v-for="ex in pullExercises"
            :key="ex.name"
            class="exercise"
            @click="openVideo(ex)"
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
            v-for="ex in legExercises"
            :key="ex.name"
            class="exercise"
            @click="openVideo(ex)"
          >
            <div class="exercise-name">{{ ex.name }}</div>
            <div class="exercise-detail">{{ ex.detail }}</div>
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
  { name: 'Bench Press',                   detail: '4 Sets, 8-10 Reps', url: 'https://www.youtube.com/watch?v=SCVCLChPQFY' },
  { name: 'Chest Press',                   detail: '4 Sets, 8-10 Reps', url: 'https://www.youtube.com/watch?v=n8TOta_pfr4' },
  { name: 'Shoulder Press',                detail: '4 Sets, 8-10 Reps', url: 'https://www.youtube.com/watch?v=y_NJ7mZYM3I' },
  { name: 'Lateral Raises',                detail: '4 Sets, 8-10 Reps', url: 'https://www.youtube.com/watch?v=gjXX8g-VPXI' },
  { name: 'Triceps Pushdown',              detail: '4 Sets, 8-10 Reps', url: 'https://www.youtube.com/shorts/Rc7-euA8FDI' },
  { name: 'Cross Body Triceps Extensions', detail: '4 Sets, 8-10 Reps', url: 'https://www.youtube.com/shorts/HCc3kDzTyTQ' },
]

const pullExercises = [
  { name: 'Lat Pulldown',    detail: '4 Sets, 8-10 Reps', url: 'https://www.youtube.com/watch?v=trZQjegcRx0' },
  { name: 'Rows',            detail: '4 Sets, 8-10 Reps', url: 'https://www.youtube.com/shorts/TXPefiUFMvw' },
  { name: 'Lat Rows',        detail: '3 Sets, 8-10 Reps', url: 'https://www.youtube.com/watch?v=GZbfZ033f74' },
  { name: 'Cable Hammer Curls', detail: '4 Sets, 8-10 Reps', url: 'https://www.youtube.com/watch?v=V8AR3SGzboU' },
  { name: 'Preacher Curls',  detail: '4 Sets, 8-10 Reps', url: 'https://www.youtube.com/shorts/dXGoere0Hxo' },
]

const legExercises = [
  { name: 'Hack-Squats',     detail: '4 Sets, 8-10 Reps', url: 'https://www.youtube.com/shorts/g9i05umL5vc' },
  { name: 'Leg Extensions',  detail: '6 Sets, 8-10 Reps', url: 'https://www.youtube.com/shorts/uM86QE59Tgc' },
  { name: 'Leg Curls',       detail: '4 Sets, 8-10 Reps', url: 'https://www.youtube.com/shorts/FMCq0hT3KRU' },
  { name: 'Calf Raises',     detail: '3 Sets, 8-10 Reps', url: 'https://www.youtube.com/watch?v=pz66Bw6HJ4s' },
]
</script>

<style>
/* Import the original workout CSS globally for this page's classes */
@import '@/assets/workout.css';
</style>

<style scoped>
/* Override body background only inside this page wrapper */
.workout-page {
  background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
  min-height: 100vh;
}

/* Re-apply body styles to the page wrapper instead of body */
.workout-page #idHeaderDiv {
  margin-bottom: 50px;
}

.workout-page #idBodyDiv {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  padding: 0 20px 60px;
}
</style>
