<template>
  <div class="bg-navy-500 border border-navy-300 rounded-lg p-4 shadow-lg">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-lg font-military text-white">{{ event.title }}</h3>
        <p class="text-sm text-gray-300 mt-1">{{ formatDate(event.date) }}</p>
      </div>
      <div class="flex space-x-2">
        <span 
          :class="{
            'px-2 py-1 text-xs font-military rounded': true,
            'bg-green-900 text-green-100': event.type === 'TRAINING',
            'bg-blue-900 text-blue-100': event.type === 'OPERATION',
            'bg-purple-900 text-purple-100': event.type === 'CEREMONY',
            'bg-red-900 text-red-100': event.type === 'INSPECTION'
          }"
        >
          {{ event.type }}
        </span>
      </div>
    </div>
    <p class="text-gray-300 mt-2">{{ event.description }}</p>
    <div class="mt-4 flex justify-between items-center">
      <div class="text-sm text-gray-400">
        <span>Host: {{ event.host }}</span>
        <span class="mx-2">•</span>
        <span>Division: {{ event.division }}</span>
      </div>
      <button 
        @click="$emit('attend', event.id)"
        class="px-4 py-2 bg-navy-300 hover:bg-navy-200 text-white font-military rounded"
      >
        ATTEND
      </button>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}
</script> 