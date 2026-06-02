<template>
  <RouterLink :to="to" class="app-tile">
    <div class="tile-label">{{ title.charAt(0) }}</div>
    <div class="tile-content">
      <div class="tile-title">{{ title }}</div>
      <div class="tile-description">{{ description }}</div>
    </div>
    <span class="tile-arrow">&#8594;</span>
  </RouterLink>
</template>

<script setup>
defineProps({
  to:          { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true }
})
</script>

<style scoped>
.app-tile {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.25rem; background: white;
  border: 1.5px solid var(--color-border-light); border-radius: var(--radius-lg);
  text-decoration: none; transition: all var(--transition);
  box-shadow: var(--shadow-xs); position: relative; overflow: hidden;
}
.app-tile::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
  background: var(--color-primary); opacity: 0; transition: opacity var(--transition);
}
.app-tile:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); transform: translateX(3px); }
.app-tile:hover::before { opacity: 1; }
.app-tile:hover .tile-arrow { color: var(--color-primary); transform: translateX(4px); }

.tile-label {
  width: 52px; height: 52px; flex-shrink: 0;
  background: var(--color-primary-bg); border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem; font-weight: 700; color: var(--color-primary);
}
.tile-content { flex: 1; }
.tile-title   { font-size: 1rem; font-weight: 600; color: var(--color-text); margin-bottom: 0.2rem; }
.tile-description { font-size: 0.85rem; color: var(--color-text-muted); }
.tile-arrow   { font-size: 1.1rem; color: var(--color-text-light); flex-shrink: 0; transition: all var(--transition); }
</style>
