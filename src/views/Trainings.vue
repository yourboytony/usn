<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-military text-white">TRAINING PROGRAMS</h1>
      <button 
        v-if="authStore.isAdmin"
        @click="showCreateModal = true"
        class="bg-navy-gold/10 border border-navy-gold/30 hover:bg-navy-gold/20 
               text-navy-gold px-4 py-2 text-sm font-military transition-all"
      >
        CREATE_PROGRAM
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="trainingStore.loading" class="text-center py-12">
      <div class="animate-spin h-8 w-8 border-2 border-navy-gold border-t-transparent rounded-full mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="trainingStore.error" class="bg-red-900/50 border border-red-500/50 p-4 rounded-lg">
      <p class="text-red-200 font-mono">{{ trainingStore.error }}</p>
    </div>

    <!-- Training Programs Grid -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="training in trainingStore.trainings" 
        :key="training.id"
        class="bg-navy-800/50 border border-navy-gold/20 rounded-lg overflow-hidden"
      >
        <!-- Training Header -->
        <div class="p-4 bg-gradient-to-r from-navy-gold/10 to-transparent border-b border-navy-gold/20">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-military text-white">{{ training.title }}</h3>
              <p class="text-navy-gold text-sm font-mono mt-1">{{ training.type }}</p>
            </div>
            <span 
              :class="{
                'bg-green-900/50 text-green-200': getProgress(training.id)?.status === 'COMPLETED',
                'bg-yellow-900/50 text-yellow-200': getProgress(training.id)?.status === 'IN_PROGRESS',
                'bg-navy-900/50 text-gray-300': !getProgress(training.id)
              }"
              class="px-2 py-1 rounded text-xs font-mono"
            >
              {{ getProgress(training.id)?.status || 'NOT STARTED' }}
            </span>
          </div>
        </div>

        <!-- Training Details -->
        <div class="p-4 space-y-4">
          <p class="text-gray-400 font-mono text-sm">{{ training.description }}</p>
          
          <div class="space-y-2 text-xs font-mono">
            <div class="flex items-center space-x-2">
              <UserIcon class="h-4 w-4 text-navy-gold" />
              <span class="text-gray-300">
                Instructor: {{ training.instructor_name }}
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <UsersIcon class="h-4 w-4 text-navy-gold" />
              <span class="text-gray-300">
                Students: {{ training.student_count || 0 }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center pt-4 border-t border-navy-gold/20">
            <button 
              v-if="!getProgress(training.id)?.status"
              @click="startTraining(training.id)"
              class="text-sm font-military text-navy-gold hover:text-white transition-colors"
            >
              START TRAINING
            </button>
            <button 
              v-else-if="getProgress(training.id)?.status === 'IN_PROGRESS'"
              @click="completeTraining(training.id)"
              class="text-sm font-military text-green-500 hover:text-green-400 transition-colors"
            >
              COMPLETE TRAINING
            </button>
            <span v-else class="text-sm font-military text-green-500">
              COMPLETED
            </span>
            
            <button 
              v-if="authStore.isAdmin"
              @click="deleteTraining(training.id)"
              class="text-red-500 hover:text-red-400"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <Modal v-if="showCreateModal" @close="showCreateModal = false">
      <template #title>CREATE TRAINING PROGRAM</template>
      <template #content>
        <form @submit.prevent="createTraining" class="space-y-4">
          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">TITLE</label>
            <input 
              v-model="newTraining.title"
              type="text"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">DESCRIPTION</label>
            <textarea 
              v-model="newTraining.description"
              rows="3"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-military text-navy-gold mb-1">TYPE</label>
            <select 
              v-model="newTraining.type"
              class="w-full bg-navy-900/50 border border-navy-gold/30 rounded px-3 py-2 
                     text-white font-mono focus:outline-none focus:border-navy-gold"
              required
            >
              <option value="BASIC">BASIC TRAINING</option>
              <option value="ADVANCED">ADVANCED TRAINING</option>
              <option value="SPECIALIST">SPECIALIST TRAINING</option>
              <option value="LEADERSHIP">LEADERSHIP TRAINING</option>
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
              :disabled="trainingStore.loading"
            >
              {{ trainingStore.loading ? 'CREATING...' : 'CREATE' }}
            </button>
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTrainingStore } from '@/stores/trainings'
import { UserIcon, UsersIcon, TrashIcon } from '@heroicons/vue/24/outline'
import Modal from '@/components/Modal.vue'

const authStore = useAuthStore()
const trainingStore = useTrainingStore()

const showCreateModal = ref(false)
const newTraining = ref({
  title: '',
  description: '',
  type: 'BASIC'
})

onMounted(() => {
  trainingStore.fetchTrainings()
})

function getProgress(trainingId) {
  return trainingStore.getProgressForTraining(trainingId)
}

async function createTraining() {
  try {
    await trainingStore.createTraining(newTraining.value)
    showCreateModal.value = false
    newTraining.value = { title: '', description: '', type: 'BASIC' }
  } catch (error) {
    console.error('Failed to create training:', error)
  }
}

async function startTraining(trainingId) {
  try {
    await trainingStore.updateProgress(trainingId, 'IN_PROGRESS')
  } catch (error) {
    console.error('Failed to start training:', error)
  }
}

async function completeTraining(trainingId) {
  try {
    await trainingStore.updateProgress(trainingId, 'COMPLETED')
  } catch (error) {
    console.error('Failed to complete training:', error)
  }
}

async function deleteTraining(id) {
  if (!confirm('Are you sure you want to delete this training program?')) return
  try {
    await trainingStore.deleteTraining(id)
  } catch (error) {
    console.error('Failed to delete training:', error)
  }
}
</script> 