<template>
  <div class="bg-military-400 rounded border border-military-300 overflow-hidden">
    <div class="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-bold tracking-wider text-military-accent uppercase">{{ title }}</p>
          <p class="mt-1 text-2xl font-military text-white">{{ value }}</p>
        </div>
        <div :class="iconBackground" class="rounded p-3 bg-military-200">
          <component 
            :is="icon" 
            class="h-6 w-6 text-white"
          />
        </div>
      </div>
      
      <div v-if="trend" class="mt-4 flex items-center">
        <component 
          :is="trendDirection === 'up' ? 'ArrowUpIcon' : 'ArrowDownIcon'"
          class="h-4 w-4 mr-1"
          :class="trendDirection === 'up' ? 'text-green-500' : 'text-red-500'"
        />
        <span 
          class="text-sm font-mono"
          :class="trendDirection === 'up' ? 'text-green-500' : 'text-red-500'"
        >
          {{ trend }}
        </span>
      </div>
    </div>
    <div class="h-1 bg-military-accent"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  UserGroupIcon as UsersIcon, 
  CalendarIcon, 
  TicketIcon, 
  SignalIcon as StatusOnlineIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  trend: {
    type: String,
    default: null
  },
  trendDirection: {
    type: String,
    default: 'up',
    validator: value => ['up', 'down'].includes(value)
  }
})

const iconBackground = computed(() => {
  switch (props.icon) {
    case 'UsersIcon': return 'bg-blue-600'
    case 'CalendarIcon': return 'bg-green-600'
    case 'TicketIcon': return 'bg-yellow-600'
    case 'StatusOnlineIcon': return 'bg-purple-600'
    default: return 'bg-gray-600'
  }
})
</script> 