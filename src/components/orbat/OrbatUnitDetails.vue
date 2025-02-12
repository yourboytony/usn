<template>
  <div class="space-y-6">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-lg font-medium text-gray-100">
          {{ unit.name }}
        </h3>
        <p class="mt-1 text-sm text-gray-400">
          {{ unit.description }}
        </p>
      </div>
      <div class="flex space-x-2">
        <button
          v-if="isAdmin"
          @click="showEditModal = true"
          class="inline-flex items-center px-3 py-1.5 border border-gray-600 rounded-md text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600"
        >
          Edit Unit
        </button>
        <button
          v-if="isAdmin"
          @click="showAssignMemberModal = true"
          class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Assign Member
        </button>
      </div>
    </div>

    <!-- Unit Members -->
    <div>
      <h4 class="text-sm font-medium text-gray-200 mb-3">Unit Members</h4>
      <div class="bg-gray-900 rounded-lg divide-y divide-gray-700">
        <div 
          v-for="member in unit.members" 
          :key="member.id"
          class="flex items-center justify-between p-4"
        >
          <div class="flex items-center space-x-3">
            <img 
              :src="member.avatarUrl" 
              :alt="member.displayName"
              class="h-10 w-10 rounded-full"
            >
            <div>
              <div class="text-sm font-medium text-gray-200">
                {{ member.displayName }}
              </div>
              <div class="text-xs text-gray-400">
                {{ member.rank }} - {{ member.role }}
              </div>
            </div>
          </div>
          
          <button
            v-if="isAdmin"
            @click="removeMember(member)"
            class="text-sm text-red-400 hover:text-red-300"
          >
            Remove
          </button>
        </div>

        <div v-if="!unit.members?.length" class="p-4 text-center text-gray-400">
          No members assigned
        </div>
      </div>
    </div>

    <!-- Edit Unit Modal -->
    <OrbatEditUnitModal
      v-if="showEditModal"
      :unit="unit"
      @close="showEditModal = false"
      @update="handleUnitUpdate"
    />

    <!-- Assign Member Modal -->
    <OrbatAssignMemberModal
      v-if="showAssignMemberModal"
      :unit="unit"
      @close="showAssignMemberModal = false"
      @assign="handleMemberAssign"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useOrbatStore } from '@/stores/orbat'
import OrbatEditUnitModal from './OrbatEditUnitModal.vue'
import OrbatAssignMemberModal from './OrbatAssignMemberModal.vue'

const props = defineProps({
  unit: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

const authStore = useAuthStore()
const orbatStore = useOrbatStore()

const showEditModal = ref(false)
const showAssignMemberModal = ref(false)

const isAdmin = computed(() => {
  const adminRanks = ['O-7', 'O-8', 'O-9', 'O-10', 'FADM', 'CNO', 'SECNAV']
  return adminRanks.includes(authStore.user?.rank)
})

async function handleUnitUpdate(updatedUnit) {
  showEditModal.value = false
  emit('update', updatedUnit)
}

async function handleMemberAssign(memberData) {
  try {
    await orbatStore.assignMember({
      unitId: props.unit.id,
      ...memberData
    })
    showAssignMemberModal.value = false
    emit('update', props.unit)
  } catch (error) {
    console.error('Failed to assign member:', error)
    // TODO: Add error notification
  }
}

async function removeMember(member) {
  if (!confirm(`Remove ${member.displayName} from this unit?`)) return

  try {
    await fetch(`/api/orbat/units/${props.unit.id}/members/${member.id}`, {
      method: 'DELETE'
    })
    emit('update', props.unit)
  } catch (error) {
    console.error('Failed to remove member:', error)
    // TODO: Add error notification
  }
}
</script> 