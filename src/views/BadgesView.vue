<template>
  <div>
    <h1 class="page-title">Zdobyte odznaki</h1>

    <div class="badges-grid">
      <div 
        v-for="badge in badges" 
        :key="badge.id"
        class="badge-card" 
        :data-badge-id="badge.id"
      >
        <div 
          class="badge-icon" 
          :class="{ 'badge-locked': !badge.unlocked }"
          :style="badge.unlocked ? { backgroundColor: badge.color } : {}"
        >
          <template v-if="badge.unlocked">
            {{ badge.icon }}
          </template>
        </div>
        <div class="badge-title">{{ badge.name }}</div>
        <div class="badge-description">{{ badge.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DataService from '@/services/DataService';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

const userData = ref(DataService.getUserData());
const badges = ref<Badge[]>(userData.value.badges);
</script>