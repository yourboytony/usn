<template>
  <div class="p-4">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-sm font-medium text-gray-200">
          {{ record.title }}
        </h4>
        <div class="mt-1 text-xs text-gray-400">
          {{ formatDate(record.date) }} • {{ record.department }}
        </div>
      </div>
      <div 
        class="px-2 py-1 text-xs rounded-full"
        :class="{
          'bg-green-900 text-green-200': record.type === 'promotion',
          'bg-blue-900 text-blue-200': record.type === 'transfer',
          'bg-yellow-900 text-yellow-200': record.type === 'award',
          'bg-red-900 text-red-200': record.type === 'disciplinary'
        }"
      >
        {{ record.type }}
      </div>
    </div>
    <p v-if="record.description" class="mt-2 text-sm text-gray-400">
      {{ record.description }}
    </p>
    <div v-if="record.issuedBy" class="mt-2 flex items-center text-xs text-gray-500">
      <span>Issued by {{ record.issuedBy.displayName }} ({{ record.issuedBy.rank }})</span>
    </div>
  </div>
</template>

<script setup>
import { formatDistance } from 'date-fns'

const props = defineProps({
  record: {
    type: Object,
    required: true
  }
})

function formatDate(date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}
</script> 