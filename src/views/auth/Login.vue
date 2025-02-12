<template>
  <form class="space-y-6" @submit.prevent="handleLogin">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-200">
        Email address
      </label>
      <div class="mt-1">
        <input 
          id="email" 
          v-model="form.email"
          type="email" 
          required 
          class="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
      </div>
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-200">
        Password
      </label>
      <div class="mt-1">
        <input 
          id="password" 
          v-model="form.password"
          type="password" 
          required 
          class="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input 
          id="remember-me" 
          v-model="form.remember"
          type="checkbox"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
        >
        <label for="remember-me" class="ml-2 block text-sm text-gray-200">
          Remember me
        </label>
      </div>
    </div>

    <div>
      <button 
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </div>

    <div class="text-sm text-center">
      <router-link 
        to="/auth/register" 
        class="font-medium text-blue-400 hover:text-blue-300"
      >
        Don't have an account? Register
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const form = ref({
  email: '',
  password: '',
  remember: false
})

async function handleLogin() {
  loading.value = true
  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password
    })
    router.push('/')
  } catch (error) {
    // TODO: Add error handling/notification
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script> 