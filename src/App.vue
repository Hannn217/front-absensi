<script setup>
import { useRoute } from 'vue-router';
import SidebarAdmin from './components/views/SidebarAdmin.vue';

const route = useRoute();
</script>

<template>
  <div class="layout">
    <!-- Tampilkan Sidebar hanya jika meta requiresSidebar adalah true -->
    <SidebarAdmin v-if="route.meta.requiresSidebar" />
    <div class="main-content" :class="{ 'full-width': !route.meta.requiresSidebar }">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  overflow-y: auto;
}

.full-width {
  width: 100%;
}

/* Optional logo styles */
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
