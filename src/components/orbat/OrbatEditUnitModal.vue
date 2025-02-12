<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-lg font-medium text-gray-100 mb-4">
        Edit Unit: {{ unit.name }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-200">
            Unit Name
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-200">
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div>
          <label for="parent" class="block text-sm font-medium text-gray-200">
            Parent Unit
          </label>
          <select
            id="parent"
            v-model="form.parentId"
            class="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">No Parent Unit</option>
            <option 
              v-for="unit in availableParentUnits" 
              :key="unit.id" 
              :value="unit.id"
            >
              {{ unit.name }}
            </option>
          </select>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-200 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrbatStore } from '@/stores/orbat'

const props = defineProps({
  unit: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])
const orbatStore = useOrbatStore()

const loading = ref(false)
const form = ref({
  name: props.unit.name,
  description: props.unit.description,
  parentId: props.unit.parentId || ''
})

// Filter out current unit and its children from available parent units
const availableParentUnits = computed(() => {
  return orbatStore.units.filter(u => {
    const isCurrentUnit = u.id === props.unit.id
    const isChildUnit = isDescendant(u.id, props.unit.id)
    return !isCurrentUnit && !isChildUnit
  })
})

function isDescendant(unitId, ancestorId) {
  const unit = orbatStore.getUnitById(unitId)
  if (!unit || !unit.parentId) return false
  if (unit.parentId === ancestorId) return true
  return isDescendant(unit.parentId, ancestorId)
}

async function handleSubmit() {
  loading.value = true
  try {
    const response = await fetch(`/api/orbat/units/${props.unit.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: form.value.name,
        description: form.value.description,
        parentId: form.value.parentId || null
      })
    })

    if (!response.ok) throw new Error('Failed to update unit')
    
    const updatedUnit = await response.json()
    emit('update', updatedUnit)
  } catch (error) {
    console.error('Failed to update unit:', error)
    // TODO: Add error notification
  } finally {
    loading.value = false
  }
}
</script> 