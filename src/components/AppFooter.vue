<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">K</div>
        <div>
          <div class="footer-app-name">KBNI</div>
          <div class="footer-tagline">Deine persönliche App-Plattform</div>
        </div>
      </div>
      <div class="footer-links">
        <RouterLink to="/impressum"  class="footer-link">Impressum</RouterLink>
        <span class="footer-sep">·</span>
        <RouterLink to="/datenschutz" class="footer-link">Datenschutz</RouterLink>
      </div>
      <div class="footer-copy">© {{ year }} KBNI</div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer { background: white; border-top: 1px solid var(--color-border-light); padding: 1.5rem; margin-top: auto; }
.footer-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;
}
.footer-brand { display: flex; align-items: center; gap: 0.75rem; }
.footer-logo  {
  width: 30px; height: 30px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 0.85rem;
}
.footer-app-name { font-size: 0.9rem; font-weight: 700; color: var(--color-text); }
.footer-tagline  { font-size: 0.75rem; color: var(--color-text-light); }
.footer-links    { display: flex; align-items: center; gap: 0.5rem; }
.footer-link     { font-size: 0.85rem; color: var(--color-text-muted); transition: color var(--transition); }
.footer-link:hover { color: var(--color-primary); }
.footer-sep      { color: var(--color-text-light); }
.footer-copy     { font-size: 0.8rem; color: var(--color-text-light); }
@media (max-width: 600px) { .footer-inner { flex-direction: column; align-items: flex-start; gap: 0.75rem; } }
</style>
