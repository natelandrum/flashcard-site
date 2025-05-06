<script setup lang="ts">
const isModalOpen = ref(false);

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

// Expose the openModal function so parent components can trigger it
defineExpose({
  openModal
});
</script>

<template>
  <!-- Trigger Button - Now part of the component -->
  <button 
    @click="openModal" 
    class="text-gray-400 flex items-center gap-1 border border-gray-700 px-3 py-1 rounded hover:bg-gray-800 hover:text-gray-300 transition-colors duration-200"
  >
    <img 
      src="/assets/icons/keyboard.svg" 
      alt="Keyboard Shortcuts" 
      class="h-4 w-4 filter invert"
    />
    <img 
      src="/assets/icons/touch.svg" 
      alt="Touch Gestures" 
      class="h-4 w-4 filter invert"
    />
    Instructions
  </button>

  <!-- Modal Dialog -->
  <div 
    v-if="isModalOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-lg flex flex-col items-center">
      <div class="flex flex-col md:flex-row md:gap-8 max-w-lg">
        <div>
          <h3 class="text-lg font-bold mb-4">Keyboard Shortcuts</h3>
          <ul class="list-disc list-inside text-sm">
            <li><strong>Space / Enter:</strong> Flip card</li>
            <li><strong>Arrow Right:</strong> Next card</li>
            <li><strong>Arrow Left:</strong> Previous card</li>
            <li><strong>L:</strong> Mark as learned</li>
            <li><strong>S:</strong> Shuffle cards</li>
            <li><strong>R:</strong> Restart</li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-bold mb-4">Touch Instructions</h3>
          <ul class="list-disc list-inside text-sm">
            <li><strong>Tap:</strong> Flip card</li>
            <li><strong>Swipe Left:</strong> Next card</li>
            <li><strong>Swipe Right:</strong> Previous card</li>
            <li><strong>Swipe Up:</strong> Mark as learned</li>
            <li><strong>Swipe Down:</strong> Shuffle cards</li>
            <li><strong>Long Tap:</strong> Restart</li>
          </ul>
        </div>
      </div>
      
      <button 
        @click="closeModal" 
        class="mt-6 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
      >
        Close
      </button>
    </div>
  </div>
</template>