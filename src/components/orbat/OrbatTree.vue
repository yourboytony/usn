<template>
  <div class="orbat-tree">
    <div v-for="unit in units" :key="unit.id" class="unit-node">
      <div 
        class="unit-header flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer"
        :class="{ 'bg-gray-700': selectedUnit?.id === unit.id }"
        @click="selectUnit(unit)"
      >
        <button 
          v-if="hasChildren(unit.id)"
          @click.stop="toggleUnit(unit.id)"
          class="w-4 h-4 flex items-center justify-center text-gray-400"
        >
          {{ expandedUnits.includes(unit.id) ? '▼' : '▶' }}
        </button>
        <span v-else class="w-4"></span>
        
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-200">{{ unit.name }}</div>
          <div class="text-xs text-gray-400">
            {{ unit.members?.length || 0 }} members
          </div>
        </div>
      </div>

      <div 
        v-if="hasChildren(unit.id) && expandedUnits.includes(unit.id)"
        class="pl-6 mt-1 border-l border-gray-700"
      >
        <OrbatTree
          :units="getChildUnits(unit.id)"
          :selected-unit="selectedUnit"
          @select="$emit('select', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrbatStore } from '@/stores/orbat'

const props = defineProps({
  units: {
    type: Array,
    required: true
  },
  selectedUnit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['select'])

const orbatStore = useOrbatStore()
const expandedUnits = ref([])

function hasChildren(unitId) {
  return orbatStore.getChildUnits(unitId).length > 0
}

function getChildUnits(unitId) {
  return orbatStore.getChildUnits(unitId)
}

function toggleUnit(unitId) {
  const index = expandedUnits.value.indexOf(unitId)
  if (index === -1) {
    expandedUnits.value.push(unitId)
  } else {
    expandedUnits.value.splice(index, 1)
  }
}

function selectUnit(unit) {
  emit('select', unit)
}
</script> 