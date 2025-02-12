<template>
  <div class="min-h-screen bg-navy-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <!-- Loading Screen -->
    <LoadingScreen v-if="showLoadingScreen" />

    <!-- Classification Banner -->
    <div class="fixed top-0 w-full bg-red-900/30 border-b border-red-500/50 py-1.5 z-50">
      <div class="flex justify-center items-center space-x-2">
        <span class="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
        <span class="text-red-500 font-mono text-xs tracking-widest">TOP SECRET // NOFORN</span>
      </div>
    </div>

    <!-- Main Container -->
    <div class="w-full max-w-md relative z-10 py-16">
      <!-- Logo Section -->
      <div class="flex flex-col items-center mb-12">
        <div class="relative mb-8">
          <div class="absolute -inset-1 bg-navy-gold/20 rounded-full blur-xl animate-pulse"></div>
          <Logo class="w-24 h-24 relative" />
        </div>

        <!-- Title -->
        <h2 class="text-center text-3xl font-military text-white mb-3">SECURE ACCESS PORTAL</h2>
        <p class="text-center text-sm font-mono text-gray-400">AUTHORIZED PERSONNEL ONLY</p>
      </div>

      <!-- Login Form Container -->
      <div class="relative">
        <!-- Glowing border effect -->
        <div class="absolute -inset-0.5 bg-navy-gold/20 rounded-lg blur-sm"></div>
        
        <div class="relative bg-navy-800/80 py-10 px-6 shadow-xl rounded-lg border border-navy-gold/30 backdrop-blur-sm sm:px-12">
          <!-- Scanner Effect -->
          <div class="absolute inset-0 bg-scan-line opacity-5 rounded-lg"></div>

          <form @submit.prevent="handleLogin" class="space-y-8">
            <!-- Username Field -->
            <div>
              <label class="block text-sm font-military text-navy-gold mb-2">USERNAME</label>
              <div class="relative">
                <div class="absolute inset-0 bg-scan-line opacity-5"></div>
                <input 
                  v-model="form.username"
                  type="text"
                  required
                  class="relative z-10 w-full bg-navy-900/90 border border-navy-gold/30 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-navy-gold/50 focus:border-navy-gold/50 font-mono"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label class="block text-sm font-military text-navy-gold mb-2">PASSWORD</label>
              <div class="relative">
                <div class="absolute inset-0 bg-scan-line opacity-5"></div>
                <input 
                  v-model="form.password"
                  type="password"
                  required
                  class="relative z-10 w-full bg-navy-900/90 border border-navy-gold/30 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-navy-gold/50 focus:border-navy-gold/50 font-mono"
                />
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="text-red-500 text-sm font-mono text-center bg-red-500/10 border border-red-500/20 rounded-md py-2">
              {{ error }}
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <button
                type="submit"
                :disabled="authStore.loading"
                class="group relative w-full flex justify-center py-3 px-4 border border-navy-gold rounded-md text-sm font-military text-white bg-navy-gold/20 hover:bg-navy-gold/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-gold/50 transition-all duration-300"
              >
                <div class="absolute inset-0 bg-scan-line opacity-10"></div>
                <span class="relative flex items-center">
                  <template v-if="authStore.loading">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-navy-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    LOGGING IN...
                  </template>
                  <template v-else>
                    LOGIN
                  </template>
                </span>
              </button>
            </div>
          </form>

          <!-- Divider -->
          <div class="mt-10 mb-8">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-navy-gold/30"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-navy-800 text-navy-gold font-military">
                  SECURITY NOTICE
                </span>
              </div>
            </div>
            <p class="mt-4 text-xs text-center text-gray-400 font-mono">
              UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED AND MONITORED
            </p>
          </div>

          <!-- Sign Up Link -->
          <div class="text-center">
            <router-link 
              to="/signup" 
              class="inline-flex items-center text-sm font-military text-navy-gold hover:text-navy-gold/80 transition-colors"
            >
              <UserPlusIcon class="h-4 w-4 mr-2" />
              REQUEST ACCESS CREDENTIALS
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Background -->
    <div class="fixed inset-0 bg-grid opacity-[0.02]"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Logo from '@/components/Logo.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import { LockClosedIcon, UserPlusIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const error = ref('')
const form = ref({
  username: '',
  password: ''
})

async function handleLogin() {
  error.value = ''
  console.log('Attempting login with:', form.value.username) // Debug log

  try {
    const success = await authStore.login(
      form.value.username,
      form.value.password
    )
    
    console.log('Login response:', success) // Debug log
    
    if (success) {
      console.log('Login successful, redirecting...') // Debug log
      await router.push({ name: 'dashboard' })
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.message || 'Authentication failed'
  }
}
</script>

<style scoped>
.bg-grid {
  background-image: 
    linear-gradient(rgba(196, 176, 133, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(196, 176, 133, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.bg-scan-line {
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1px,
    rgba(196, 176, 133, 0.1) 2px,
    rgba(196, 176, 133, 0.1) 3px
  );
  background-size: 100% 3px;
  animation: scanning 10s linear infinite;
}

@keyframes scanning {
  from { background-position: 0 0; }
  to { background-position: 0 100%; }
}
</style> 