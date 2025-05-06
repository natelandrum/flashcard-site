<script setup lang="ts">
  const vocab = ref<Array<{ word: string, translation: string }>>([]);
  const hydrated = ref(false);
  const toast = useToast();
  
  onMounted(() => {
    hydrated.value = true;
    
    // Check for existing vocab in sessionStorage (in case of refresh)
    const savedVocab = sessionStorage.getItem('vocab');
    if (savedVocab) {
      try {
        const parsed = JSON.parse(savedVocab);
        if (Array.isArray(parsed) && parsed.length > 0) {
          vocab.value = parsed;
          toast.info('Loaded previously imported vocabulary');
        }
      } catch (e) {
        console.error('Failed to parse saved vocabulary', e);
      }
    }
  });
  
  function handleFileUploaded(data: Array<{ word: string, translation: string }>) {
    vocab.value = data;
    console.log('Loaded vocab:', vocab.value); // For debugging
  }
  
  function startFlashcards() {
    // Store vocab temporarily for next page
    sessionStorage.setItem('vocab', JSON.stringify(vocab.value));
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
        @start-flashcards="startFlashcards" 
      />
    </div>
  </div>
</template>