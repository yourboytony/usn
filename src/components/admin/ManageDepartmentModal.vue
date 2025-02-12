<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
      <h3 class="text-lg font-medium text-gray-100 mb-4">
        {{ department ? 'Edit Department' : 'Create Department' }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-200">
            Department Name
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-200">
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-200 mb-2">
            Permissions
          </label>
          <div class="space-y-2">
            <label 
              v-for="perm in availablePermissions"
              :key="perm.id"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :value="perm.id"
                v-model="form.permissions"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              >
              <span class="ml-2 text-sm text-gray-300">{{ perm.name }}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-200 mb-2">
            Required Rank
          </label>
          <select
            v-model="form.minRank"
            class="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">No Rank Requirement</option>
            <optgroup 
              v-for="(ranks, category) in RANKS" 
              :key="category"
              :label="category"
            >
              <option 
                v-for="rank in ranks"
                :key="rank.id"
                :value="rank.id"
              >
                {{ rank.name }} ({{ rank.abbr }})
              </option>
            </optgroup>
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
            :disabled="loading"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Saving...' : 'Save Department' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RANKS } from '@/constants/ranks'

const props = defineProps({
  department: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const loading = ref(false)
const form = ref({
  name: props.department?.name || '',
  description: props.department?.description || '',
  permissions: props.department?.permissions || [],
  minRank: props.department?.minRank || ''
})

const availablePermissions = [
  { id: 'manage_members', name: 'Manage Members' },
  { id: 'manage_tickets', name: 'Manage Tickets' },
  { id: 'create_events', name: 'Create Events' },
  { id: 'manage_reports', name: 'Manage Reports' },
  { id: 'view_logs', name: 'View Logs' }
]

async function handleSubmit() {
  loading.value = true
  try {
    emit('save', {
      id: props.department?.id,
      ...form.value
    })
  } catch (error) {
    console.error('Failed to save department:', error)
    // TODO: Add error notification
  } finally {
    loading.value = false
  }
}
</script> 