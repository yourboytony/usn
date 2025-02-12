<template>
  <div class="p-4">
    <div class="flex items-start space-x-3">
      <div 
        class="w-8 h-8 rounded-full flex items-center justify-center"
        :class="{
          'bg-blue-900 text-blue-200': activity.type === 'ticket',
          'bg-green-900 text-green-200': activity.type === 'training',
          'bg-purple-900 text-purple-200': activity.type === 'patrol',
          'bg-yellow-900 text-yellow-200': activity.type === 'event'
        }"
      >
        <svg v-if="activity.type === 'ticket'" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
        <svg v-else-if="activity.type === 'training'" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
        <svg v-else-if="activity.type === 'patrol'" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
        </svg>
        <svg v-else class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-200">
          {{ activity.title }}
        </p>
        <p class="mt-0.5 text-xs text-gray-400">
          {{ formatDate(activity.date) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDistance } from 'date-fns'

const props = defineProps({
  activity: {
    type: Object,
    required: true
  }
})

function formatDate(date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}
</script> 