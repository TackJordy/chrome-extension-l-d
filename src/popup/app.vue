<script setup lang="ts"></script>

<template>
  <div class="flex justify-center mt-4">
  <img src="@/assets/logo-color-with-text.svg" alt="Lighthouse Extension Logo" class="logo">
  </div>
  <RouterView />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1em;
  will-change: filter;
  transition: filter 300ms;
  
}

.logo:hover {
  filter: drop-shadow(0 0 2em orange);
}
</style>
