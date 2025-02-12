<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-military text-white">EVENTS</h1>
      <button 
        v-if="authStore.isAdmin"
        @click="showCreateModal = true"
        class="bg-navy-gold/10 border border-navy-gold/30 hover:bg-navy-gold/20 
               text-navy-gold px-4 py-2 text-sm font-military transition-all"
      >
        CREATE_EVENT
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="eventStore.loading" class="text-center py-12">
      <div class="animate-spin h-8 w-8 border-2 border-navy-gold border-t-transparent rounded-full mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="eventStore.error" class="bg-red-900/50 border border-red-500/50 p-4 rounded-lg">
      <p class="text-red-200 font-mono">{{ eventStore.error }}</p>
    </div>

    <!-- Events Grid -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="event in eventStore.events" 
        :key="event.id"
        class="bg-navy-800/50 border border-navy-gold/20 rounded-lg overflow-hidden group"
      >
        <!-- Event Header -->
        <div class="p-4 bg-gradient-to-r from-navy-gold/10 to-transparent border-b border-navy-gold/20">
          <h3 class="text-lg font-military text-white">{{ event.title }}</h3>
          <p class="text-navy-gold text-sm font-mono mt-1">{{ event.type }}</p>
        </div>

        <!-- Event Details -->
        <div class="p-4 space-y-4">
          <p class="text-gray-400 font-mono text-sm">{{ event.description }}</p>
          
          <div class="space-y-2 text-xs font-mono">
            <div class="flex items-center space-x-2">
              <ClockIcon class="h-4 w-4 text-navy-gold" />
              <span class="text-gray-300">
                {{ new Date(event.start_time).toLocaleString() }}
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <UserIcon class="h-4 w-4 text-navy-gold" />
              <span class="text-gray-300">Host: {{ event.host_name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <UsersIcon class="h-4 w-4 text-navy-gold" />
              <span class="text-gray-300">
                Attendees: {{ event.attendee_count || 0 }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center pt-4 border-t border-navy-gold/20">
            <button 
              @click="toggleAttendance(event.id)"
              class="text-sm font-military text-navy-gold hover:text-white transition-colors"
            >
              {{ event.is_attending ? 'CANCEL' : 'ATTEND' }}
            </button>
            
            <button 
              v-if="authStore.isAdmin"
              @click="deleteEvent(event.id)"
              class="text-red-500 hover:text-red-400"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <Modal v-if="showCreateModal" @close="showCreateModal = false">
      <template #title>CREATE EVENT</template>
      <template #content>
        <form @submit.prevent="createEvent" class="space-y-4">
          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">TITLE</label>
            <input 
              v-model="newEvent.title"
              type="text"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">DESCRIPTION</label>
            <textarea 
              v-model="newEvent.description"
              rows="3"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-military text-navy-gold mb-1">START TIME</label>
              <input 
                v-model="newEvent.start_time"
                type="datetime-local"
                class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                       text-white font-mono focus:outline-none focus:border-navy-gold"
                required
              >
            </div>
            <div>
              <label class="block text-sm font-military text-navy-gold mb-1">END TIME</label>
              <input 
                v-model="newEvent.end_time"
                type="datetime-local"
                class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                       text-white font-mono focus:outline-none focus:border-navy-gold"
                required
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">TYPE</label>
            <select 
              v-model="newEvent.type"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            >
              <option value="TRAINING">TRAINING</option>
              <option value="OPERATION">OPERATION</option>
              <option value="BRIEFING">BRIEFING</option>
              <option value="OTHER">OTHER</option>
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
              :disabled="eventStore.loading"
            >
              {{ eventStore.loading ? 'CREATING...' : 'CREATE' }}
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
import { useEventStore } from '@/stores/events'
import { ClockIcon, UserIcon, UsersIcon, TrashIcon } from '@heroicons/vue/24/outline'
import Modal from '@/components/Modal.vue'

const authStore = useAuthStore()
const eventStore = useEventStore()

const showCreateModal = ref(false)
const newEvent = ref({
  title: '',
  description: '',
  start_time: '',
  end_time: '',
  type: 'TRAINING'
})

onMounted(() => {
  eventStore.fetchEvents()
})

async function createEvent() {
  try {
    await eventStore.createEvent(newEvent.value)
    showCreateModal.value = false
    newEvent.value = { title: '', description: '', start_time: '', end_time: '', type: 'TRAINING' }
  } catch (error) {
    console.error('Failed to create event:', error)
  }
}

async function toggleAttendance(eventId) {
  try {
    await eventStore.attendEvent(eventId)
  } catch (error) {
    console.error('Failed to update attendance:', error)
  }
}

async function deleteEvent(id) {
  if (!confirm('Are you sure you want to delete this event?')) return
  try {
    await eventStore.deleteEvent(id)
  } catch (error) {
    console.error('Failed to delete event:', error)
  }
}
</script> 