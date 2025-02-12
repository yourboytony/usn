<template>
  <div class="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <Logo class="w-20 h-20" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-100">
        <slot name="title">Welcome</slot>
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-700">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import Logo from '@/components/Logo.vue'
</script> 