<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-military text-white">COMMAND MANAGEMENT</h1>
        <div class="flex items-center space-x-4">
          <select 
            v-if="isHQ"
            v-model="selectedCommand"
            class="bg-navy-600 border border-navy-400 rounded-md text-white px-3 py-2"
          >
            <option value="">All Commands</option>
            <option v-for="cmd in COMMANDS" :key="cmd.id" :value="cmd.id">
              {{ cmd.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-navy-500 rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-navy-400">
            <thead class="bg-navy-600">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-military text-gray-300">
                  PERSONNEL
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-military text-gray-300">
                  RANK
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-military text-gray-300">
                  COMMAND
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-military text-gray-300">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody class="bg-navy-500 divide-y divide-navy-400">
              <tr v-for="user in filteredUsers" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img class="h-10 w-10 rounded-full" :src="user.avatarUrl" :alt="user.username">
                    <div class="ml-4">
                      <div class="text-sm font-medium text-white">{{ user.username }}</div>
                      <div class="text-sm text-gray-400">{{ user.role }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-white">{{ getRankById(user.rank)?.name }}</div>
                  <div class="text-sm text-gray-400">{{ getRankById(user.rank)?.abbr }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-white">
                    {{ COMMANDS.find(c => c.id === user.commandId)?.name || 'Unassigned' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    v-if="canPromoteTo(auth.user?.rank, user.rank)"
                    @click="openEditModal(user)"
                    class="text-blue-400 hover:text-blue-300 font-military"
                  >
                    EDIT RANK
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <EditRankModal
      v-if="showEditModal"
      :user="selectedUser"
      :available-ranks="availableRanks"
      :available-commands="availableCommands"
      @close="closeEditModal"
      @update="handleUpdateUser"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { COMMANDS, RANKS, getRankById, canPromoteTo, getAvailableRanks } from '@/constants/ranks'
import EditRankModal from '@/components/command/EditRankModal.vue'

const auth = useAuthStore()
const usersStore = useUsersStore()

const showEditModal = ref(false)
const selectedUser = ref(null)
const selectedCommand = ref('')

// Check if user is HQ
const isHQ = computed(() => {
  const hqRanks = ['O-7', 'O-8', 'O-9', 'O-10', 'FADM', 'CNO', 'SECNAV']
  return hqRanks.includes(auth.user?.rank)
})

// Get filtered users
const filteredUsers = computed(() => {
  let users = usersStore.users
  
  if (!isHQ.value) {
    // Command level can only see users in their command
    users = users.filter(user => user.commandId === auth.user?.commandId)
  } else if (selectedCommand.value) {
    // HQ with selected command filter
    users = users.filter(user => user.commandId === selectedCommand.value)
  }
  
  return users
})

// Get available ranks for promotions
const availableRanks = computed(() => {
  return getAvailableRanks(auth.user?.rank)
})

// Get available commands for assignment
const availableCommands = computed(() => {
  if (isHQ.value) {
    return COMMANDS
  }
  return COMMANDS.filter(cmd => cmd.id === auth.user?.commandId)
})

function openEditModal(user) {
  selectedUser.value = user
  showEditModal.value = true
}

function closeEditModal() {
  selectedUser.value = null
  showEditModal.value = false
}

async function handleUpdateUser(updates) {
  try {
    await usersStore.updateUser(selectedUser.value.id, updates)
    closeEditModal()
  } catch (error) {
    console.error('Failed to update user:', error)
  }
}

onMounted(async () => {
  await usersStore.fetchUsers()
})
</script> 