<template>
  <div>
    <h1 class="page-title">Biblioteka materiałów</h1>

    <div class="skills-container">
      <div class="file-explorer">
        <div class="file-explorer-header">
          Freestyle Staff Academy - Pliki szkoleniowe
        </div>
        <div class="file-explorer-body">
          <ul class="file-list">
            <template v-for="folder in libraryStructure" :key="folder.name">
              <li class="file-folder" :class="{ open: folder.isOpen }">
                <div class="file-folder-header" @click="toggleFolder(folder)">
                  <span class="file-folder-icon">{{ folder.isOpen ? '▼' : '▶' }}</span>
                  <span class="file-folder-name">{{ folder.name }}</span>
                </div>
                <ul class="file-folder-content">
                  <template v-for="item in folder.items" :key="item.name">
                    <li v-if="item.type === 'file'" class="file-item" :class="'file-' + item.fileType"
                      @click="showResourceContent(item)">
                      <span class="file-item-icon">{{ getFileIcon(item.fileType) }}</span>
                      <span class="file-item-name">{{ item.name }}</span>
                    </li>
                    <li v-else class="file-folder" :class="{ open: item.isOpen }">
                      <div class="file-folder-header" @click.stop="toggleFolder(item)">
                        <span class="file-folder-icon">{{ item.isOpen ? '▼' : '▶' }}</span>
                        <span class="file-folder-name">{{ item.name }}</span>
                      </div>
                      <ul class="file-folder-content">
                        <li v-for="subItem in item.items" :key="subItem.name" class="file-item"
                          :class="'file-' + subItem.fileType" @click.stop="showResourceContent(subItem)">
                          <span class="file-item-icon">{{ getFileIcon(subItem.fileType) }}</span>
                          <span class="file-item-name">{{ subItem.name }}</span>
                        </li>
                      </ul>
                    </li>
                  </template>
                </ul>
              </li>
            </template>
          </ul>
        </div>
      </div>

      <!-- Resource Viewer -->
      <div id="resourceViewer" class="resource-viewer" v-if="activeResource" style="display: block;">
        <div class="resource-viewer-header">
          <h3 class="resource-viewer-title">{{ activeResource.name }}</h3>
          <button class="btn btn-outline" @click="hideResourceViewer">Zamknij</button>
        </div>

        <div class="resource-viewer-content">
          <template v-if="activeResource.fileType === 'mp4'">
            <template v-if="realVideoPath">
              <video controls width="100%">
                <source :src="realVideoPath" type="video/mp4">
                Twoja przeglądarka nie obsługuje odtwarzania wideo.
              </video>
              <p class="mb-3">Oglądasz film instruktażowy: {{ activeResource.name }}</p>
              <p>Wykorzystaj ten materiał, by dokładnie przeanalizować technikę wykonania.</p>
            </template>
            <template v-else>
              <div class="video-placeholder">
                <span class="video-message">Wideo jest niedostępne</span>
                <span class="video-submessage">Materiał wideo zostanie wkrótce zaktualizowany</span>
              </div>
              <p class="mb-3">Film instruktażowy: {{ activeResource.name }}</p>
              <p>Ten materiał jest obecnie w przygotowaniu.</p>
            </template>
          </template>

          <template v-else-if="activeResource.fileType === 'md'">
            <p class="mb-3">Plik dokumentacji: {{ activeResource.name }}</p>
            <p>Ten dokument zawiera szczegółowe informacje o technice.</p>
            <div class="markdown-content">
              <p>Trwają prace nad udostępnieniem tej zawartości. Wkrótce będzie dostępna!</p>
            </div>
          </template>

          <template v-else-if="activeResource.fileType === 'pdf'">
            <p class="mb-3">Dokument PDF: {{ activeResource.name }}</p>
            <p>Ten plik zawiera szczegółowe materiały w formacie PDF.</p>
            <p>Aby otworzyć go, kliknij poniższy przycisk:</p>
            <a :href="activeResource.path" class="btn btn-primary" target="_blank">Otwórz PDF</a>
          </template>

          <template v-else>
            <p>Ten typ pliku nie jest obsługiwany w podglądzie.</p>
          </template>
        </div>

        <div class="resource-actions">
          <button class="btn btn-primary" @click="addToTraining">Dodaj do treningu</button>
          <button class="btn btn-secondary" @click="trackReps" :disabled="!relatedSkill">Śledź powtórzenia</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import DataService from '@/services/DataService';
import { showToast } from '@/services/ToastService';
import { getVideoPath, canPlayVideo } from '@/utils/videoUtils';

interface FileItem {
  name: string;
  type: 'file';
  fileType: string;
  path: string;
  skillId?: string;
}

interface FolderItem {
  name: string;
  type: 'folder';
  isOpen: boolean;
  items: (FileItem | FolderItem)[];
}

const router = useRouter();
const activeResource = ref<FileItem | null>(null);
const relatedSkill = ref<string | null>(null);

const realVideoPath = computed(() => {
  if (!activeResource.value || activeResource.value.fileType !== 'mp4') {
    return null;
  }
  
  const path = getVideoPath(activeResource.value.path);
  if (path) {
    return path;
  }
  
  return null;
});

// Struktura biblioteki (na potrzeby demonstracji)
const libraryStructure = ref<FolderItem[]>([
  {
    name: '1. START HERE',
    isOpen: false,
    type: 'folder',
    items: [
      { name: 'How to Succeed at Staff Spinning.md', type: 'file', fileType: 'md', path: 'freestyle-staff-academy/1. START HERE/How to Succeed at Staff Spinning.md' },
      { name: 'key-to-success.mp4', type: 'file', fileType: 'mp4', path: 'freestyle-staff-academy/1. START HERE/key-to-success.mp4' },
      { name: 'Keys To Success.md', type: 'file', fileType: 'md', path: 'freestyle-staff-academy/1. START HERE/Keys To Success.md' }
    ]
  },
  {
    name: '2. DOWNLOADS',
    isOpen: false,
    type: 'folder',
    items: [
      {
        name: 'e-book',
        type: 'folder',
        isOpen: false,
        items: [
          { name: '1000-reps-do-mistrzostwa.md', type: 'file', fileType: 'md', path: 'freestyle-staff-academy/2. DOWNLOADS/e-book/1000-reps-do-mistrzostwa.md' },
          { name: '1000-reps-to-mastery.pdf', type: 'file', fileType: 'pdf', path: 'freestyle-staff-academy/2. DOWNLOADS/e-book/1000-reps-to-mastery.pdf' }
        ]
      },
      { name: 'FSA_Rep_Tracker.pdf', type: 'file', fileType: 'pdf', path: 'freestyle-staff-academy/2. DOWNLOADS/FSA_Rep_Tracker.pdf' }
    ]
  },
  {
    name: '5. BEGINNER',
    isOpen: false,
    type: 'folder',
    items: [
      {
        name: '1. Basic Flow',
        type: 'folder',
        isOpen: false,
        items: [
          { name: 'Basic Flow.mp4', type: 'file', fileType: 'mp4', path: 'freestyle-staff-academy/5. BEGINNER/1. Basic Flow/Basic Flow.mp4', skillId: 'basic-flow' },
          { name: 'Full Basic Flow.md', type: 'file', fileType: 'md', path: 'freestyle-staff-academy/5. BEGINNER/1. Basic Flow/Full Basic Flow.md', skillId: 'basic-flow' }
        ]
      },
      {
        name: '5. Neck Wrap',
        type: 'folder',
        isOpen: false,
        items: [
          { name: 'Intro To Wraps.mp4', type: 'file', fileType: 'mp4', path: 'freestyle-staff-academy/5. BEGINNER/5. Neck Wrap/Intro To Wraps.mp4', skillId: 'neck-wrap' }
        ]
      },
      {
        name: '7. High_Low Whip',
        type: 'folder',
        isOpen: false,
        items: [
          { name: 'High Whip.mp4', type: 'file', fileType: 'mp4', path: 'freestyle-staff-academy/5. BEGINNER/7. High_Low Whip/High Whip.mp4', skillId: 'high-low-whip' },
          { name: 'Low Whip.mp4', type: 'file', fileType: 'mp4', path: 'freestyle-staff-academy/5. BEGINNER/7. High_Low Whip/Low Whip.mp4', skillId: 'high-low-whip' }
        ]
      },
      {
        name: '11. 2 Hand Spin',
        type: 'folder',
        isOpen: false,
        items: [
          { name: '2 Hand Spin.mp4', type: 'file', fileType: 'mp4', path: 'freestyle-staff-academy/5. BEGINNER/11. 2 Hand Spin/2 Hand Spin.mp4', skillId: 'two-hand-spin' }
        ]
      }
    ]
  }
]);

// Przełącz folder (otwarty/zamknięty)
const toggleFolder = (folder: FolderItem) => {
  folder.isOpen = !folder.isOpen;
};

// Pobierz ikonę dla typu pliku
const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'mp4': return '🎬';
    case 'md': return '📄';
    case 'pdf': return '📑';
    default: return '📄';
  }
};

// Pokaż zawartość zasobu
const showResourceContent = (resource: FileItem) => {
  activeResource.value = resource;
  relatedSkill.value = resource.skillId || findRelatedSkill(resource.path);
};

// Znajdź powiązaną umiejętność na podstawie ścieżki
const findRelatedSkill = (path: string) => {
  // Prosty mechanizm dopasowania na podstawie nazwy pliku
  const lowerPath = path.toLowerCase();

  if (lowerPath.includes('basic-flow') || lowerPath.includes('basic flow')) {
    return 'basic-flow';
  } else if (lowerPath.includes('neck-wrap') || lowerPath.includes('neck wrap')) {
    return 'neck-wrap';
  } else if (lowerPath.includes('high-low-whip') || lowerPath.includes('high_low whip')) {
    return 'high-low-whip';
  } else if (lowerPath.includes('2-hand-spin') || lowerPath.includes('2 hand spin')) {
    return 'two-hand-spin';
  }

  return null;
};

// Ukryj przeglądarkę zasobów
const hideResourceViewer = () => {
  // Zatrzymaj odtwarzanie wideo
  const videoElements = document.querySelectorAll('.resource-viewer video');
  videoElements.forEach(video => {
    if (video instanceof HTMLVideoElement) {
      video.pause();
    }
  });

  activeResource.value = null;
  relatedSkill.value = null;
};

// Dodaj do treningu
const addToTraining = () => {
  router.push('/progress');

  // Jeśli jest powiązana umiejętność, wybierz ją w formularzu
  if (relatedSkill.value) {
    // To będzie zaimplementowane w widoku Progress
    // Na razie tylko powiadomienie
    showToast('Dodano do treningu: ' + activeResource.value!.name);
  } else {
    showToast('Dodano do treningu');
  }
};

// Śledź powtórzenia
const trackReps = () => {
  if (!relatedSkill.value) {
    showToast('Nie znaleziono powiązanej umiejętności', 'warning');
    return;
  }

  router.push('/skills');
  showToast('Przechodzę do śledzenia powtórzeń');

  // Tutaj można dodać kod, który otworzy modal ze szczegółami umiejętności
  // po przejściu do zakładki Skills
};
</script>

<style scoped>
/* Poprawki dla drzewa plików */
.file-folder.open .file-folder-content {
  display: block;
}

.file-folder-content {
  display: none;
}
</style>