<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-navy-900 bg-opacity-75" @click="$emit('close')"></div>
      
      <div class="relative bg-navy-800 rounded-lg max-w-lg w-full p-6">
        <h3 class="text-xl font-military text-white mb-4">Edit User Rank</h3>
        
        <div class="space-y-4">
          <!-- User Info -->
          <div class="flex items-center space-x-4">
            <img :src="user.avatarUrl" :alt="user.username" class="h-12 w-12 rounded-full">
            <div>
              <p class="text-white font-medium">{{ user.username }}</p>
              <p class="text-gray-400">Current Rank: {{ user.rank }}</p>
            </div>
          </div>

          <!-- Rank Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              New Rank
            </label>
            <select
              v-model="selectedRank"
              class="bg-navy-700 text-white rounded-md w-full p-2 border border-navy-600"
            >
              <option value="">Select a rank...</option>
              <optgroup 
                v-for="(ranks, category) in groupedRanks" 
                :key="category"
                :label="category"
              >
                <option
                  v-for="rank in ranks"
                  :key="rank.id"
                  :value="rank.id"
                >
                  {{ rank.abbr }} - {{ rank.name }}
                </option>
              </optgroup>
            </select>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="$emit('close')"
              class="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              @click="updateRank"
              :disabled="!selectedRank"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Update Rank
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RANKS } from '@/constants/ranks'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  availableRanks: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])

const selectedRank = ref('')

const groupedRanks = computed(() => {
  const groups = {}
  for (const [category, ranks] of Object.entries(RANKS)) {
    const availableInCategory = ranks.filter(rank => 
      props.availableRanks.some(r => r.id === rank.id)
    )
    if (availableInCategory.length > 0) {
      groups[category] = availableInCategory
    }
  }
  return groups
})

function updateRank() {
  if (!selectedRank.value) return
  
  emit('update', {
    rank: selectedRank.value
  })
}
</script> 