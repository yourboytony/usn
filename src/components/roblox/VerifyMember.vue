<template>
  <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
    <h3 class="text-sm text-white font-mono mb-4">ROBLOX VERIFICATION</h3>
    
    <div v-if="!verified" class="space-y-4">
      <div>
        <label class="block text-xs text-gray-500 font-mono mb-1">
          ROBLOX USERNAME
        </label>
        <input
          v-model="username"
          type="text"
          class="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
          :disabled="loading"
        />
      </div>

      <button
        @click="verify"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono text-sm py-2 rounded transition-colors"
        :disabled="loading"
      >
        <template v-if="loading">
          <span class="flex items-center justify-center">
            <svg class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            VERIFYING...
          </span>
        </template>
        <template v-else>
          VERIFY MEMBERSHIP
        </template>
      </button>

      <p v-if="error" class="text-xs text-red-500 font-mono mt-2">
        {{ error }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <div class="flex items-center space-x-3">
        <div class="h-10 w-10 rounded bg-green-500/10 flex items-center justify-center">
          <CheckIcon class="h-6 w-6 text-green-500" />
        </div>
        <div>
          <p class="text-sm text-white font-mono">VERIFICATION SUCCESSFUL</p>
          <p class="text-xs text-gray-500 font-mono">
            Rank: {{ memberRank }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'
import { useRobloxStore } from '@/stores/roblox'

const robloxStore = useRobloxStore()

const username = ref('')
const loading = ref(false)
const error = ref(null)
const verified = ref(false)
const memberRank = ref('')

async function verify() {
  if (!username.value) return
  
  loading.value = true
  error.value = null
  
  try {
    const member = await robloxStore.getMemberByUsername(username.value)
    if (!member) {
      error.value = 'USER NOT FOUND IN GROUP'
      return
    }

    const isVerified = await robloxStore.verifyMember(member.userId)
    if (!isVerified) {
      error.value = 'VERIFICATION FAILED'
      return
    }

    verified.value = true
    memberRank.value = robloxStore.getRankName(member.rankId)
    emit('verified', {
      username: username.value,
      userId: member.userId,
      rank: memberRank.value
    })
  } catch (err) {
    error.value = 'VERIFICATION FAILED'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const emit = defineEmits(['verified'])
</script> 