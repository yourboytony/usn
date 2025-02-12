<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>

    <template v-else>
      <div 
        v-for="event in events" 
        :key="event.id"
        class="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
        @click="$emit('click', event)"
      >
        <div class="p-4">
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-3">
              <div 
                class="w-12 h-12 rounded-lg flex items-center justify-center"
                :class="{
                  'bg-green-900 text-green-200': event.type === 'training',
                  'bg-blue-900 text-blue-200': event.type === 'patrol',
                  'bg-purple-900 text-purple-200': event.type === 'meeting',
                  'bg-yellow-900 text-yellow-200': event.type === 'ceremony',
                  'bg-gray-700 text-gray-300': event.type === 'other'
                }"
              >
                <svg v-if="event.type === 'training'" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                </svg>
                <svg v-else-if="event.type === 'patrol'" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                <svg v-else-if="event.type === 'meeting'" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
              </div>
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
            </div>

            <div class="flex items-center space-x-4">
              <div v-if="event.mandatory" class="px-2 py-1 text-xs rounded-full bg-red-900 text-red-200">
                Mandatory
              </div>
              <button
                v-if="canManageEvents"
                @click.stop="$emit('edit', event)"
                class="p-1 text-gray-400 hover:text-gray-300"
              >
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                v-if="canManageEvents"
                @click.stop="handleDelete(event)"
                class="p-1 text-gray-400 hover:text-gray-300"
              >
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <p class="mt-2 text-sm text-gray-400">
            {{ event.description }}
          </p>

          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex -space-x-2">
                <img
                  v-for="attendee in event.attendees?.slice(0, 3)"
                  :key="attendee.id"
                  :src="attendee.avatarUrl"
                  :alt="attendee.displayName"
                  class="h-6 w-6 rounded-full ring-2 ring-gray-800"
                  :title="attendee.displayName"
                >
                <div
                  v-if="event.attendees?.length > 3"
                  class="flex items-center justify-center h-6 w-6 rounded-full bg-gray-700 ring-2 ring-gray-800"
                  :title="`${event.attendees.length - 3} more attendees`"
                >
                  <span class="text-xs text-gray-300">+{{ event.attendees.length - 3 }}</span>
                </div>
              </div>
              <span class="text-sm text-gray-400">
                {{ event.attendees?.length || 0 }} attending
              </span>
            </div>

            <button
              v-if="canAttendEvent(event)"
              @click.stop="handleAttendance(event)"
              :class="{
                'bg-blue-600 hover:bg-blue-700': !isAttending(event),
                'bg-red-600 hover:bg-red-700': isAttending(event)
              }"
              class="px-4 py-2 rounded-md text-sm font-medium text-white"
            >
              {{ isAttending(event) ? 'Cancel Registration' : 'Register' }}
            </button>
          </div>
        </div>
      </div>

      <div 
        v-if="!events.length" 
        class="text-center py-12 text-gray-400"
      >
        No events to display
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDistance, format } from 'date-fns'
import { useAuthStore } from '@/stores/auth'
import { getRankById } from '@/constants/ranks'

const props = defineProps({
  events: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'edit', 
  'delete', 
  'register', 
  'unregister',
  'click'
])

const authStore = useAuthStore()

const canManageEvents = computed(() => {
  return authStore.user?.permissions.includes('manage_events')
})

function formatDate(date) {
  return format(new Date(date), 'MMM d, yyyy h:mm a')
}

function formatDuration(hours) {
  return hours === 1 ? '1 hour' : `${hours} hours`
}

function formatRank(rankId) {
  const rank = getRankById(rankId)
  return rank?.abbr || rankId
}

function canAttendEvent(event) {
  // This uses the getter from the event store
  return true // TODO: Implement actual check
}

function isAttending(event) {
  return event.attendees?.some(a => a.id === authStore.user?.id) || false
}

function handleDelete(event) {
  event.stopPropagation()
  if (!confirm(`Are you sure you want to delete the event "${event.title}"?`)) {
    return
  }
  emit('delete', event.id)
}

function handleAttendance(event) {
  event.stopPropagation()
  if (isAttending(event)) {
    emit('unregister', event.id)
  } else {
    emit('register', event.id)
  }
}
</script> 