<template>
  <div>
    <h1 class="page-title">Tricki i umiejętności</h1>

    <!-- Zakładka z listą do nauki -->
    <div v-if="learningList.length > 0" class="dashboard-card mb-4">
      <h3>Twoja lista do nauki</h3>
      <div class="learning-skills-grid">
        <div 
          v-for="skillId in learningList" 
          :key="skillId"
          class="skill-item" 
          @click="showSkillDetail(skillId)"
        >
          <input 
            type="checkbox" 
            class="skill-checkbox"
            :checked="isSkillCompleted(skillId)"
            @click.stop
          >
          <div class="skill-info">
            <div class="skill-name">
              {{ getSkillName(skillId) }} 
              <span 
                class="custom-badge" 
                :class="{
                  'badge-new': isSkillNew(skillId),
                  'badge-in-progress': isSkillInProgress(skillId),
                  'badge-completed': isSkillCompleted(skillId)
                }"
              >
                {{ getStatusText(getSkillStatus(skillId)) }}
              </span>
            </div>
            <div class="skill-difficulty">
              <span 
                v-for="star in 5" 
                :key="star" 
                class="skill-star"
                :class="{ 'filled': star <= getSkillDifficulty(skillId) }"
              >★</span>
            </div>
            <div class="skill-progress">
              <div 
                class="skill-progress-value" 
                :style="{ width: getProgressPercentage(skillId) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="learning-list-actions">
        <button class="btn btn-primary" @click="clearLearningList">Wyczyść listę nauki</button>
      </div>
    </div>

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
            :class="{ 'learning-item': isInLearningList(skill.id) }"
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
                <span v-if="isInLearningList(skill.id)" class="custom-badge badge-learning">Do nauki</span>
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
            <div class="video-placeholder">
              <span class="video-message">Wideo jest niedostępne</span>
              <span class="video-submessage">Materiał wideo zostanie dodany w najbliższym czasie</span>
            </div>
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
          <button 
            class="btn" 
            :class="isInLearningList(activeSkill) ? 'btn-outline-danger' : 'btn-outline-primary'"
            @click="toggleLearningList(activeSkill)"
          >
            {{ isInLearningList(activeSkill) ? 'Usuń z listy nauki' : 'Dodaj do listy nauki' }}
          </button>
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

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import DataService from '@/services/DataService';
import LearningListService from '@/services/LearningListService';
import { showToast } from '@/services/ToastService';
import type { UserData, Skill, Badge, SkillDetails, Category } from '@/types/data-service';

interface SkillWithId extends Skill {
  id: string;
}

const userData = ref<UserData>(DataService.getUserData());
const categories = ref<Category[]>(DataService.getCategories());
const activeSkill = ref<string | null>(null);
const activeSkillDetails = ref<SkillDetails>({} as SkillDetails);
const repCount = ref<number>(10);
const unlockedBadge = ref<Badge | null>(null);
const learningList = ref<string[]>(LearningListService.getLearningList());

// Obserwuj zmiany listy nauki
watch(() => learningList.value, () => {
  // Przy każdej zmianie listy nauki zapisz ją
  LearningListService.saveLearningList(learningList.value);
}, { deep: true });

// Pobierz umiejętności według kategorii
const getSkillsByCategory = (categoryId: string): SkillWithId[] => {
  return Object.entries(userData.value.skills)
    .filter(([_, skill]) => skill.category === categoryId)
    .map(([id, skill]) => ({
      id,
      ...skill
    }));
};

// Pobierz postęp kategorii
const getCategoryProgress = (categoryId: string): string => {
  const skills = getSkillsByCategory(categoryId);
  const completed = skills.filter(skill => skill.status === 'completed').length;
  return `${completed}/${skills.length}`;
};

// Pobierz tekst statusu
const getStatusText = (status: string): string => {
  switch (status) {
    case 'completed': return 'Ukończone';
    case 'in-progress': return 'W trakcie';
    default: return 'Nowy';
  }
};

// Pobierz procent postępu dla umiejętności
const getProgressPercentage = (skill: Skill | string): number => {
  if (typeof skill === 'string') {
    // Jeśli przekazano ID umiejętności
    const skillObj = userData.value.skills[skill];
    if (!skillObj) return 0;
    return Math.min(100, (skillObj.reps / skillObj.goalReps) * 100);
  }
  
  // Jeśli przekazano obiekt umiejętności
  return Math.min(100, (skill.reps / skill.goalReps) * 100);
};

// Funkcje pomocnicze dla listy nauki
const getSkillName = (skillId: string): string => {
  const skill = userData.value.skills[skillId];
  return skill ? skill.name : skillId;
};

const getSkillDifficulty = (skillId: string): number => {
  const skill = userData.value.skills[skillId];
  return skill ? skill.difficulty : 3;
};

const getSkillStatus = (skillId: string): string => {
  const skill = userData.value.skills[skillId];
  return skill ? skill.status : 'new';
};

const isSkillNew = (skillId: string): boolean => {
  return getSkillStatus(skillId) === 'new';
};

const isSkillInProgress = (skillId: string): boolean => {
  return getSkillStatus(skillId) === 'in-progress';
};

const isSkillCompleted = (skillId: string): boolean => {
  return getSkillStatus(skillId) === 'completed';
};

// Sprawdź, czy umiejętność jest na liście nauki
const isInLearningList = (skillId: string): boolean => {
  return learningList.value.includes(skillId);
};

// Dodaj/usuń z listy nauki
const toggleLearningList = (skillId: string): void => {
  if (isInLearningList(skillId)) {
    learningList.value = learningList.value.filter(id => id !== skillId);
    showToast(`Usunięto "${getSkillName(skillId)}" z listy nauki`);
  } else {
    learningList.value.push(skillId);
    showToast(`Dodano "${getSkillName(skillId)}" do listy nauki`);
  }
};

// Wyczyść listę nauki
const clearLearningList = (): void => {
  if (confirm('Czy na pewno chcesz wyczyścić całą listę nauki?')) {
    learningList.value = [];
    showToast('Lista nauki została wyczyszczona');
  }
};

// Pokaż szczegóły umiejętności
const showSkillDetail = (skillId: string): void => {
  activeSkill.value = skillId;
  activeSkillDetails.value = DataService.getSkillDetails(skillId);
};

// Ukryj szczegóły umiejętności
const hideSkillDetail = (): void => {
  activeSkill.value = null;
  // Zatrzymaj odtwarzanie wideo
  const videoElements = document.querySelectorAll('.skill-video-container video');
  videoElements.forEach(video => {
    if (video instanceof HTMLVideoElement) {
      video.pause();
    }
  });
};

// Dodaj powtórzenia
const addReps = (): void => {
  if (!activeSkill.value) return;
  
  const reps = parseInt(repCount.value.toString());
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
        (b.id === 'smooth-operator' && skill.reps >= 100 && activeSkill.value === 'basic-flow')
      ));
      
      if (badge) {
        unlockedBadge.value = badge;
      }
      
      // Usuń ukończoną umiejętność z listy nauki
      if (isInLearningList(activeSkill.value)) {
        learningList.value = learningList.value.filter(id => id !== activeSkill.value);
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
const markSkillCompleted = (): void => {
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
    
    // Usuń ukończoną umiejętność z listy nauki
    if (isInLearningList(activeSkill.value)) {
      learningList.value = learningList.value.filter(id => id !== activeSkill.value);
    }
    
    hideSkillDetail();
    showToast('Umiejętność została oznaczona jako opanowana!');
  } else {
    showToast('Nie udało się oznaczyć umiejętności jako ukończonej', 'error');
  }
};

// Ukryj gratulacje
const hideCongratsModal = (): void => {
  unlockedBadge.value = null;
};

// Inicjalizacja
onMounted(() => {
  // Pobierz listę nauki
  learningList.value = LearningListService.getLearningList();
});
</script>

<style scoped>
/* Styl dla elementów oznaczonych jako "do nauki" */
.learning-item {
  border-left: 3px solid var(--secondary);
  background-color: rgba(243, 156, 18, 0.05);
}

/* Lista umiejętności do nauki */
.learning-skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.learning-list-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

/* Badge dla umiejętności do nauki */
.badge-learning {
  background-color: var(--secondary);
}

/* Dodatkowe style dla placeholdera wideo */
.video-placeholder {
  width: 100%;
  height: 300px;
  background-color: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 8px;
}

.video-message {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.video-submessage {
  font-size: 1rem;
  opacity: 0.7;
}

/* Dodatkowe style dla przycisku outline-danger */
.btn-outline-danger {
  border: 1px solid var(--danger);
  color: var(--danger);
  background-color: transparent;
}

.btn-outline-danger:hover {
  background-color: var(--danger);
  color: white;
}

.btn-outline-primary {
  border: 1px solid var(--primary);
  color: var(--primary);
  background-color: transparent;
}

.btn-outline-primary:hover {
  background-color: var(--primary);
  color: white;
}
</style>