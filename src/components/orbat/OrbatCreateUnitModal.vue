<template>
  <div class="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
    <div class="bg-navy-800 rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-military text-white mb-6">CREATE NEW UNIT</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Unit Type -->
        <div>
          <label class="block text-sm font-military text-navy-300 mb-1">UNIT TYPE</label>
          <select 
            v-model="form.type"
            class="w-full bg-navy-700 border border-navy-600 rounded px-3 py-2 text-white focus:outline-none focus:border-navy-gold"
            required
          >
            <option value="unit">Main Unit</option>
            <option value="subunit">Sub Unit</option>
          </select>
        </div>

        <!-- Parent Unit (for subunits) -->
        <div v-if="form.type === 'subunit'">
          <label class="block text-sm font-military text-navy-300 mb-1">PARENT UNIT</label>
          <select 
            v-model="form.parentId"
            class="w-full bg-navy-700 border border-navy-600 rounded px-3 py-2 text-white focus:outline-none focus:border-navy-gold"
            required
          >
            <option v-for="unit in mainUnits" :key="unit.id" :value="unit.id">
              {{ unit.name }}
            </option>
          </select>
        </div>

        <!-- Unit Name -->
        <div>
          <label class="block text-sm font-military text-navy-300 mb-1">UNIT NAME</label>
          <input 
            v-model="form.name"
            type="text"
            class="w-full bg-navy-700 border border-navy-600 rounded px-3 py-2 text-white focus:outline-none focus:border-navy-gold"
            required
          >
        </div>

        <!-- Commander -->
        <div>
          <label class="block text-sm font-military text-navy-300 mb-1">COMMANDER</label>
          <select 
            v-model="form.commander"
            class="w-full bg-navy-700 border border-navy-600 rounded px-3 py-2 text-white focus:outline-none focus:border-navy-gold"
          >
            <option value="">Unassigned</option>
            <option v-for="user in users" :key="user.username" :value="user.username">
              {{ user.username }} ({{ user.rank }})
            </option>
          </select>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>

        <!-- Buttons -->
        <div class="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-navy-300 hover:text-white font-military"
          >
            CANCEL
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-navy-600 text-white font-military rounded hover:bg-navy-500 disabled:opacity-50"
          >
            {{ loading ? 'CREATING...' : 'CREATE UNIT' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['close', 'created'])

const loading = ref(false)
const error = ref(null)
const users = ref([])
const mainUnits = ref([])

const form = ref({
  type: 'unit',
  name: '',
  commander: '',
  parentId: ''
})

async function loadUsers() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      credentials: 'include'
    })
    const data = await response.json()
    users.value = data
  } catch (err) {
    console.error('Failed to load users:', err)
  }
}

async function loadMainUnits() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orbat`, {
      credentials: 'include'
    })
    const data = await response.json()
    mainUnits.value = data.branches[0].units // Assuming Navy branch is first
  } catch (err) {
    console.error('Failed to load units:', err)
  }
}

async function handleSubmit() {
  try {
    loading.value = true
    error.value = null

    const unitData = {
      name: form.value.name,
      commander: form.value.commander || null
    }

    let url = `${import.meta.env.VITE_API_URL}/api/orbat/units`
    if (form.value.type === 'subunit') {
      url = `${import.meta.env.VITE_API_URL}/api/orbat/units/${form.value.parentId}/subunits`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(unitData)
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Failed to create unit')
    }

    const newUnit = await response.json()
    emit('created', newUnit)
  } catch (err) {
    console.error('Failed to create unit:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsers()
  loadMainUnits()
})
</script> 