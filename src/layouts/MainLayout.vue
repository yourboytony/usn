<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Navigation Bar -->
    <nav class="bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and Nav Links -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Logo class="h-8 w-8 text-blue-500" />
            </div>
            <div class="ml-6 flex space-x-4">
              <router-link 
                to="/" 
                class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                :class="{ 'bg-gray-900': $route.name === 'dashboard' }"
              >
                Dashboard
              </router-link>
              <router-link 
                to="/events" 
                class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                :class="{ 'bg-gray-900': $route.name === 'events' }"
              >
                Events
              </router-link>
              <router-link 
                to="/tickets" 
                class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                :class="{ 'bg-gray-900': $route.name === 'tickets' }"
              >
                Tickets
              </router-link>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center">
            <button 
              @click="logout"
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Logo from '@/components/Logo.vue'

const router = useRouter()
const authStore = useAuthStore()

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 text-sm font-medium text-gray-300 hover:text-white 
         hover:bg-gray-700 rounded-md transition-colors;
}

.nav-link.active {
  @apply bg-gray-700 text-white;
}
</style> 