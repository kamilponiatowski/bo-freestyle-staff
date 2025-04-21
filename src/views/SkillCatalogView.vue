<template>
    <div class="skill-catalog">
      <h1 class="page-title">Katalog umiejętności <span class="accent-text">Freestyle Staff</span></h1>
      
      <div class="filters-container">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Szukaj triku..." 
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
        
        <div class="filter-tabs">
          <button 
            v-for="category in categories" 
            :key="category.id"
            :class="['filter-tab', { active: activeCategory === category.id }]"
            @click="setActiveCategory(category.id)"
            :style="{ borderColor: category.color }"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
      
      <div class="skill-grid">
        <div 
          v-for="skill in filteredSkills" 
          :key="skill.id"
          class="skill-card"
          :class="{ 'selected-for-learning': learningList.includes(skill.id) }"
          @click="toggleSkillDetails(skill.id)"
        >
          <div class="skill-card-header" :style="{ backgroundColor: getCategoryColor(skill.category) }">
            <h3>{{ skill.name }}</h3>
            <div class="skill-difficulty">
              <span 
                v-for="star in 5" 
                :key="star" 
                class="skill-star"
                :class="{ 'filled': star <= skill.difficulty }"
              >★</span>
            </div>
          </div>
          
          <div class="skill-card-body">
            <p class="skill-description">{{ getShortDescription(skill) }}</p>
            
            <div class="skill-meta">
              <span class="skill-category-tag" :style="{ backgroundColor: getCategoryColor(skill.category) }">
                {{ getCategoryName(skill.category) }}
              </span>
              <span class="skill-video-count">
                {{ skill.videos.length }} {{ skill.videos.length === 1 ? 'wideo' : 'wideów' }}
              </span>
            </div>
            
            <div class="skill-actions">
              <button class="btn-outline" @click.stop="toggleLearningList(skill.id)">
                {{ learningList.includes(skill.id) ? 'Usuń z listy' : 'Dodaj do nauki' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Widok szczegółów umiejętności -->
      <div v-if="selectedSkill" class="skill-details-modal" @click.self="closeSkillDetails">
        <div class="skill-details-content">
          <button class="close-button" @click="closeSkillDetails">&times;</button>
          
          <div class="skill-details-header" :style="{ backgroundColor: getCategoryColor(selectedSkill.category) }">
            <h2>{{ selectedSkill.name }}</h2>
            <div class="skill-difficulty">
              <span 
                v-for="star in 5" 
                :key="star" 
                class="skill-star"
                :class="{ 'filled': star <= selectedSkill.difficulty }"
              >★</span>
            </div>
          </div>
          
          <div class="skill-details-body">
            <p class="skill-full-description">{{ selectedSkill.description }}</p>
            
            <div class="skill-video-section">
              <h3>Materiały wideo:</h3>
              <ul class="video-list">
                <li v-for="video in selectedSkill.videos" :key="video.id" class="video-item">
                  <div class="video-card" @click="playVideo(video)">
                    <div class="video-thumbnail">
                      <!-- Używamy placeholder zamiast próby ładowania obrazów, które mogą nie istnieć -->
                      <div class="video-placeholder" :style="{ backgroundColor: getCategoryColor(selectedSkill.category) + '80' }">
                        <span class="video-icon">🎬</span>
                      </div>
                      <div class="play-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polygon points="10 8 16 12 10 16 10 8"></polygon>
                        </svg>
                      </div>
                    </div>
                    <div class="video-info">
                      <h4>{{ video.title }}</h4>
                      <p>{{ video.duration }}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            
            <div class="skill-tips-section" v-if="selectedSkill.tips && selectedSkill.tips.length">
              <h3>Wskazówki:</h3>
              <ul class="tips-list">
                <li v-for="(tip, index) in selectedSkill.tips" :key="index">
                  {{ tip }}
                </li>
              </ul>
            </div>
            
            <div class="skill-progress-section">
              <h3>Twój postęp:</h3>
              <div class="progress-bar">
                <div 
                  class="progress-bar-value" 
                  :style="{ width: `${getSkillProgress(selectedSkill.id)}%` }"
                ></div>
              </div>
              <p class="progress-text">
                {{ getSkillProgressReps(selectedSkill.id) }} / {{ selectedSkill.goalReps || 1000 }} powtórzeń
              </p>
              
              <div class="add-reps-form">
                <input 
                  type="number" 
                  v-model="repsToAdd" 
                  min="1" 
                  max="100" 
                  placeholder="Liczba powtórzeń"
                />
                <button class="btn-primary" @click="addReps(selectedSkill.id)">
                  Dodaj powtórzenia
                </button>
              </div>
            </div>
          </div>
          
          <div class="skill-details-footer">
            <button class="btn-primary" @click="addToLearningPlan(selectedSkill.id)">
              {{ learningList.includes(selectedSkill.id) ? 'Usuń z planu nauki' : 'Dodaj do planu nauki' }}
            </button>
            <button class="btn-outline" @click="closeSkillDetails">Zamknij</button>
          </div>
        </div>
      </div>
      
      <!-- Lista "Do nauki" -->
      <div class="learning-list-container" v-show="learningList.length > 0">
        <h2>Twoja lista do nauki</h2>
        <ul class="learning-list">
          <li 
            v-for="skillId in learningList" 
            :key="skillId"
            class="learning-list-item"
          >
            <span class="learning-item-name">{{ getSkillById(skillId).name }}</span>
            <div class="learning-item-actions">
              <button class="btn-small" @click="toggleSkillDetails(skillId)">Szczegóły</button>
              <button class="btn-small btn-danger" @click="removeFromLearningList(skillId)">Usuń</button>
            </div>
          </li>
        </ul>
        <div class="learning-list-actions">
          <button class="btn-primary" @click="startLearningSession" :disabled="learningList.length === 0">
            Rozpocznij naukę
          </button>
          <button class="btn-outline" @click="clearLearningList" :disabled="learningList.length === 0">
            Wyczyść listę
          </button>
        </div>
      </div>
  
      <!-- Video Player Modal -->
      <div v-if="activeVideo" class="video-modal" @click.self="closeVideoPlayer">
        <div class="video-modal-content">
          <button class="close-button" @click="closeVideoPlayer">&times;</button>
          <h3 class="video-title">{{ activeVideo.title }}</h3>
          <div class="video-player-container">
            <div class="video-placeholder-large">
              <span class="video-message">Wideo jest niedostępne</span>
              <span class="video-submessage">Materiał wideo zostanie dodany w najbliższym czasie</span>
            </div>
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
            <button class="btn-primary" @click="hideCongratsModal">Super!</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import DataService from '@/services/DataService';
  import { showToast } from '@/services/ToastService';
  
  interface Video {
    id: string;
    title: string;
    path: string;
    duration: string;
  }
  
  interface Skill {
    id: string;
    name: string;
    category: string;
    difficulty: number;
    description: string;
    shortDescription?: string;
    videos: Video[];
    tips?: string[];
    goalReps: number;
  }
  
  interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    unlocked: boolean;
  }
  
  const router = useRouter();
  const userData = ref(DataService.getUserData());
  const categories = ref(DataService.getCategories());
  const activeCategory = ref('all');
  const searchQuery = ref('');
  const selectedSkillId = ref<string | null>(null);
  const learningList = ref<string[]>(JSON.parse(localStorage.getItem('learningList') || '[]'));
  const repsToAdd = ref(10);
  const activeVideo = ref<Video | null>(null);
  const unlockedBadge = ref<Badge | null>(null);
  
  // Katalog wszystkich umiejętności
  const allSkills = ref<Skill[]>([
    {
      id: 'basic-flow',
      name: 'Basic Flow',
      category: 'beginner',
      difficulty: 1,
      description: 'Basic Flow to fundament Freestyle Staff Spinningu. To najważniejsza umiejętność, która pozwala zrozumieć podstawowe mechaniki i przepływ ruchu staffa.',
      shortDescription: 'Podstawowa technika będąca fundamentem wszystkich ruchów staffa.',
      videos: [
        { id: 'basic-flow-1', title: 'Podstawy Basic Flow', path: '/videos/basic-flow-1.mp4', duration: '5:24' },
        { id: 'basic-flow-2', title: 'Ósemki do przodu', path: '/videos/basic-flow-2.mp4', duration: '3:12' },
        { id: 'basic-flow-3', title: 'Ósemki do tyłu', path: '/videos/basic-flow-3.mp4', duration: '4:05' },
        { id: 'basic-flow-4', title: 'Pełny Basic Flow', path: '/videos/basic-flow-4.mp4', duration: '6:30' },
        { id: 'grip-tips', title: 'Wskazówki dotyczące chwytu', path: '/videos/grip-tips.mp4', duration: '2:15' }
      ],
      tips: [
        'Zacznij powoli, skupiając się na poprawnej technice',
        'Utrzymuj łokcie blisko ciała dla lepszej kontroli',
        'Ćwicz obie strony (prawą i lewą rękę) równomiernie',
        'Powtarzaj do momentu aż ruch stanie się naturalny i płynny'
      ],
      goalReps: 1000
    },
    {
      id: 'basic-pass',
      name: 'Basic Pass',
      category: 'beginner',
      difficulty: 2,
      description: 'Basic Pass to proste, efektywne przejście z ósemek do przodu. Powinno być wykonywane szybko i efektywnie, bez zbędnych ozdobników.',
      shortDescription: 'Proste przejście między rękami podczas wykonywania ósemek do przodu.',
      videos: [
        { id: 'basic-pass-1', title: 'Basic Pass - wprowadzenie', path: '/videos/basic-pass-1.mp4', duration: '3:45' },
        { id: 'basic-pass-2', title: 'Przejście z ósemek do przodu', path: '/videos/basic-pass-2.mp4', duration: '4:20' }
      ],
      tips: [
        'Skup się na prostych mechanizmach',
        'Wykonuj szybko i efektywnie',
        'Zachowaj płynność ruchu'
      ],
      goalReps: 1000
    },
    {
      id: 'dip-pass',
      name: 'Dip Pass',
      category: 'beginner',
      difficulty: 2,
      description: 'Dip Pass to przejście wsteczne, pochodzące z ósemek do tyłu. Ma być szybkim i prostym przejściem, stanowiącym podstawę dla bardziej złożonych ruchów.',
      shortDescription: 'Przejście wsteczne wykonywane z ósemek do tyłu.',
      videos: [
        { id: 'dip-pass-1', title: 'Dip Pass - podstawy', path: '/videos/dip-pass-1.mp4', duration: '4:15' },
        { id: 'dip-pass-2', title: 'Przejście z ósemek do tyłu', path: '/videos/dip-pass-2.mp4', duration: '3:50' }
      ],
      tips: [
        'Staff będzie prostopadły w centrum ciała przed przejściem',
        'Trzymaj staff blisko siebie',
        'Tylna część ręki przechodzącej dotyka czoła'
      ],
      goalReps: 1000
    },
    {
      id: 'simple-combo',
      name: 'Simple Combo',
      category: 'beginner',
      difficulty: 2,
      description: 'Simple Combo to pierwsza kombinacja pokazująca, jak różne elementy Staff Spinningu łączą się ze sobą. Używamy obu rąk i dwóch różnych przejść w jednym płynnym ruchu.',
      shortDescription: 'Pierwsza kombinacja łącząca Basic Flow, Basic Pass i Dip Pass.',
      videos: [
        { id: 'simple-combo-1', title: 'Simple Combo - wprowadzenie', path: '/videos/simple-combo-1.mp4', duration: '5:30' },
        { id: 'simple-combo-2', title: 'Simple Combo - objaśnienie', path: '/videos/simple-combo-2.mp4', duration: '7:15' }
      ],
      tips: [
        'Ćwicz prawą i lewą ręką',
        'Zachowaj prostotę, używając tylko podstawowych mechanizmów',
        'Dąż do wykonania 10 powtórzeń pod rząd, obu rękami'
      ],
      goalReps: 1000
    },
    {
      id: 'neck-wrap',
      name: 'Neck Wrap',
      category: 'beginner',
      difficulty: 3,
      description: 'Neck Wrap to twoje pierwsze wprowadzenie do technik owijania, stanowiące alternatywę dla Basic Pass. Jest to efektywny sposób na urozmaicenie przepływu i dodanie widowiskowości.',
      shortDescription: 'Pierwszy ruch owijania staffa wokół szyi.',
      videos: [
        { id: 'neck-wrap-1', title: 'Wprowadzenie do Neck Wrap', path: '/videos/neck-wrap-1.mp4', duration: '6:10' },
        { id: 'neck-wrap-2', title: 'Technika Neck Wrap', path: '/videos/neck-wrap-2.mp4', duration: '4:45' }
      ],
      tips: [
        'ZAWSZE owijaj staff tak daleko, jak to możliwe, PRZED wypuszczeniem',
        'Zacznij od powolnego ćwiczenia, aby zrozumieć mechanikę',
        'Nie bój się początkowo dotykać szyi staffem - to normalne'
      ],
      goalReps: 1000
    },
    {
      id: 'shoulder-wrap',
      name: 'Shoulder Wrap',
      category: 'beginner',
      difficulty: 3,
      description: 'Shoulder Wrap to alternatywa dla Neck Wrap i wprowadzenie do serii zawijania. Jest świetnym dodatkiem do praktyki walki/ruchu bojowego, będąc szybkim, efektownym i nieoczekiwanym elementem.',
      shortDescription: 'Technika owijania staffa wokół ramienia, idealna do sekwencji bojowych.',
      videos: [
        { id: 'shoulder-wrap-1', title: 'Shoulder Wrap - podstawy', path: '/videos/shoulder-wrap-1.mp4', duration: '5:20' },
        { id: 'shoulder-wrap-2', title: 'Shoulder Wrap - technika', path: '/videos/shoulder-wrap-2.mp4', duration: '4:10' }
      ],
      tips: [
        'Pamiętaj o 1. Zasadzie Zawijania - zawijaj tak dużo, jak to możliwe PRZED wypuszczeniem',
        'Ćwicz przed lustrem, aby znaleźć optymalne ułożenie',
        'Ta umiejętność zawsze będzie pochodzić z ósemek do przodu'
      ],
      goalReps: 1000
    },
    {
      id: 'high-low-whip',
      name: 'High/Low Whip',
      category: 'intermediate',
      difficulty: 3,
      description: 'High/Low Whip (znany również jako Obi Ani) to prosty, ale niezwykle skuteczny i piękny trik. Może być używany jako element przepływu oraz jako element bojowy. W późniejszych umiejętnościach pomaga budować energię przed rzucaniem.',
      shortDescription: 'Elegancki ruch przypominający bicz, wykonywany na górze i na dole.',
      videos: [
        { id: 'high-whip-1', title: 'High Whip - wprowadzenie', path: '/videos/high-whip-1.mp4', duration: '4:30' },
        { id: 'low-whip-1', title: 'Low Whip - wprowadzenie', path: '/videos/low-whip-1.mp4', duration: '3:55' },
        { id: 'high-low-whip-1', title: 'Pełny High/Low Whip', path: '/videos/high-low-whip-1.mp4', duration: '6:25' }
      ],
      tips: [
        'Upewnij się, że High Whip następuje w pozycji godziny 12',
        'Podczas Low Whip trzymaj kostki przy pasie',
        'Dla sztywnych nadgarstków, obróć biodra podczas Low Whip'
      ],
      goalReps: 1000
    },
    {
      id: 'continuous-passing',
      name: 'Continuous Passing',
      category: 'intermediate',
      difficulty: 2,
      description: 'Continuous Passing to jeden z najlepszych sposobów na zrozumienie, jak różne elementy Staff Spinningu łączą się ze sobą. Używamy struktury Basic Flow do wszystkich poznanych technik, tworząc płynny, ciągły ruch.',
      shortDescription: 'Technika ciągłego przepływu i przekazywania staffa z ręki do ręki.',
      videos: [
        { id: 'continuous-passing-1', title: 'Wprowadzenie do Continuous Passing', path: '/videos/continuous-passing-1.mp4', duration: '3:45' },
        { id: 'forward-continuous-passing-1', title: 'Forward Continuous Passing', path: '/videos/forward-continuous-passing-1.mp4', duration: '5:10' },
        { id: 'reverse-continuous-passing-1', title: 'Reverse Continuous Passing', path: '/videos/reverse-continuous-passing-1.mp4', duration: '4:50' }
      ],
      tips: [
        'Obracaj ramionami całkowicie w płaszczyźnie przedniej i tylnej',
        'Upewnij się, że staff jest równoległy do płaszczyzny przed przejściem',
        'W razie potrzeby dodaj dodatkowe ósemki, aby spowolnić przepływ'
      ],
      goalReps: 1000
    },
    {
      id: 'windmill',
      name: 'Windmill',
      category: 'intermediate',
      difficulty: 3,
      description: 'Windmill to prosta, ale elegancka technika, którą można wykonać prawie każdym rekwizytem. Dodaje tekstury do przepływu poprzez zmiany wysokości i płaszczyzn, pomagając w głębszym zrozumieniu pracy w wielu wymiarach.',
      shortDescription: 'Obrotowy ruch staffa przypominający wiatrak, z wykorzystaniem różnych poziomów.',
      videos: [
        { id: 'windmill-1', title: 'Windmill - wprowadzenie', path: '/videos/windmill-1.mp4', duration: '5:35' },
        { id: 'windmill-2', title: 'Windmill - technika', path: '/videos/windmill-2.mp4', duration: '4:20' }
      ],
      tips: [
        'Rozpocznij rozgrzewkę od Basic Flow',
        'Ustanów swoją bazę i obracaj się tylko z bioder',
        'Kontroluj wysokość staffa przez cały czas trwania ruchu'
      ],
      goalReps: 1000
    },
    {
      id: 'two-hand-spin',
      name: '2 Hand Spin',
      category: 'intermediate',
      difficulty: 3,
      description: 'Two Hand Spin to powtarzalne przejście, które może być wykonywane do przodu lub do tyłu. Jest to również ważny postęp w kierunku Thumbflips, które będą jednym z głównych sposobów rzucania staffa.',
      shortDescription: 'Technika obracania staffa obiema rękami, kluczowa dla wielu zaawansowanych ruchów.',
      videos: [
        { id: 'two-hand-spin-1', title: '2 Hand Spin - wprowadzenie', path: '/videos/two-hand-spin-1.mp4', duration: '6:15' },
        { id: 'two-hand-spin-2', title: '2 Hand Spin - technika', path: '/videos/two-hand-spin-2.mp4', duration: '5:40' }
      ],
      tips: [
        'Bądź cierpliwy, poczekaj aż staff całkowicie się obróci wokół kciuka',
        'Trzymaj OBE dłonie skierowane w górę podczas przejścia',
        'Dopasuj podanie - kciuki powinny się stykać',
        'Zacznij wolno, prędkość zwiększy się wraz z opanowaniem techniki'
      ],
      goalReps: 1000
    },
    {
      id: 'backhand-flip',
      name: 'Backhand Flip',
      category: 'advanced',
      difficulty: 4,
      description: 'Backhand Flip to jeden z najbardziej wszechstronnych i prostych sposobów rzucania staffa. Jest świetnym punktem wyjściowym do nauki, jak wprowadzać i wyprowadzać staff z rąk, wykonując szybkie, efektywne i przewidywalne rzuty.',
      shortDescription: 'Podstawowa technika podrzucania staffa zewnętrzną częścią dłoni.',
      videos: [
        { id: 'backhand-flip-1', title: 'Wprowadzenie do Backhand Flip', path: '/videos/backhand-flip-1.mp4', duration: '4:30' },
        { id: 'backhand-flip-2', title: 'Deadstick Backhand - ćwiczenie', path: '/videos/backhand-flip-2.mp4', duration: '3:15' },
        { id: 'backhand-flip-3', title: 'Pełny Backhand Flip', path: '/videos/backhand-flip-3.mp4', duration: '5:50' }
      ],
      tips: [
        'Obróć całkowicie rękę przed wypuszczeniem staffa',
        'Jeśli brakuje Ci mobilności - lekko obróć biodra i ramiona',
        'Wyciągnij rękę z rotacji po wypuszczeniu',
        'Łap dłonią do góry',
        'Staff musi wykonać minimum 1 pełny obrót'
      ],
      goalReps: 1000
    },
    {
      id: 'thumbflips',
      name: 'Thumbflips',
      category: 'advanced',
      difficulty: 4,
      description: 'Thumbflips są głównym sposobem rzucania w Freestyle Staff. Pozwalają na pełną kontrolę wysokości, kierunku, umiejscowienia i prędkości obrotu podczas rzutu, przy minimalnym wysiłku. Większość momentu obrotowego generowana jest w nadgarstku.',
      shortDescription: 'Podstawowa technika podrzucania staffa z wykorzystaniem kciuka jako punktu obrotu.',
      videos: [
        { id: 'thumbflips-1', title: 'Wprowadzenie do Thumbflips', path: '/videos/thumbflips-1.mp4', duration: '5:20' },
        { id: 'thumbflips-2', title: 'Thumbdrop - ćwiczenie', path: '/videos/thumbflips-2.mp4', duration: '3:40' },
        { id: 'thumbflips-3', title: 'Thumbflip z lewą ręką', path: '/videos/thumbflips-3.mp4', duration: '6:10' }
      ],
      tips: [
        'Bądź cierpliwy, pozwól staffowi obrócić się całkowicie wokół kciuka przed wypuszczeniem',
        'Złap dłonią do góry lewą ręką na początek',
        'Jeśli technika się cofa, wróć do ćwiczeń 2 Hand Spin i Thumbdrop'
      ],
      goalReps: 1000
    },
    {
      id: 'rocket',
      name: 'Rocket',
      category: 'advanced',
      difficulty: 5,
      description: 'Rocket może wyglądać na trudny i niebezpieczny trik, ale w rzeczywistości jest dość prosty mechanicznie i dostępny dla większości praktykujących z odrobiną cierpliwości. Jest to pierwsze spojrzenie na wykorzystanie podstawowych umiejętności w różnych poziomach i płaszczyznach.',
      shortDescription: 'Efektowny ruch "wystrzeliwujący" staff pionowo w górę.',
      videos: [
        { id: 'rocket-1', title: 'Rocket - wprowadzenie', path: '/videos/rocket-1.mp4', duration: '4:45' },
        { id: 'rocket-2', title: 'Rocket - technika', path: '/videos/rocket-2.mp4', duration: '5:30' }
      ],
      tips: [
        'Rozgrzej się Backhand Flips (20-50 powtórzeń)',
        'Trzymaj ramiona PROSTE przez cały czas!',
        'Skieruj górny koniec w dół tak długo, jak to możliwe',
        'Używaj miękkich rąk do łapania',
        'Upuszczanie jest częścią procesu nauki - nie zniechęcaj się'
      ],
      goalReps: 1000
    },
    {
      id: 'handrolls',
      name: 'Handrolls',
      category: 'advanced',
      difficulty: 5,
      description: 'Handrolls (Wycieraczka) to świetne wprowadzenie do technik rolowania. Jest to szybki, prosty i niezwykle wszechstronny ruch, będący podstawą dla bardziej zaawansowanych technik rolowania. Wycieraczka to dobry sposób na ćwiczenie obu stron handroll i zmiany kierunku.',
      shortDescription: 'Podstawowa technika rolowania staffa po dłoniach.',
      videos: [
        { id: 'handrolls-1', title: 'Wprowadzenie do Handrolls', path: '/videos/handrolls-1.mp4', duration: '5:15' },
        { id: 'handrolls-2', title: 'Wycieraczka - technika', path: '/videos/handrolls-2.mp4', duration: '4:40' }
      ],
      tips: [
        'ZWOLNIJ! Rolki poruszają się wolniej niż inne umiejętności',
        'Skup się na punktach wejścia i wyjścia każdej rolki',
        'Zakotwicz i ustabilizuj stopy',
        'Mniej znaczy więcej - mniej wysiłku, napięcia i energii',
        'Zawsze rozgrzewaj się ćwiczeniami postępującymi'
      ],
      goalReps: 1000
    },
    {
      id: 'elbow-rolls',
      name: 'Elbow Rolls',
      category: 'advanced',
      difficulty: 5,
      description: 'Elbow Rolls to jedna z najważniejszych i najbardziej fundamentalnych technik rolowania. Pojawia się wielokrotnie w wielu złożonych, zaawansowanych rolkach. Są podobne do Arm Rolls, ale bliskość twarzy i zwiększony kontakt ze skórą czyni je nieco trudniejszymi.',
      shortDescription: 'Technika rolowania staffa po łokciu, kluczowa dla zaawansowanych ruchów.',
      videos: [
        { id: 'elbow-rolls-1', title: 'Wprowadzenie do Elbow Rolls', path: '/videos/elbow-rolls-1.mp4', duration: '6:20' },
        { id: 'outside-inside-elbow-roll-1', title: 'Outside to Inside Elbow Roll', path: '/videos/outside-inside-elbow-roll-1.mp4', duration: '4:50' },
        { id: 'inside-outside-elbow-roll-1', title: 'Inside to Outside Elbow Roll', path: '/videos/inside-outside-elbow-roll-1.mp4', duration: '5:10' },
        { id: 'double-elbow-roll-1', title: 'Double Elbow Roll', path: '/videos/double-elbow-roll-1.mp4', duration: '7:30' }
      ],
      tips: [
        'ZWOLNIJ! Rolki mają swój własny rytm i czas',
        'Skup się na punktach wejścia i wyjścia',
        'Ustabilizuj dolną część ciała',
        'Mniej wysiłku daje lepsze rezultaty',
        'Wracaj do ćwiczeń podstawowych, jeśli umiejętność się cofa'
      ],
      goalReps: 1000
    },
    {
      id: 'double-elbow-roll',
      name: 'Double Elbow Roll',
      category: 'advanced',
      difficulty: 5,
      description: 'Double Elbow Roll to złożona technika rolowania, łącząca dwa pojedyncze Elbow Rolls. Ta podwójna umiejętność jest tak wszechstronna, że stanowi podstawę dla wielu technik rolowania górnej części ciała. Dzięki niej zaczniesz odkrywać tempo i rytm charakterystyczny dla rolek.',
      shortDescription: 'Zaawansowana technika łącząca dwa rolowania po łokciach w jeden płynny ruch.',
      videos: [
        { id: 'double-elbow-roll-1', title: 'Double Elbow Roll - wprowadzenie', path: '/videos/double-elbow-roll-1.mp4', duration: '6:45' },
        { id: 'double-elbow-roll-2', title: 'Double Elbow Roll - technika', path: '/videos/double-elbow-roll-2.mp4', duration: '5:30' }
      ],
      tips: [
        'Zacznij od 25 pojedynczych Elbow Rolls jako rozgrzewka',
        'Zwolnij - rolki mają swój własny rytm',
        'Skup się na punktach wejścia i wyjścia',
        'Stabilizuj stopy i dolną część ciała',
        'Mniej napięcia daje lepsze wykonanie'
      ],
      goalReps: 1000
    }
  ]);
  
  const selectedSkill = computed(() => {
    if (!selectedSkillId.value) return null;
    return allSkills.value.find(skill => skill.id === selectedSkillId.value) || null;
  });
  
  // Filtrowana lista umiejętności
  const filteredSkills = computed(() => {
    let filtered = allSkills.value;
    
    // Filtrowanie po kategorii
    if (activeCategory.value !== 'all') {
      filtered = filtered.filter(skill => skill.category === activeCategory.value);
    }
    
    // Filtrowanie po wyszukiwaniu
    if (searchQuery.value.trim() !== '') {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(skill => 
        skill.name.toLowerCase().includes(query) || 
        skill.description.toLowerCase().includes(query) ||
        skill.shortDescription?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  });
  
  // Ustaw aktywną kategorię
  const setActiveCategory = (category: string) => {
    activeCategory.value = category;
  };
  
  // Pobierz kolor kategorii
  const getCategoryColor = (categoryId: string) => {
    const category = categories.value.find(cat => cat.id === categoryId);
    return category ? category.color : '#cccccc';
  };
  
  // Pobierz nazwę kategorii
  const getCategoryName = (categoryId: string) => {
    const category = categories.value.find(cat => cat.id === categoryId);
    return category ? category.name : 'Nieznana kategoria';
  };
  
  // Pobierz umiejętność po ID
  const getSkillById = (skillId: string) => {
    return allSkills.value.find(skill => skill.id === skillId) || { 
      id: '', 
      name: 'Nieznana umiejętność', 
      category: '', 
      difficulty: 0, 
      description: '', 
      videos: [], 
      goalReps: 0
    };
  };
  
  // Skrócony opis umiejętności
  const getShortDescription = (skill: Skill) => {
    return skill.shortDescription || skill.description.substring(0, 100) + '...';
  };
  
  // Pokaż szczegóły umiejętności
  const toggleSkillDetails = (skillId: string) => {
    selectedSkillId.value = selectedSkillId.value === skillId ? null : skillId;
  };
  
  // Zamknij szczegóły umiejętności
  const closeSkillDetails = () => {
    selectedSkillId.value = null;
  };
  
  // Dodaj/usuń umiejętność do/z listy nauki
  const toggleLearningList = (skillId: string) => {
    const index = learningList.value.indexOf(skillId);
    if (index === -1) {
      learningList.value.push(skillId);
      showToast(`Dodano "${getSkillById(skillId).name}" do listy nauki`);
      
      // Dodaj do systemu śledzenia w DataService, jeśli nie istnieje
      ensureSkillExists(skillId);
    } else {
      learningList.value.splice(index, 1);
      showToast(`Usunięto "${getSkillById(skillId).name}" z listy nauki`);
    }
    saveLearningList();
  };
  
  // Dodaj do planu nauki
  const addToLearningPlan = (skillId: string) => {
    toggleLearningList(skillId);
  };
  
  // Usuń z listy nauki
  const removeFromLearningList = (skillId: string) => {
    const index = learningList.value.indexOf(skillId);
    if (index !== -1) {
      learningList.value.splice(index, 1);
      showToast(`Usunięto "${getSkillById(skillId).name}" z listy nauki`);
      saveLearningList();
    }
  };
  
  // Wyczyść listę nauki
  const clearLearningList = () => {
    if (confirm('Czy na pewno chcesz wyczyścić całą listę nauki?')) {
      learningList.value = [];
      localStorage.removeItem('learningList');
      showToast('Lista nauki została wyczyszczona');
    }
  };
  
  // Zapisz listę nauki w localStorage
  const saveLearningList = () => {
    localStorage.setItem('learningList', JSON.stringify(learningList.value));
  };
  
  // Rozpocznij sesję nauki
  const startLearningSession = () => {
    if (learningList.value.length === 0) {
      showToast('Dodaj umiejętności do listy nauki, aby rozpocząć', 'warning');
      return;
    }
    
    // Przekieruj do SkillsView
    router.push('/skills');
    showToast('Rozpoczęto sesję nauki! Wszystkie umiejętności zostały dodane do trackera.');
  };
  
  // Odtwórz wideo (pokaż odtwarzacz)
  const playVideo = (video: Video) => {
    activeVideo.value = video;
  };
  
  // Zamknij odtwarzacz wideo
  const closeVideoPlayer = () => {
    activeVideo.value = null;
  };
  
  // Pobierz postęp umiejętności
  const getSkillProgress = (skillId: string) => {
    const skill = userData.value.skills[skillId];
    if (!skill) return 0;
    
    return Math.min(100, (skill.reps / skill.goalReps) * 100);
  };
  
  // Pobierz liczbę powtórzeń umiejętności
  const getSkillProgressReps = (skillId: string) => {
    const skill = userData.value.skills[skillId];
    if (!skill) return 0;
    
    return skill.reps || 0;
  };
  
  // Dodaj powtórzenia
  const addReps = (skillId: string) => {
    const reps = parseInt(repsToAdd.value.toString());
    if (!reps || reps < 1) {
      showToast('Wprowadź poprawną liczbę powtórzeń', 'error');
      return;
    }
    
    // Upewnij się, że umiejętność istnieje w systemie śledzenia
    ensureSkillExists(skillId);
    
    // Dodaj powtórzenia
    const success = DataService.addReps(skillId, reps);
    
    if (success) {
      userData.value = DataService.getUserData();
      
      // Sprawdź czy odblokowano odznakę
      const skill = userData.value.skills[skillId];
      if (skill && skill.status === 'completed') {
        const badge = userData.value.badges.find((b: Badge) => b.unlocked && (
          (b.id === 'basic-flow-master' && skillId === 'basic-flow') ||
          (b.id === '1000-reps' && skill.reps >= 1000) ||
          (b.id === 'smooth-operator' && skillId === 'basic-flow' && skill.reps >= 100)
        ));
        
        if (badge) {
          unlockedBadge.value = badge;
        }
      }
      
      showToast(`Dodano ${reps} powtórzeń!`);
      repsToAdd.value = 10;
    } else {
      showToast('Nie udało się dodać powtórzeń', 'error');
    }
  };
  
  // Ukryj modal z gratulacjami
  const hideCongratsModal = () => {
    unlockedBadge.value = null;
  };
  
  // Upewnij się, że umiejętność istnieje w systemie śledzenia
  const ensureSkillExists = (skillId: string) => {
    const skill = userData.value.skills[skillId];
    if (!skill) {
      const skillInfo = getSkillById(skillId);
      if (skillInfo.id) {
        // Dodaj umiejętność do systemu śledzenia
        userData.value.skills[skillId] = {
          name: skillInfo.name,
          category: skillInfo.category,
          difficulty: skillInfo.difficulty,
          progress: 0,
          status: 'new',
          reps: 0,
          goalReps: skillInfo.goalReps
        };
        DataService.saveUserData(userData.value);
      }
    }
  };
  
  // Aktualizuj dane użytkownika i synchronizuj listę nauki przy zmianie userData
  watch(() => userData.value, () => {
    // Sprawdź, czy jakaś umiejętność z listy nauki została ukończona
    const completedSkills = learningList.value.filter(skillId => {
      const skill = userData.value.skills[skillId];
      return skill && skill.status === 'completed';
    });
    
    // Usuń ukończone umiejętności z listy nauki
    if (completedSkills.length > 0) {
      completedSkills.forEach(skillId => {
        const index = learningList.value.indexOf(skillId);
        if (index !== -1) {
          learningList.value.splice(index, 1);
        }
      });
      saveLearningList();
    }
  }, { deep: true });
  
  // Inicjalizacja komponentu
  onMounted(() => {
    // Dodaj wszystkie kategorie na początek listy
    categories.value = [
      { id: 'all', name: 'Wszystkie', color: '#8e44ad' },
      ...DataService.getCategories()
    ];
    
    // Załaduj listę nauki z localStorage
    const savedList = localStorage.getItem('learningList');
    if (savedList) {
      learningList.value = JSON.parse(savedList);
    }
    
    // Upewnij się, że wszystkie umiejętności z listy nauki istnieją w systemie śledzenia
    learningList.value.forEach(skillId => {
      ensureSkillExists(skillId);
    });
  });
  </script>
  
  <style scoped>
  .skill-catalog {
    padding: 20px 0;
  }
  
  .accent-text {
    color: var(--secondary);
  }
  
  .filters-container {
    margin-bottom: 30px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
  }
  
  .search-box {
    position: relative;
    flex: 1;
    min-width: 250px;
  }
  
  .search-input {
    width: 100%;
    padding: 12px 15px 12px 40px;
    border-radius: 30px;
    border: 1px solid #e0e0e0;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .search-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(142, 68, 173, 0.2);
  }
  
  .search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
  }
  
  .filter-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .filter-tab {
    padding: 8px 15px;
    border-radius: 20px;
    border: 2px solid #e0e0e0;
    background: white;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .filter-tab:hover {
    border-color: var(--primary-light);
  }
  
  .filter-tab.active {
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  
  .skill-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .skill-card {
    border-radius: 10px;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
  }
  
  .skill-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .skill-card.selected-for-learning {
    border: 2px solid var(--secondary);
  }
  
  .skill-card-header {
    padding: 15px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .skill-card-header h3 {
    margin: 0;
    font-size: 1.2rem;
  }
  
  .skill-difficulty {
    display: flex;
    gap: 2px;
  }
  
  .skill-star {
    color: rgba(255, 255, 255, 0.5);
  }
  
  .skill-star.filled {
    color: white;
  }
  
  .skill-card-body {
    padding: 15px;
  }
  
  .skill-description {
    margin-bottom: 15px;
    min-height: 60px;
  }
  
  .skill-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .skill-category-tag {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    color: white;
  }
  
  .skill-video-count {
    font-size: 0.9rem;
    color: #666;
  }
  
  .skill-actions {
    display: flex;
    justify-content: flex-end;
  }
  
  .btn-outline {
    padding: 6px 12px;
    border-radius: 20px;
    border: 1px solid var(--primary);
    background: transparent;
    color: var(--primary);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-outline:hover {
    background-color: var(--primary);
    color: white;
  }
  
  .skill-details-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
  }
  
  .skill-details-content {
    background-color: white;
    border-radius: 10px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.5);
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 1;
    transition: background 0.3s ease;
  }
  
  .close-button:hover {
    background: rgba(255, 255, 255, 0.8);
  }
  
  .skill-details-header {
    padding: 25px 20px;
    color: white;
    position: relative;
  }
  
  .skill-details-header h2 {
    margin: 0;
    font-size: 1.8rem;
    margin-right: 30px;
  }
  
  .skill-details-body {
    padding: 20px;
  }
  
  .skill-full-description {
    margin-bottom: 20px;
    line-height: 1.6;
  }
  
  .skill-video-section, 
  .skill-tips-section, 
  .skill-progress-section {
    margin-bottom: 25px;
  }
  
  .video-list {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
  
  .video-card {
    border-radius: 8px;
    overflow: hidden;
    background-color: #f5f5f5;
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  
  .video-card:hover {
    transform: scale(1.03);
  }
  
  .video-thumbnail {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
    height: 0;
  }
  
  .video-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2rem;
  }
  
  .video-icon {
    font-size: 2.5rem;
    opacity: 0.8;
  }
  
  .play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    transition: background-color 0.3s ease;
  }
  
  .video-card:hover .play-button {
    background-color: var(--primary);
  }
  
  .video-info {
    padding: 10px;
  }
  
  .video-info h4 {
    margin: 0 0 5px;
    font-size: 0.95rem;
  }
  
  .video-info p {
    margin: 0;
    font-size: 0.8rem;
    color: #666;
  }
  
  .tips-list {
    padding-left: 20px;
    line-height: 1.6;
  }
  
  .progress-bar {
    height: 10px;
    background-color: #e9ecef;
    border-radius: 5px;
    overflow: hidden;
    margin: 10px 0;
  }
  
  .progress-bar-value {
    height: 100%;
    background: linear-gradient(90deg, var(--secondary) 0%, var(--primary) 100%);
    border-radius: 5px;
  }
  
  .progress-text {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 15px;
  }
  
  .add-reps-form {
    display: flex;
    gap: 10px;
  }
  
  .add-reps-form input {
    flex: 1;
    padding: 8px 12px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .btn-primary {
    padding: 8px 16px;
    border-radius: 5px;
    border: none;
    background-color: var(--primary);
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn-primary:hover {
    background-color: var(--primary-dark);
  }
  
  .btn-primary:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .skill-details-footer {
    padding: 15px 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .learning-list-container {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    padding: 20px;
    margin-top: 30px;
  }
  
  .learning-list-container h2 {
    margin-top: 0;
    margin-bottom: 15px;
    color: var(--primary);
  }
  
  .learning-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .learning-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .learning-list-item:last-child {
    border-bottom: none;
  }
  
  .learning-item-actions {
    display: flex;
    gap: 10px;
  }
  
  .btn-small {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
  }
  
  .btn-danger {
    background-color: #e74c3c;
    color: white;
    border: none;
  }
  
  .btn-danger:hover {
    background-color: #c0392b;
  }
  
  .learning-list-actions {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  /* Video Player Modal */
  .video-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1100;
    padding: 20px;
  }
  
  .video-modal-content {
    background-color: #000;
    border-radius: 10px;
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    overflow: hidden;
    position: relative;
    color: white;
  }
  
  .video-title {
    padding: 15px;
    margin: 0;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .video-player-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
    height: 0;
  }
  
  .video-placeholder-large {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #222;
  }
  
  .video-message {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  .video-submessage {
    font-size: 1rem;
    opacity: 0.7;
  }
  
  @media (max-width: 768px) {
    .skill-grid {
      grid-template-columns: 1fr;
    }
    
    .video-list {
      grid-template-columns: 1fr;
    }
    
    .add-reps-form {
      flex-direction: column;
    }
    
    .skill-details-footer {
      flex-direction: column;
    }
    
    .skill-details-footer button {
      width: 100%;
    }
  }
  </style>