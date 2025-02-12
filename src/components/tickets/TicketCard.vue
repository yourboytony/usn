<script setup>
import { computed } from 'vue'
import { useTicketsStore } from '@/stores/tickets' // Changed from useTicketStore
import { formatDistance } from 'date-fns'

const ticketsStore = useTicketsStore() // Changed from useTicketStore

// ... rest of the code
</script> 