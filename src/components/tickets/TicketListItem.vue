<template>
  <div 
    class="p-4 hover:bg-gray-700 cursor-pointer transition-colors"
    @click="$emit('click', ticket)"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div 
          class="w-2 h-2 rounded-full"
          :class="{
            'bg-green-400': ticket.status === 'open',
            'bg-yellow-400': ticket.status === 'in-progress',
            'bg-gray-400': ticket.status === 'closed'
          }"
        ></div>
        <div>
          <h4 class="text-sm font-medium text-gray-200">
            {{ ticket.title }}
          </h4>
          <div class="mt-1 flex items-center space-x-2 text-xs text-gray-400">
            <span>{{ ticket.department }}</span>
            <span>•</span>
            <span>Opened by {{ ticket.createdBy.displayName }}</span>
            <span>•</span>
            <span>{{ formatDate(ticket.createdAt) }}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <div class="flex -space-x-2">
          <img
            v-for="assignee in ticket.assignees"
            :key="assignee.id"
            :src="assignee.avatarUrl"
            :alt="assignee.displayName"
            class="h-6 w-6 rounded-full ring-2 ring-gray-800"
            :title="assignee.displayName"
          >
        </div>
        <div 
          class="px-2 py-1 text-xs rounded-full"
          :class="{
            'bg-green-900 text-green-200': ticket.priority === 'low',
            'bg-yellow-900 text-yellow-200': ticket.priority === 'medium',
            'bg-red-900 text-red-200': ticket.priority === 'high'
          }"
        >
          {{ ticket.priority }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDistance } from 'date-fns'

const props = defineProps({
  ticket: {
    type: Object,
    required: true
  }
})

function formatDate(date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}
</script> 