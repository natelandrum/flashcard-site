<script setup lang="ts">
import { toasts } from '~/composables/useToast';

// Extend the Window interface to include the $toast property
declare global {
  interface Window {
    $toast: {
      info: Function;
      success: Function;
      error: Function;
      warning: Function;
    }
  }
}

// Get the toast functions
const toast = useToast();

// Remove a toast when the close button is clicked
function removeToast(id: number) {
  toast.removeToast(id);
}

// Expose the toast functionality to the window if needed
onMounted(() => {
  if (import.meta.client) {
    window.$toast = {
      info: toast.info,
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
    };
  }
});
</script>

<template>
  <div class="toast-container flex flex-col gap-2 fixed bottom-4 right-4 z-[1000] max-w-md">
    <TransitionGroup name="toast">
      <UiToast
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        :style="{ zIndex: 1000 + toast.id }"
        class="mb-2"
        @close="removeToast"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>