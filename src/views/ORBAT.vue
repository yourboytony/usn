<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-military text-white">ORGANIZATIONAL STRUCTURE</h1>
      <button 
        v-if="authStore.isAdmin"
        @click="showCreateModal = true"
        class="bg-navy-gold/10 border border-navy-gold/30 hover:bg-navy-gold/20 
               text-navy-gold px-4 py-2 text-sm font-military transition-all"
      >
        CREATE_UNIT
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="orbatStore.loading" class="text-center py-12">
      <div class="animate-spin h-8 w-8 border-2 border-navy-gold border-t-transparent rounded-full mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="orbatStore.error" class="bg-red-900/50 border border-red-500/50 p-4 rounded-lg">
      <p class="text-red-200 font-mono">{{ orbatStore.error }}</p>
    </div>

    <!-- ORBAT Tree -->
    <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Root Units -->
      <div v-for="unit in rootUnits" 
        :key="unit.id"
        class="bg-navy-800/50 border border-navy-gold/20 rounded-lg overflow-hidden"
      >
        <UnitCard 
          :unit="unit" 
          :child-units="getChildUnits(unit.id)"
          @edit="editUnit"
          @delete="deleteUnit"
        />
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Modal v-if="showCreateModal" @close="showCreateModal = false">
      <template #title>{{ editingUnit ? 'EDIT UNIT' : 'CREATE UNIT' }}</template>
      <template #content>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">NAME</label>
            <input 
              v-model="unitForm.name"
              type="text"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">DESCRIPTION</label>
            <textarea 
              v-model="unitForm.description"
              rows="3"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">PARENT UNIT</label>
            <select 
              v-model="unitForm.parent_id"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
            >
              <option :value="null">NO PARENT</option>
              <option 
                v-for="unit in orbatStore.structure"
                :key="unit.id"
                :value="unit.id"
                :disabled="unit.id === editingUnit?.id"
              >
                {{ unit.name }}
              </option>
            </select>
          </div>

          <div class="flex justify-end space-x-4">
            <button 
              type="button"
              @click="showCreateModal = false"
              class="text-gray-400 hover:text-white font-military"
            >
              CANCEL
            </button>
            <button 
              type="submit"
              class="bg-navy-gold/10 border border-navy-gold/30 hover:bg-navy-gold/20 
                     text-navy-gold px-4 py-2 font-military"
              :disabled="orbatStore.loading"
            >
              {{ orbatStore.loading ? 'SAVING...' : (editingUnit ? 'SAVE' : 'CREATE') }}
            </button>
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useOrbatStore } from '@/stores/orbat'
import Modal from '@/components/Modal.vue'
import UnitCard from '@/components/UnitCard.vue'

const authStore = useAuthStore()
const orbatStore = useOrbatStore()

const showCreateModal = ref(false)
const editingUnit = ref(null)
const unitForm = ref({
  name: '',
  description: '',
  parent_id: null
})

const rootUnits = computed(() => 
  orbatStore.structure.filter(unit => !unit.parent_id)
)

function getChildUnits(parentId) {
  return orbatStore.structure.filter(unit => unit.parent_id === parentId)
}

onMounted(() => {
  orbatStore.fetchStructure()
})

function editUnit(unit) {
  editingUnit.value = unit
  unitForm.value = { ...unit }
  showCreateModal.value = true
}

async function handleSubmit() {
  try {
    if (editingUnit.value) {
      await orbatStore.updateUnit(editingUnit.value.id, unitForm.value)
    } else {
      await orbatStore.createUnit(unitForm.value)
    }
    showCreateModal.value = false
    editingUnit.value = null
    unitForm.value = { name: '', description: '', parent_id: null }
  } catch (error) {
    console.error('Failed to save unit:', error)
  }
}

async function deleteUnit(id) {
  if (!confirm('Are you sure you want to delete this unit?')) return
  try {
    await orbatStore.deleteUnit(id)
  } catch (error) {
    console.error('Failed to delete unit:', error)
  }
}
</script>

<style scoped>
.font-military {
  font-family: 'Industry', monospace;
  letter-spacing: 0.05em;
}
</style> 