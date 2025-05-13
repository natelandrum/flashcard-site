<script setup lang="ts">
const emit = defineEmits(['fileUploaded']);

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
          // Get a name for the list from the file name (remove extension)
          const suggestedName = file.name.replace('.json', '');
          const listName = prompt('Enter a name for this vocabulary list:', suggestedName) || suggestedName;
          
          // Emit the data with the list name
          emit('fileUploaded', { data, listName });
          toast.success(`Vocabulary "${listName}" loaded with ${data.length} words!`);
          toast.info('Open "Vocabulary Lists" to start studying');
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
</script>

<template>
  <div class="flex flex-col gap-4">
    <label class="block">
      <span class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md cursor-pointer inline-block transition-colors duration-200">
        📤 Upload JSON File
      </span>
      <input type="file" accept=".json" @change="handleFileUpload" class="hidden" />
    </label>
  </div>
</template>