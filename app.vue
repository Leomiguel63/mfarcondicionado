<template>
  <NavBar v-if="route.path !== '/login'" />
  <div class="main-content">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import NavBar from '~/components/NavBar.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
