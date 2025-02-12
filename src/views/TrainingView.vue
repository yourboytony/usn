<template>
  <div class="space-y-6">
    <header class="flex justify-between items-center bg-navy-800 p-6 rounded-lg">
      <h1 class="text-2xl font-military text-white">
        TRAINING CENTER
      </h1>
      <div class="flex space-x-4">
        <button
          v-if="isInstructor"
          @click="showCreateSessionModal = true"
          class="px-4 py-2 bg-navy-600 text-white font-military rounded hover:bg-navy-500"
        >
          CREATE SESSION
        </button>
        <button
          v-if="isAdmin"
          @click="showCreateCourseModal = true"
          class="px-4 py-2 bg-navy-600 text-white font-military rounded hover:bg-navy-500"
        >
          CREATE COURSE
        </button>
      </div>
    </header>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>

    <div v-else class="grid grid-cols-1 gap-6">
      <!-- Available Courses -->
      <div class="bg-navy-800 p-6 rounded-lg">
        <h2 class="text-xl font-military text-navy-gold mb-4">AVAILABLE COURSES</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="course in availableCourses" :key="course.id"
            class="bg-navy-700 p-4 rounded-lg hover:bg-navy-600/50 transition-colors">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-military text-white">{{ course.name }}</h3>
              <span class="px-2 py-1 text-xs font-military rounded"
                :class="getStatusClass(course.status)">
                {{ course.status.toUpperCase() }}
              </span>
            </div>
            <p class="text-sm text-navy-300 mb-4">{{ course.description }}</p>
            <div class="grid grid-cols-2 gap-2 text-sm text-navy-400">
              <div>Duration: {{ course.duration }}</div>
              <div>Instructor: {{ course.instructor || 'Unassigned' }}</div>
            </div>
            <div class="mt-4 flex justify-end">
              <button
                v-if="canEnroll(course)"
                @click="enrollInCourse(course)"
                class="px-3 py-1 bg-navy-500 text-white font-military rounded hover:bg-navy-400"
              >
                ENROLL
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Sessions -->
      <div class="bg-navy-800 p-6 rounded-lg">
        <h2 class="text-xl font-military text-navy-gold mb-4">ACTIVE SESSIONS</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="session in activeSessions" :key="session.id"
            class="bg-navy-700 p-4 rounded-lg">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-military text-white">{{ session.courseName }}</h3>
              <span class="text-sm text-navy-300">
                {{ formatDate(session.startDate) }}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm text-navy-400">
              <div>Instructor: {{ session.instructor }}</div>
              <div>Participants: {{ session.participants.length }}/{{ session.maxParticipants }}</div>
            </div>
            <div class="mt-4 flex justify-end space-x-2">
              <button
                v-if="isInstructor && session.instructor === auth.user.username"
                @click="manageSession(session)"
                class="px-3 py-1 bg-navy-500 text-white font-military rounded hover:bg-navy-400"
              >
                MANAGE
              </button>
              <button
                v-if="canJoinSession(session)"
                @click="joinSession(session)"
                class="px-3 py-1 bg-navy-500 text-white font-military rounded hover:bg-navy-400"
              >
                JOIN
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- My Training -->
      <div class="bg-navy-800 p-6 rounded-lg">
        <h2 class="text-xl font-military text-navy-gold mb-4">MY TRAINING</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="enrollment in myEnrollments" :key="enrollment.id"
            class="bg-navy-700 p-4 rounded-lg">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-military text-white">{{ enrollment.courseName }}</h3>
              <span class="px-2 py-1 text-xs font-military rounded"
                :class="getProgressClass(enrollment.progress)">
                {{ enrollment.progress.toUpperCase() }}
              </span>
            </div>
            <div class="mt-4">
              <div class="w-full bg-navy-600 rounded-full h-2">
                <div class="bg-navy-gold h-2 rounded-full"
                  :style="{ width: `${enrollment.completionPercentage}%` }">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CreateSessionModal
      v-if="showCreateSessionModal"
      @close="showCreateSessionModal = false"
      @created="handleSessionCreated"
    />
    <CreateCourseModal
      v-if="showCreateCourseModal"
      @close="showCreateCourseModal = false"
      @created="handleCourseCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { format } from 'date-fns'
import CreateSessionModal from '@/components/training/CreateSessionModal.vue'
import CreateCourseModal from '@/components/training/CreateCourseModal.vue'

const auth = useAuthStore()
const loading = ref(true)
const error = ref(null)
const courses = ref([])
const sessions = ref([])
const enrollments = ref([])
const showCreateSessionModal = ref(false)
const showCreateCourseModal = ref(false)

const isAdmin = computed(() => auth.isAdmin)
const isInstructor = computed(() => {
  const instructorRanks = ['E-7', 'E-8', 'E-9', 'O-1', 'O-2', 'O-3', 'O-4', 'O-5', 'O-6', 'O-7', 'O-8', 'O-9', 'O-10', 'FADM', 'CNO', 'SECNAV', 'CIC']
  return instructorRanks.includes(auth.user?.rank)
})

const availableCourses = computed(() => {
  return courses.value.filter(course => course.status === 'active')
})

const activeSessions = computed(() => {
  return sessions.value.filter(session => session.status === 'active')
})

const myEnrollments = computed(() => {
  return enrollments.value.filter(e => e.username === auth.user?.username)
})

function getStatusClass(status) {
  return {
    'active': 'bg-green-900/50 text-green-400',
    'pending': 'bg-yellow-900/50 text-yellow-400',
    'completed': 'bg-blue-900/50 text-blue-400',
    'cancelled': 'bg-red-900/50 text-red-400'
  }[status] || 'bg-navy-600 text-navy-300'
}

function getProgressClass(progress) {
  return {
    'in-progress': 'bg-blue-900/50 text-blue-400',
    'completed': 'bg-green-900/50 text-green-400',
    'failed': 'bg-red-900/50 text-red-400'
  }[progress] || 'bg-navy-600 text-navy-300'
}

function formatDate(date) {
  return format(new Date(date), 'MMM dd, yyyy')
}

function canEnroll(course) {
  // Check if user meets requirements and isn't already enrolled
  return true // TODO: Implement proper checks
}

function canJoinSession(session) {
  return session.participants.length < session.maxParticipants &&
    !session.participants.includes(auth.user?.username)
}

async function fetchTrainingData() {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/training`, {
      credentials: 'include'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch training data')
    }
    
    const data = await response.json()
    courses.value = data.courses
    sessions.value = data.sessions
    enrollments.value = data.enrollments
  } catch (err) {
    console.error('Training fetch error:', err)
    error.value = 'Failed to load training data'
  } finally {
    loading.value = false
  }
}

async function enrollInCourse(course) {
  // TODO: Implement enrollment
}

async function joinSession(session) {
  // TODO: Implement session joining
}

async function manageSession(session) {
  // TODO: Implement session management
}

async function handleSessionCreated(session) {
  showCreateSessionModal.value = false
  await fetchTrainingData()
}

async function handleCourseCreated(course) {
  showCreateCourseModal.value = false
  await fetchTrainingData()
}

onMounted(() => {
  fetchTrainingData()
})
</script> 