<script setup lang="ts">
defineProps({
  isMenuOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['closeMenu']);

const handleLinkClick = () => {
  emit('closeMenu');
};
</script>

<template>
  <nav 
    :class="{'translate-x-0': isMenuOpen, 'translate-x-full': !isMenuOpen}" 
    class="fixed z-100 top-0 right-0 w-64 sm:w-auto h-full bg-gray-800 text-white shadow-lg sm:shadow-none transform transition-transform sm:static sm:translate-x-0 sm:flex sm:items-center">
    <ul class="flex flex-col sm:flex-row sm:space-x-6 p-6 sm:p-0 mt-8 sm:mt-0">
      <li class="sm:my-0 my-2 sm:border-none border-b border-gray-700 w-full">
        <NuxtLink 
          to="/" 
          class="hover:text-gray-300 transition-colors relative group text-gray-400 font-medium text-lg"
          @click="handleLinkClick"
        >
          Home
          <span 
            class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"
          ></span>
        </NuxtLink>
      </li>
      <li class="sm:my-0 my-2 sm:border-none border-b border-gray-700 w-full">
        <NuxtLink 
          to="/flashcards" 
          class="hover:text-gray-300 transition-colors relative group text-gray-400 font-medium text-lg"
          @click="handleLinkClick"
        >
          Flashcards
          <span 
            class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"
          ></span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>