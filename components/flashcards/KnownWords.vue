<script setup lang="ts">
const props = defineProps<{
  knownWords: number;
  totalWords: number;
}>();

// Compute percentage of known words
const percentage = computed(() => {
  if (props.totalWords === 0) return 0;
  return Math.round((props.knownWords / props.totalWords) * 100);
});
</script>

<template>
  <div class="mt-4 text-center transition-all duration-300 ease-in-out">
    <div class="text-sm text-gray-400 mb-1 flex justify-between items-center">
      <span>Words Learned: {{ percentage }}%</span>
    </div>
  </div>
</template>