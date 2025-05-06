<script setup lang="ts">
defineProps({
  isMenuOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle']);

const toggleMenu = () => {
  emit('toggle');
};
</script>

<template>
  <button 
    @click="toggleMenu" 
    class="sm:hidden z-150 flex flex-col justify-between w-6 h-6 focus:outline-none cursor-pointer pointer-events-auto">
    <div 
      :class="{'rotate-45 translate-y-[11px]': isMenuOpen}" 
      class="w-full h-0.5 bg-white transition-transform"></div>
    <div 
      :class="{'opacity-0': isMenuOpen}" 
      class="w-full h-0.5 bg-white transition-opacity"></div>
    <div 
      :class="{'-rotate-45 -translate-y-[11px]': isMenuOpen}" 
      class="w-full h-0.5 bg-white transition-transform"></div>
  </button>
</template>