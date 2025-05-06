<script setup lang="ts">
defineProps<{
  isFirstCard: boolean;
}>();

const emit = defineEmits(['previous', 'next', 'flip', 'markAsKnown', 'shuffle']);
</script>

<template>
  <div>
    <div class="flex justify-between">
      <button 
        @click="emit('previous')" 
        :disabled="isFirstCard"
        class="bg-gray-700 hover:bg-gray-800 text-gray-200 font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Previous
      </button>

      <div class="flex gap-2">
        <button @click="emit('flip')" class="bg-blue-700 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
          Flip
        </button>
        <button @click="emit('markAsKnown')" class="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
          Learned
        </button>
      </div>

      <button 
        @click="emit('next')" 
        class="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
      >
        Next
      </button>
    </div>

    <!-- Moved shuffle button and instructions to the same line -->
    <div class="mt-6 flex justify-between items-center">
      <button 
        @click="emit('shuffle')" 
        class="text-gray-400 border border-gray-700 px-4 py-1 rounded hover:bg-gray-800 hover:text-gray-300 transition-colors duration-200"
      >
        🔀 Shuffle
      </button>
      
      <!-- Using the InstructionsModal component directly -->
      <FlashcardsInstructionsModal />
    </div>
  </div>
</template>