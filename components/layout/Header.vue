<script setup lang="ts">
  const isMenuOpen = ref(false);

  watch(() => window.innerWidth, (newWidth) => {
    if (newWidth >= 640) {
      isMenuOpen.value = false;
    }
  });

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const closeMenu = () => {
    isMenuOpen.value = false;
  };
</script>

<template>
  <header class="bg-gray-800 text-white py-4 px-6 shadow-md transition-colors duration-200">
    <div class="container mx-auto flex justify-between items-center">
      <UiNavigationLogo />
      <div class="flex items-center">
        <UiNavigationHamburgerButton 
          :is-menu-open="isMenuOpen" 
          @toggle="toggleMenu" 
        />
        <UiNavigationNavMenu 
          :is-menu-open="isMenuOpen"
          @close-menu="closeMenu"
        />
      </div>
    </div>
  </header>
</template>
