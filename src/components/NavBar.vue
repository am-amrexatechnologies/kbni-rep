<template>
  <header class="navbar" :class="{ 'navbar--scrolled': scrolled }">
    <div class="container navbar__inner">
      <!-- Logo -->
      <RouterLink to="/" class="navbar__logo">
        <div class="navbar__logo-icon">K</div>
        <span class="navbar__logo-text">KBNI</span>
      </RouterLink>

      <!-- Desktop Nav -->
      <nav class="navbar__links" :class="{ 'navbar__links--open': menuOpen }">
        <RouterLink to="/" class="navbar__link" @click="menuOpen = false">Home</RouterLink>
        <RouterLink to="/workout" class="navbar__link" @click="menuOpen = false">Workout</RouterLink>
        <RouterLink to="/anime" class="navbar__link" @click="menuOpen = false">Anime</RouterLink>
      </nav>

      <!-- Auth area -->
      <div class="navbar__auth">
        <!-- Logged in -->
        <template v-if="auth.state.user">
          <div class="navbar__user">
            <div class="navbar__avatar">{{ auth.state.user.username[0].toUpperCase() }}</div>
            <span class="navbar__username">{{ auth.state.user.username }}</span>
          </div>
          <button class="btn btn-ghost btn--sm" @click="handleLogout">Logout</button>
        </template>
        <!-- Logged out -->
        <template v-else>
          <RouterLink to="/login" class="btn btn-ghost btn--sm">Login</RouterLink>
          <RouterLink to="/register" class="btn btn-primary btn--sm">Registrieren</RouterLink>
        </template>
      </div>

      <!-- Burger -->
      <button class="navbar__burger" @click="menuOpen = !menuOpen" :aria-expanded="menuOpen">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Mobile dropdown -->
    <div class="navbar__mobile" v-if="menuOpen">
      <RouterLink to="/" class="navbar__mobile-link" @click="menuOpen = false">Home</RouterLink>
      <RouterLink to="/workout" class="navbar__mobile-link" @click="menuOpen = false">Workout</RouterLink>
      <RouterLink to="/anime" class="navbar__mobile-link" @click="menuOpen = false">Anime</RouterLink>
      <hr class="navbar__mobile-divider" />
      <template v-if="auth.state.user">
        <div class="navbar__mobile-user">
          <div class="navbar__avatar">{{ auth.state.user.username[0].toUpperCase() }}</div>
          {{ auth.state.user.username }}
        </div>
        <button class="navbar__mobile-link navbar__mobile-logout" @click="handleLogout">Logout</button>
      </template>
      <template v-else>
        <RouterLink to="/login" class="navbar__mobile-link" @click="menuOpen = false">Login</RouterLink>
        <RouterLink to="/register" class="navbar__mobile-link navbar__mobile-link--cta" @click="menuOpen = false">Registrieren</RouterLink>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const auth = useAuth()
const router = useRouter()
const menuOpen = ref(false)
const scrolled = ref(false)

function onScroll() { scrolled.value = window.scrollY > 16 }

async function handleLogout() {
  menuOpen.value = false
  await auth.logout()
  router.push('/')
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(248, 250, 252, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--slate-200);
  transition: box-shadow .25s;
}
.navbar--scrolled { box-shadow: var(--shadow-md); }

.navbar__inner {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.navbar__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.navbar__logo-icon {
  width: 34px; height: 34px;
  border-radius: 8px;
  background: var(--blue-600);
  color: white;
  font-weight: 800; font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
}
.navbar__logo-text {
  font-weight: 800; font-size: 1.15rem;
  color: var(--slate-900); letter-spacing: -.3px;
}

.navbar__links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}
.navbar__link {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: .9rem; font-weight: 500;
  color: var(--slate-600);
  transition: color .2s, background .2s;
}
.navbar__link:hover, .navbar__link.router-link-active {
  color: var(--blue-600);
  background: var(--blue-50);
}

.navbar__auth {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.navbar__user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  background: var(--blue-50);
  border-radius: 99px;
  border: 1px solid var(--blue-100);
}
.navbar__avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--blue-600);
  color: white;
  font-size: .78rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.navbar__username {
  font-size: .85rem; font-weight: 600;
  color: var(--blue-700, #1D4ED8);
}

.btn--sm { padding: 7px 16px; font-size: .85rem; }

/* Burger */
.navbar__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none; border: none; cursor: pointer;
  padding: 6px; border-radius: var(--radius-sm);
  margin-left: auto;
}
.navbar__burger span {
  display: block; width: 22px; height: 2px;
  background: var(--slate-700); border-radius: 999px; transition: .2s;
}

/* Mobile */
.navbar__mobile {
  display: flex;
  flex-direction: column;
  padding: 8px 16px 16px;
  border-top: 1px solid var(--slate-200);
  gap: 2px;
  background: var(--white);
}
.navbar__mobile-link {
  padding: 11px 14px;
  border-radius: var(--radius-sm);
  font-size: .95rem; font-weight: 500;
  color: var(--slate-700);
  transition: background .15s, color .15s;
  border: none; background: none; cursor: pointer; font-family: inherit; text-align: left;
}
.navbar__mobile-link:hover, .navbar__mobile-link.router-link-active {
  background: var(--blue-50); color: var(--blue-600);
}
.navbar__mobile-link--cta {
  background: var(--blue-600); color: white !important;
  text-align: center; margin-top: 4px; font-weight: 600;
}
.navbar__mobile-logout {
  color: #EF4444 !important;
}
.navbar__mobile-logout:hover { background: #FEF2F2 !important; }
.navbar__mobile-user {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  font-weight: 600; font-size: .9rem; color: var(--slate-700);
}
.navbar__mobile-divider { border: none; border-top: 1px solid var(--slate-200); margin: 4px 0; }

@media (max-width: 768px) {
  .navbar__links, .navbar__auth { display: none; }
  .navbar__burger { display: flex; }
}
</style>
