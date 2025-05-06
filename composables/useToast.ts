interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

// Shared state for toasts - this will be used by ToastManager
export const toasts = ref<Toast[]>([]);
let nextId = 0;

export const useToast = () => {
  
  const addToast = (message: string, type: Toast['type'] = 'info', duration: number = 3000) => {
    const id = nextId++;
    const toast = { id, message, type, duration };
    toasts.value.push(toast);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration + 1000);
    
    return id;
  };
  
  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };
  
  return {
    // Toast methods
    info: (message: string, duration = 3000) => addToast(message, 'info', duration),
    success: (message: string, duration = 3000) => addToast(message, 'success', duration),
    error: (message: string, duration = 3000) => addToast(message, 'error', duration),
    warning: (message: string, duration = 3000) => addToast(message, 'warning', duration),
    
    // State
    toasts,
    removeToast
  };
};