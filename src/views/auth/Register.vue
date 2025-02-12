<template>
  <form class="space-y-6" @submit.prevent="handleRegister">
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

    <div>
      <label for="roblox-username" class="block text-sm font-medium text-gray-200">
        Roblox Username
      </label>
      <div class="mt-1 flex">
        <input 
          id="roblox-username" 
          v-model="form.robloxUsername"
          type="text" 
          required 
          class="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-l-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
        <button
          type="button"
          @click="verifyRobloxUser"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 border border-gray-600 rounded-r-md shadow-sm text-sm font-medium text-gray-200 bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Verify
        </button>
      </div>
    </div>

    <div v-if="robloxUserVerified" class="flex items-center space-x-4">
      <img :src="robloxUserData.avatarUrl" class="h-12 w-12 rounded-full">
      <div>
        <p class="text-sm font-medium text-gray-200">{{ robloxUserData.displayName }}</p>
        <p class="text-xs text-gray-400">ID: {{ robloxUserData.userId }}</p>
      </div>
    </div>

    <VerifyMember
      @verified="handleRobloxVerification"
    />

    <div>
      <button 
        type="submit"
        :disabled="loading || !robloxUserVerified"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {{ loading ? 'Creating account...' : 'Create account' }}
      </button>
    </div>

    <div class="text-sm text-center">
      <router-link 
        to="/auth/login" 
        class="font-medium text-blue-400 hover:text-blue-300"
      >
        Already have an account? Sign in
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import VerifyMember from '@/components/roblox/VerifyMember.vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const robloxUserVerified = ref(false)
const robloxUserData = ref(null)

const form = ref({
  email: '',
  password: '',
  robloxUsername: ''
})

async function verifyRobloxUser() {
  loading.value = true
  try {
    // TODO: Implement Roblox API verification
    const response = await fetch(`/api/roblox/verify/${form.value.robloxUsername}`)
    if (!response.ok) {
      throw new Error('Failed to verify Roblox user')
    }
    
    robloxUserData.value = await response.json()
    robloxUserVerified.value = true
  } catch (error) {
    console.error('Roblox verification failed:', error)
    // TODO: Add error notification
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  if (!robloxUserVerified.value) return

  loading.value = true
  try {
    await authStore.register({
      email: form.value.email,
      password: form.value.password,
      robloxData: robloxUserData.value
    })
    router.push('/')
  } catch (error) {
    console.error('Registration failed:', error)
    // TODO: Add error notification
  } finally {
    loading.value = false
  }
}

function handleRobloxVerification(data) {
  robloxUserData.value = data
}
</script> 