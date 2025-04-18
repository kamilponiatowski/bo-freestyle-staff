<template>
  <div>
    <h1 class="page-title">Mój postęp</h1>

    <div class="dashboard-card mb-4">
      <h3>Podsumowanie postępu</h3>
      <canvas id="progressChart" ref="progressChart" width="400" height="200"></canvas>
    </div>

    <div class="dashboard-card mb-4">
      <h3>Postęp według kategorii</h3>
      <canvas id="categoryChart" ref="categoryChart" width="400" height="200"></canvas>
    </div>

    <div class="skills-container">
      <div class="skill-category">
        <div class="category-header">
          Twój dziennik treningowy
        </div>
        <div class="skill-list" style="padding: 1.5rem;">
          <h4 class="mb-2">Aktualny cel:</h4>
          <p class="mb-3">Wykonaj 1000 powtórzeń każdej umiejętności, by osiągnąć mistrzostwo</p>

          <h4 class="mb-2">Dzisiejszy plan:</h4>
          <ul class="mb-3">
            <li>50x Basic Flow (obie ręce)</li>
            <li>25x High/Low Whip</li>
            <li>20x Neck Wrap</li>
          </ul>

          <h4 class="mb-2">Dodaj dzisiejsze ćwiczenia:</h4>
          <div class="form-group">
            <label for="trainingDate" class="form-label">Data treningu:</label>
            <input 
              type="date" 
              id="trainingDate" 
              class="form-control" 
              v-model="trainingDate"
            >
          </div>

          <div class="form-group">
            <label for="trainingSkill" class="form-label">Ćwiczona umiejętność:</label>
            <select id="trainingSkill" class="form-control" v-model="trainingSkill">
              <option value="">Wybierz umiejętność</option>
              <option 
                v-for="(skill, id) in userData.skills" 
                :key="id" 
                :value="id"
              >
                {{ skill.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="trainingReps" class="form-label">Liczba powtórzeń:</label>
            <input 
              type="number" 
              id="trainingReps" 
              class="form-control" 
              min="1" 
              v-model="trainingReps"
            >
          </div>

          <div class="form-group">
            <label for="trainingNotes" class="form-label">Notatki:</label>
            <textarea 
              id="trainingNotes" 
              class="form-control" 
              rows="3"
              placeholder="Jak poszło dzisiejsze ćwiczenie?"
              v-model="trainingNotes"
            ></textarea>
          </div>

          <button id="addTrainingBtn" class="btn btn-primary" @click="addTraining">Dodaj trening</button>
        </div>
      </div>

      <div class="skill-category">
        <div class="category-header">
          Historia treningów
        </div>
        <div id="trainingHistory" class="skill-list" style="padding: 1.5rem;">
          <div 
            v-for="(entry, index) in trainingHistory" 
            :key="index"
            class="training-entry"
          >
            <div class="training-date">{{ formatDate(entry.date) }}</div>
            <div class="training-skill">{{ entry.skill }}</div>
            <div class="training-reps">{{ entry.reps }} powtórzeń</div>
            <div class="training-notes">{{ entry.notes || 'Brak notatek' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import DataService from '@/services/DataService';
import { showToast } from '@/services/ToastService';
import Chart from 'chart.js/auto';

const userData = ref(DataService.getUserData());
const trainingHistory = ref(userData.value.trainingHistory.slice(0, 10));
const progressChart = ref(null);
const categoryChart = ref(null);
const progressChartInstance = ref(null);
const categoryChartInstance = ref(null);

// Stan formularza
const today = new Date().toISOString().split('T')[0];
const trainingDate = ref(today);
const trainingSkill = ref('');
const trainingReps = ref(10);
const trainingNotes = ref('');

// Formatuj datę
const formatDate = (dateStr) => {
  if (!dateStr) return 'Brak daty';
  
  try {
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
  } catch (e) {
    return dateStr;
  }
};

// Inicjalizuj wykresy
onMounted(() => {
  if (progressChart.value && !progressChartInstance.value) {
    initProgressChart();
  }
  
  if (categoryChart.value && !categoryChartInstance.value) {
    initCategoryChart();
  }
});

// Zniszcz instancje wykresów przy demontażu komponentu, aby uniknąć memory leaks
onUnmounted(() => {
  if (progressChartInstance.value) {
    progressChartInstance.value.destroy();
    progressChartInstance.value = null;
  }
  
  if (categoryChartInstance.value) {
    categoryChartInstance.value.destroy();
    categoryChartInstance.value = null;
  }
});

// Inicjalizuj wykres postępu
const initProgressChart = () => {
  if (!progressChart.value) return;
  
  const ctx = progressChart.value.getContext('2d');
  
  // Przygotuj dane
  const chartData = prepareProgressChartData();
  
  progressChartInstance.value = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Postęp treningowy (liczba powtórzeń)',
          font: {
            size: 16
          }
        },
        legend: {
          position: 'bottom'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Liczba powtórzeń'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Data'
          }
        }
      }
    }
  });
};

// Inicjalizuj wykres kategorii
const initCategoryChart = () => {
  if (!categoryChart.value) return;
  
  const ctx = categoryChart.value.getContext('2d');
  
  // Przygotuj dane
  const chartData = prepareCategoryChartData();
  
  categoryChartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Postęp w kategoriach umiejętności',
          font: {
            size: 16
          }
        },
        legend: {
          position: 'bottom'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          stacked: true,
          title: {
            display: true,
            text: 'Liczba umiejętności'
          }
        },
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Kategoria'
          }
        }
      }
    }
  });
};

// Przygotowanie danych dla wykresu postępów
const prepareProgressChartData = () => {
  // Pobierz historię treningową
  const history = userData.value.trainingHistory || [];
  const dateSet = new Set();
  
  // Zbierz unikalne daty z historii (max. ostatnie 7 dni)
  history.forEach(entry => {
    dateSet.add(entry.date);
    if (dateSet.size >= 7) return;
  });
  
  // Sortuj daty
  const dates = Array.from(dateSet).sort();
  
  // Znajdź umiejętności z powtórzeniami
  const activeSkills = Object.entries(userData.value.skills)
    .filter(([_, data]) => data.reps > 0)
    .slice(0, 3); // Pokaż tylko top 3 umiejętności
  
  // Przygotuj dane dla wykresu
  const datasets = activeSkills.map(([skillId, skill]) => {
    // Wybierz kolor na podstawie kategorii
    let color;
    switch (skill.category) {
      case 'beginner':
        color = '#3498db'; // niebieski
        break;
      case 'intermediate':
        color = '#e67e22'; // pomarańczowy
        break;
      case 'advanced':
        color = '#e74c3c'; // czerwony
        break;
      default:
        color = '#2ecc71'; // zielony
    }
    
    // Przygotuj dane dla każdej daty
    const data = dates.map(date => {
      // Znajdź wpisy dla tej daty i tej umiejętności
      const entriesForDate = history.filter(entry => 
        entry.date === date && entry.skill === skill.name
      );
      
      // Sumuj powtórzenia dla danej daty
      return entriesForDate.reduce((sum, entry) => sum + (entry.reps || 0), 0);
    });
    
    return {
      label: skill.name,
      data: data,
      borderColor: color,
      backgroundColor: color + '1A', // Dodaj alpha dla przezroczystości
      tension: 0.4
    };
  });
  
  // Jeśli nie ma danych, dodaj przykładowe dane
  if (datasets.length === 0) {
    datasets.push({
      label: 'Brak danych',
      data: [0, 0, 0, 0, 0, 0, 0],
      borderColor: '#cccccc',
      backgroundColor: '#cccccc1A',
      tension: 0.4
    });
  }
  
  // Jeśli nie ma dat, dodaj przykładowe daty (ostatnie 7 dni)
  if (dates.length === 0) {
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
  }
  
  return {
    labels: dates.map(date => {
      // Formatujemy datę do postaci DD.MM
      const [year, month, day] = date.split('-');
      return `${day}.${month}`;
    }),
    datasets: datasets
  };
};

// Przygotowanie danych dla wykresu kategorii
const prepareCategoryChartData = () => {
  const categories = DataService.getCategories();
  
  // Przygotowanie danych dla każdej kategorii
  const data = categories.map(category => {
    // Znajdź umiejętności w tej kategorii
    const skills = Object.values(userData.value.skills).filter(skill => skill.category === category.id);
    
    // Oblicz postęp
    const completed = skills.filter(skill => skill.status === 'completed').length;
    const inProgress = skills.filter(skill => skill.status === 'in-progress').length;
    const notStarted = skills.length - completed - inProgress;
    
    return {
      category: category.name,
      color: category.color,
      completed,
      inProgress,
      notStarted
    };
  });
  
  // Formatowanie danych dla wykresu
  return {
    labels: data.map(item => item.category),
    datasets: [
      {
        label: 'Ukończone',
        data: data.map(item => item.completed),
        backgroundColor: '#2ecc71', // zielony
        stack: 'Stack 0'
      },
      {
        label: 'W trakcie',
        data: data.map(item => item.inProgress),
        backgroundColor: '#3498db', // niebieski
        stack: 'Stack 0'
      },
      {
        label: 'Nierozpoczęte',
        data: data.map(item => item.notStarted),
        backgroundColor: '#ecf0f1', // jasny szary
        stack: 'Stack 0'
      }
    ]
  };
};

// Aktualizacja wykresów po zmianach
const updateCharts = () => {
  if (progressChartInstance.value) {
    const progressData = prepareProgressChartData();
    progressChartInstance.value.data.labels = progressData.labels;
    progressChartInstance.value.data.datasets = progressData.datasets;
    progressChartInstance.value.update();
  }
  
  if (categoryChartInstance.value) {
    const categoryData = prepareCategoryChartData();
    categoryChartInstance.value.data.labels = categoryData.labels;
    categoryChartInstance.value.data.datasets = categoryData.datasets;
    categoryChartInstance.value.update();
  }
};

// Dodawanie treningu
const addTraining = () => {
  if (!trainingSkill.value || !trainingReps.value || trainingReps.value < 1) {
    showToast('Wypełnij wszystkie pola formularza', 'error');
    return;
  }
  
  // Dodaj powtórzenia
  const reps = parseInt(trainingReps.value);
  const success = DataService.addReps(trainingSkill.value, reps);
  
  if (success) {
    // Dodaj notatkę, jeśli istnieje
    if (trainingNotes.value.trim()) {
      DataService.addTrainingNote(trainingSkill.value, trainingNotes.value);
    }
    
    // Reset formularza
    trainingNotes.value = '';
    trainingReps.value = 10;
    trainingSkill.value = '';
    
    // Zaktualizuj dane użytkownika i historię treningów
    userData.value = DataService.getUserData();
    trainingHistory.value = userData.value.trainingHistory.slice(0, 10);
    
    // Odśwież wykresy
    updateCharts();
    
    showToast('Trening został dodany pomyślnie!');
    
    // Sprawdź, czy umiejętność została ukończona
    const skill = userData.value.skills[trainingSkill.value];
    if (skill && skill.status === 'completed') {
      showToast(`Gratulacje! Opanowałeś umiejętność: ${skill.name}`, 'success');
    }
  } else {
    showToast('Nie udało się dodać treningu', 'error');
  }
};
</script>