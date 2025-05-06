<script setup lang="ts">
defineProps<{
  totalWords: number;
}>();

const emit = defineEmits(['restart', 'goHome']);

function handleRestart() {
  emit('restart');
}

function handleGoHome() {
  emit('goHome');
}
</script>

<template>
  <div class="text-center py-16">
    <h2 class="text-3xl font-bold text-gray-400 mb-4 transition-colors duration-200">🎉 Study Complete!</h2>
    <p class="text-lg text-gray-300 mb-6 transition-colors duration-200">
      You've learned all {{ totalWords }} vocabulary items in this set.
    </p>
    <div class="flex justify-center gap-4">
      <button 
        @click="handleRestart" 
        class="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
      >
        Study Again
      </button>
      <button 
        @click="handleGoHome" 
        class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
      >
        Back to Home
      </button>
    </div>
  </div>
</template>