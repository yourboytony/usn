<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center px-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/90 backdrop-blur-sm" @click="$emit('close')"></div>

      <!-- Modal -->
      <div class="relative bg-navy-800 border border-navy-gold/30 rounded-lg w-full max-w-md p-6">
        <div class="mb-4">
          <h3 class="text-lg font-military text-white">
            <slot name="title"></slot>
          </h3>
        </div>

        <div class="space-y-4">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script> 