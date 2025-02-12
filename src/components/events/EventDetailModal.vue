<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full p-6">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h3 class="text-lg font-medium text-gray-100">
            {{ event.title }}
          </h3>
          <div class="mt-1 flex items-center space-x-2 text-sm text-gray-400">
            <span>{{ formatDate(event.startTime) }}</span>
            <span>•</span>
            <span>{{ formatDuration(event.duration) }}</span>
            <span v-if="event.minRank">•</span>
            <span v-if="event.minRank" class="text-blue-400">
              Min. Rank: {{ formatRank(event.minRank) }}
            </span>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-300"
        >
          <span class="sr-only">Close</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-gray-700 rounded-lg p-4">
            <div class="prose prose-invert max-w-none">
              {{ event.description }}
            </div>
          </div>

          <!-- Attendees -->
          <div>
            <h4 class="text-sm font-medium text-gray-200 mb-3">Attendees</h4>
            <div class="bg-gray-700 rounded-lg divide-y divide-gray-600">
              <div 
                v-for="attendee in event.attendees"
                :key="attendee.id"
                class="p-3 flex items-center justify-between"
              >
                <div class="flex items-center space-x-3">
                  <img 
                    :src="attendee.avatarUrl" 
                    :alt="attendee.displayName"
                    class="h-8 w-8 rounded-full"
                  >
                  <div>
                    <p class="text-sm font-medium text-gray-200">
                      {{ attendee.displayName }}
                    </p>
                    <p class="text-xs text-gray-400">
                      {{ attendee.rank }}
                    </p>
                  </div>
                </div>
                <button
                  v-if="canManageEvents"
                  @click="handleRemoveAttendee(attendee)"
                  class="text-gray-400 hover:text-gray-300"
                >
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Event Info -->
          <div class="bg-gray-700 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-200 mb-3">Event Details</h4>
            <dl class="space-y-2 text-sm">
              <div>
                <dt class="text-gray-400">Type</dt>
                <dd class="text-gray-200 capitalize">{{ event.type }}</dd>
              </div>
              <div>
                <dt class="text-gray-400">Departments</dt>
                <dd class="text-gray-200">
                  {{ formatDepartments(event.departments) }}
                </dd>
              </div>
              <div v-if="event.requiresApproval">
                <dt class="text-gray-400">Registration</dt>
                <dd class="text-yellow-400">Requires Approval</dd>
              </div>
              <div v-if="event.mandatory">
                <dt class="text-gray-400">Attendance</dt>
                <dd class="text-red-400">Mandatory</dd>
              </div>
            </dl>
          </div>

          <!-- Actions -->
          <div class="space-y-3">
            <button
              v-if="canManageEvents"
              @click="$emit('edit')"
              class="w-full px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-700"
            >
              Edit Event
            </button>
            <button
              v-if="canManageEvents"
              @click="handleDelete"
              class="w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Delete Event
            </button>
            <button
              v-if="canAttendEvent"
              @click="handleAttendance"
              :class="{
                'bg-blue-600 hover:bg-blue-700': !isAttending,
                'bg-red-600 hover:bg-red-700': isAttending
              }"
              class="w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white"
            >
              {{ isAttending ? 'Cancel Registration' : 'Register' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/auth'
import { useEventStore } from '@/stores/events'
import { DEPARTMENTS, getRankById } from '@/constants/ranks'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'edit', 'delete', 'register', 'unregister', 'remove-attendee'])

const authStore = useAuthStore()
const eventStore = useEventStore()

const canManageEvents = computed(() => {
  return authStore.user?.permissions.includes('manage_events')
})

const canAttendEvent = computed(() => {
  return eventStore.canAttendEvent(props.event)
})

const isAttending = computed(() => {
  return props.event.attendees?.some(a => a.id === authStore.user?.id) || false
})

function formatDate(date) {
  return format(new Date(date), 'MMMM d, yyyy h:mm a')
}

function formatDuration(hours) {
  return hours === 1 ? '1 hour' : `${hours} hours`
}

function formatRank(rankId) {
  const rank = getRankById(rankId)
  return rank ? `${rank.abbr} (${rank.name})` : rankId
}

function formatDepartments(departmentIds) {
  if (!departmentIds?.length) return 'All Departments'
  return departmentIds
    .map(id => DEPARTMENTS.find(d => d.id === id)?.name)
    .filter(Boolean)
    .join(', ')
}

function handleDelete() {
  if (!confirm(`Are you sure you want to delete the event "${props.event.title}"?`)) {
    return
  }
  emit('delete', props.event.id)
}

function handleAttendance() {
  if (isAttending.value) {
    emit('unregister', props.event.id)
  } else {
    emit('register', props.event.id)
  }
}

function handleRemoveAttendee(attendee) {
  if (!confirm(`Remove ${attendee.displayName} from this event?`)) {
    return
  }
  emit('remove-attendee', { eventId: props.event.id, attendeeId: attendee.id })
}
</script> 