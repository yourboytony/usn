<template>
  <div class="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
    <div class="bg-navy-800 rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-military text-white mb-6">CREATE TRAINING SESSION</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Course Selection -->
        <div>
          <label class="block text-sm font-military text-navy-300 mb-1">COURSE</label>
          <select 
            v-model="form.courseId"
            class="w-full bg-navy-700 border border-navy-600 rounded px-3 py-2 text-white focus:outline-none focus:border-navy-gold"
            required
          >
            <option value="">Select Course</option>
            <option v-for="course in availableCourses" :key="course.id" :value="course.id">
              {{ course.name }}
            </option>
          </select>
        </div>

        <!-- Start Date -->
        <div>
          <label class="block text-sm font-military text-navy-300 mb-1">START DATE</label>
          <input 
            v-model="form.startDate"
            type="date"
            class="w-full bg-navy-700 border border-navy-600 rounded px-3 py-2 text-white focus:outline-none focus:border-navy-gold"
            required
          >
        </div>

        <!-- Max Participants -->
        <div>
          <label class="block text-sm font-military text-navy-300 mb-1">MAX PARTICIPANTS</label>
          <input 
            v-model.number="form.maxParticipants"
            type="number"
            min="1"
            max="50"
            class="w-full bg-navy-700 border border-navy-600 rounded px-3 py-2 text-white focus:outline-none focus:border-navy-gold"
            required
          >
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-military text-navy-300 mb-1">SESSION NOTES</label>
          <textarea 
            v-model="form.notes"
            rows="3"
            class="w-full bg-navy-700 border border-navy-600 rounded px-3 py-2 text-white focus:outline-none focus:border-navy-gold"
          ></textarea>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>

        <!-- Buttons -->
        <div class="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-navy-300 hover:text-white font-military"
          >
            CANCEL
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-navy-600 text-white font-military rounded hover:bg-navy-500 disabled:opacity-50"
          >
            {{ loading ? 'CREATING...' : 'CREATE SESSION' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['close', 'created'])
const auth = useAuthStore()

const loading = ref(false)
const error = ref(null)
const availableCourses = ref([])

const form = ref({
  courseId: '',
  startDate: '',
  maxParticipants: 20,
  notes: ''
})

async function loadCourses() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/training/courses`, {
      credentials: 'include'
    })
    const data = await response.json()
    availableCourses.value = data.filter(course => course.status === 'active')
  } catch (err) {
    console.error('Failed to load courses:', err)
    error.value = 'Failed to load available courses'
  }
}

async function handleSubmit() {
  try {
    loading.value = true
    error.value = null

    const sessionData = {
      ...form.value,
      instructor: auth.user.username
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/training/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(sessionData)
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Failed to create session')
    }

    const newSession = await response.json()
    emit('created', newSession)
  } catch (err) {
    console.error('Failed to create session:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCourses()
})
</script> 