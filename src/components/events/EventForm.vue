<template>
  <div class="bg-navy-500 border border-navy-300 rounded-lg p-4">
    <h2 class="text-xl font-military text-white mb-4">
      {{ editing ? 'EDIT EVENT' : 'CREATE EVENT' }}
    </h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-military text-gray-300 mb-1">
          TITLE
        </label>
        <input 
          v-model="form.title"
          type="text"
          required
          class="w-full bg-navy-600 text-white border border-navy-300 rounded px-3 py-2"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-military text-gray-300 mb-1">
            DATE
          </label>
          <input 
            v-model="form.date"
            type="datetime-local"
            required
            class="w-full bg-navy-600 text-white border border-navy-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label class="block text-sm font-military text-gray-300 mb-1">
            TYPE
          </label>
          <select 
            v-model="form.type"
            required
            class="w-full bg-navy-600 text-white border border-navy-300 rounded px-3 py-2"
          >
            <option value="TRAINING">TRAINING</option>
            <option value="OPERATION">OPERATION</option>
            <option value="CEREMONY">CEREMONY</option>
            <option value="INSPECTION">INSPECTION</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-military text-gray-300 mb-1">
          DESCRIPTION
        </label>
        <textarea 
          v-model="form.description"
          required
          rows="3"
          class="w-full bg-navy-600 text-white border border-navy-300 rounded px-3 py-2"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-military text-gray-300 mb-1">
          DIVISION
        </label>
        <select 
          v-model="form.division"
          required
          class="w-full bg-navy-600 text-white border border-navy-300 rounded px-3 py-2"
        >
          <option value="All Divisions">ALL DIVISIONS</option>
          <option v-for="div in divisions" :key="div.value" :value="div.value">
            {{ div.label }}
          </option>
        </select>
      </div>

      <div class="flex justify-end space-x-3">
        <button 
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 bg-navy-400 text-white font-military rounded"
        >
          CANCEL
        </button>
        <button 
          type="submit"
          class="px-4 py-2 bg-navy-300 hover:bg-navy-200 text-white font-military rounded"
        >
          {{ editing ? 'UPDATE' : 'CREATE' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEventsStore } from '@/stores/events'
import { divisions } from '@/constants/divisions'

const props = defineProps({
  event: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['cancel', 'created', 'updated'])
const eventsStore = useEventsStore()

const editing = computed(() => !!props.event)
const form = ref({
  title: '',
  date: '',
  type: 'TRAINING',
  description: '',
  division: 'All Divisions'
})

// Populate form if editing
onMounted(() => {
  if (props.event) {
    form.value = { ...props.event }
  }
})

const handleSubmit = async () => {
  try {
    if (editing.value) {
      const updated = await eventsStore.updateEvent(props.event.id, form.value)
      emit('updated', updated)
    } else {
      const created = await eventsStore.createEvent(form.value)
      emit('created', created)
    }
  } catch (error) {
    console.error('Failed to save event:', error)
  }
}
</script> 