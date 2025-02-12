<template>
  <div class="min-h-screen bg-navy-400 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <Logo class="w-20 h-20" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-military text-white">
        REQUEST ACCESS
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-navy-500 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-navy-300">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Error Alert -->
          <div v-if="error" class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline font-military">{{ error }}</span>
          </div>

          <div>
            <label for="username" class="block text-sm font-military text-gray-200">
              ROBLOX USERNAME
            </label>
            <div class="mt-1">
              <input 
                id="username" 
                v-model="form.username"
                type="text" 
                required 
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm bg-navy-400 text-white font-military focus:outline-none focus:ring-navy-gold focus:border-navy-gold sm:text-sm"
              >
            </div>
          </div>

          <div>
            <label for="discordTag" class="block text-sm font-military text-gray-200">
              DISCORD TAG
            </label>
            <div class="mt-1">
              <input 
                id="discordTag" 
                v-model="form.discordTag"
                type="text" 
                required 
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm bg-navy-400 text-white font-military focus:outline-none focus:ring-navy-gold focus:border-navy-gold sm:text-sm"
                placeholder="username#0000"
              >
            </div>
          </div>

          <div>
            <label for="division" class="block text-sm font-military text-gray-200">
              NAVAL DIVISION
            </label>
            <div class="mt-1">
              <select
                id="division"
                v-model="form.division"
                required
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm bg-navy-400 text-white font-military focus:outline-none focus:ring-navy-gold focus:border-navy-gold sm:text-sm"
              >
                <option value="">SELECT DIVISION</option>

                <!-- Major Commands -->
                <optgroup label="MAJOR COMMANDS">
                  <option value="opnav">OPNAV (Office of the Chief of Naval Operations)</option>
                  <option value="ffc">FFC (Fleet Forces Command)</option>
                  <option value="pacflt">PACFLT (Pacific Fleet)</option>
                  <option value="naveur">NAVEUR (Naval Forces Europe)</option>
                  <option value="navcent">NAVCENT (Naval Forces Central Command)</option>
                </optgroup>

                <!-- Type Commands -->
                <optgroup label="TYPE COMMANDS">
                  <option value="surfor">SURFOR (Surface Forces)</option>
                  <option value="airfor">AIRFOR (Air Forces)</option>
                  <option value="subfor">SUBFOR (Submarine Forces)</option>
                  <option value="necc">NECC (Navy Expeditionary Combat Command)</option>
                  <option value="nswc">NSWC (Naval Special Warfare Command)</option>
                </optgroup>

                <!-- Education & Training -->
                <optgroup label="EDUCATION & TRAINING">
                  <option value="netc">NETC (Naval Education and Training Command)</option>
                  <option value="nstc">NSTC (Naval Service Training Command)</option>
                  <option value="nawctsd">NAWCTSD (Naval Air Warfare Center Training Systems Division)</option>
                  <option value="swsc">SWSC (Surface Warfare Schools Command)</option>
                </optgroup>

                <!-- Support Commands -->
                <optgroup label="SUPPORT COMMANDS">
                  <option value="navsea">NAVSEA (Naval Sea Systems Command)</option>
                  <option value="navair">NAVAIR (Naval Air Systems Command)</option>
                  <option value="spawar">SPAWAR (Space and Naval Warfare Systems Command)</option>
                  <option value="navsup">NAVSUP (Naval Supply Systems Command)</option>
                  <option value="navfac">NAVFAC (Naval Facilities Engineering Command)</option>
                </optgroup>

                <!-- Intelligence & Security -->
                <optgroup label="INTELLIGENCE & SECURITY">
                  <option value="oni">ONI (Office of Naval Intelligence)</option>
                  <option value="ncis">NCIS (Naval Criminal Investigative Service)</option>
                  <option value="tenth_fleet">TENTH Fleet (Fleet Cyber Command)</option>
                  <option value="infosec">Information Warfare Command</option>
                </optgroup>

                <!-- Medical & Support Services -->
                <optgroup label="MEDICAL & SUPPORT">
                  <option value="bumed">BUMED (Bureau of Medicine and Surgery)</option>
                  <option value="jag">JAG (Judge Advocate General's Corps)</option>
                  <option value="chaplain">Chaplain Corps</option>
                  <option value="msc">MSC (Military Sealift Command)</option>
                </optgroup>

                <!-- Research & Development -->
                <optgroup label="RESEARCH & DEVELOPMENT">
                  <option value="onr">ONR (Office of Naval Research)</option>
                  <option value="nrl">NRL (Naval Research Laboratory)</option>
                  <option value="nuwc">NUWC (Naval Undersea Warfare Center)</option>
                  <option value="nswc_labs">NSWC Labs (Naval Surface Warfare Center)</option>
                </optgroup>

                <!-- Reserve Components -->
                <optgroup label="RESERVE COMPONENTS">
                  <option value="navresfor">NAVRESFOR (Navy Reserve Force)</option>
                  <option value="redcom">Regional Reserve Commands</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-military text-gray-200">
              DESIRED PASSWORD
            </label>
            <div class="mt-1">
              <input 
                id="password" 
                v-model="form.password"
                type="password" 
                required 
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm bg-navy-400 text-white font-military focus:outline-none focus:ring-navy-gold focus:border-navy-gold sm:text-sm"
              >
            </div>
          </div>

          <div>
            <button 
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-navy-gold rounded-md shadow-sm text-sm font-military text-white bg-navy-300 hover:bg-navy-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-gold disabled:opacity-50"
            >
              <template v-if="loading">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                SUBMITTING REQUEST...
              </template>
              <template v-else>
                SUBMIT ACCESS REQUEST
              </template>
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-navy-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-navy-500 text-gray-400 font-military">
                ALREADY HAVE ACCESS?
              </span>
            </div>
          </div>
          <div class="mt-6 text-center">
            <router-link 
              to="/login" 
              class="text-sm font-military text-navy-gold hover:text-navy-gold/80"
            >
              RETURN TO LOGIN
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Logo from '@/components/Logo.vue'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const form = ref({
  username: '',
  discordTag: '',
  division: '',
  password: ''
})

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    await authStore.signup(form.value)
    router.push('/signup-confirmation')
  } catch (err) {
    error.value = err.message || 'Failed to submit access request. Please try again.'
  } finally {
    loading.value = false
  }
}
</script> 