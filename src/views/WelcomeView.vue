<template>
    <div class="welcome-container">
      <div class="welcome-logo">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#8e44ad" />
          <path d="M30 70L70 30M30 50L70 50M30 30L70 70" stroke="white" stroke-width="5"
                stroke-linecap="round" />
        </svg>
      </div>
      <h1>Witaj w Freestyle Staff Academy</h1>
      <p>Twój osobisty tracker postępów w nauce Freestyle Staff</p>
      
      <div class="welcome-actions">
        <button class="btn btn-primary btn-block" @click="startJourney">Rozpocznij swoją przygodę</button>
        <button class="btn btn-outline btn-block" @click="goToProgress">Przejdź do swojego postępu</button>
      </div>
      
      <div class="mt-3">
        <p>
          Śledź swoje postępy, poznawaj nowe tricki i zdobywaj odznaki
          w swojej podróży w świecie Freestyle Staff! 💜
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  import DataService from '@/services/DataService';
  import { showToast } from '@/services/ToastService';
  import type { Badge } from '@/types/data-service';
  
  const router = useRouter();
  
  // Aktywuj odznakę First Steps przy pierwszym uruchomieniu
  const userData = DataService.getUserData();
  const firstStepsBadge = userData.badges.find((b: Badge) => b.id === 'first-steps');
  if (firstStepsBadge && !firstStepsBadge.unlocked) {
    firstStepsBadge.unlocked = true;
    DataService.saveUserData(userData);
  }
  
  // Funkcja do przejścia do dashboardu
  const startJourney = (): void => {
    router.push('/dashboard');
    showToast('Witaj w Freestyle Staff Academy! Zaczynamy przygodę! 🎉');
  };
  
  // Funkcja do przejścia do postępu
  const goToProgress = (): void => {
    router.push('/progress');
    showToast('Przejdźmy do Twojego postępu! 📊');
  };
  </script>