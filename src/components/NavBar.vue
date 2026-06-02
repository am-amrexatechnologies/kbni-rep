<template>
  <nav class="navbar">
    <div class="nav-inner">
      <RouterLink to="/" class="nav-brand">
        <div class="nav-logo">K</div>
        <span class="nav-title">KBNI</span>
      </RouterLink>

      <div class="nav-links">
        <RouterLink to="/"                   class="nav-link" active-class="nav-link--active" exact>Home</RouterLink>
        <RouterLink to="/trainingsplan"       class="nav-link" active-class="nav-link--active">Trainingsplan</RouterLink>
        <RouterLink to="/charakterbewertung"  class="nav-link" active-class="nav-link--active">Charaktere</RouterLink>
      </div>

      <div class="nav-actions">
        <template v-if="auth.isLoggedIn">
          <RouterLink to="/profil" class="nav-user" title="Profil bearbeiten">
            <div class="nav-avatar">{{ auth.currentUser.username.charAt(0).toUpperCase() }}</div>
            <span class="nav-username">{{ auth.currentUser.username }}</span>
          </RouterLink>
          <button class="btn btn-ghost btn-sm" @click="handleLogout">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/login"    class="btn btn-ghost btn-sm">Login</RouterLink>
          <RouterLink to="/register" class="btn btn-primary btn-sm">Registrieren</RouterLink>
        </template>
      </div>

      <button class="nav-burger" @click="mobileOpen = !mobileOpen" :aria-expanded="mobileOpen">
        <span></span><span></span><span></span>
      </button>
    </div>

    <Transition name="slide-down">
      <div v-if="mobileOpen" class="nav-mobile" @click="mobileOpen = false">
        <RouterLink to="/"                  class="nav-mobile-link">Home</RouterLink>
        <RouterLink to="/trainingsplan"     class="nav-mobile-link">Trainingsplan</RouterLink>
        <RouterLink to="/charakterbewertung" class="nav-mobile-link">Charaktere</RouterLink>
        <hr class="divider" style="margin:0.5rem 0" />
        <template v-if="auth.isLoggedIn">
          <RouterLink to="/profil" class="nav-mobile-link">Profil</RouterLink>
          <button class="nav-mobile-link nav-mobile-btn" @click.stop="handleLogout">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/login"    class="nav-mobile-link">Login</RouterLink>
          <RouterLink to="/register" class="nav-mobile-link" style="color:var(--color-primary);font-weight:600">Registrieren</RouterLink>
        </template>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const mobileOpen = ref(false)

function handleLogout() {
  auth.logout()
  mobileOpen.value = false
  router.push('/')
}
</script>

<style scoped>
.navbar {
  position: fixed; top: 0; left: 0; right: 0;
  height: var(--nav-height);
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-xs);
  z-index: 1000;
}
.nav-inner {
  max-width: 1200px; margin: 0 auto; height: 100%;
  padding: 0 1.5rem;
  display: flex; align-items: center; gap: 1.5rem;
}
.nav-brand { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; flex-shrink: 0; }
.nav-logo  {
  width: 34px; height: 34px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 1rem; box-shadow: var(--shadow-sm);
}
.nav-title { font-size: 1.1rem; font-weight: 700; color: var(--color-text); letter-spacing: 0.08em; }

.nav-links { display: flex; align-items: center; gap: 0.25rem; flex: 1; }
.nav-link  {
  padding: 0.4rem 0.85rem; border-radius: var(--radius-md);
  font-size: 0.88rem; font-weight: 500; color: var(--color-text-muted); text-decoration: none;
  transition: all var(--transition);
}
.nav-link:hover, .nav-link--active { background: var(--color-primary-bg); color: var(--color-primary); }
.nav-link--active { font-weight: 600; }

.nav-actions { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; }
.nav-user   {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.3rem 0.7rem 0.3rem 0.3rem;
  border-radius: var(--radius-lg); text-decoration: none;
  border: 1px solid var(--color-border); transition: all var(--transition);
}
.nav-user:hover { background: var(--color-primary-bg); border-color: var(--color-primary); }
.nav-avatar   {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 0.8rem; font-weight: 700;
}
.nav-username { font-size: 0.85rem; font-weight: 500; color: var(--color-text); }

.nav-burger {
  display: none; flex-direction: column; justify-content: center; gap: 5px;
  width: 36px; height: 36px; background: none; border: none; cursor: pointer; margin-left: auto; padding: 6px;
}
.nav-burger span { display: block; height: 2px; background: var(--color-text); border-radius: 2px; transition: all var(--transition); }

.nav-mobile {
  background: white; border-top: 1px solid var(--color-border-light);
  padding: 0.75rem 1.5rem 1rem;
  display: flex; flex-direction: column; gap: 0.25rem;
  box-shadow: var(--shadow-md);
}
.nav-mobile-link {
  display: block; padding: 0.65rem 0.85rem; border-radius: var(--radius-md);
  font-size: 0.9rem; font-weight: 500; color: var(--color-text); text-decoration: none;
  transition: background var(--transition);
}
.nav-mobile-link:hover { background: var(--color-primary-bg); color: var(--color-primary); }
.nav-mobile-btn { background: none; border: none; text-align: left; cursor: pointer; width: 100%; color: var(--color-danger); }

.slide-down-enter-active,.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from,.slide-down-leave-to { opacity: 0; transform: translateY(-10px); }

@media (max-width: 768px) {
  .nav-links, .nav-actions { display: none; }
  .nav-burger { display: flex; }
  .navbar { height: auto; min-height: var(--nav-height); }
  .nav-inner { height: var(--nav-height); }
}
</style>
