<template>
  <div>
    <h1 class="page-title">Tricki i umiejętności</h1>

    <div class="skills-container">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="skill-category"
      >
        <div class="category-header">
          {{ category.name }}
          <span class="category-progress">
            {{ getCategoryProgress(category.id) }}
          </span>
        </div>
        <div class="skill-list">
          <div 
            v-for="skill in getSkillsByCategory(category.id)" 
            :key="skill.id"
            class="skill-item" 
            :data-skill-id="skill.id"
            @click="showSkillDetail(skill.id)"
          >
            <input 
              type="checkbox" 
              class="skill-checkbox"
              :checked="skill.status === 'completed'"
              @click.stop
            >
            <div class="skill-info">
              <div class="skill-name">
                {{ skill.name }} 
                <span 
                  class="custom-badge" 
                  :class="{
                    'badge-new': skill.status === 'new',
                    'badge-in-progress': skill.status === 'in-progress',
                    'badge-completed': skill.status === 'completed'
                  }"
                >
                  {{ getStatusText(skill.status) }}
                </span>
              </div>
              <div class="skill-difficulty">
                <span 
                  v-for="star in 5" 
                  :key="star" 
                  class="skill-star"
                  :class="{ 'filled': star <= skill.difficulty }"
                >★</span>
              </div>
              <div class="skill-progress">
                <div 
                  class="skill-progress-value" 
                  :style="{ width: getProgressPercentage(skill) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal szczegółów umiejętności -->
    <div class="modal-backdrop" id="skillDetailModal" v-if="activeSkill" style="display: flex;">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ activeSkillDetails.name }}</h3>
          <button class="modal-close" @click="hideSkillDetail">&times;</button>
        </div>
        <div class="modal-body">
          <div class="skill-details-difficulty">
            <strong>Poziom trudności:</strong>
            <span 
              v-for="star in 5" 
              :key="star" 
              class="skill-star"
              :class="{ 'filled': star <= activeSkillDetails.difficulty }"
            >★</span>
          </div>

          <div class="skill-details-description">
            {{ activeSkillDetails.description }}
          </div>

          <div class="skill-video-container" v-if="activeSkillDetails.videoPath">
            <video controls>
              <source :src="activeSkillDetails.videoPath" type="video/mp4">
              Twoja przeglądarka nie obsługuje odtwarzania wideo.
            </video>
          </div>

          <div class="skill-tips">
            <h4>Wskazówki:</h4>
            <ul>
              <li v-for="(tip, index) in activeSkillDetails.tips" :key="index">{{ tip }}</li>
            </ul>
          </div>

          <div class="skill-rep-tracker">
            <h4>Licznik powtórzeń ({{ activeSkillDetails.reps }}/{{ activeSkillDetails.goalReps }})</h4>
            <div class="rep-progress">
              <div 
                class="rep-progress-value" 
                :style="{ width: getProgressPercentage(activeSkillDetails) + '%' }"
              ></div>
            </div>
            <div class="rep-input-container">
              <input 
                type="number" 
                class="rep-input" 
                placeholder="Liczba powtórzeń" 
                min="1" 
                v-model="repCount"
              >
              <button class="btn btn-primary" @click="addReps">Dodaj</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="hideSkillDetail">Zamknij</button>
          <button class="btn btn-success" @click="markSkillCompleted">Oznacz jako opanowane</button>
        </div>
      </div>
    </div>

    <!-- Modal z gratulacjami -->
    <div class="modal-backdrop" id="congratsModal" v-if="unlockedBadge" style="display: flex;">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Gratulacje!</h3>
          <button class="modal-close" @click="hideCongratsModal">&times;</button>
        </div>
        <div class="modal-body congrats-modal">
          <div class="badge-unlocked" :style="{ backgroundColor: unlockedBadge.color }">
            {{ unlockedBadge.icon }}
          </div>
          <h2 class="congrats-title">Zdobyłaś nową odznakę!</h2>
          <p class="congrats-text">
            Właśnie odblokowałaś odznakę "{{ unlockedBadge.name }}" - {{ unlockedBadge.description }}! Tak trzymaj!
          </p>
          <div class="congrats-icon">🎉</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="hideCongratsModal">Super!</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import DataService from '@/services/DataService';
import { showToast } from '@/services/ToastService';

const userData = ref(DataService.getUserData());
const categories = ref(DataService.getCategories());
const activeSkill = ref(null);
const activeSkillDetails = ref({});
const repCount = ref(10);
const unlockedBadge = ref(null);

// Pobierz umiejętności według kategorii
const getSkillsByCategory = (categoryId) => {
  return Object.entries(userData.value.skills)
    .filter(([_, skill]) => skill.category === categoryId)
    .map(([id, skill]) => ({
      id,
      ...skill
    }));
};

// Pobierz postęp kategorii
const getCategoryProgress = (categoryId) => {
  const skills = getSkillsByCategory(categoryId);
  const completed = skills.filter(skill => skill.status === 'completed').length;
  return `${completed}/${skills.length}`;
};

// Pobierz tekst statusu
const getStatusText = (status) => {
  switch (status) {
    case 'completed': return 'Ukończone';
    case 'in-progress': return 'W trakcie';
    default: return 'Nowy';
  }
};

// Pobierz procent postępu dla umiejętności
const getProgressPercentage = (skill) => {
  return Math.min(100, (skill.reps / skill.goalReps) * 100);
};

// Pokaż szczegóły umiejętności
const showSkillDetail = (skillId) => {
  activeSkill.value = skillId;
  activeSkillDetails.value = DataService.getSkillDetails(skillId);
};

// Ukryj szczegóły umiejętności
const hideSkillDetail = () => {
  activeSkill.value = null;
  // Zatrzymaj odtwarzanie wideo
  const videoElements = document.querySelectorAll('.skill-video-container video');
  videoElements.forEach(video => {
    video.pause();
  });
};

// Dodaj powtórzenia
const addReps = () => {
  if (!activeSkill.value) return;
  
  const reps = parseInt(repCount.value);
  if (!reps || reps < 1) {
    showToast('Wprowadź poprawną liczbę powtórzeń', 'error');
    return;
  }
  
  // Dodaj powtórzenia
  const success = DataService.addReps(activeSkill.value, reps);
  
  if (success) {
    // Zaktualizuj dane użytkownika
    userData.value = DataService.getUserData();
    
    // Sprawdź, czy umiejętność została ukończona
    const skill = userData.value.skills[activeSkill.value];
    
    if (skill.status === 'completed') {
      // Znajdź odznakę, która mogła zostać odblokowana
      const badge = userData.value.badges.find(b => b.unlocked && (
        (b.id === 'basic-flow-master' && activeSkill.value === 'basic-flow') ||
        (b.id === '1000-reps' && skill.reps >= 1000) ||
        (b.id === 'smooth-operator' && skill.reps >= 100)
      ));
      
      if (badge) {
        unlockedBadge.value = badge;
      }
      
      hideSkillDetail();
    } else {
      // Aktualizuj UI modalu
      activeSkillDetails.value = DataService.getSkillDetails(activeSkill.value);
      // Reset input
      repCount.value = 10;
      
      showToast(`Dodano ${reps} powtórzeń!`);
    }
  } else {
    showToast('Nie udało się dodać powtórzeń', 'error');
  }
};

// Oznacz umiejętność jako ukończoną
const markSkillCompleted = () => {
  if (!activeSkill.value) return;
  
  // Oznacz umiejętność jako ukończoną
  const success = DataService.markSkillAsCompleted(activeSkill.value);
  
  if (success) {
    // Zaktualizuj dane użytkownika
    userData.value = DataService.getUserData();
    
    // Znajdź odznakę, która mogła zostać odblokowana
    const badge = userData.value.badges.find(b => b.unlocked && (
      (b.id === 'basic-flow-master' && activeSkill.value === 'basic-flow') ||
      (b.id === '1000-reps')
    ));
    
    if (badge) {
      unlockedBadge.value = badge;
    }
    
    hideSkillDetail();
    showToast('Umiejętność została oznaczona jako opanowana!');
  } else {
    showToast('Nie udało się oznaczyć umiejętności jako ukończonej', 'error');
  }
};

// Ukryj gratulacje
const hideCongratsModal = () => {
  unlockedBadge.value = null;
};
</script>