<template>
  <div>
    <NavBar />
    <main>
      <!-- Hero -->
      <section class="hero">
        <div class="container hero__inner">
          <div class="hero__content fade-in-up">
            <span class="badge">Beta</span>
            <h1 class="hero__title">Willkommen bei <span class="hero__title-accent">KBNI</span></h1>
            <p class="hero__sub">Deine Plattform für Workout-Tracking, Anime-Ratings und Community-Chat – alles an einem Ort.</p>
            <div class="hero__actions">
              <RouterLink to="/register" class="btn btn-primary">Jetzt starten</RouterLink>
              <RouterLink to="/workout" class="btn btn-secondary">Workout ansehen</RouterLink>
            </div>
          </div>
          <div class="hero__visual fade-in-up" style="animation-delay:.15s">
            <div class="hero__badge-float hero__badge-float--1">💪 Push Day</div>
            <div class="hero__badge-float hero__badge-float--2">⭐ Anime Ratings</div>
            <div class="hero__badge-float hero__badge-float--3">💬 Community</div>
            <div class="hero__circle"></div>
          </div>
        </div>
      </section>

      <!-- App Tiles -->
      <section class="tiles-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Anwendungen</h2>
            <p class="section-sub">Wähle eine App und leg los.</p>
          </div>
          <div class="tiles-grid">
            <RouterLink
              v-for="app in apps"
              :key="app.name"
              :to="app.to"
              class="tile fade-in-up"
            >
              <div class="tile__icon" :style="{ background: app.iconBg }">
                <span>{{ app.emoji }}</span>
              </div>
              <div class="tile__body">
                <h3 class="tile__name">{{ app.name }}</h3>
                <p class="tile__desc">{{ app.desc }}</p>
              </div>
              <div class="tile__arrow">→</div>
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Chat -->
      <section class="chat-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Community Chat</h2>
            <p class="section-sub">Tausch dich aus, motiviere andere – stay active.</p>
          </div>
          <ChatRoom />
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__logo">
          <div class="navbar__logo-icon" style="width:28px;height:28px;font-size:.85rem;background:var(--blue-600);color:white;border-radius:7px;display:flex;align-items:center;justify-content:center;font-weight:800">K</div>
          <span style="font-weight:700;color:var(--slate-700)">KBNI</span>
        </div>
        <nav class="footer__links">
          <RouterLink to="/impressum">Impressum</RouterLink>
          <RouterLink to="/datenschutz">Datenschutz</RouterLink>
        </nav>
        <p class="footer__copy">© {{ year }} KBNI. Alle Rechte vorbehalten.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import ChatRoom from '@/components/ChatRoom.vue'

const year = new Date().getFullYear()

const apps = [
  {
    name: 'Workout Plan',
    desc: 'Push, Pull & Legs – mit YouTube-Guide zu jeder Übung.',
    emoji: '🏋️',
    iconBg: 'rgba(255,107,53,.12)',
    to: '/workout'
  },
  {
    name: 'Anime Ratings',
    desc: 'Bewerte deine Lieblingscharaktere und sieh die Top 10.',
    emoji: '⭐',
    iconBg: 'rgba(250,204,21,.15)',
    to: '/anime'
  }
]
</script>

<style scoped>
/* ── Hero ── */
.hero {
  background: linear-gradient(135deg, var(--blue-600) 0%, #1D4ED8 100%);
  padding: 80px 0 100px;
  position: relative;
  overflow: hidden;
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.hero__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero__content { color: white; }

.hero__content .badge {
  background: rgba(255,255,255,.2);
  color: white;
  margin-bottom: 20px;
}

.hero__title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 16px;
  letter-spacing: -.5px;
}

.hero__title-accent {
  background: linear-gradient(135deg, #FDE68A, #FCA5A5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero__sub {
  font-size: 1.1rem;
  opacity: .85;
  line-height: 1.65;
  margin-bottom: 32px;
  max-width: 420px;
}

.hero__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hero__actions .btn-primary {
  background: white;
  color: var(--blue-600);
  font-weight: 700;
}

.hero__actions .btn-primary:hover {
  background: var(--blue-50);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,.25);
}

.hero__actions .btn-secondary {
  background: rgba(255,255,255,.15);
  color: white;
  border-color: rgba(255,255,255,.4);
}

.hero__actions .btn-secondary:hover {
  background: rgba(255,255,255,.25);
}

/* Visual */
.hero__visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 280px;
}

.hero__circle {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.15);
}

.hero__badge-float {
  position: absolute;
  background: white;
  color: var(--slate-800);
  font-size: .85rem;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 99px;
  box-shadow: var(--shadow-lg);
  white-space: nowrap;
}

.hero__badge-float--1 { top: 20px;  left: 0; }
.hero__badge-float--2 { bottom: 60px; right: 0; }
.hero__badge-float--3 { top: 50%; left: 50%; transform: translate(-50%,-50%); }

/* ── Tiles ── */
.tiles-section {
  padding: 80px 0 60px;
}

.section-header {
  margin-bottom: 36px;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--slate-900);
  margin-bottom: 6px;
}

.section-sub {
  color: var(--slate-500);
  font-size: .95rem;
}

.tiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.tile {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: var(--white);
  border: 1px solid var(--slate-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all .25s ease;
  cursor: pointer;
}

.tile:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--blue-200, #BFDBFE);
}

.tile__icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  flex-shrink: 0;
}

.tile__body { flex: 1; }

.tile__name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--slate-900);
  margin-bottom: 4px;
}

.tile__desc {
  font-size: .82rem;
  color: var(--slate-500);
  line-height: 1.45;
}

.tile__arrow {
  font-size: 1.1rem;
  color: var(--slate-400);
  transition: transform .2s, color .2s;
}

.tile:hover .tile__arrow {
  transform: translateX(4px);
  color: var(--blue-600);
}

/* ── Chat Section ── */
.chat-section {
  padding: 0 0 80px;
}

/* ── Footer ── */
.footer {
  border-top: 1px solid var(--slate-200);
  background: var(--white);
  padding: 28px 0;
}

.footer__inner {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer__links {
  display: flex;
  gap: 20px;
  margin-left: auto;
}

.footer__links a {
  font-size: .85rem;
  color: var(--slate-500);
  transition: color .15s;
}

.footer__links a:hover { color: var(--blue-600); }

.footer__copy {
  font-size: .8rem;
  color: var(--slate-400);
  width: 100%;
}

@media (max-width: 900px) {
  .hero__inner { grid-template-columns: 1fr; gap: 40px; }
  .hero__visual { display: none; }
  .hero__title { font-size: 2.2rem; }
}

@media (max-width: 600px) {
  .hero { padding: 60px 0 70px; }
  .hero__title { font-size: 1.8rem; }
  .footer__links { margin-left: 0; }
}
</style>
