<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 text-gray-300 hover:text-white"
    >
      <img 
        :src="user?.avatarUrl || '/default-avatar.png'" 
        class="h-8 w-8 rounded-full"
      >
      <span class="hidden md:block">{{ user?.displayName || 'User' }}</span>
      <span 
        class="inline-block h-4 w-4"
        :class="isOpen ? 'transform rotate-180' : ''"
      >
        ▼
      </span>
    </button>

    <div 
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5"
    >
      <div 
        class="py-1" 
        role="menu" 
        aria-orientation="vertical"
      >
        <RouterLink 
          :to="{ name: 'profile', params: { id: user?.id }}" 
          class="block px-4 py-2 text-xs font-mono text-gray-400 hover:bg-[#222]"
        >
          Profile
        </RouterLink>

        <template v-if="isAdmin">
          <router-link
            to="/admin"
            class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            role="menuitem"
          >
            Admin Dashboard
          </router-link>
        </template>

        <button
          @click="handleLogout"
          class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
          role="menuitem"
        >
          Sign out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isOpen = ref(false)

const user = computed(() => authStore.user)
const isAdmin = computed(() => {
  const adminRanks = ['O-7', 'O-8', 'O-9', 'O-10', 'FADM', 'CNO', 'SECNAV']
  return adminRanks.includes(user.value?.rank)
})

async function handleLogout() {
  await authStore.logout()
  router.push('/auth/login')
}
</script> 