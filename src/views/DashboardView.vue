<template>
  <div id="dashboardPage">
    <h1 class="page-title">Witaj, Muszka! 💜</h1>

    <div class="dashboard-grid">
      <!-- Ogólny postęp -->
      <div class="dashboard-card stat-card">
        <div class="progress-ring">
          <svg>
            <circle class="progress-ring-circle progress-ring-bg" cx="60" cy="60" r="52" />
            <circle class="progress-ring-circle progress-ring-value" cx="60" cy="60" r="52"
              :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset" />
          </svg>
          <div class="progress-ring-text">
            <div class="progress-ring-percentage">{{ Math.round(totalProgress) }}%</div>
            <div class="progress-ring-label">ukończone</div>
          </div>
        </div>
        <h3>Ogólny postęp</h3>
      </div>

      <!-- Wykonane umiejętności -->
      <div class="dashboard-card stat-card">
        <div class="stat-value">{{ userData.progress.completedSkills }}</div>
        <div class="stat-label">Tricki opanowane</div>
        <h3>Wykonane umiejętności</h3>
      </div>

      <!-- Tricki w trakcie nauki -->
      <div class="dashboard-card stat-card">
        <div class="stat-value">{{ userData.progress.inProgressSkills }}</div>
        <div class="stat-label">W trakcie nauki</div>
        <h3>Tricki w trakcie</h3>
      </div>

      <!-- Ostatnie odznaki -->
      <div class="dashboard-card">
        <h3>Ostatnie odznaki</h3>
        <div v-for="badge in recentBadges" :key="badge.id" class="progress-container">
          <div class="progress-label">
            <span class="progress-title">{{ badge.name }}</span>
            <span class="progress-percentage">{{ badge.unlocked ? 'Zdobyta!' : '0%' }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-value" :style="{ width: badge.unlocked ? '100%' : '0%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <h2 class="page-title">Dzisiejszy trening</h2>

    <div class="dashboard-card">
      <h3>Plan treningowy na dziś</h3>
      <ul class="mb-3">
        <li v-for="(skill, index) in recommendedSkills" :key="skill.id">
          {{ skill.name }}: {{ recommendedReps[index] }} powtórzeń{{ skill.category === 'beginner' ? ' (obie ręce)' : ''
          }}
        </li>
        <li v-if="recommendedSkills.length === 0">
          Brak umiejętności do treningu. Zacznij od Basic Flow!
        </li>
      </ul>
      <button class="btn btn-primary" @click="startTodayTraining">Rozpocznij dzisiejszy trening</button>
    </div>

    <h2 class="page-title">Twoje następne kroki</h2>

    <div class="skills-container">
      <div class="skill-category">
        <div class="category-header">
          Tricki do opanowania
        </div>
        <div class="skill-list">
          <div v-for="skill in recommendedSkills" :key="skill.id" class="skill-item" :data-skill-id="skill.id"
            @click="showSkillDetail(skill.id)">
            <input type="checkbox" class="skill-checkbox" :checked="skill.status === 'completed'" @click.stop>
            <div class="skill-info">
              <div class="skill-name">
                {{ skill.name }}
                <span class="custom-badge" :class="{
                  'badge-new': skill.status === 'new',
                  'badge-in-progress': skill.status === 'in-progress',
                  'badge-completed': skill.status === 'completed'
                }">
                  {{ getStatusText(skill.status) }}
                </span>
              </div>
              <div class="skill-difficulty">
                <span v-for="star in 5" :key="star" class="skill-star"
                  :class="{ 'filled': star <= skill.difficulty }">★</span>
              </div>
              <div class="skill-progress">
                <div class="skill-progress-value" :style="{ width: getProgressPercentage(skill) + '%' }"></div>
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
            <span v-for="star in 5" :key="star" class="skill-star"
              :class="{ 'filled': star <= activeSkillDetails.difficulty }">★</span>
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
              <div class="rep-progress-value" :style="{ width: getProgressPercentage(activeSkillDetails) + '%' }"></div>
            </div>
            <div class="rep-input-container">
              <input type="number" class="rep-input" placeholder="Liczba powtórzeń" min="1" v-model="repCount">
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DataService from '@/services/DataService';
import { showToast } from '@/services/ToastService';

// Importujemy typy
import type {
  UserData,
  Skill,
  Badge,
  SkillDetails
} from '@/types/data-service';

interface SkillWithId extends Skill {
  id: string;
}

const router = useRouter();
const userData = ref<UserData>(DataService.getUserData());
const activeSkill = ref<string | null>(null);
const activeSkillDetails = ref<SkillDetails>({} as SkillDetails);
const repCount = ref<number>(10);
const unlockedBadge = ref<Badge | null>(null);

// Obliczenie całkowitego postępu - teraz jako stała wartość obliczona jednorazowo
const totalProgress = computed((): number => {
  const skills = Object.values(userData.value.skills);
  if (skills.length === 0) return 0;

  let completedReps = 0;
  let totalGoal = 0;

  skills.forEach(skill => {
    completedReps += skill.reps || 0;
    totalGoal += skill.goalReps || 1000;
  });

  return (completedReps / totalGoal) * 100;
});

// Obliczenie danych dla kółka postępu
const circumference = computed((): number => 2 * Math.PI * 52);
const dashOffset = computed((): number => {
  return circumference.value - (totalProgress.value / 100) * circumference.value;
});

// Pobierz ostatnie odznaki (3)
const recentBadges = computed((): Badge[] => {
  return userData.value.badges.slice(0, 3);
});

// Pobierz rekomendowane umiejętności do treningu
const recommendedSkills = computed((): SkillWithId[] => {
  // Znajdź umiejętności do treningu (w trakcie lub nowe)
  return Object.entries(userData.value.skills)
    .filter(([_, skill]) => skill.status !== 'completed')
    .sort((a, b) => {
      // Priorytetyzuj umiejętności w trakcie
      const statusPriority: Record<string, number> = {
        'in-progress': 0,
        'new': 1
      };
      return statusPriority[a[1].status] - statusPriority[b[1].status];
    })
    .map(([id, skill]) => ({
      id,
      ...skill
    }))
    .slice(0, 4);
});

// Zalecana liczba powtórzeń dla każdej umiejętności
const recommendedReps = computed((): number[] => {
  return recommendedSkills.value.map(skill => {
    if (skill.status === 'in-progress') {
      return Math.min(50, Math.ceil((skill.goalReps - skill.reps) / 20));
    } else {
      return 20; // Dla nowych umiejętności
    }
  });
});

// Pobierz tekst statusu
const getStatusText = (status: string): string => {
  switch (status) {
    case 'completed': return 'Ukończone';
    case 'in-progress': return 'W trakcie';
    default: return 'Nowy';
  }
};

// Pobierz procent postępu dla umiejętności
const getProgressPercentage = (skill: Skill): number => {
  return Math.min(100, (skill.reps / skill.goalReps) * 100);
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
        (b.id === 'smooth-operator' && activeSkill.value === 'basic-flow' && skill.reps >= 100)
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

// Rozpocznij dzisiejszy trening
const startTodayTraining = (): void => {
  router.push('/skills');
  showToast('Rozpoczęto dzisiejszy trening!');
};
</script>