<script setup lang="ts">
import type { VocabItem } from '~/types';

defineProps<{
  word: VocabItem;
  showTranslation: boolean;
  isFlipping: boolean;
  slideDirection: string; // 'left', 'right', or 'none'
}>();

const emit = defineEmits(['flip', 'touchStart', 'touchEnd']);

function handleClick() {
  emit('flip');
}

function handleTouchStart(event: TouchEvent) {
  emit('touchStart', event);
}

function handleTouchEnd(event: TouchEvent) {
  emit('touchEnd', event);
}
</script>

<template>
  <div 
    class="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden h-64 mb-6 cursor-pointer flex items-center justify-center transition-colors duration-200 relative"
    :class="{ 
      'animate-flip-card': isFlipping,
      'animate-slide-left': slideDirection === 'left',
      'animate-slide-right': slideDirection === 'right',
      'animate-slide-in-left': slideDirection === 'in-left',
      'animate-slide-in-right': slideDirection === 'in-right'
    }"
    @click="handleClick"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <img 
      v-if="word.known" 
      src="/assets/icons/star.png" 
      alt="Known Word Star" 
      class="absolute h-8 w-8 inset-2" 
    />
    <div class="text-center p-6">
      <div v-if="!showTranslation" class="text-3xl font-semibold text-gray-100 transition-colors duration-200">{{ word.word }}</div>
      <div v-else class="text-3xl font-semibold text-gray-100 transition-colors duration-200">{{ word.translation }}</div>
    </div>
  </div>
</template>

<style scoped>
.animate-flip-card {
  animation: flipCard 0.3s ease-in-out;
}

.animate-slide-left {
  animation: slideLeft 0.3s ease-in-out forwards;
}

.animate-slide-right {
  animation: slideRight 0.3s ease-in-out forwards;
}

.animate-slide-in-left {
  animation: slideInLeft 0.3s ease-in-out;
}

.animate-slide-in-right {
  animation: slideInRight 0.3s ease-in-out;
}

@keyframes flipCard {
  0% {
    transform: perspective(1000px) rotateY(0deg);
  }
  50% {
    transform: perspective(1000px) rotateY(90deg);
  }
  100% {
    transform: perspective(1000px) rotateY(0deg);
  }
}

@keyframes slideLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-50%);
    opacity: 0;
  }
}

@keyframes slideRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(50%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-50%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(50%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>