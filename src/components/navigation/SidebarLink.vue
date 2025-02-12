<template>
  <router-link
    :to="to"
    class="flex items-center px-4 py-2 text-xs font-mono tracking-wider transition-colors group"
    :class="[
      isActive 
        ? 'bg-[#1a1a1a] text-blue-400 border-l-2 border-blue-500' 
        : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
    ]"
  >
    <component 
      :is="icon" 
      class="h-4 w-4 mr-3"
      :class="isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'"
    />
    <span>{{ name }}</span>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  to: {
    type: [String, Object],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

const route = useRoute()
const isActive = computed(() => route.name === props.to.name)
</script> 