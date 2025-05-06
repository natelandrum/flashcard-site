<script setup lang="ts">
import type { ProgressInfo } from '~/types';

defineProps<ProgressInfo>();
</script>

<template>
  <div class="mb-6">
    <div class="flex justify-between text-sm text-gray-400 mb-1 transition-colors duration-200">
      <span>Progress: {{ current }} / {{ total }}</span>
      <span>{{ percentage }}%</span>
    </div>
    <div class="w-full bg-gray-700 rounded-full h-2.5 transition-colors duration-200">
      <div 
        class="bg-white h-2.5 rounded-full transition-colors duration-200" 
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>