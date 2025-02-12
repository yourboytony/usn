<template>
  <div class="relative">
    <svg class="w-full h-full" viewBox="0 0 100 100">
      <!-- US Navy Anchor styled icon -->
      <circle cx="50" cy="50" r="45" fill="#002E5D" stroke="#C4B085" stroke-width="2"/>
      <path d="M50 20v60M30 40h40M35 70l15-20 15 20" 
        stroke="#C4B085" 
        stroke-width="4" 
        fill="none"
      />
      <circle cx="50" cy="30" r="5" fill="#C4B085"/>
    </svg>
    <div class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500"></div>
  </div>
</template>

<script>
export default {
  name: 'Logo'
}
</script> 