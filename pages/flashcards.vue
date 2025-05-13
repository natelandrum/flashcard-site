<script setup lang="ts">
import type { VocabItem, ProgressInfo } from '~/types';

// State
const vocab = ref<VocabItem[]>([]);
const originalTotalWords = ref(0); // Track the original total number of words
const currentIndex = ref(0);
const showTranslation = ref(false);
const isFlipping = ref(false);
const studyComplete = ref(false);
const knownWordsSet = ref<Set<string>>(new Set()); // Changed to store words instead of indices
const toast = useToast();
const { getLists, updateList } = useLocalStorage();
const touchStartX = ref(0);
const touchStartY = ref(0);
const longTouchTimer = ref<number | null>(null);
const isResetting = ref(false);
const selectedListName = ref('');
const showFilterModal = ref(false); // New state for the filter modal

// Animation states
const slideDirection = ref('none');
const isAnimating = ref(false);

// Get vocabulary data from local storage
onMounted(() => {
  selectedListName.value = localStorage.getItem('selectedVocabList') || '';
  
  if (selectedListName.value) {
    const lists = getLists();
    const selectedList = lists.find(list => list.name === selectedListName.value);
    
    if (selectedList) {
      // Use the vocab items directly with their translations
      vocab.value = selectedList.vocab.map(item => ({
        word: item.word,
        translation: item.translation,
        known: selectedList.knownWords.includes(item.word)
      }));
      
      // Store the original total count
      originalTotalWords.value = vocab.value.length;
      
      // Pre-load known words set with actual words
      knownWordsSet.value = new Set(selectedList.knownWords);
      
      // Check if the list has known words but not all words are known
      if (knownWordsSet.value.size > 0 && knownWordsSet.value.size < vocab.value.length) {
        // Show filter modal
        showFilterModal.value = true;
      } else {
        // No known words or all words are known
        shuffleVocab();
        toast.info('Flashcards ready! Click on a card to flip it.');
      }
    } else {
      toast.error('Selected vocabulary list not found. Redirecting to home page.');
      setTimeout(() => {
        navigateTo('/');
      }, 3000);
    }
  } else {
    toast.error('No vocabulary list selected. Redirecting to home page.');
    setTimeout(() => {
      navigateTo('/');
    }, 3000);
  }
  
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  // Save known words to local storage when leaving the page
  saveKnownWords();
});

// Save the current state of known words
function saveKnownWords() {
  if (selectedListName.value) {
    const knownWordsArray = Array.from(knownWordsSet.value);
    updateList(selectedListName.value, knownWordsArray);
  }
}

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

// Computed property to get the count of known words
const knownWordsCount = computed(() => knownWordsSet.value.size);

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
  const word = vocab.value[currentIndex.value].word;
  knownWordsSet.value.add(word);
  vocab.value[currentIndex.value].known = true;
  // Save progress immediately
  saveKnownWords();
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
    if (knownWordsSet.value.size === originalTotalWords.value) {
      studyComplete.value = true;
      saveKnownWords();
    } else {
      // Remove known words and restart with remaining words
      vocab.value = vocab.value.filter(item => !knownWordsSet.value.has(item.word));
      currentIndex.value = 0;
      showTranslation.value = false;
      saveKnownWords();
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
  
  // Update known status before shuffling
  vocab.value.forEach(item => {
    item.known = knownWordsSet.value.has(item.word);
  });
  
  vocab.value = [...vocab.value].sort(() => Math.random() - 0.5);
  currentIndex.value = 0;
  showTranslation.value = false;
  
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
  // Reset by reloading the original vocabulary list
  isResetting.value = true;
  
  const lists = getLists();
  const selectedList = lists.find(list => list.name === selectedListName.value);
  
  if (selectedList) {
    vocab.value = selectedList.vocab.map(item => ({
      word: item.word,
      translation: item.translation,
      known: false
    }));
    
    // Reset the original total words to match the full vocabulary list
    originalTotalWords.value = vocab.value.length;
    
    knownWordsSet.value = new Set(); // Clear known words
    shuffleVocab();
    studyComplete.value = false;
    
    // Clear known words in local storage
    updateList(selectedListName.value, []);
  }
}

function handleTouchStart(event: TouchEvent) {
  event.preventDefault();
  touchStartX.value = event.touches[0].clientX;
  touchStartY.value = event.touches[0].clientY;
  longTouchTimer.value = window.setTimeout(() => {
    confirm('Do you want to restart the flashcards?') && restart();
    isResetting.value = true;
    resetIsResetting();
  }, 1000);
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
  // Save progress before navigating
  saveKnownWords();
  navigateTo('/');
}

// Filter vocabulary based on user choice
function filterVocabulary(showOnlyUnknown: boolean) {
  if (showOnlyUnknown) {
    // Filter out known words
    vocab.value = vocab.value.filter(item => !knownWordsSet.value.has(item.word));
    toast.success(`Filtered out ${knownWordsCount.value} known words`);
  } else {
    // Keep all words
    toast.info('Showing all words including known ones');
  }
  
  showFilterModal.value = false;
  shuffleVocab();
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 overflow-hidden">
    <!-- Filter Modal -->
    <div v-if="showFilterModal" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 mx-4 max-w-sm w-full">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Study Options</h3>
        <p class="mb-4 text-gray-700">
          You already know {{ knownWordsCount }} out of {{ originalTotalWords }} words in this list. 
          Would you like to:
        </p>
        <div class="flex flex-col gap-3">
          <button 
            @click="filterVocabulary(true)"
            class="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
          >
            Only Show New Words ({{ originalTotalWords - knownWordsCount }})
          </button>
          <button 
            @click="filterVocabulary(false)"
            class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors"
          >
            Show All Words ({{ originalTotalWords }})
          </button>
        </div>
      </div>
    </div>

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
      :total-words="originalTotalWords"
      @restart="restart"
      @go-home="goHome"
    />

    <div v-else class="max-w-2xl mx-auto">
      <!-- Known Words Component -->
      <KnownWords 
        :known-words="knownWordsCount" 
        :total-words="originalTotalWords"
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
      <FlashcardsKnownWords 
        :known-words="knownWordsCount" 
        :total-words="originalTotalWords"
      />
    </div>
  </div>
</template>

<style scoped>
/* This empty style section helps resolve build issues */
</style>