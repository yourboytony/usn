<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-navy-500 rounded-lg shadow-xl w-full max-w-2xl mx-4">
      <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-military text-white">VIEW TICKET</h2>
          <button @click="emit('close')" class="text-gray-400 hover:text-gray-300">
            <span class="sr-only">Close</span>
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <div v-if="loading" class="text-center py-4">
          Loading...
        </div>

        <div v-else-if="error" class="text-red-400 text-center py-4">
          {{ error }}
        </div>

        <div v-else-if="ticket" class="space-y-6">
          <!-- Ticket Details -->
          <div>
            <h3 class="text-lg font-medium text-white">{{ ticket.title }}</h3>
            <div class="mt-2 space-y-2">
              <p class="text-gray-300">{{ ticket.description }}</p>
              <div class="flex space-x-4 text-sm text-gray-400">
                <span>Department: {{ ticket.department }}</span>
                <span>Priority: {{ ticket.priority }}</span>
                <span>Status: {{ ticket.status }}</span>
              </div>
            </div>
          </div>

          <!-- Assignees Section -->
          <div class="border-t border-gray-700 pt-4">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-md font-medium text-white">Assigned Members</h4>
              <button
                v-if="canManageAssignees"
                @click="showAssignModal = true"
                class="text-sm text-blue-400 hover:text-blue-300"
              >
                Assign Member
              </button>
            </div>
            
            <div class="space-y-2">
              <div 
                v-for="assignee in ticket.assignees" 
                :key="assignee.id"
                class="flex justify-between items-center bg-navy-600 p-2 rounded"
              >
                <div class="flex items-center space-x-2">
                  <img 
                    :src="assignee.avatarUrl" 
                    :alt="assignee.username"
                    class="h-6 w-6 rounded-full"
                  >
                  <span class="text-gray-200">{{ assignee.username }}</span>
                </div>
                <button
                  v-if="canManageAssignees"
                  @click="removeAssignee(assignee.id)"
                  class="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- Status Controls -->
          <div v-if="canUpdateStatus" class="border-t border-gray-700 pt-4">
            <label class="block text-sm font-medium text-gray-200 mb-2">Update Status</label>
            <select
              v-model="ticketStatus"
              class="w-full px-3 py-2 bg-navy-600 border border-navy-400 rounded-md text-white"
              @change="updateStatus"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <!-- Comments Section -->
          <div class="border-t border-gray-700 pt-4">
            <h4 class="text-md font-medium text-white mb-4">Comments</h4>
            <div class="space-y-4">
              <div v-for="comment in ticket.comments" :key="comment.id" class="bg-navy-600 p-3 rounded">
                <div class="flex justify-between text-sm text-gray-400">
                  <span>{{ comment.createdBy.username }}</span>
                  <span>{{ formatDate(comment.createdAt) }}</span>
                </div>
                <p class="mt-2 text-gray-300">{{ comment.content }}</p>
              </div>
            </div>

            <!-- Add Comment -->
            <div class="mt-4">
              <textarea
                v-model="newComment"
                rows="3"
                class="w-full px-3 py-2 bg-navy-600 border border-navy-400 rounded-md text-white"
                placeholder="Add a comment..."
              ></textarea>
              <button
                @click="addComment"
                :disabled="!newComment.trim() || commentLoading"
                class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
              >
                {{ commentLoading ? 'Posting...' : 'Post Comment' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assign Member Modal -->
    <AssignMemberModal
      v-if="showAssignModal"
      :ticket="ticket"
      @close="showAssignModal = false"
      @assign="handleAssign"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTicketsStore } from '@/stores/tickets'
import AssignMemberModal from './AssignMemberModal.vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { formatDistance } from 'date-fns'

const props = defineProps({
  ticket: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])

const authStore = useAuthStore()
const ticketsStore = useTicketsStore()

const loading = ref(false)
const error = ref(null)
const ticketStatus = ref(props.ticket.status)
const newComment = ref('')
const commentLoading = ref(false)
const showAssignModal = ref(false)

const canUpdateStatus = computed(() => {
  return ['CIC', 'CJCS', 'CNO'].includes(authStore.user?.rank) ||
         props.ticket.createdBy.username === authStore.user?.username
})

const canManageAssignees = computed(() => {
  return ['CIC', 'CJCS', 'CNO'].includes(authStore.user?.rank) ||
         props.ticket.createdBy.username === authStore.user?.username
})

function formatDate(date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

async function updateStatus() {
  try {
    const updatedTicket = await ticketsStore.updateTicket(props.ticket.id, {
      status: ticketStatus.value
    })
    emit('update', updatedTicket)
  } catch (error) {
    console.error('Failed to update status:', error)
  }
}

async function addComment() {
  if (!newComment.value.trim()) return

  commentLoading.value = true
  try {
    const updatedTicket = await ticketsStore.updateTicket(props.ticket.id, {
      comment: newComment.value
    })
    emit('update', updatedTicket)
    newComment.value = ''
  } catch (error) {
    console.error('Failed to add comment:', error)
  } finally {
    commentLoading.value = false
  }
}

async function handleAssign(userId) {
  try {
    const updatedTicket = await ticketsStore.updateTicket(props.ticket.id, {
      addAssignee: userId
    })
    showAssignModal.value = false
    emit('update', updatedTicket)
  } catch (error) {
    console.error('Failed to assign member:', error)
  }
}

async function removeAssignee(userId) {
  if (!confirm('Are you sure you want to remove this assignee?')) return
  
  try {
    const updatedTicket = await ticketsStore.updateTicket(props.ticket.id, {
      removeAssignee: userId
    })
    emit('update', updatedTicket)
  } catch (error) {
    console.error('Failed to remove assignee:', error)
  }
}
</script> 