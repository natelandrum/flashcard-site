<script setup lang="ts">
useHead({
  title: 'VocabDrop - Home',
  meta: [
    { name: 'description', content: 'Welcome to VocabDrop! Your go-to app for learning vocabulary.' },
    { property: 'og:title', content: 'VocabDrop - Home' },
    { property: 'og:description', content: 'Welcome to VocabDrop! Your go-to app for learning vocabulary.' },
    { property: 'og:image', content: '/icon.png' },
  ],
});

const vocab = ref<Array<{ word: string, translation: string }>>([]);
const hydrated = ref(false);
const toast = useToast();
const isModalOpen = ref(false);
const { addList } = useLocalStorage();

onMounted(() => {
  hydrated.value = true;
});

function handleFileUploaded(fileData: { data: Array<{ word: string, translation: string }>, listName: string }) {
  vocab.value = fileData.data;
  
  // Save to local storage with provided list name, including both words and translations
  addList(fileData.listName, vocab.value);
  
  // Automatically open vocabulary manager after a short delay
  setTimeout(() => {
    openModal();
  }, 1000);
}

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

function handleListSelected(listName: string) {
  toast.success(`Selected list: ${listName}`);
  navigateTo('/flashcards');
}
</script>

<template>
  <div class="flex flex-col items-center justify-center p-6 py-16 transition-colors duration-200">
    <div class="bg-gray-800 shadow-xl rounded-xl p-8 max-w-xl w-full text-center border border-gray-700">
      <!-- Use the WelcomeHeader component -->
      <HomeWelcomeHeader :hydrated="hydrated" />

      <!-- Use the FileUploader component -->
      <HomeFileUploader 
        :has-vocab="vocab.length > 0" 
        @file-uploaded="handleFileUploaded" 
      />

      <!-- Button to open the Vocabulary Manager Modal -->
      <button 
        class="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-md flex items-center justify-center mx-auto"
        @click="openModal"
      >
        <span>Vocabulary Lists</span>
      </button>
    </div>

    <!-- Vocabulary Manager Modal -->
    <FlashcardsVocabularyManagerModal 
      :is-open="isModalOpen" 
      @close="closeModal"
      @list-selected="handleListSelected" 
    />
  </div>
</template>