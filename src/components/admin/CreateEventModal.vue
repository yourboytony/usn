<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
      <h3 class="text-lg font-medium text-gray-100 mb-4">
        Schedule New Event
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-200">
            Event Title
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
          <label for="type" class="block text-sm font-medium text-gray-200">
            Event Type
          </label>
          <select
            id="type"
            v-model="form.type"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="training">Training</option>
            <option value="patrol">Patrol</option>
            <option value="meeting">Meeting</option>
            <option value="ceremony">Ceremony</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="startTime" class="block text-sm font-medium text-gray-200">
              Start Time
            </label>
            <input
              id="startTime"
              v-model="form.startTime"
              type="datetime-local"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
          </div>

          <div>
            <label for="duration" class="block text-sm font-medium text-gray-200">
              Duration (hours)
            </label>
            <input
              id="duration"
              v-model.number="form.duration"
              type="number"
              min="0.5"
              step="0.5"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
          </div>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-200">
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-200 mb-2">
            Departments
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
                v-model="form.departments"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              >
              <span class="ml-2 text-sm text-gray-300">{{ dept.name }}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-200">
            Minimum Rank Required
          </label>
          <select
            v-model="form.minRank"
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

        <div>
          <label class="block text-sm font-medium text-gray-200">
            Additional Settings
          </label>
          <div class="mt-2 space-y-2">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="form.mandatory"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              >
              <span class="ml-2 text-sm text-gray-300">Mandatory for selected departments</span>
            </label>
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="form.requiresApproval"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              >
              <span class="ml-2 text-sm text-gray-300">Requires approval to attend</span>
            </label>
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
            :disabled="loading"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Creating...' : 'Create Event' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RANKS, DEPARTMENTS } from '@/constants/ranks'

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
  type: 'training',
  startTime: '',
  duration: 1,
  description: '',
  departments: [],
  minRank: '',
  mandatory: false,
  requiresApproval: false
})

async function handleSubmit() {
  loading.value = true
  try {
    emit('create', {
      ...form.value,
      endTime: calculateEndTime(form.value.startTime, form.value.duration)
    })
  } catch (error) {
    console.error('Failed to create event:', error)
    // TODO: Add error notification
  } finally {
    loading.value = false
  }
}

function calculateEndTime(startTime, duration) {
  const start = new Date(startTime)
  return new Date(start.getTime() + duration * 60 * 60 * 1000).toISOString()
}
</script> 