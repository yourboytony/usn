<template>
  <Menu as="div" class="relative">
    <MenuButton class="flex items-center space-x-3 text-gray-300 hover:text-white">
      <img 
        :src="user?.avatarUrl || defaultAvatar" 
        :alt="user?.username"
        class="h-8 w-8 rounded-full"
      >
      <span class="text-sm font-medium">{{ user?.username }}</span>
      <ChevronDownIcon class="h-5 w-5" />
    </MenuButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-navy-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <RouterLink
              :to="{ name: 'profile' }"
              :class="[
                active ? 'bg-navy-500 text-white' : 'text-gray-300',
                'block px-4 py-2 text-sm'
              ]"
            >
              My Profile
            </RouterLink>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              @click="handleLogout"
              :class="[
                active ? 'bg-navy-500 text-white' : 'text-gray-300',
                'block w-full text-left px-4 py-2 text-sm'
              ]"
            >
              Sign Out
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { computed } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const user = computed(() => auth.user)
const defaultAvatar = 'https://api.dicebear.com/7.x/avatars/svg?seed=default'

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script> 