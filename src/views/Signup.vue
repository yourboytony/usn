<template>
  <div class="min-h-screen bg-navy-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <LoadingScreen v-if="loading" />

    <div class="w-full max-w-md space-y-8">
      <!-- Logo Section -->
      <div class="flex flex-col items-center">
        <Logo class="w-24 h-24" />
        <h2 class="mt-6 text-center text-3xl font-military text-white">
          REQUEST ACCESS
        </h2>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6 bg-navy-800/80 p-8 rounded-lg border border-navy-gold/30">
        <!-- Username -->
        <div>
          <label class="block text-sm font-military text-navy-gold">USERNAME</label>
          <input
            v-model="form.username"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 bg-navy-900/90 border border-navy-gold/30 rounded text-white placeholder-gray-500"
            placeholder="Enter username"
          />
        </div>

        <!-- Discord Username -->
        <div>
          <label class="block text-sm font-military text-navy-gold">DISCORD USERNAME</label>
          <input
            v-model="form.discordUsername"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 bg-navy-900/90 border border-navy-gold/30 rounded text-white placeholder-gray-500"
            placeholder="username#0000"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-military text-navy-gold">PASSWORD</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="mt-1 block w-full px-3 py-2 bg-navy-900/90 border border-navy-gold/30 rounded text-white placeholder-gray-500"
            placeholder="Enter password"
          />
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-navy-gold rounded text-sm font-military text-white bg-navy-gold/20 hover:bg-navy-gold/30"
        >
          {{ loading ? 'PROCESSING...' : 'SUBMIT REQUEST' }}
        </button>
      </form>

      <!-- Login Link -->
      <div class="text-center">
        <router-link 
          to="/login" 
          class="text-sm font-military text-navy-gold hover:text-navy-gold/80"
        >
          RETURN TO LOGIN
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'
import Logo from '@/components/Logo.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = ref({
  username: '',
  discordUsername: '',
  password: ''
})

async function handleSubmit() {
  if (!validateForm()) return
  
  loading.value = true
  error.value = ''

  try {
    await authService.register(form.value)
    router.push('/signup-confirmation')
  } catch (err) {
    error.value = err.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}

function validateForm() {
  if (!form.value.username || !form.value.password || !form.value.discordUsername) {
    error.value = 'All fields are required'
    return false
  }

  if (form.value.username.length < 3) {
    error.value = 'Username must be at least 3 characters'
    return false
  }

  if (form.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return false
  }

  return true
}
</script>

<style>
input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}
</style> 