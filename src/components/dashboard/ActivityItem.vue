<template>
  <div class="flex items-start space-x-3">
    <div class="flex-shrink-0">
      <img 
        :src="activity.user.avatar" 
        :alt="activity.user.name"
        class="h-8 w-8 rounded-full"
      >
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm text-white">
        <span class="font-medium">{{ activity.user.name }}</span>
        {{ activity.message }}
      </p>
      <p class="text-xs text-gray-400">
        {{ formatDate(activity.date) }}
      </p>
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