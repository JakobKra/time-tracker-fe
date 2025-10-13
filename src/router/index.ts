// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Tracker from '../views/Tracker.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Tracker, meta: { requiresAuth: true } },
  { path: '/auth/:catchAll(.*)', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // Wait until the store is initialized
  if (!auth.initialized) await auth.init()

  if (to.meta.requiresAuth && !auth.user) {
    next('/login')
  } else if (to.path === '/login' && auth.user) {
    // Prevent going to login when already logged in
    next('/')
  } else {
    next()
  }
})

export default router
