<script setup lang="ts">
const emit = defineEmits(['fileUploaded', 'startFlashcards']);

const props = defineProps<{
  hasVocab: boolean;
}>();

const toast = useToast();

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    try {
      if (file.name.endsWith('.json')) {
        const data = JSON.parse(content);
        
        // Validate the data structure
        if (Array.isArray(data) && data.length > 0) {
          emit('fileUploaded', data);
          toast.success(`Vocabulary loaded! Found ${data.length} words.`);
        } else {
          toast.error('Invalid data format. Expected an array of vocabulary items.');
        }
      } else {
        toast.error('Invalid file type. Please upload a JSON file.');
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error('Error parsing file. Please check the file format.');
    }
  };
  reader.readAsText(file);
}

function startFlashcards() {
  if (!props.hasVocab) {
    toast.warning('Please load vocabulary first.');
    return;
  }
  
  emit('startFlashcards');
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <label class="block">
      <span class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md cursor-pointer inline-block transition-colors duration-200">
        📤 Upload JSON File
      </span>
      <input type="file" accept=".json" @change="handleFileUpload" class="hidden" />
    </label>

    <button
      v-if="props.hasVocab"
      @click="startFlashcards"
      class="hover:cursor-pointer w-fit mx-auto border-1 border-gray-700 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
    >
      🚀 Start Flashcards
    </button>
  </div>
</template>