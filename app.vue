<script setup>
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-900 text-gray-100 transition-colors duration-200">
    <LayoutHeader />
    <main class="flex-grow">
      <NuxtPage />
    </main>
    <LayoutFooter />
    <UiToastManager />
  </div>
</template>

<style>
html, body {
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
