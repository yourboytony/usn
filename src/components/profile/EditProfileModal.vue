<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-lg font-medium text-gray-100 mb-4">
        Edit Profile
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="discord" class="block text-sm font-medium text-gray-200">
            Discord Handle
          </label>
          <input
            id="discord"
            v-model="form.discordHandle"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>

        <div>
          <label for="roblox" class="block text-sm font-medium text-gray-200">
            Roblox Username
          </label>
          <div class="mt-1 flex">
            <input
              id="roblox"
              v-model="form.robloxUsername"
              type="text"
              required
              class="block w-full px-3 py-2 border border-gray-600 rounded-l-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

        <div v-if="robloxVerified" class="flex items-center space-x-4 bg-gray-700 p-3 rounded-md">
          <img :src="robloxData.avatarUrl" class="h-12 w-12 rounded-full">
          <div>
            <p class="text-sm font-medium text-gray-200">{{ robloxData.displayName }}</p>
            <p class="text-xs text-gray-400">ID: {{ robloxData.userId }}</p>
          </div>
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
            :disabled="loading || !robloxVerified"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])

const loading = ref(false)
const robloxVerified = ref(true) // Initially true since we're editing existing profile
const robloxData = ref(null)

const form = ref({
  discordHandle: props.user.discordHandle,
  robloxUsername: props.user.robloxUsername
})

async function verifyRobloxUser() {
  loading.value = true
  try {
    const response = await fetch(`/api/roblox/verify/${form.value.robloxUsername}`)
    if (!response.ok) throw new Error('Failed to verify Roblox user')
    
    robloxData.value = await response.json()
    robloxVerified.value = true
  } catch (error) {
    console.error('Roblox verification failed:', error)
    // TODO: Add error notification
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  if (!robloxVerified.value) return

  loading.value = true
  try {
    emit('update', {
      discordHandle: form.value.discordHandle,
      robloxUsername: form.value.robloxUsername,
      robloxData: robloxData.value
    })
  } catch (error) {
    console.error('Failed to update profile:', error)
    // TODO: Add error notification
  } finally {
    loading.value = false
  }
}
</script> 