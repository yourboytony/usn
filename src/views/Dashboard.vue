<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-navy-800/50 border border-navy-gold/20 p-6 rounded-lg">
      <h1 class="text-2xl font-military text-white">
        WELCOME BACK, {{ authStore.user?.username }}
      </h1>
      <p class="mt-2 text-gray-400 font-mono">
        {{ authStore.user?.rank }} • {{ authStore.user?.role }}
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in quickStats" :key="stat.name"
        class="bg-navy-800/50 border border-navy-gold/20 p-4 rounded-lg">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <component :is="stat.icon" class="h-6 w-6 text-navy-gold" />
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-military text-gray-400">{{ stat.name }}</h3>
            <p class="text-lg text-white">{{ stat.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-navy-800/50 border border-navy-gold/20 p-6 rounded-lg">
      <h2 class="text-lg font-military text-white mb-4">RECENT ACTIVITY</h2>
      <div class="space-y-4">
        <div v-for="activity in recentActivity" :key="activity.id"
          class="flex items-start space-x-3 text-sm">
          <component :is="activity.icon" class="h-5 w-5 text-navy-gold mt-0.5" />
          <div>
            <p class="text-white">{{ activity.description }}</p>
            <p class="text-gray-500 font-mono text-xs">
              {{ new Date(activity.timestamp).toLocaleString() }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  CalendarIcon,
  UserGroupIcon,
  TicketIcon,
  AcademicCapIcon,
  BellIcon,
  ChatBubbleLeftIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const quickStats = ref([
  { name: 'UPCOMING EVENTS', value: '3', icon: CalendarIcon },
  { name: 'ACTIVE TRAININGS', value: '2', icon: AcademicCapIcon },
  { name: 'OPEN TICKETS', value: '1', icon: TicketIcon },
  { name: 'TEAM MEMBERS', value: '24', icon: UserGroupIcon }
])

const recentActivity = ref([
  {
    id: 1,
    icon: BellIcon,
    description: 'New announcement: Weekly briefing scheduled',
    timestamp: '2024-02-14T10:00:00'
  },
  {
    id: 2,
    icon: ChatBubbleLeftIcon,
    description: 'Your ticket #123 has been updated',
    timestamp: '2024-02-14T09:30:00'
  }
])

// Fetch data when component mounts
onMounted(async () => {
  // Add API calls here when worker endpoints are ready
})
</script> 