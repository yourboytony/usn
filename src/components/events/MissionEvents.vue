<template>
  <div class="bg-navy-500 border border-navy-300 rounded-lg p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-military text-white">MISSION EVENTS</h2>
      <div class="flex space-x-2">
        <button 
          v-for="filter in filters"
          :key="filter"
          @click="toggleFilter(filter)"
          :class="{
            'px-3 py-1 text-sm font-military rounded': true,
            'bg-navy-300 text-white': activeFilters.includes(filter),
            'bg-navy-400 text-gray-300': !activeFilters.includes(filter)
          }"
        >
          {{ filter }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-white">Loading mission events...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-400">{{ error }}</div>
    </div>

    <!-- Events List -->
    <div v-else class="space-y-4">
      <div v-if="filteredEvents.length === 0" class="text-center py-8 text-gray-400">
        No mission events found
      </div>
      
      <div v-for="event in filteredEvents" 
           :key="event.id" 
           class="bg-navy-600 rounded-lg p-4 hover:bg-navy-700 transition-colors"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-military text-white">{{ event.title }}</h3>
            <p class="text-sm text-gray-300">{{ formatDate(event.date) }}</p>
          </div>
          <span 
            :class="{
              'px-2 py-1 text-xs font-military rounded': true,
              'bg-green-900 text-green-100': event.status === 'ACTIVE',
              'bg-yellow-900 text-yellow-100': event.status === 'PENDING',
              'bg-red-900 text-red-100': event.status === 'COMPLETED'
            }"
          >
            {{ event.status }}
          </span>
        </div>
        <p class="text-gray-300 mt-2">{{ event.description }}</p>
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-400">
            <span>Commander: {{ event.commander }}</span>
            <span class="mx-2">•</span>
            <span>Location: {{ event.location }}</span>
          </div>
          <button 
            @click="joinMission(event.id)"
            class="px-4 py-2 bg-navy-300 hover:bg-navy-200 text-white font-military rounded"
          >
            JOIN MISSION
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format } from 'date-fns'

const loading = ref(false)
const error = ref(null)
const events = ref([
  {
    id: 1,
    title: 'Operation Deep Water',
    date: '2024-03-25T14:00:00',
    status: 'ACTIVE',
    description: 'Deep sea reconnaissance mission in the Pacific.',
    commander: 'CAPT. Anderson',
    location: 'Pacific Ocean',
    type: 'COMBAT'
  },
  {
    id: 2,
    title: 'Coastal Defense Exercise',
    date: '2024-03-26T09:00:00',
    status: 'PENDING',
    description: 'Defensive maneuvers and patrol operations.',
    commander: 'CDR. Martinez',
    location: 'Pearl Harbor',
    type: 'TRAINING'
  }
])

const filters = ['ALL', 'COMBAT', 'TRAINING', 'PATROL']
const activeFilters = ref(['ALL'])

const filteredEvents = computed(() => {
  if (activeFilters.value.includes('ALL')) {
    return events.value
  }
  return events.value.filter(event => 
    activeFilters.value.includes(event.type)
  )
})

const toggleFilter = (filter) => {
  if (filter === 'ALL') {
    activeFilters.value = ['ALL']
  } else {
    activeFilters.value = activeFilters.value.filter(f => f !== 'ALL')
    if (activeFilters.value.includes(filter)) {
      activeFilters.value = activeFilters.value.filter(f => f !== filter)
      if (activeFilters.value.length === 0) {
        activeFilters.value = ['ALL']
      }
    } else {
      activeFilters.value.push(filter)
    }
  }
}

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

const joinMission = (eventId) => {
  // TODO: Implement mission joining logic
  console.log('Joining mission:', eventId)
}
</script> 