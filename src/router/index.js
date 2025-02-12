import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SignupConfirmation from '@/views/SignupConfirmation.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/Signup.vue'),
    meta: { guest: true }
  },
  {
    path: '/dashboard',
    component: () => import('@/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'announcements',
        name: 'announcements',
        component: () => import('@/views/Announcements.vue')
      },
      {
        path: 'events',
        name: 'events',
        component: () => import('@/views/Events.vue')
      },
      {
        path: 'trainings',
        name: 'trainings',
        component: () => import('@/views/Trainings.vue')
      },
      {
        path: 'tickets',
        name: 'tickets',
        component: () => import('@/views/Tickets.vue')
      },
      {
        path: 'orbat',
        name: 'orbat',
        component: () => import('@/views/ORBAT.vue'),
        meta: { requiresAdmin: true }
      }
    ]
  },
  {
    path: '/signup-confirmation',
    name: 'SignupConfirmation',
    component: SignupConfirmation
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check auth status on first navigation
  if (!authStore.checkedAuth) {
    await authStore.checkAuth()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestRoute = to.matched.some(record => record.meta.guest)

  // Handle auth required routes
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Handle guest routes (login/signup)
  if (isGuestRoute && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  next()
})

export default router 