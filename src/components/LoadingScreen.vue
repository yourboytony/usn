<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <!-- Radar Sweep Background -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="radar-sweep"></div>
      </div>

      <div class="max-w-md w-full p-8 relative">
        <!-- Navy Logo -->
        <div class="mb-8 relative">
          <div class="absolute inset-0 bg-navy-gold/5 rounded-full blur-2xl animate-pulse"></div>
          <div class="relative">
            <img 
              src="/navy-logo.png" 
              alt="U.S. Navy Logo" 
              class="w-32 h-32 mx-auto"
            />

            <!-- Spinning Rings -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="animate-spin rounded-full h-40 w-40 border border-navy-gold/10"></div>
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div class="animate-spin rounded-full h-32 w-32 border-t border-r border-navy-gold/30" style="animation-duration: 3s;"></div>
              </div>
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div class="animate-spin rounded-full h-24 w-24 border-t-2 border-navy-gold/50" style="animation-duration: 2s;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rest of the existing content -->
        <div class="space-y-4 relative">
          <!-- Existing department text -->
          <div class="space-y-1">
            <p class="text-navy-gold font-military tracking-[0.2em] text-sm cyberpunk-text">
              DEPARTMENT OF DEFENSE
            </p>
            <p class="text-navy-gold/60 font-military tracking-[0.15em] text-xs cyberpunk-text">
              UNITED STATES NAVY
            </p>
          </div>

          <!-- Loading Status with Matrix Effect -->
          <div class="space-y-2">
            <div class="flex items-center justify-center space-x-2">
              <div class="h-px w-16 bg-gradient-to-r from-transparent via-navy-gold/50 to-transparent"></div>
              <p class="text-gray-400 font-mono text-xs tracking-[0.2em] matrix-text">
                INITIALIZING SECURE CONNECTION
              </p>
              <div class="h-px w-16 bg-gradient-to-r from-transparent via-navy-gold/50 to-transparent"></div>
            </div>
            <!-- Loading Dots -->
            <div class="flex justify-center">
              <div class="flex space-x-2">
                <div class="w-2 h-2 bg-navy-gold/60 rounded-full animate-loader"></div>
                <div class="w-2 h-2 bg-navy-gold/60 rounded-full animate-loader" style="animation-delay: 200ms"></div>
                <div class="w-2 h-2 bg-navy-gold/60 rounded-full animate-loader" style="animation-delay: 400ms"></div>
              </div>
            </div>
          </div>

          <!-- Enhanced System Status -->
          <div class="flex items-center justify-center space-x-6 text-xs font-mono">
            <span class="flex items-center cyberpunk-status">
              <span class="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse mr-2"></span>
              NETWORK: SECURE
            </span>
            <span class="text-navy-gold/30">|</span>
            <span class="cyberpunk-status">ENCRYPTION: ACTIVE</span>
            <span class="text-navy-gold/30">|</span>
            <span class="cyberpunk-status">CLEARANCE: VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
.radar-sweep {
  position: absolute;
  width: 100%;
  height: 100%;
  background: conic-gradient(
    from 0deg at 50% 50%,
    transparent 0deg,
    rgba(196, 176, 133, 0.1) 60deg,
    transparent 61deg
  );
  animation: radar-sweep 4s linear infinite;
}

@keyframes radar-sweep {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-loader {
  animation: loader 1s infinite;
}

@keyframes loader {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}

.cyberpunk-text {
  text-shadow: 0 0 10px rgba(196, 176, 133, 0.5);
}

.cyberpunk-status {
  color: #C4B085;
  text-shadow: 0 0 5px rgba(196, 176, 133, 0.3);
}

.matrix-text {
  animation: matrixGlow 2s infinite;
}

@keyframes matrixGlow {
  0%, 100% { text-shadow: 0 0 5px rgba(196, 176, 133, 0.3); }
  50% { text-shadow: 0 0 15px rgba(196, 176, 133, 0.5); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 