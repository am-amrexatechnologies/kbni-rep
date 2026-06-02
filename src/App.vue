<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import NavBar    from './components/NavBar.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<style>
.main-content { flex: 1; display: flex; flex-direction: column; }
</style>
