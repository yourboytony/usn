<template>
  <div class="min-h-screen bg-navy-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-military text-white">
        404 - PAGE NOT FOUND
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-navy-800/50 py-8 px-4 shadow-xl border border-navy-gold/30 sm:rounded-lg sm:px-10">
        <div class="text-center space-y-6">
          <div class="space-y-2">
            <p class="text-gray-300 font-mono">
              The page you are looking for does not exist.
            </p>
            <p class="text-gray-400 font-mono text-sm">
              Please check the URL or return to the dashboard.
            </p>
          </div>

          <div>
            <router-link 
              :to="{ name: 'dashboard' }"
              class="w-full flex justify-center py-2 px-4 border border-navy-gold/30
                     text-sm font-military text-navy-gold bg-navy-gold/10 
                     hover:bg-navy-gold/20 focus:outline-none transition-all"
            >
              RETURN TO DASHBOARD
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script> 