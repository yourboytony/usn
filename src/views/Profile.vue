<template>
  <div class="p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-military text-white mb-6">MY PROFILE</h1>
      
      <div class="bg-navy-500 rounded-lg shadow p-6">
        <div class="flex items-center space-x-6 mb-6">
          <img 
            :src="user?.avatarUrl || defaultAvatar" 
            :alt="user?.username"
            class="h-24 w-24 rounded-full"
          >
          <div>
            <h2 class="text-xl font-military text-white">{{ user?.username }}</h2>
            <p class="text-gray-300">{{ user?.rank }} • {{ user?.role }}</p>
          </div>
        </div>

        <!-- Add more profile information and edit functionality here -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const user = computed(() => auth.user)
const defaultAvatar = 'https://api.dicebear.com/7.x/avatars/svg?seed=default'
</script> 