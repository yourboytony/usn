<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen"
      class="p-2 bg-[#1a1a1a] border border-[#333] rounded"
    >
      <div class="relative">
        <BellIcon class="h-5 w-5 text-gray-400" />
        <span 
          v-if="unreadCount" 
          class="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"
        />
      </div>
    </button>

    <!-- Dropdown -->
    <div 
      v-if="isOpen" 
      class="absolute right-0 mt-2 w-80 bg-[#1a1a1a] border border-[#333] rounded shadow-lg"
    >
      <div class="p-2 border-b border-[#333]">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono text-gray-400">NOTIFICATIONS</span>
          <span class="text-xs font-mono text-blue-400">{{ unreadCount }} NEW</span>
        </div>
      </div>
      
      <div class="max-h-96 overflow-y-auto">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="p-3 border-b border-[#333] last:border-0 hover:bg-[#222] cursor-pointer"
          :class="{ 'bg-[#1f1f1f]': !notification.read }"
        >
          <div class="flex items-start space-x-3">
            <component 
              :is="getNotificationIcon(notification.type)"
              class="h-4 w-4 mt-0.5"
              :class="getNotificationColor(notification.type)"
            />
            <div>
              <p class="text-xs font-mono text-white">{{ notification.message }}</p>
              <p class="mt-1 text-xs font-mono text-gray-500">
                {{ formatDate(notification.date) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 py-2 border-t border-gray-700">
        <button 
          class="text-sm text-primary-500 hover:text-primary-400"
          @click="markAllAsRead"
        >
          Mark all as read
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatDistance } from 'date-fns'
import { BellIcon, UserIcon, CalendarIcon, TicketIcon } from '@heroicons/vue/24/outline'

const isOpen = ref(false)
const notifications = ref([
  {
    id: 1,
    type: 'event',
    message: 'New training event scheduled for tomorrow',
    date: new Date(),
    read: false
  },
  {
    id: 2,
    type: 'ticket',
    message: 'Your ticket has been responded to',
    date: new Date(Date.now() - 3600000),
    read: false
  }
])

const unreadCount = computed(() => 
  notifications.value.filter(n => !n.read).length
)

function getNotificationIcon(type) {
  switch (type) {
    case 'event': return CalendarIcon
    case 'ticket': return TicketIcon
    default: return BellIcon
  }
}

function getNotificationColor(type) {
  switch (type) {
    case 'event': return 'text-blue-500'
    case 'ticket': return 'text-green-500'
    default: return 'text-gray-400'
  }
}

function formatDate(date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

function markAllAsRead() {
  notifications.value = notifications.value.map(n => ({ ...n, read: true }))
}
</script> 