<template>
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const route = useRoute()

const layout = computed(() => {
  const layoutName = route.meta.layout || 'default'
  switch (layoutName) {
    case 'dashboard':
      return DashboardLayout
    case 'auth':
      return AuthLayout
    default:
      return DefaultLayout
  }
})
</script>

<style>
.test {
  font-size: 24px;
  color: white;
  background: #000;
  padding: 20px;
  text-align: center;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 