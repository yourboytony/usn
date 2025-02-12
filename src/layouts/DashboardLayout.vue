<template>
  <div class="min-h-screen bg-navy-900">
    <!-- Top Security Bar -->
    <div class="bg-[#0a0a0a] py-1 px-4 border-b border-red-900/30">
      <div class="flex justify-between items-center max-w-7xl mx-auto">
        <div class="flex items-center space-x-3">
          <span class="text-red-500 text-xs font-mono animate-pulse">●</span>
          <span class="text-xs text-red-500 font-mono tracking-wider">TOP SECRET // NOFORN</span>
        </div>
        <div class="flex items-center space-x-4 text-xs font-mono text-gray-500">
          <span class="text-green-500">SYSTEM: OPERATIONAL</span>
          <span class="text-gray-700">|</span>
          <span>{{ new Date().toLocaleTimeString('en-US', { hour12: false }) }}</span>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="bg-black border-b border-navy-gold/30">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-8">
            <router-link to="/dashboard" class="flex items-center space-x-3">
              <Logo class="h-8 w-8" />
              <span class="text-navy-gold font-military">COMMAND CENTER</span>
            </router-link>
            
            <div class="flex space-x-4">
              <router-link 
                v-for="item in navigation" 
                :key="item.name"
                :to="item.to"
                class="text-gray-300 hover:text-white px-3 py-2 text-sm font-military"
                :class="{ 'text-navy-gold': $route.path.startsWith(item.to) }"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <span class="text-navy-gold font-military text-sm">
              {{ authStore.user?.rank }} {{ authStore.user?.username }}
            </span>
            <button 
              @click="logout"
              class="text-gray-300 hover:text-white text-sm font-military"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Logo from '@/components/Logo.vue'

const router = useRouter()
const authStore = useAuthStore()

const navigation = [
  { name: 'DASHBOARD', to: '/dashboard' },
  { name: 'ANNOUNCEMENTS', to: '/dashboard/announcements' },
  { name: 'EVENTS', to: '/dashboard/events' },
  { name: 'TRAININGS', to: '/dashboard/trainings' },
  { name: 'TICKETS', to: '/dashboard/tickets' },
  { name: 'ORBAT', to: '/dashboard/orbat' }
]

const logout = async () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 