<template>
  <div>Admin Dashboard View</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { formatDistance } from 'date-fns'
import ManageDepartmentModal from '@/components/admin/ManageDepartmentModal.vue'
import { useAnnouncementStore } from '@/stores/announcements'
import CreateAnnouncementModal from '@/components/admin/CreateAnnouncementModal.vue'

const departments = ref([])
const recentActions = ref([])
const showDepartmentModal = ref(false)
const selectedDepartment = ref(null)
const announcementStore = useAnnouncementStore()
const showAnnouncementModal = ref(false)

const quickActions = [
  {
    id: 'create-announcement',
    title: 'Create Announcement',
    description: 'Post a new announcement for all members',
    icon: 'BellIcon',
    iconBg: 'bg-blue-900',
    iconColor: 'text-blue-200',
    handler: () => {
      showAnnouncementModal.value = true
    }
  },
  {
    id: 'schedule-event',
    title: 'Schedule Event',
    description: 'Create a new training or patrol event',
    icon: 'CalendarIcon',
    iconBg: 'bg-green-900',
    iconColor: 'text-green-200',
    handler: () => {
      // TODO: Implement event scheduling
    }
  },
  {
    id: 'manage-roles',
    title: 'Manage Roles',
    description: 'Update department roles and permissions',
    icon: 'ShieldCheckIcon',
    iconBg: 'bg-purple-900',
    iconColor: 'text-purple-200',
    handler: () => {
      // TODO: Implement role management
    }
  }
]

onMounted(async () => {
  try {
    // Fetch admin dashboard data
    const response = await fetch('/api/admin/dashboard')
    const data = await response.json()
    
    departments.value = data.departments
    recentActions.value = data.recentActions
  } catch (error) {
    console.error('Failed to fetch admin dashboard data:', error)
    // TODO: Add error notification
  }
})

function viewDepartment(dept) {
  // TODO: Implement department view
}

function editDepartment(dept) {
  selectedDepartment.value = dept
  showDepartmentModal.value = true
}

function closeDepartmentModal() {
  showDepartmentModal.value = false
  selectedDepartment.value = null
}

async function handleDepartmentSave(data) {
  try {
    const response = await fetch(`/api/admin/departments/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) throw new Error('Failed to update department')

    // Refresh departments data
    const updatedDepts = await fetch('/api/admin/departments').then(r => r.json())
    departments.value = updatedDepts

    closeDepartmentModal()
  } catch (error) {
    console.error('Failed to save department:', error)
    // TODO: Add error notification
  }
}

function formatDate(date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

async function handleAnnouncementCreate(data) {
  try {
    await announcementStore.createAnnouncement(data)
    showAnnouncementModal.value = false
  } catch (error) {
    console.error('Failed to create announcement:', error)
    // TODO: Add error notification
  }
}
</script> 