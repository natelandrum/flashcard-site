<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Manage Vocabulary Lists</h2>
      <div v-if="vocabLists.length === 0" class="text-center py-4">
        <p class="text-gray-600">No vocabulary lists found. Upload a list to get started.</p>
      </div>
      <ul v-else>
        <li v-for="list in vocabLists" :key="list.name" class="vocab-list-item">
          <div class="mb-2">
            <strong class="text-lg text-gray-700">{{ list.name }}</strong>
            <p class="text-sm text-gray-600">Known Words: {{ calculatePercentage(list.knownWords, list.vocab) }}%</p>
            <p class="text-xs text-gray-500">Last Updated: {{ formatDate(list.lastUpdated) }}</p>
          </div>
          <div class="actions flex justify-end">
            <button @click="selectList(list.name)" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">Study</button>
            <button @click="renameListHandler(list.name)" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mx-1">Rename</button>
            <button @click="deleteListHandler(list.name)" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
          </div>
        </li>
      </ul>
      <button @click="closeModal" class="mt-4 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded w-full">Close</button>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'list-selected']);

const { getLists, deleteList, renameList } = useLocalStorage();
const toast = useToast();

const vocabLists = ref(getLists());

// Refresh the list when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    vocabLists.value = getLists();
  }
});

const calculatePercentage = (knownWords, vocab) => {
  if (!vocab || vocab.length === 0) return '0';
  return (Math.round((knownWords.length / vocab.length) * 100));
};

const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleString();
};

const selectList = (name) => {
  localStorage.setItem('selectedVocabList', name);
  emit('list-selected', name);
  closeModal();
};

const closeModal = () => {
  emit('close');
};

const deleteListHandler = (name) => {
  if (confirm(`Are you sure you want to delete "${name}"?`)) {
    deleteList(name);
    vocabLists.value = getLists();
    toast.info(`Deleted list "${name}"`);
  }
};

const renameListHandler = (oldName) => {
  const newName = prompt('Enter new name:', oldName);
  if (newName && newName !== oldName) {
    renameList(oldName, newName);
    vocabLists.value = getLists();
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.vocab-list-item {
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: #f8fafc;
  transition: all 0.2s;
}

.vocab-list-item:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>