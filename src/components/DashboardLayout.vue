<script setup>
import { onUnmounted } from 'vue'
import { useRobloxStore } from '@/stores/roblox'

const store = useRobloxStore()

// ... other code ...

onUnmounted(() => {
  store.stopPresenceSync()
})
</script> 