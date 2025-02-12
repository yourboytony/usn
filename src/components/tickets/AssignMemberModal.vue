<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-navy-500 rounded-lg shadow-xl w-full max-w-md mx-4">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-military text-white">ASSIGN MEMBER</h2>
          <button @click="emit('close')" class="text-gray-400 hover:text-gray-300">
            <span class="sr-only">Close</span>
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <div class="space-y-4">
          <!-- Search Input -->
          <div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search members..."
              class="w-full px-3 py-2 bg-navy-600 border border-navy-400 rounded-md text-white"
            >
          </div>

          <!-- Members List -->
          <div class="max-h-64 overflow-y-auto space-y-2">
            <button
              v-for="member in filteredMembers"
              :key="member.id"
              @click="handleAssign(member)"
              class="w-full flex items-center space-x-3 p-2 hover:bg-navy-400 rounded-md text-left"
            >
              <img 
                :src="member.avatarUrl" 
                :alt="member.username"
                class="h-8 w-8 rounded-full"
              >
              <div>
                <div class="text-white">{{ member.username }}</div>
                <div class="text-sm text-gray-400">{{ member.rank }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  ticket: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'assign'])
const authStore = useAuthStore()

const searchQuery = ref('')
const members = ref([
  // This should be fetched from your API
  // For now, using mock data
  {
    id: 1,
    username: 'john.doe',
    rank: 'Commander',
    avatarUrl: 'https://api.dicebear.com/7.x/avatars/svg?seed=john'
  },
  {
    id: 2,
    username: 'jane.smith',
    rank: 'Lieutenant',
    avatarUrl: 'https://api.dicebear.com/7.x/avatars/svg?seed=jane'
  }
])

const filteredMembers = computed(() => {
  if (!searchQuery.value) return members.value
  
  const query = searchQuery.value.toLowerCase()
  return members.value.filter(member => 
    member.username.toLowerCase().includes(query) ||
    member.rank.toLowerCase().includes(query)
  )
})

function handleAssign(member) {
  emit('assign', member.id)
}
</script> 