<template>
  <div class="flex items-center space-x-4 text-xs font-mono">
    <div class="flex items-center space-x-2">
      <span class="h-1.5 w-1.5 rounded-full" :class="statusColor"></span>
      <span class="text-gray-400">{{ status }}</span>
    </div>
    <span class="text-gray-600">|</span>
    <span class="text-gray-400">{{ currentTime }}</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const status = ref('OPERATIONAL')
const timer = ref(null)
const currentTime = ref(new Date().toISOString())

const statusColor = computed(() => {
  switch (status.value) {
    case 'OPERATIONAL': return 'bg-green-500'
    case 'DEGRADED': return 'bg-yellow-500'
    case 'CRITICAL': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
})

onMounted(() => {
  timer.value = setInterval(() => {
    currentTime.value = new Date().toISOString()
  }, 1000)
})

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
})
</script> 