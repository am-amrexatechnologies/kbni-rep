<template>
  <div class="page-wrapper">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <span class="hero-badge">Willkommen</span>
        <h1 class="hero-title">Deine persönliche <span class="hero-highlight">KBNI</span> Plattform</h1>
        <p class="hero-sub">Trainiere, bewerte und chatte — alles an einem Ort.</p>
        <div class="hero-actions" v-if="!auth.isLoggedIn">
          <RouterLink to="/register" class="btn btn-primary btn-lg">Jetzt starten</RouterLink>
          <RouterLink to="/login"    class="btn btn-outline btn-lg">Einloggen</RouterLink>
        </div>
        <div v-else class="hero-welcome">
          <div class="hero-avatar">{{ auth.currentUser.username.charAt(0).toUpperCase() }}</div>
          Hey, <strong>{{ auth.currentUser.username }}</strong>! Schön, dass du da bist.
        </div>
      </div>
    </section>

    <!-- Apps -->
    <section class="section">
      <div class="section-header">
        <h2>Apps</h2>
        <p>Wähle eine App aus, um loszulegen</p>
      </div>
      <div class="tiles-grid">
        <AppTile
          to="/trainingsplan"
          title="Trainingsplan"
          description="Dein persönlicher Wochenplan für Workouts und Fitness"
        />
        <AppTile
          to="/charakterbewertung"
          title="Charakterbewertung"
          description="Bewerte fiktive Charaktere und erstelle deine persönliche Top 5"
        />
      </div>
    </section>

    <!-- Chat -->
    <section class="section">
      <div class="section-header">
        <h2>Community Chat</h2>
        <p>Tausche dich mit anderen aus</p>
      </div>
      <ChatRoom />
    </section>
  </div>
</template>

<script setup>
import AppTile from '../components/AppTile.vue'
import ChatRoom from '../components/ChatRoom.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--color-primary-bg) 0%, white 100%);
  border: 1px solid var(--color-border-light); border-radius: var(--radius-xl);
  padding: 2.5rem 2rem; margin-bottom: 2.5rem; box-shadow: var(--shadow-sm);
}
.hero-badge {
  display: inline-block; background: var(--color-primary-bg); color: var(--color-primary);
  font-size: 0.8rem; font-weight: 600; padding: 0.3rem 0.8rem; border-radius: 999px;
  border: 1px solid var(--color-primary-light); margin-bottom: 0.75rem;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.hero-title { font-size: 2rem; margin-bottom: 0.75rem; line-height: 1.2; }
.hero-highlight {
  color: var(--color-primary);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hero-sub { font-size: 1rem; margin-bottom: 1.5rem; }
.hero-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.hero-welcome {
  display: flex; align-items: center; gap: 0.75rem;
  font-size: 1rem; color: var(--color-text-muted);
}
.hero-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 0.95rem; font-weight: 700;
}

.section { margin-bottom: 2.5rem; }
.section-header { margin-bottom: 1.25rem; }
.section-header h2 { font-size: 1.25rem; margin-bottom: 0.25rem; }
.section-header p  { font-size: 0.88rem; }

.tiles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 0.85rem; }

@media (max-width: 640px) { .hero-title { font-size: 1.5rem; } }
</style>
