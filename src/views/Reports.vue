<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-military text-white">PERSONNEL REPORTS</h1>
      <button 
        v-if="authStore.isAdmin"
        @click="showCreateModal = true"
        class="bg-navy-gold/10 border border-navy-gold/30 hover:bg-navy-gold/20 
               text-navy-gold px-4 py-2 text-sm font-military transition-all"
      >
        CREATE_REPORT
      </button>
    </div>

    <!-- Search/Filter -->
    <div class="bg-navy-800/50 border border-navy-gold/20 p-4 rounded-lg">
      <div class="flex gap-4">
        <div class="flex-1">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search reports..."
            class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                   text-white font-mono focus:outline-none focus:border-navy-gold"
          >
        </div>
        <select 
          v-model="filterType"
          class="bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                 text-white font-mono focus:outline-none focus:border-navy-gold"
        >
          <option value="ALL">ALL TYPES</option>
          <option value="COMMENDATION">COMMENDATION</option>
          <option value="DISCIPLINARY">DISCIPLINARY</option>
          <option value="EVALUATION">EVALUATION</option>
          <option value="INCIDENT">INCIDENT</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="reportStore.loading" class="text-center py-12">
      <div class="animate-spin h-8 w-8 border-2 border-navy-gold border-t-transparent rounded-full mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="reportStore.error" class="bg-red-900/50 border border-red-500/50 p-4 rounded-lg">
      <p class="text-red-200 font-mono">{{ reportStore.error }}</p>
    </div>

    <!-- Reports List -->
    <div v-else class="space-y-4">
      <div v-for="report in filteredReports" 
        :key="report.id"
        class="bg-navy-800/50 border border-navy-gold/20 p-6 rounded-lg"
      >
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center space-x-3">
              <h3 class="text-lg font-military text-white">{{ report.subject }}</h3>
              <span 
                :class="{
                  'bg-green-900/50 text-green-200': report.type === 'COMMENDATION',
                  'bg-red-900/50 text-red-200': report.type === 'DISCIPLINARY',
                  'bg-blue-900/50 text-blue-200': report.type === 'EVALUATION',
                  'bg-yellow-900/50 text-yellow-200': report.type === 'INCIDENT'
                }"
                class="px-2 py-0.5 rounded text-xs font-mono"
              >
                {{ report.type }}
              </span>
            </div>
            
            <div class="mt-2 space-y-2">
              <p class="text-gray-400 font-mono text-sm">{{ report.content }}</p>
              
              <div class="flex items-center space-x-4 text-xs font-mono">
                <span class="text-navy-gold">Subject: {{ report.user_name }}</span>
                <span class="text-gray-500">|</span>
                <span class="text-gray-500">
                  Filed by: {{ report.author_name }}
                </span>
                <span class="text-gray-500">|</span>
                <span class="text-gray-500">
                  {{ new Date(report.created_at).toLocaleString() }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex space-x-2">
            <button 
              v-if="authStore.isAdmin"
              @click="editReport(report)"
              class="text-navy-gold hover:text-white"
            >
              <PencilIcon class="h-5 w-5" />
            </button>
            <button 
              v-if="authStore.isAdmin"
              @click="deleteReport(report.id)"
              class="text-red-500 hover:text-red-400"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Attachments -->
        <div v-if="report.attachments?.length" class="mt-4 pt-4 border-t border-navy-gold/20">
          <h4 class="text-sm font-military text-navy-gold mb-2">ATTACHMENTS</h4>
          <div class="flex flex-wrap gap-2">
            <a 
              v-for="attachment in report.attachments"
              :key="attachment.id"
              :href="attachment.url"
              target="_blank"
              class="flex items-center space-x-2 bg-navy-900/50 px-3 py-1 rounded-full
                     text-xs font-mono text-white hover:bg-navy-900"
            >
              <DocumentIcon class="h-4 w-4 text-navy-gold" />
              <span>{{ attachment.name }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Modal v-if="showCreateModal" @close="showCreateModal = false">
      <template #title>{{ editingReport ? 'EDIT REPORT' : 'CREATE REPORT' }}</template>
      <template #content>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">SUBJECT</label>
            <input 
              v-model="reportForm.subject"
              type="text"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">PERSONNEL</label>
            <select 
              v-model="reportForm.user_id"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            >
              <option value="">SELECT PERSONNEL</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.rank }} {{ user.username }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">TYPE</label>
            <select 
              v-model="reportForm.type"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            >
              <option value="COMMENDATION">COMMENDATION</option>
              <option value="DISCIPLINARY">DISCIPLINARY</option>
              <option value="EVALUATION">EVALUATION</option>
              <option value="INCIDENT">INCIDENT</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">CONTENT</label>
            <textarea 
              v-model="reportForm.content"
              rows="4"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">ATTACHMENTS</label>
            <input 
              type="file"
              multiple
              @change="handleFileUpload"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
            >
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
              :disabled="reportStore.loading"
            >
              {{ reportStore.loading ? 'SAVING...' : (editingReport ? 'UPDATE' : 'CREATE') }}
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
import { useReportStore } from '@/stores/reports'
import { PencilIcon, TrashIcon, DocumentIcon } from '@heroicons/vue/24/outline'
import Modal from '@/components/Modal.vue'

const authStore = useAuthStore()
const reportStore = useReportStore()

const showCreateModal = ref(false)
const editingReport = ref(null)
const searchQuery = ref('')
const filterType = ref('ALL')
const users = ref([])

const reportForm = ref({
  subject: '',
  content: '',
  type: 'EVALUATION',
  user_id: '',
  attachments: []
})

const filteredReports = computed(() => {
  let reports = reportStore.reports
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    reports = reports.filter(report => 
      report.subject.toLowerCase().includes(query) ||
      report.content.toLowerCase().includes(query) ||
      report.user_name.toLowerCase().includes(query)
    )
  }

  if (filterType.value !== 'ALL') {
    reports = reports.filter(report => report.type === filterType.value)
  }

  return reports
})

onMounted(async () => {
  await reportStore.fetchReports()
  // Fetch users list for the select dropdown
  // This would need to be implemented in the auth store or a new users store
  // users.value = await fetchUsers()
})

function handleFileUpload(event) {
  reportForm.value.attachments = Array.from(event.target.files)
}

function editReport(report) {
  editingReport.value = report
  reportForm.value = { ...report }
  showCreateModal.value = true
}

async function handleSubmit() {
  try {
    const formData = new FormData()
    Object.entries(reportForm.value).forEach(([key, value]) => {
      if (key !== 'attachments') {
        formData.append(key, value)
      }
    })
    
    reportForm.value.attachments.forEach(file => {
      formData.append('attachments', file)
    })

    if (editingReport.value) {
      await reportStore.updateReport(editingReport.value.id, formData)
    } else {
      await reportStore.createReport(formData)
    }
    
    showCreateModal.value = false
    editingReport.value = null
    reportForm.value = {
      subject: '',
      content: '',
      type: 'EVALUATION',
      user_id: '',
      attachments: []
    }
  } catch (error) {
    console.error('Failed to save report:', error)
  }
}

async function deleteReport(id) {
  if (!confirm('Are you sure you want to delete this report?')) return
  try {
    await reportStore.deleteReport(id)
  } catch (error) {
    console.error('Failed to delete report:', error)
  }
}
</script> 