<template>
  <nav class="flex-1 px-2 py-4 space-y-1">
    <!-- Dashboard -->
    <SidebarLink to="/dashboard" :icon="HomeIcon">
      Dashboard
    </SidebarLink>

    <!-- Command Center - Only show for command ranks -->
    <SidebarLink
      v-if="canAccessCommand"
      to="/dashboard/command-center"
      :icon="CommandCenterIcon"
      class="text-blue-400 hover:text-blue-300"
    >
      Command Center
    </SidebarLink>

    <!-- Profile -->
    <SidebarLink to="/dashboard/profile" :icon="UserIcon">
      Profile
    </SidebarLink>

    <!-- Events -->
    <SidebarLink to="/dashboard/events" :icon="CalendarIcon">
      Events
    </SidebarLink>

    <!-- Missions -->
    <SidebarLink to="/dashboard/missions" :icon="FlagIcon">
      Missions
    </SidebarLink>

    <!-- Training -->
    <SidebarLink to="/dashboard/training" :icon="AcademicCapIcon">
      Training
    </SidebarLink>

    <!-- Tickets -->
    <SidebarLink to="/dashboard/tickets" :icon="TicketIcon">
      Tickets
    </SidebarLink>

    <!-- ORBAT -->
    <SidebarLink to="/dashboard/orbat" :icon="ChartBarIcon">
      ORBAT
    </SidebarLink>

    <!-- Reports -->
    <SidebarLink to="/dashboard/reports" :icon="DocumentTextIcon">
      Reports
    </SidebarLink>
  </nav>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import SidebarLink from './SidebarLink.vue'
import CommandCenterIcon from '@/components/icons/CommandCenterIcon.vue'
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  FlagIcon,
  AcademicCapIcon,
  TicketIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()

// Debug logging
console.log('Sidebar component:', {
  user: auth.user,
  rank: auth.user?.rank,
  isAuthenticated: auth.isAuthenticated,
  localStorage: {
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token')?.substring(0, 20) + '...'
  }
})

const canAccessCommand = computed(() => {
  const commandRanks = ['E-9', 'O-7', 'O-8', 'O-9', 'O-10', 'FADM', 'CNO', 'SECNAV', 'CIC']
  const hasAccess = commandRanks.includes(auth.user?.rank)
  
  // Debug logging
  console.log('Command access check:', {
    userRank: auth.user?.rank,
    hasAccess,
    commandRanks,
    includes: commandRanks.includes(auth.user?.rank),
    strictEqual: auth.user?.rank === 'CIC',
    rankType: typeof auth.user?.rank,
    rankLength: auth.user?.rank?.length,
    fullUser: auth.user
  })
  
  return hasAccess
})

// Add mounted hook to check initial state
onMounted(() => {
  console.log('Sidebar mounted:', {
    user: auth.user,
    rank: auth.user?.rank,
    canAccessCommand: canAccessCommand.value
  })
})
</script>

<style scoped>
.router-link-active {
  @apply bg-navy-700 text-white;
}
</style> 