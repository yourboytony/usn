<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-military text-white">ANNOUNCEMENTS</h1>
      <button 
        v-if="authStore.isAdmin"
        @click="showCreateModal = true"
        class="bg-navy-gold/10 border border-navy-gold/30 hover:bg-navy-gold/20 
               text-navy-gold px-4 py-2 text-sm font-military transition-all"
      >
        CREATE_ANNOUNCEMENT
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="announcementStore.loading" class="text-center py-12">
      <div class="animate-spin h-8 w-8 border-2 border-navy-gold border-t-transparent rounded-full mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="announcementStore.error" class="bg-red-900/50 border border-red-500/50 p-4 rounded-lg">
      <p class="text-red-200 font-mono">{{ announcementStore.error }}</p>
    </div>

    <!-- Announcements List -->
    <div v-else class="space-y-4">
      <div v-for="announcement in announcementStore.announcements" 
        :key="announcement.id"
        class="bg-navy-800/50 border border-navy-gold/20 p-6 rounded-lg hover:bg-navy-800/70 transition-all"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-military text-white mb-1">{{ announcement.title }}</h3>
            <p class="text-gray-400 font-mono text-sm mb-4">{{ announcement.content }}</p>
            <div class="flex items-center space-x-4 text-xs font-mono">
              <span class="text-navy-gold">{{ announcement.author_name }}</span>
              <span class="text-gray-500">|</span>
              <span class="text-gray-500">
                {{ new Date(announcement.created_at).toLocaleString() }}
              </span>
              <span 
                v-if="announcement.importance !== 'NORMAL'"
                class="bg-red-900/50 text-red-200 px-2 py-0.5 rounded"
              >
                {{ announcement.importance }}
              </span>
            </div>
          </div>
          
          <button 
            v-if="authStore.isAdmin"
            @click="deleteAnnouncement(announcement.id)"
            class="text-red-500 hover:text-red-400"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <Modal v-if="showCreateModal" @close="showCreateModal = false">
      <template #title>CREATE ANNOUNCEMENT</template>
      <template #content>
        <form @submit.prevent="createAnnouncement" class="space-y-4">
          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">TITLE</label>
            <input 
              v-model="newAnnouncement.title"
              type="text"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">CONTENT</label>
            <textarea 
              v-model="newAnnouncement.content"
              rows="4"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">IMPORTANCE</label>
            <select 
              v-model="newAnnouncement.importance"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
            >
              <option value="NORMAL">NORMAL</option>
              <option value="URGENT">URGENT</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div class="flex justify-end space-x-4">
            <button 
              type="button"
              @click="showCreateModal = false"
              class="text-gray-400 hover:text-white font-military"
            >
              CANCEL
            </button>
            <button 
              type="submit"
              class="bg-navy-gold/10 border border-navy-gold/30 hover:bg-navy-gold/20 
                     text-navy-gold px-4 py-2 font-military"
              :disabled="announcementStore.loading"
            >
              {{ announcementStore.loading ? 'CREATING...' : 'CREATE' }}
            </button>
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAnnouncementStore } from '@/stores/announcements'
import { TrashIcon } from '@heroicons/vue/24/outline'
import Modal from '@/components/Modal.vue'

const authStore = useAuthStore()
const announcementStore = useAnnouncementStore()

const showCreateModal = ref(false)
const newAnnouncement = ref({
  title: '',
  content: '',
  importance: 'NORMAL'
})

onMounted(() => {
  announcementStore.fetchAnnouncements()
})

async function createAnnouncement() {
  try {
    await announcementStore.createAnnouncement(newAnnouncement.value)
    showCreateModal.value = false
    newAnnouncement.value = { title: '', content: '', importance: 'NORMAL' }
  } catch (error) {
    console.error('Failed to create announcement:', error)
  }
}

async function deleteAnnouncement(id) {
  if (!confirm('Are you sure you want to delete this announcement?')) return
  try {
    await announcementStore.deleteAnnouncement(id)
  } catch (error) {
    console.error('Failed to delete announcement:', error)
  }
}
</script> 