<template>
  <div class="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
    <div class="bg-navy-800 rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-military text-white mb-6">CREATE NEW COURSE</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Course Name -->
        <div>
          <label class="block text-sm font-military text-navy-300 mb-1">COURSE NAME</label>
          <input 
            v-model="form.name"
            type="text"
            class="w-full bg-navy-700 border border-navy-600 rounded px-3 py-2 text-white focus:outline-none focus:border-navy-gold"
            required
          >
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-military text-navy-300 mb-1">DESCRIPTION</label>
          <textarea 
            v-model="form.description"
            rows="3"
            class="w-full bg-navy-700 border border-navy-600 rounded px-3 py-2 text-white focus:outline-none focus:border-navy-gold"
            required
          ></textarea>
        </div>

        <!-- Duration -->
        <div>
          <label class="block text-sm font-military text-navy-300 mb-1">DURATION</label>
          <input 
            v-model="form.duration"
            type="text"
            placeholder="e.g. 2 weeks"
            class="w-full bg-navy-700 border border-navy-600 rounded px-3 py-2 text-white focus:outline-none focus:border-navy-gold"
            required
          >
        </div>

        <!-- Requirements -->
        <div>
          <label class="block text-sm font-military text-navy-300 mb-1">REQUIREMENTS</label>
          <select 
            v-model="form.requirements"
            multiple
            class="w-full bg-navy-700 border border-navy-600 rounded px-3 py-2 text-white focus:outline-none focus:border-navy-gold"
          >
            <option v-for="course in availableCourses" :key="course.id" :value="course.id">
              {{ course.name }}
            </option>
          </select>
          <p class="text-xs text-navy-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
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
            {{ loading ? 'CREATING...' : 'CREATE COURSE' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['close', 'created'])

const loading = ref(false)
const error = ref(null)
const availableCourses = ref([])

const form = ref({
  name: '',
  description: '',
  duration: '',
  requirements: [],
  maxParticipants: 20
})

async function loadCourses() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/training/courses`, {
      credentials: 'include'
    })
    const data = await response.json()
    availableCourses.value = data
  } catch (err) {
    console.error('Failed to load courses:', err)
    error.value = 'Failed to load available courses'
  }
}

async function handleSubmit() {
  try {
    loading.value = true
    error.value = null

    const courseData = {
      ...form.value,
      status: 'active'
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/training/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(courseData)
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Failed to create course')
    }

    const newCourse = await response.json()
    emit('created', newCourse)
  } catch (err) {
    console.error('Failed to create course:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCourses()
})
</script> 