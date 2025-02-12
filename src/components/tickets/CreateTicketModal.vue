<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-navy-500 rounded-lg shadow-xl w-full max-w-2xl mx-4">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-military text-white">CREATE TICKET</h2>
          <button @click="emit('close')" class="text-gray-400 hover:text-gray-300">
            <span class="sr-only">Close</span>
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-200 mb-2">Title</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full px-3 py-2 bg-navy-600 border border-navy-400 rounded-md text-white"
              required
            >
          </div>

          <!-- Department -->
          <div>
            <label class="block text-sm font-medium text-gray-200 mb-2">Department</label>
            <select
              v-model="form.department"
              class="w-full px-3 py-2 bg-navy-600 border border-navy-400 rounded-md text-white"
              required
            >
              <option value="">Select Department</option>
              <option v-for="dept in DEPARTMENTS" :key="dept" :value="dept">
                {{ dept }}
              </option>
            </select>
          </div>

          <!-- Priority -->
          <div>
            <label class="block text-sm font-medium text-gray-200 mb-2">Priority</label>
            <select
              v-model="form.priority"
              class="w-full px-3 py-2 bg-navy-600 border border-navy-400 rounded-md text-white"
              required
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-200 mb-2">Description</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full px-3 py-2 bg-navy-600 border border-navy-400 rounded-md text-white"
              required
            ></textarea>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="text-red-400 text-sm">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
              :disabled="loading"
            >
              {{ loading ? 'Creating...' : 'Create Ticket' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTicketsStore } from '@/stores/tickets'
import { DEPARTMENTS } from '@/constants/ranks'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['close', 'created'])
const ticketsStore = useTicketsStore()

const loading = ref(false)
const error = ref(null)

const form = ref({
  title: '',
  description: '',
  department: '',
  priority: 'MEDIUM'
})

async function handleSubmit() {
  if (!form.value.title || !form.value.description || !form.value.department) {
    error.value = 'Please fill in all required fields'
    return
  }

  loading.value = true
  error.value = null

  try {
    const ticket = await ticketsStore.createTicket({
      title: form.value.title,
      description: form.value.description,
      department: form.value.department,
      priority: form.value.priority
    })

    emit('created', ticket)
    emit('close')
  } catch (err) {
    console.error('Failed to create ticket:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script> 