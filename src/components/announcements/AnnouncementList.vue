<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>

    <template v-else>
      <div 
        v-for="announcement in announcements" 
        :key="announcement.id"
        class="bg-gray-800 rounded-lg overflow-hidden"
      >
        <div class="p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-100">
              {{ announcement.title }}
            </h3>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-400">
                {{ formatDate(announcement.date) }}
              </span>
              <button
                v-if="canManageAnnouncements"
                @click="handleDelete(announcement)"
                class="text-gray-400 hover:text-gray-300"
              >
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div class="mt-2 prose prose-invert max-w-none">
            <div v-html="markdownToHtml(announcement.content)"></div>
          </div>

          <div class="mt-4 flex items-center text-sm text-gray-400">
            <img 
              :src="announcement.author.avatarUrl" 
              :alt="announcement.author.displayName"
              class="h-6 w-6 rounded-full"
            >
            <span class="ml-2">Posted by {{ announcement.author.displayName }}</span>
            
            <template v-if="announcement.visibility !== 'all'">
              <span class="mx-2">•</span>
              <span v-if="announcement.visibility === 'department'">
                Visible to: {{ formatDepartments(announcement.selectedDepartments) }}
              </span>
              <span v-else-if="announcement.visibility === 'rank'">
                Minimum rank: {{ formatRank(announcement.minRank) }}
              </span>
            </template>
          </div>
        </div>
      </div>

      <div 
        v-if="!announcements.length" 
        class="text-center py-12 text-gray-400"
      >
        No announcements to display
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDistance } from 'date-fns'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { useAuthStore } from '@/stores/auth'
import { DEPARTMENTS, getRankById } from '@/constants/ranks'

const props = defineProps({
  announcements: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delete'])

const authStore = useAuthStore()

const canManageAnnouncements = computed(() => {
  return authStore.user?.permissions.includes('manage_announcements')
})

function formatDate(date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

function markdownToHtml(content) {
  return DOMPurify.sanitize(marked(content))
}

function formatDepartments(departmentIds) {
  return departmentIds
    .map(id => DEPARTMENTS.find(d => d.id === id)?.abbr)
    .filter(Boolean)
    .join(', ')
}

function formatRank(rankId) {
  const rank = getRankById(rankId)
  return rank ? `${rank.abbr} (${rank.name})` : rankId
}

async function handleDelete(announcement) {
  if (!confirm(`Are you sure you want to delete the announcement "${announcement.title}"?`)) {
    return
  }

  emit('delete', announcement.id)
}
</script> 