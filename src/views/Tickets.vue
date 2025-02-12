<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-military text-white">SUPPORT TICKETS</h1>
      <button 
        @click="showCreateModal = true"
        class="bg-navy-gold/10 border border-navy-gold/30 hover:bg-navy-gold/20 
               text-navy-gold px-4 py-2 text-sm font-military transition-all"
      >
        CREATE_TICKET
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="ticketStore.loading" class="text-center py-12">
      <div class="animate-spin h-8 w-8 border-2 border-navy-gold border-t-transparent rounded-full mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="ticketStore.error" class="bg-red-900/50 border border-red-500/50 p-4 rounded-lg">
      <p class="text-red-200 font-mono">{{ ticketStore.error }}</p>
    </div>

    <!-- Tickets List -->
    <div v-else class="space-y-4">
      <div v-for="ticket in ticketStore.tickets" 
        :key="ticket.id"
        class="bg-navy-800/50 border border-navy-gold/20 p-6 rounded-lg"
      >
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center space-x-3">
              <h3 class="text-lg font-military text-white">{{ ticket.title }}</h3>
              <span 
                :class="{
                  'bg-green-900/50 text-green-200': ticket.status === 'RESOLVED',
                  'bg-yellow-900/50 text-yellow-200': ticket.status === 'IN_PROGRESS',
                  'bg-red-900/50 text-red-200': ticket.status === 'OPEN'
                }"
                class="px-2 py-0.5 rounded text-xs font-mono"
              >
                {{ ticket.status }}
              </span>
            </div>
            <p class="text-gray-400 font-mono text-sm mt-2">{{ ticket.description }}</p>
            
            <div class="flex items-center space-x-4 mt-4 text-xs font-mono">
              <span class="text-navy-gold">Created by: {{ ticket.creator_name }}</span>
              <span class="text-gray-500">|</span>
              <span class="text-gray-500">
                {{ new Date(ticket.created_at).toLocaleString() }}
              </span>
              <span v-if="ticket.assignee_name" class="text-gray-400">
                Assigned to: {{ ticket.assignee_name }}
              </span>
            </div>
          </div>

          <div class="flex space-x-2">
            <button 
              v-if="ticket.status !== 'RESOLVED' && (authStore.isAdmin || ticket.creator_id === authStore.user.id)"
              @click="updateTicketStatus(ticket.id, 'RESOLVED')"
              class="text-green-500 hover:text-green-400"
            >
              <CheckIcon class="h-5 w-5" />
            </button>
            <button 
              v-if="authStore.isAdmin || ticket.creator_id === authStore.user.id"
              @click="deleteTicket(ticket.id)"
              class="text-red-500 hover:text-red-400"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Comments Section -->
        <div v-if="ticket.comment_count > 0" class="mt-4 pt-4 border-t border-navy-gold/20">
          <div class="text-sm font-mono text-gray-400">
            {{ ticket.comment_count }} comment{{ ticket.comment_count > 1 ? 's' : '' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <Modal v-if="showCreateModal" @close="showCreateModal = false">
      <template #title>CREATE SUPPORT TICKET</template>
      <template #content>
        <form @submit.prevent="createTicket" class="space-y-4">
          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">TITLE</label>
            <input 
              v-model="newTicket.title"
              type="text"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">DESCRIPTION</label>
            <textarea 
              v-model="newTicket.description"
              rows="4"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">PRIORITY</label>
            <select 
              v-model="newTicket.priority"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
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
              :disabled="ticketStore.loading"
            >
              {{ ticketStore.loading ? 'CREATING...' : 'CREATE' }}
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
import { useTicketStore } from '@/stores/tickets'
import { CheckIcon, TrashIcon } from '@heroicons/vue/24/outline'
import Modal from '@/components/Modal.vue'

const authStore = useAuthStore()
const ticketStore = useTicketStore()

const showCreateModal = ref(false)
const newTicket = ref({
  title: '',
  description: '',
  priority: 'MEDIUM'
})

onMounted(() => {
  ticketStore.fetchTickets()
})

async function createTicket() {
  try {
    await ticketStore.createTicket(newTicket.value)
    showCreateModal.value = false
    newTicket.value = { title: '', description: '', priority: 'MEDIUM' }
  } catch (error) {
    console.error('Failed to create ticket:', error)
  }
}

async function updateTicketStatus(id, status) {
  try {
    await ticketStore.updateTicket(id, { status })
  } catch (error) {
    console.error('Failed to update ticket:', error)
  }
}

async function deleteTicket(id) {
  if (!confirm('Are you sure you want to delete this ticket?')) return
  try {
    await ticketStore.deleteTicket(id)
  } catch (error) {
    console.error('Failed to delete ticket:', error)
  }
}
</script> 