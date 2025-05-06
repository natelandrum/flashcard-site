<script setup lang="ts">
  import type { VocabItem, ProgressInfo } from '~/types';

  // State
  const vocab = ref<VocabItem[]>([]);
  const currentIndex = ref(0);
  const showTranslation = ref(false);
  const isFlipping = ref(false);
  const studyComplete = ref(false);
  const knownWords = ref<Set<number>>(new Set());
  const toast = useToast();
  const storedVocab = ref('');
  const touchStartX = ref(0);
  const touchStartY = ref(0);
  const longTouchTimer = ref<number | null>(null);
  const isResetting = ref(false);
  
  // Animation states
  const slideDirection = ref('none');
  const isAnimating = ref(false);

  // Get vocabulary data from session storage
  onMounted(() => {
    storedVocab.value = sessionStorage.getItem('vocab') || ''; 
    if (storedVocab.value) {
      vocab.value = JSON.parse(storedVocab.value);
      shuffleVocab();
      toast.info('Flashcards ready! Click on a card to flip it.');
    } else {
      // If no vocab in session storage, redirect back to home
      toast.error('No vocabulary loaded. Redirecting to home page.');
      setTimeout(() => {
        navigateTo('/');
      }, 3000);
    }
    window.addEventListener('keydown', handleKeydown);
  });
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });

  // Computed properties
  const currentWord = computed((): VocabItem => {
    if (vocab.value.length === 0) return { word: '', translation: '' };
    return vocab.value[currentIndex.value];
  });

  const progress = computed((): ProgressInfo => {
    return {
      current: currentIndex.value + 1,
      total: vocab.value.length,
      percentage: vocab.value.length ? Math.round(((currentIndex.value + 1) / vocab.value.length) * 100) : 0
    };
  });

  // Methods
  function resetIsResetting() {
    setTimeout(() => {
      isResetting.value = false;
    }, 50);
  }

  function flipCard() {
    // Don't flip card if we're in the middle of resetting
    if (isResetting.value) return;
    
    isFlipping.value = true;
    setTimeout(() => {
      showTranslation.value = !showTranslation.value;
      isFlipping.value = false;
    }, 150);
  }

  function markAsKnown() {
    knownWords.value.add(currentIndex.value);
    vocab.value[currentIndex.value].known = true;
    nextCard();
  }

  function nextCard() {
    if (isAnimating.value) return;
    
    if (currentIndex.value < vocab.value.length - 1) {
      isAnimating.value = true;
      slideDirection.value = 'left';
      
      // Wait for slide-out animation to complete
      setTimeout(() => {
        showTranslation.value = false;
        currentIndex.value++;
        slideDirection.value = 'in-right';
        
        // Reset animation state after slide-in completes
        setTimeout(() => {
          slideDirection.value = 'none';
          isAnimating.value = false;
        }, 200);
      }, 200);
    } else {
      if (knownWords.value.size === vocab.value.length) {
        studyComplete.value = true;
      } else {
        // Remove known words and restart with remaining words
        vocab.value = vocab.value.filter((_, index) => !knownWords.value.has(index));
        knownWords.value = new Set();
        currentIndex.value = 0;
        showTranslation.value = false;
      }
    }
  }

  function previousCard() {
    if (isAnimating.value) return;
    
    if (currentIndex.value > 0) {
      isAnimating.value = true;
      slideDirection.value = 'right';
      
      // Wait for slide-out animation to complete
      setTimeout(() => {
        showTranslation.value = false;
        currentIndex.value--;
        slideDirection.value = 'in-left';
        
        // Reset animation state after slide-in completes
        setTimeout(() => {
          slideDirection.value = 'none';
          isAnimating.value = false;
        }, 200);
      }, 200);
    }
  }

  function shuffleVocab() {
    // Set the resetting flag to prevent flip animations
    isResetting.value = true;
    
    vocab.value = [...vocab.value].sort(() => Math.random() - 0.5);
    currentIndex.value = 0;
    showTranslation.value = false;
    knownWords.value = new Set();
    
    // After a short delay, allow flipping again
    resetIsResetting();
  }
  
  function handleKeydown(event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === ' ' || event.key === 'Enter') {
      flipCard();
    } else if (event.key === 'ArrowRight') {
      nextCard();
    } else if (event.key === 'ArrowLeft') {
      previousCard();
    } else if (event.key === 'l') {
      markAsKnown();
    } else if (event.key === 's') {
      shuffleVocab();
    } else if (event.key === 'r') {
      restart();
    }
  }

  function restart() {
    // Set the resetting flag to prevent flip animations
    isResetting.value = true;
    
    vocab.value = JSON.parse(storedVocab.value);
    shuffleVocab();
    studyComplete.value = false;
  }

  function handleTouchStart(event: TouchEvent) {
    event.preventDefault();
    touchStartX.value = event.touches[0].clientX;
    touchStartY.value = event.touches[0].clientY;
    longTouchTimer.value = window.setTimeout(() => {
      confirm('Do you want to restart the flashcards?') && restart();
      isResetting.value = true;
      resetIsResetting();
    }, 500);
  }

  function handleTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    if (longTouchTimer.value) {
      clearTimeout(longTouchTimer.value);
      longTouchTimer.value = null;
    }

    // Don't process touches during reset operations
    if (isResetting.value) return;

    const touchDifferenceX = touchEndX - touchStartX.value;
    const touchDifferenceY = touchEndY - touchStartY.value;
    
    // Handle horizontal swipes for navigation
    if (Math.abs(touchDifferenceX) > 50) {
      if (touchDifferenceX > 0) {
        previousCard();
      } else {
        nextCard();
      }
    }
    // Only flip if it was a deliberate tap with minimal movement
    else if (Math.abs(touchDifferenceX) < 10 && Math.abs(touchDifferenceY) < 10) {
      flipCard();
    }
    
    // Handle vertical swipes
    if (Math.abs(touchDifferenceY) > 50) {
      if (touchDifferenceY > 0) {
        shuffleVocab();
      } else {
        markAsKnown();
      }
    } 
  }
  
  function goHome() {
    navigateTo('/');
  }
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="vocab.length === 0" class="text-center py-16">
      <h2 class="text-2xl font-semibold text-gray-300 mb-4">Loading vocabulary...</h2>
      <p class="text-gray-400">If nothing happens, please go back to the home page and load your vocabulary.</p>
      <NuxtLink to="/" class="inline-block mt-4 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200">
        Back to Home
      </NuxtLink>
    </div>

    <!-- Use the CompletionMessage component for the study complete screen -->
    <FlashcardsCompletionMessage 
      v-else-if="studyComplete" 
      :total-words="vocab.length"
      @restart="restart"
      @go-home="goHome"
    />

    <div v-else class="max-w-2xl mx-auto">
      <!-- Known Words Component -->
      <KnownWords 
        :known-words="knownWords.size" 
        :total-words="vocab.length"
      />
      
      <!-- Progress Bar Component -->
      <FlashcardsProgressBar v-bind="progress" />
      
      <!-- Flashcard Component with slide animations -->
      <FlashcardsFlashCard 
        :word="currentWord" 
        :show-translation="showTranslation" 
        :is-flipping="isFlipping"
        :slide-direction="slideDirection"
        @flip="flipCard"
        @touch-start="handleTouchStart"
        @touch-end="handleTouchEnd"
      />

      <!-- Card Controls Component with Shuffle Button and Instructions -->
      <FlashcardsCardControls 
        :is-first-card="currentIndex === 0"
        @previous="previousCard"
        @next="nextCard"
        @flip="flipCard"
        @mark-as-known="markAsKnown"
        @shuffle="shuffleVocab"
      />
    </div>
  </div>
</template>

<style scoped>
/* This empty style section helps resolve build issues */
</style>