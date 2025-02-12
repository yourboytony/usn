<template>
  <div class="space-y-6">
    <!-- Group Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500 font-mono">TOTAL MEMBERS</p>
            <p class="text-2xl text-white font-mono mt-1">{{ memberCount }}</p>
          </div>
          <div class="h-8 w-8 rounded bg-blue-500/10 flex items-center justify-center">
            <UsersIcon class="h-5 w-5 text-blue-500" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-xs font-mono">
          <ArrowUpIcon class="h-3 w-3 text-green-500 mr-1" />
          <span class="text-green-500">+{{ memberGrowth }}%</span>
          <span class="text-gray-600 ml-2">vs last week</span>
        </div>
      </div>

      <!-- Similar stat cards for Active Members, Rank Changes, etc. -->
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Member List -->
      <div class="lg:col-span-2 bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm text-white font-mono">GROUP MEMBERS</h3>
          <div class="flex items-center space-x-2">
            <input
              v-model="search"
              type="text"
              placeholder="Search members..."
              class="bg-[#0a0a0a] border border-[#333] rounded px-3 py-1 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            <select
              v-model="rankFilter"
              class="bg-[#0a0a0a] border border-[#333] rounded px-3 py-1 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="">All Ranks</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <div v-for="member in filteredMembers" :key="member.userId" 
               class="flex items-center justify-between p-2 hover:bg-[#222] rounded">
            <div class="flex items-center space-x-3">
              <div class="relative">
                <img :src="member.thumbnail" class="h-8 w-8 rounded" :alt="member.username">
                <span 
                  class="absolute -bottom-1 -right-1 h-2 w-2 rounded-full"
                  :class="{
                    'bg-green-500': getOnlineStatus(member.userId) === 2,
                    'bg-blue-500': getOnlineStatus(member.userId) === 1,
                    'bg-yellow-500': getOnlineStatus(member.userId) === 3,
                    'bg-gray-500': getOnlineStatus(member.userId) === 0
                  }"
                />
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <p class="text-sm text-white font-mono">{{ member.username }}</p>
                  <span 
                    class="text-xs font-mono px-1.5 py-0.5 rounded"
                    :class="{
                      'bg-green-500/10 text-green-500': member.inNavalAcademy,
                      'bg-blue-500/10 text-blue-500': !member.inNavalAcademy && getOnlineStatus(member.userId) === 1,
                      'bg-yellow-500/10 text-yellow-500': !member.inNavalAcademy && getOnlineStatus(member.userId) === 2,
                      'bg-purple-500/10 text-purple-500': !member.inNavalAcademy && getOnlineStatus(member.userId) === 3,
                      'bg-gray-500/10 text-gray-500': getOnlineStatus(member.userId) === 0
                    }"
                  >
                    {{ getPresenceText(getOnlineStatus(member.userId), member.inNavalAcademy) }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 font-mono">{{ member.role }}</p>
              </div>
            </div>
            <button 
              @click="openMemberModal(member)"
              class="px-2 py-1 text-xs font-mono text-blue-400 hover:text-blue-300"
            >
              MANAGE
            </button>
          </div>
        </div>
      </div>

      <!-- Activity Feed -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-4">
        <h3 class="text-sm text-white font-mono mb-4">RECENT ACTIVITY</h3>
        
        <div class="space-y-4">
          <div v-for="(activity, index) in recentActivity" :key="index" 
               class="flex items-start space-x-3">
            <div class="h-6 w-6 rounded bg-blue-500/10 flex items-center justify-center">
              <component :is="getActivityIcon(activity.type)" class="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p class="text-xs text-white font-mono">{{ activity.description }}</p>
              <p class="text-xs text-gray-500 font-mono mt-0.5">{{ formatDate(activity.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatDistance } from 'date-fns'
import { 
  UsersIcon, ArrowUpIcon, UserPlusIcon, 
  UserMinusIcon, ArrowPathIcon 
} from '@heroicons/vue/24/outline'
import { useRobloxStore } from '@/stores/roblox'

const robloxStore = useRobloxStore()
const search = ref('')
const rankFilter = ref('')
const members = ref([])
const roles = ref([])
const recentActivity = ref([])

const { getOnlineStatus, getPresenceText } = robloxStore

const memberCount = computed(() => members.value.length)
const memberGrowth = computed(() => {
  // Calculate growth percentage
  return ((members.value.length - previousMemberCount) / previousMemberCount * 100).toFixed(1)
})

const filteredMembers = computed(() => {
  return members.value.filter(member => {
    const matchesSearch = member.username.toLowerCase().includes(search.value.toLowerCase())
    const matchesRank = !rankFilter.value || member.roleId === rankFilter.value
    return matchesSearch && matchesRank
  })
})

function getActivityIcon(type) {
  switch (type) {
    case 'join': return UserPlusIcon
    case 'leave': return UserMinusIcon
    case 'rank': return ArrowPathIcon
    default: return UsersIcon
  }
}

function formatDate(date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

onMounted(async () => {
  try {
    await robloxStore.fetchGroupInfo()
    await robloxStore.fetchMembers()
    members.value = robloxStore.members
    roles.value = robloxStore.groupInfo.roles
    // Fetch activity log
    const activityLog = await robloxStore.fetchAuditLog()
    recentActivity.value = activityLog.data
  } catch (error) {
    console.error('Failed to fetch group data:', error)
  }
})
</script> 