<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-lg font-medium text-gray-100 mb-4">
        Manage Rank: {{ user.displayName }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-200 mb-2">
            Current Rank: <span class="text-blue-400">{{ user.rank }}</span>
          </label>

          <!-- Enlisted Ranks -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-300 mb-2">Enlisted Ranks</h4>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="rank in RANKS.ENLISTED"
                :key="rank.id"
                type="button"
                @click="selectedRank = rank.id"
                class="text-left px-3 py-2 rounded-md text-sm"
                :class="{
                  'bg-blue-600 text-white': selectedRank === rank.id,
                  'bg-gray-700 text-gray-300 hover:bg-gray-600': selectedRank !== rank.id
                }"
              >
                {{ rank.abbr }} - {{ rank.name }}
              </button>
            </div>
          </div>

          <!-- Warrant Officer Ranks -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-300 mb-2">Warrant Officers</h4>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="rank in RANKS.WARRANT"
                :key="rank.id"
                type="button"
                @click="selectedRank = rank.id"
                class="text-left px-3 py-2 rounded-md text-sm"
                :class="{
                  'bg-blue-600 text-white': selectedRank === rank.id,
                  'bg-gray-700 text-gray-300 hover:bg-gray-600': selectedRank !== rank.id
                }"
              >
                {{ rank.abbr }} - {{ rank.name }}
              </button>
            </div>
          </div>

          <!-- Commissioned Officer Ranks -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-300 mb-2">Commissioned Officers</h4>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="rank in RANKS.COMMISSIONED"
                :key="rank.id"
                type="button"
                @click="selectedRank = rank.id"
                class="text-left px-3 py-2 rounded-md text-sm"
                :class="{
                  'bg-blue-600 text-white': selectedRank === rank.id,
                  'bg-gray-700 text-gray-300 hover:bg-gray-600': selectedRank !== rank.id
                }"
              >
                {{ rank.abbr }} - {{ rank.name }}
              </button>
            </div>
          </div>

          <!-- Flag Officer Ranks (Admin Only) -->
          <div v-if="isHighCommand" class="mb-4">
            <h4 class="text-sm font-medium text-gray-300 mb-2">Flag Officers</h4>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="rank in RANKS.FLAG"
                :key="rank.id"
                type="button"
                @click="selectedRank = rank.id"
                class="text-left px-3 py-2 rounded-md text-sm"
                :class="{
                  'bg-blue-600 text-white': selectedRank === rank.id,
                  'bg-gray-700 text-gray-300 hover:bg-gray-600': selectedRank !== rank.id
                }"
              >
                {{ rank.abbr }} - {{ rank.name }}
              </button>
            </div>
          </div>

          <!-- Special Ranks (Admin Only) -->
          <div v-if="isHighCommand" class="mb-4">
            <h4 class="text-sm font-medium text-gray-300 mb-2">Special Ranks</h4>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="rank in RANKS.SPECIAL"
                :key="rank.id"
                type="button"
                @click="selectedRank = rank.id"
                class="text-left px-3 py-2 rounded-md text-sm"
                :class="{
                  'bg-blue-600 text-white': selectedRank === rank.id,
                  'bg-gray-700 text-gray-300 hover:bg-gray-600': selectedRank !== rank.id
                }"
              >
                {{ rank.abbr }} - {{ rank.name }}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label for="reason" class="block text-sm font-medium text-gray-200">
            Reason for Change
          </label>
          <textarea
            id="reason"
            v-model="reason"
            rows="3"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
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
            :disabled="loading || !selectedRank || selectedRank === user.rank"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Update Rank
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { RANKS } from '@/constants/ranks'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])
const authStore = useAuthStore()

const loading = ref(false)
const selectedRank = ref(props.user.rank)
const reason = ref('')

const isHighCommand = computed(() => {
  const highCommandRanks = ['O-10', 'FADM', 'CNO', 'SECNAV']
  return highCommandRanks.includes(authStore.user?.rank)
})

async function handleSubmit() {
  if (!selectedRank.value || selectedRank.value === props.user.rank) return

  loading.value = true
  try {
    emit('update', {
      rank: selectedRank.value,
      reason: reason.value
    })
  } catch (error) {
    console.error('Failed to update rank:', error)
    // TODO: Add error notification
  } finally {
    loading.value = false
  }
}
</script> 