<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-lg font-medium text-gray-100 mb-4">
        Assign Member to {{ unit.name }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-200">
            Search User
          </label>
          <div class="mt-1 relative">
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Search by username or ID..."
              class="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @input="searchUsers"
            >
            <!-- Search Results Dropdown -->
            <div 
              v-if="searchResults.length && !selectedUser"
              class="absolute z-10 mt-1 w-full bg-gray-700 rounded-md shadow-lg"
            >
              <div class="py-1">
                <button
                  v-for="user in searchResults"
                  :key="user.id"
                  type="button"
                  class="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-600 flex items-center space-x-3"
                  @click="selectUser(user)"
                >
                  <img :src="user.avatarUrl" :alt="user.displayName" class="h-8 w-8 rounded-full">
                  <div>
                    <div class="font-medium">{{ user.displayName }}</div>
                    <div class="text-xs text-gray-400">{{ user.rank }}</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected User -->
        <div v-if="selectedUser" class="bg-gray-700 p-3 rounded-md flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <img :src="selectedUser.avatarUrl" :alt="selectedUser.displayName" class="h-10 w-10 rounded-full">
            <div>
              <div class="text-sm font-medium text-gray-200">{{ selectedUser.displayName }}</div>
              <div class="text-xs text-gray-400">{{ selectedUser.rank }}</div>
            </div>
          </div>
          <button
            type="button"
            @click="selectedUser = null"
            class="text-sm text-gray-400 hover:text-gray-300"
          >
            Change
          </button>
        </div>

        <div>
          <label for="role" class="block text-sm font-medium text-gray-200">
            Role in Unit
          </label>
          <select
            id="role"
            v-model="form.role"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select Role</option>
            <option value="commander">Commander</option>
            <option value="deputy">Deputy Commander</option>
            <option value="staff">Staff Officer</option>
            <option value="member">Member</option>
          </select>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading || !selectedUser || !form.role"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Assigning...' : 'Assign Member' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useOrbatStore } from '@/stores/orbat'

const props = defineProps({
  unit: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'assign'])

const loading = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const selectedUser = ref(null)
const form = ref({
  role: ''
})

// Debounced search
let searchTimeout

watch(searchQuery, (newQuery) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  if (!newQuery.trim()) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    await searchUsers()
  }, 300)
})

async function searchUsers() {
  if (!searchQuery.value.trim()) return

  try {
    const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery.value)}`)
    if (!response.ok) throw new Error('Search failed')
    
    const data = await response.json()
    searchResults.value = data.users.filter(user => 
      // Filter out users already in the unit
      !props.unit.members?.some(member => member.id === user.id)
    )
  } catch (error) {
    console.error('User search failed:', error)
    // TODO: Add error notification
  }
}

function selectUser(user) {
  selectedUser.value = user
  searchResults.value = []
  searchQuery.value = ''
}

async function handleSubmit() {
  if (!selectedUser.value || !form.value.role) return

  loading.value = true
  try {
    emit('assign', {
      userId: selectedUser.value.id,
      role: form.value.role
    })
  } catch (error) {
    console.error('Failed to assign member:', error)
    // TODO: Add error notification
  } finally {
    loading.value = false
  }
}
</script> 