<template>
  <div class="min-h-screen bg-navy-900">
    <header class="bg-navy-800 shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-military text-white">COMMAND CENTER</h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div class="bg-navy-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <UsersIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-400 truncate">Total Personnel</dt>
                  <dd class="text-lg font-semibold text-white">{{ totalUsers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-navy-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <StarIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-400 truncate">Officers</dt>
                  <dd class="text-lg font-semibold text-white">{{ officerCount }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-navy-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ShieldCheckIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-400 truncate">Active Commands</dt>
                  <dd class="text-lg font-semibold text-white">{{ activeCommands }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-navy-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ClipboardIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-400 truncate">Pending Actions</dt>
                  <dd class="text-lg font-semibold text-white">{{ pendingActions }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-navy-800 shadow rounded-lg mb-8">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-lg font-military text-white mb-4">QUICK ACTIONS</h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              @click="$router.push('/dashboard/command/personnel')"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UsersIcon class="h-5 w-5 mr-2" />
              Manage Personnel
            </button>
            
            <button
              @click="$router.push('/dashboard/command/assignments')"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <UserPlusIcon class="h-5 w-5 mr-2" />
              Command Assignments
            </button>
            
            <button
              @click="$router.push('/dashboard/command/reports')"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <DocumentTextIcon class="h-5 w-5 mr-2" />
              Command Reports
            </button>
            
            <button
              @click="$router.push('/dashboard/command/settings')"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <CogIcon class="h-5 w-5 mr-2" />
              Command Settings
            </button>
          </div>
        </div>
      </div>

      <!-- Personnel Management -->
      <div class="bg-navy-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-lg font-military text-white mb-4">PERSONNEL MANAGEMENT</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-navy-700">
              <thead>
                <tr>
                  <th class="px-6 py-3 bg-navy-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                  <th class="px-6 py-3 bg-navy-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                  <th class="px-6 py-3 bg-navy-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Command</th>
                  <th class="px-6 py-3 bg-navy-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-navy-800 divide-y divide-navy-700">
                <tr v-for="user in users" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <img class="h-10 w-10 rounded-full" :src="user.avatarUrl" :alt="user.username">
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-white">{{ user.username }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ user.rank }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ user.role }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      @click="openEditModal(user)"
                      class="text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Error Alert -->
    <div v-if="error" class="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
      {{ error }}
    </div>

    <!-- Edit Modal -->
    <EditRankModal
      v-if="showEditModal"
      :user="selectedUser"
      :available-ranks="availableRanks"
      :error="error"
      @close="closeEditModal"
      @update="handleUpdateUser"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { COMMANDS } from '@/constants/ranks'
import CommandDashboard from '@/views/CommandDashboard.vue'
import {
  UsersIcon,
  StarIcon,
  ShieldCheckIcon,
  ClipboardIcon,
  UserPlusIcon,
  DocumentTextIcon,
  CogIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import EditRankModal from '@/components/command/EditRankModal.vue'
import { RANKS, getAllRanks } from '@/constants/ranks'

const usersStore = useUsersStore()
const auth = useAuthStore()
const showEditModal = ref(false)
const selectedUser = ref(null)
const error = ref(null)

// Stats
const totalUsers = computed(() => usersStore.users.length)
const officerCount = computed(() => 
  usersStore.users.filter(user => user.rank?.startsWith('O-')).length
)
const activeCommands = computed(() => 
  new Set(usersStore.users.map(user => user.role).filter(Boolean)).size
)
const pendingActions = ref(0)

// Check if user is HQ
const isHQ = computed(() => {
  const hqRanks = ['O-7', 'O-8', 'O-9', 'O-10', 'FADM', 'CNO', 'SECNAV', 'CIC']
  return hqRanks.includes(auth.user?.rank)
})

const users = computed(() => usersStore.users)

// Available ranks for the edit modal
const availableRanks = computed(() => {
  const userRank = auth.user?.rank
  const allRanks = getAllRanks()
  
  // CIC can assign any rank
  if (userRank === 'CIC') {
    return allRanks
  }
  
  // Find the user's rank level
  const userRankObj = allRanks.find(r => r.id === userRank)
  const userLevel = userRankObj?.level || 0
  
  // Can only assign ranks below their own
  return allRanks.filter(rank => {
    const rankObj = allRanks.find(r => r.id === rank.id)
    return rankObj?.level < userLevel
  })
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
  error.value = null
  try {
    await usersStore.updateUser(selectedUser.value.id, updates)
    closeEditModal()
  } catch (err) {
    error.value = err.message
    console.error('Failed to update user:', err)
  }
}

onMounted(async () => {
  console.log('CommandCenter mounted')
  try {
    await usersStore.fetchUsers()
    console.log('Users fetched:', users.value)
  } catch (error) {
    console.error('Error fetching users:', error)
  }
})
</script> 