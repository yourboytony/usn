<template>
  <div class="bg-navy-500 border border-navy-300 rounded-lg p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-military text-white">UPCOMING EVENTS</h2>
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
    <div v-if="eventsStore.loading" class="text-center py-8">
      <div class="text-white">Loading events...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="eventsStore.error" class="text-center py-8">
      <div class="text-red-400">{{ eventsStore.error }}</div>
    </div>

    <!-- Events List -->
    <div v-else class="space-y-4">
      <div v-if="filteredEvents.length === 0" class="text-center py-8 text-gray-400">
        No events found
      </div>
      
      <EventCard 
        v-for="event in filteredEvents" 
        :key="event.id" 
        :event="event"
        @attend="handleAttend"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEventsStore } from '@/stores/events'
import EventCard from './EventCard.vue'

const eventsStore = useEventsStore()
const filters = ['TRAINING', 'OPERATION', 'CEREMONY', 'INSPECTION']
const activeFilters = ref(filters)

const filteredEvents = computed(() => {
  return eventsStore.events.filter(event => 
    activeFilters.value.includes(event.type)
  )
})

const toggleFilter = (filter) => {
  if (activeFilters.value.includes(filter)) {
    activeFilters.value = activeFilters.value.filter(f => f !== filter)
  } else {
    activeFilters.value.push(filter)
  }
}

const handleAttend = async (eventId) => {
  try {
    await eventsStore.attendEvent(eventId)
  } catch (error) {
    // Handle error (show notification, etc)
    console.error('Failed to attend event:', error)
  }
}

onMounted(async () => {
  await eventsStore.fetchEvents()
})
</script> 