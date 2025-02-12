<template>
  <div>
    <!-- Unit Header -->
    <div class="p-4 bg-gradient-to-r from-navy-gold/10 to-transparent border-b border-navy-gold/20">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-military text-white">{{ unit.name }}</h3>
          <p class="text-gray-400 font-mono text-sm mt-1">{{ unit.description }}</p>
        </div>
        
        <div v-if="authStore.isAdmin" class="flex space-x-2">
          <button 
            @click="$emit('edit', unit)"
            class="text-navy-gold hover:text-white"
          >
            <PencilIcon class="h-5 w-5" />
          </button>
          <button 
            @click="$emit('delete', unit.id)"
            class="text-red-500 hover:text-red-400"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Child Units -->
    <div v-if="childUnits?.length" class="p-4 space-y-4">
      <div v-for="child in childUnits" 
        :key="child.id"
        class="ml-4 border-l-2 border-navy-gold/20 pl-4"
      >
        <UnitCard 
          :unit="child" 
          :child-units="getChildUnits(child.id)"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useOrbatStore } from '@/stores/orbat'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const orbatStore = useOrbatStore()

const props = defineProps({
  unit: {
    type: Object,
    required: true
  },
  childUnits: {
    type: Array,
    default: () => []
  }
})

defineEmits(['edit', 'delete'])

function getChildUnits(parentId) {
  return orbatStore.structure.filter(unit => unit.parent_id === parentId)
}
</script> 