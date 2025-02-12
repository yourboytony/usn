<template>
  <div class="min-h-screen bg-navy-400 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8 flex justify-between items-center">
        <h1 class="text-3xl font-military text-white">EVENTS</h1>
        <button 
          v-if="isStaff"
          @click="showEventForm = true"
          class="px-4 py-2 bg-navy-300 hover:bg-navy-200 text-white font-military rounded"
        >
          CREATE EVENT
        </button>
      </div>

      <EventCalendar />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import EventCalendar from '@/components/events/EventCalendar.vue'

const auth = useAuthStore()
const showEventForm = ref(false)

const isStaff = computed(() => {
  return ['CIC', 'CJCS', 'CNO'].includes(auth.user?.rank)
})
</script> 