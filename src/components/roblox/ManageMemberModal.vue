<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div class="bg-[#1a1a1a] border border-[#333] rounded-lg w-full max-w-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <img :src="member.thumbnail" class="h-12 w-12 rounded" :alt="member.username">
          <div>
            <h3 class="text-lg text-white font-mono">{{ member.username }}</h3>
            <p class="text-sm text-gray-500 font-mono">Member since {{ formatDate(member.joinDate) }}</p>
          </div>
        </div>
        <button @click="$emit('close')" class="text-gray-500 hover:text-white">
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>

      <div class="space-y-4">
        <!-- Rank Management -->
        <div>
          <label class="block text-sm text-gray-500 font-mono mb-2">RANK</label>
          <select
            v-model="selectedRank"
            class="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
          >
            <option v-for="role in availableRoles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm text-gray-500 font-mono mb-2">NOTES</label>
          <textarea
            v-model="notes"
            rows="3"
            class="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>

        <!-- Activity Log -->
        <div>
          <h4 class="text-sm text-gray-500 font-mono mb-2">RECENT ACTIVITY</h4>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div v-for="(activity, index) in memberActivity" :key="index"
                 class="text-xs font-mono p-2 border border-[#333] rounded">
              <p class="text-white">{{ activity.description }}</p>
              <p class="text-gray-500 mt-1">{{ formatDate(activity.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3 mt-6">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-mono text-gray-400 hover:text-white"
        >
          CANCEL
        </button>
        <button
          @click="handleSave"
          class="px-4 py-2 text-sm font-mono bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          SAVE CHANGES
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { formatDistance } from 'date-fns'
import { useRobloxStore } from '@/stores/roblox'

const props = defineProps({
  member: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])
const robloxStore = useRobloxStore()

const selectedRank = ref(props.member.roleId)
const notes = ref('')
const memberActivity = ref([])

async function handleSave() {
  try {
    await robloxStore.updateMemberRank(props.member.userId, selectedRank.value)
    emit('update')
    emit('close')
  } catch (error) {
    console.error('Failed to update member:', error)
  }
}

onMounted(async () => {
  try {
    const activity = await robloxStore.fetchMemberActivity(props.member.userId)
    memberActivity.value = activity
  } catch (error) {
    console.error('Failed to fetch member activity:', error)
  }
})

function formatDate(date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}
</script> 