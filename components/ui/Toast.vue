<script setup lang="ts">
interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

const props = defineProps<{
  toast: ToastItem
}>();

const emit = defineEmits<{
  close: [id: number]
}>();

const handleClose = () => {
  emit('close', props.toast.id);
};
</script>

<template>
  <div
    class="p-4 rounded-md shadow-lg text-white max-w-md w-full transition-all duration-300 flex items-center justify-between z-[1000]"
    :class="{
      'bg-green-600': toast.type === 'success',
      'bg-red-600': toast.type === 'error',
      'bg-yellow-600': toast.type === 'warning',
      'bg-blue-500': toast.type === 'info',
    }"
  >
    <div class="flex items-center">
      <UiToastIcon :type="toast.type" />
      {{ toast.message }}
    </div>
    <button 
      @click="handleClose" 
      class="ml-4 text-white hover:text-gray-200 focus:outline-none transition-colors"
      aria-label="Close toast"
    >
      <span class="text-lg">×</span>
    </button>
  </div>
</template>