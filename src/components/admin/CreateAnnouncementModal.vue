<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
      <h3 class="text-lg font-medium text-gray-100 mb-4">
        Create Announcement
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-200">
            Title
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>

        <div>
          <label for="content" class="block text-sm font-medium text-gray-200">
            Content
          </label>
          <div class="mt-1">
            <textarea
              id="content"
              v-model="form.content"
              rows="6"
              required
              class="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
            <p class="mt-1 text-xs text-gray-400">
              Markdown formatting is supported
            </p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-200">
            Visibility
          </label>
          <div class="mt-2 space-y-2">
            <label class="flex items-center">
              <input
                type="radio"
                v-model="form.visibility"
                value="all"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
              >
              <span class="ml-2 text-sm text-gray-300">All Members</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                v-model="form.visibility"
                value="department"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
              >
              <span class="ml-2 text-sm text-gray-300">Specific Departments</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                v-model="form.visibility"
                value="rank"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
              >
              <span class="ml-2 text-sm text-gray-300">Minimum Rank Required</span>
            </label>
          </div>
        </div>

        <!-- Department Selection -->
        <div v-if="form.visibility === 'department'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-200">
            Select Departments
          </label>
          <div class="space-y-2">
            <label 
              v-for="dept in departments"
              :key="dept.id"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :value="dept.id"
                v-model="form.selectedDepartments"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              >
              <span class="ml-2 text-sm text-gray-300">{{ dept.name }}</span>
            </label>
          </div>
        </div>

        <!-- Rank Selection -->
        <div v-if="form.visibility === 'rank'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-200">
            Minimum Rank Required
          </label>
          <select
            v-model="form.minRank"
            class="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
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
            :disabled="loading || !isValid"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Creating...' : 'Create Announcement' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RANKS } from '@/constants/ranks'

const props = defineProps({
  departments: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'create'])

const loading = ref(false)
const form = ref({
  title: '',
  content: '',
  visibility: 'all',
  selectedDepartments: [],
  minRank: ''
})

const isValid = computed(() => {
  if (!form.value.title || !form.value.content) return false
  if (form.value.visibility === 'department' && !form.value.selectedDepartments.length) return false
  if (form.value.visibility === 'rank' && !form.value.minRank) return false
  return true
})

async function handleSubmit() {
  if (!isValid.value) return

  loading.value = true
  try {
    emit('create', {
      ...form.value,
      date: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to create announcement:', error)
    // TODO: Add error notification
  } finally {
    loading.value = false
  }
}
</script> 