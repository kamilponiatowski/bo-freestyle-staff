<template>
    <div class="toast" :class="'toast-' + type">
      <span class="toast-icon">{{ icon }}</span>
      <span class="toast-message">{{ message }}</span>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'success'
    }
  });
  
  const icon = computed(() => {
    switch (props.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '✅';
    }
  });
  </script>