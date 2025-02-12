<script setup>
import { ref, onMounted } from 'vue'
import { useTicketsStore } from '@/stores/tickets' // Changed from useTicketStore
import TicketCard from './TicketCard.vue'

const ticketsStore = useTicketsStore() // Changed from useTicketStore

// ... rest of the code
</script> 