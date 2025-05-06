<script setup lang="ts">
defineProps<{
  type: 'success' | 'error' | 'warning' | 'info'
}>();
</script>

<template>
  <span class="mr-2">
    <span v-if="type === 'success'">✅</span>
    <span v-else-if="type === 'error'">❗</span>
    <span v-else-if="type === 'warning'">⚠️</span>
    <span v-else>ℹ️</span>
  </span>
</template>