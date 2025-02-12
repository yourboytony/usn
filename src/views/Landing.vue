<template>
  <div class="min-h-screen bg-navy-900">
    <LoadingScreen :show="isLoading" />
    <!-- Command Header -->
    <div class="bg-black border-b border-navy-gold/30 fixed w-full z-40">
      <!-- Top Security Bar -->
      <div class="bg-[#0a0a0a] py-1 px-4 border-b border-red-900/30">
        <div class="flex justify-between items-center max-w-7xl mx-auto">
          <div class="flex items-center space-x-3">
            <span class="text-red-500 text-xs font-mono animate-pulse">●</span>
            <span class="text-xs text-red-500 font-mono tracking-wider">TOP SECRET // NOFORN</span>
          </div>
          <div class="flex items-center space-x-4 text-xs font-mono text-gray-500">
            <span class="text-green-500">SYSTEM: OPERATIONAL</span>
            <span class="text-gray-700">|</span>
            <span>DEFCON: 5</span>
            <span class="text-gray-700">|</span>
            <span>{{ new Date().toLocaleTimeString('en-US', { hour12: false }) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Main Header -->
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-6">
            <Logo class="h-10 w-10" />
            <div class="border-l border-navy-gold/20 pl-6">
              <div class="flex flex-col">
                <span class="text-sm text-navy-gold font-mono">UNITED STATES NAVY</span>
                <span class="text-xs text-gray-500 font-mono">HONOR, COURAGE, COMMITMENT</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <router-link 
              to="/login" 
              class="text-navy-gold hover:text-white transition-colors font-mono text-sm"
            >
              [LOGIN]
            </router-link>
            <router-link 
              to="/signup" 
              class="bg-navy-gold/10 border border-navy-gold/30 hover:bg-navy-gold/20 
                     text-navy-gold px-3 py-1 text-sm font-mono transition-all"
            >
              ENLIST_NOW
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="relative pt-32 pb-16 sm:pb-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-military tracking-tight text-white sm:text-6xl">
            UNITED STATES NAVY
          </h1>
          <p class="mt-6 text-lg leading-8 text-gray-300 font-mono">
            Forged by the Sea - Defending Freedom Around the Globe
          </p>
        </div>
      </div>
    </div>

    <!-- Core Values Grid -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div v-for="(value, index) in coreValues" :key="index"
          class="relative bg-navy-800/50 border border-navy-gold/20 p-6 rounded-lg 
                 hover:bg-navy-800/70 transition-all group">
          <component 
            :is="value.icon" 
            class="h-8 w-8 text-navy-gold mb-4"
          />
          <h3 class="text-lg font-military text-white mb-2">{{ value.title }}</h3>
          <p class="text-gray-400 text-sm font-mono">{{ value.description }}</p>
        </div>
      </div>
    </div>

    <!-- Mission Areas -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-military text-white mb-8 text-center">MISSION AREAS</h2>
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="(mission, index) in missions" :key="index"
          class="relative bg-navy-800/50 border border-navy-gold/20 p-6 rounded-lg 
                 hover:bg-navy-800/70 transition-all group">
          <component 
            :is="mission.icon" 
            class="h-8 w-8 text-navy-gold mb-4"
          />
          <h3 class="text-lg font-military text-white mb-2">{{ mission.title }}</h3>
          <p class="text-gray-400 text-sm font-mono">{{ mission.description }}</p>
        </div>
      </div>
    </div>

    <!-- Command Staff -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-military text-white mb-8 text-center">COMMAND STAFF</h2>
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="(member, index) in commandStaff" :key="index"
          class="relative bg-navy-800/50 border border-navy-gold/20 p-6 rounded-lg 
                 hover:bg-navy-800/70 transition-all group text-center">
          <div class="relative w-24 h-24 mx-auto mb-4">
            <img 
              :src="member.avatar" 
              :alt="member.name"
              class="rounded-full w-full h-full object-cover border-2 border-navy-gold/30"
            />
            <div class="absolute -bottom-2 -right-2 bg-navy-gold/20 px-2 py-1 rounded text-xs font-mono text-navy-gold">
              {{ member.rank }}
            </div>
          </div>
          <h3 class="text-lg font-military text-white mb-1">{{ member.name }}</h3>
          <p class="text-navy-gold text-sm font-mono mb-2">{{ member.position }}</p>
          <p class="text-gray-400 text-xs font-mono">{{ member.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Logo from '@/components/Logo.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import { 
  ShieldCheckIcon,
  HeartIcon,
  StarIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  SparklesIcon,
  RocketLaunchIcon,
  GlobeAmericasIcon,
  CloudIcon
} from '@heroicons/vue/24/outline'

const coreValues = [
  {
    icon: ShieldCheckIcon,
    title: 'HONOR',
    description: 'Conducting ourselves in the highest ethical manner in all relationships with peers, superiors and subordinates.'
  },
  {
    icon: HeartIcon,
    title: 'COURAGE',
    description: 'Having the moral and mental strength to face fear, danger and adversity.'
  },
  {
    icon: StarIcon,
    title: 'COMMITMENT',
    description: 'The day-to-day duty of every man and woman in the Navy to exemplify the highest standards of conduct.'
  }
]

const missions = [
  {
    icon: GlobeAltIcon,
    title: 'GLOBAL PRESENCE',
    description: 'Forward deployed forces ensuring security and stability across international waters.'
  },
  {
    icon: GlobeAmericasIcon,
    title: 'MARITIME DOMINANCE',
    description: 'Maintaining superiority in naval warfare and protecting vital sea lanes.'
  },
  {
    icon: CloudIcon,
    title: 'AIR SUPERIORITY',
    description: 'Projecting power through naval aviation and carrier strike groups.'
  },
  {
    icon: SparklesIcon,
    title: 'SPECIAL WARFARE',
    description: 'Elite special operations forces conducting high-risk operations worldwide.'
  },
  {
    icon: AcademicCapIcon,
    title: 'NAVAL EDUCATION',
    description: 'World-class training and development of the next generation of naval leaders.'
  },
  {
    icon: RocketLaunchIcon,
    title: 'TECHNOLOGICAL EDGE',
    description: 'Advancing naval capabilities through cutting-edge technology and innovation.'
  }
]

const commandStaff = [
  {
    name: 'TONY',
    rank: 'CIC',
    position: 'Commander in Chief',
    description: 'Strategic oversight and command of all naval operations.',
    avatar: '/avatars/tony.png'
  },
  {
    name: 'AERO',
    rank: 'FADM',
    position: 'Fleet Admiral',
    description: 'Command of fleet operations and strategic planning.',
    avatar: '/avatars/aero.png'
  },
  {
    name: 'VORTEX',
    rank: 'VADM',
    position: 'Vice Admiral',
    description: 'Tactical operations and personnel management.',
    avatar: '/avatars/vortex.png'
  },
  {
    name: 'SHADOW',
    rank: 'RADM',
    position: 'Rear Admiral',
    description: 'Training and development of naval forces.',
    avatar: '/avatars/shadow.png'
  },
  {
    name: 'PLANE',
    rank: 'RADM',
    position: 'Rear Admiral',
    description: 'Intelligence and cybersecurity operations.',
    avatar: '/avatars/plane.png'
  },
  {
    name: 'STORM',
    rank: 'RADM',
    position: 'Rear Admiral',
    description: 'Special operations and covert missions.',
    avatar: '/avatars/storm.png'
  }
]

const isLoading = ref(true)

onMounted(() => {
  document.title = 'United States Navy'
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
})
</script>

<style>
.font-military {
  font-family: 'Industry', 'Roboto Condensed', sans-serif;
  letter-spacing: 0.05em;
}

.bg-scan-line {
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1px,
    rgba(196, 176, 133, 0.1) 2px,
    rgba(196, 176, 133, 0.1) 3px
  );
  background-size: 100% 3px;
  animation: scanning 10s linear infinite;
}

@keyframes scanning {
  from { background-position: 0 0; }
  to { background-position: 0 100%; }
}

@keyframes pulse-border {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.animate-pulse-border {
  animation: pulse-border 2s ease-in-out infinite;
}
</style> 