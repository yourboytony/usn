<template>
  <div class="space-y-6">
    <header class="flex justify-between items-center bg-navy-800 p-6 rounded-lg">
      <h1 class="text-2xl font-military text-white">
        ANNOUNCEMENTS
      </h1>
      <button
        v-if="isAdmin"
        @click="showCreateModal = true"
        class="px-4 py-2 bg-navy-600 text-white font-military rounded hover:bg-navy-500"
      >
        CREATE ANNOUNCEMENT
      </button>
    </header>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>

    <div v-else-if="error" class="bg-red-900/50 border border-red-500 rounded-lg p-6 text-white">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <div v-for="announcement in announcements" :key="announcement.id"
        class="bg-navy-800 p-6 rounded-lg hover:bg-navy-700/50 transition-colors">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-xl font-military text-white">{{ announcement.title }}</h2>
            <p class="text-sm text-navy-300">
              By {{ announcement.author }} • {{ formatDate(announcement.createdAt) }}
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <span :class="getPriorityClass(announcement.priority)" 
              class="px-2 py-1 text-xs font-military rounded">
              {{ announcement.priority }}
            </span>
            <span :class="getTypeClass(announcement.type)"
              class="px-2 py-1 text-xs font-military rounded">
              {{ announcement.type }}
            </span>
          </div>
        </div>
        
        <div class="prose prose-invert max-w-none">
          {{ announcement.content }}
        </div>

        <div v-if="isAdmin" class="flex justify-end mt-4 space-x-2">
          <button
            @click="editAnnouncement(announcement)"
            class="px-3 py-1 text-navy-300 hover:text-white font-military"
          >
            EDIT
          </button>
          <button
            @click="deleteAnnouncement(announcement.id)"
            class="px-3 py-1 text-red-400 hover:text-red-300 font-military"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <AnnouncementModal
      v-if="showCreateModal"
      :announcement="selectedAnnouncement"
      @close="closeModal"
      @created="handleCreated"
      @updated="handleUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { format } from 'date-fns'
import AnnouncementModal from '@/components/announcements/AnnouncementModal.vue'

const auth = useAuthStore()
const loading = ref(true)
const error = ref(null)
const announcements = ref([])
const showCreateModal = ref(false)
const selectedAnnouncement = ref(null)

const isAdmin = computed(() => auth.isAdmin)

function getPriorityClass(priority) {
  return {
    'HIGH': 'bg-red-900/50 text-red-400',
    'MEDIUM': 'bg-yellow-900/50 text-yellow-400',
    'LOW': 'bg-blue-900/50 text-blue-400'
  }[priority] || 'bg-navy-600 text-navy-300'
}

function getTypeClass(type) {
  return {
    'SYSTEM': 'bg-purple-900/50 text-purple-400',
    'EVENT': 'bg-green-900/50 text-green-400',
    'UPDATE': 'bg-blue-900/50 text-blue-400'
  }[type] || 'bg-navy-600 text-navy-300'
}

function formatDate(date) {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

async function fetchAnnouncements() {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/announcements`, {
      credentials: 'include'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch announcements')
    }
    
    announcements.value = await response.json()
  } catch (err) {
    console.error('Announcements fetch error:', err)
    error.value = 'Failed to load announcements'
  } finally {
    loading.value = false
  }
}

function editAnnouncement(announcement) {
  selectedAnnouncement.value = announcement
  showCreateModal.value = true
}

async function deleteAnnouncement(id) {
  if (!confirm('Are you sure you want to delete this announcement?')) return

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/announcements/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to delete announcement')
    }

    await fetchAnnouncements()
  } catch (err) {
    console.error('Delete error:', err)
    error.value = 'Failed to delete announcement'
  }
}

function closeModal() {
  showCreateModal.value = false
  selectedAnnouncement.value = null
}

async function handleCreated() {
  closeModal()
  await fetchAnnouncements()
}

async function handleUpdated() {
  closeModal()
  await fetchAnnouncements()
}

onMounted(() => {
  fetchAnnouncements()
})
</script> 