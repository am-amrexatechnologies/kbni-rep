import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/',                  name: 'Home',             component: () => import('../views/HomeView.vue') },
  { path: '/login',             name: 'Login',            component: () => import('../views/LoginView.vue'),       meta: { guestOnly: true } },
  { path: '/register',          name: 'Register',         component: () => import('../views/RegisterView.vue'),    meta: { guestOnly: true } },
  { path: '/profil',            name: 'Profil',           component: () => import('../views/ProfileView.vue'),     meta: { requiresAuth: true } },
  { path: '/trainingsplan',     name: 'Trainingsplan',    component: () => import('../views/TrainingPlanView.vue') },
  { path: '/charakterbewertung',name: 'Charakterbewertung', component: () => import('../views/CharacterRatingView.vue') },
  { path: '/impressum',         name: 'Impressum',        component: () => import('../views/ImpressumView.vue') },
  { path: '/datenschutz',       name: 'Datenschutz',      component: () => import('../views/DatenschutzView.vue') },
  { path: '/:pathMatch(.*)*',   redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return { name: 'Login' }
  if (to.meta.guestOnly  && auth.isLoggedIn)  return { name: 'Home' }
})

export default router
