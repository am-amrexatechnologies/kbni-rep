import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',              name: 'home',         component: HomeView },
    { path: '/workout',       name: 'workout',      component: () => import('@/views/WorkoutView.vue') },
    { path: '/anime',         name: 'anime',        component: () => import('@/views/AnimeView.vue') },
    { path: '/login',         name: 'login',        component: () => import('@/views/LoginView.vue') },
    { path: '/register',      name: 'register',     component: () => import('@/views/RegisterView.vue') },
    { path: '/impressum',     name: 'impressum',    component: () => import('@/views/ImpressumView.vue') },
    { path: '/datenschutz',   name: 'datenschutz',  component: () => import('@/views/DatenschutzView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
