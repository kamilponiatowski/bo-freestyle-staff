/**
 * Freestyle Staff Academy - Komponent Library
 * 
 * Ten moduł odpowiada za renderowanie i obsługę biblioteki materiałów.
 */

const LibraryComponent = (function() {
    // Inicjalizacja komponentu
    const initialize = function() {
        console.log("Inicjalizacja komponentu biblioteki...");
        // Renderuj statyczną strukturę katalogów
        renderStaticStructure();
        // Dodaj obsługę zdarzeń
        setupEventListeners();
    };
    
    // Renderowanie statycznej struktury katalogów
    const renderStaticStructure = function() {
        const fileExplorer = document.querySelector('.file-explorer-body');
        if (!fileExplorer) {
            console.error("Nie znaleziono elementu .file-explorer-body");
            return;
        }
        
        // Przygotuj statyczną strukturę katalogów
        const html = `
        <ul class="file-list">
            <li class="file-folder">
                <div class="file-folder-header">
                    <span class="file-folder-icon">▶</span>
                    <span class="file-folder-name">1. START HERE</span>
                </div>
                <ul class="file-folder-content">
                    <li class="file-item file-md" data-file-path="freestyle-staff-academy/1. START HERE/How to Succeed at Staff Spinning.md">
                        <span class="file-item-icon">📄</span>
                        <span class="file-item-name">How to Succeed at Staff Spinning</span>
                    </li>
                    <li class="file-item file-mp4" data-file-path="freestyle-staff-academy/1. START HERE/key-to-success.mp4">
                        <span class="file-item-icon">🎬</span>
                        <span class="file-item-name">key-to-success</span>
                    </li>
                    <li class="file-item file-md" data-file-path="freestyle-staff-academy/1. START HERE/Keys To Success.md">
                        <span class="file-item-icon">📄</span>
                        <span class="file-item-name">Keys To Success</span>
                    </li>
                    <li class="file-item file-md" data-file-path="freestyle-staff-academy/1. START HERE/Tips for Practicing.md">
                        <span class="file-item-icon">📄</span>
                        <span class="file-item-name">Tips for Practicing</span>
                    </li>
                </ul>
            </li>
            <li class="file-folder">
                <div class="file-folder-header">
                    <span class="file-folder-icon">▶</span>
                    <span class="file-folder-name">2. DOWNLOADS</span>
                </div>
                <ul class="file-folder-content">
                    <li class="file-folder">
                        <div class="file-folder-header">
                            <span class="file-folder-icon">▶</span>
                            <span class="file-folder-name">e-book</span>
                        </div>
                        <ul class="file-folder-content">
                            <li class="file-item file-md" data-file-path="freestyle-staff-academy/2. DOWNLOADS/e-book/1000-reps-do-mistrzostwa.md">
                                <span class="file-item-icon">📄</span>
                                <span class="file-item-name">1000-reps-do-mistrzostwa</span>
                            </li>
                            <li class="file-item file-md" data-file-path="freestyle-staff-academy/2. DOWNLOADS/e-book/1000-reps-to-mastery.md">
                                <span class="file-item-icon">📄</span>
                                <span class="file-item-name">1000-reps-to-mastery</span>
                            </li>
                        </ul>
                    </li>
                    <li class="file-item file-pdf" data-file-path="freestyle-staff-academy/2. DOWNLOADS/FSA_Rep_Tracker.pdf">
                        <span class="file-item-icon">📑</span>
                        <span class="file-item-name">FSA_Rep_Tracker.pdf</span>
                    </li>
                </ul>
            </li>
            <li class="file-folder">
                <div class="file-folder-header">
                    <span class="file-folder-icon">▶</span>
                    <span class="file-folder-name">5. BEGINNER</span>
                </div>
                <ul class="file-folder-content">
                    <li class="file-folder">
                        <div class="file-folder-header">
                            <span class="file-folder-icon">▶</span>
                            <span class="file-folder-name">1. Basic Flow</span>
                        </div>
                        <ul class="file-folder-content">
                            <li class="file-item file-mp4" data-file-path="freestyle-staff-academy/5. BEGINNER/1. Basic Flow/Basic Flow.mp4">
                                <span class="file-item-icon">🎬</span>
                                <span class="file-item-name">Basic Flow</span>
                            </li>
                            <li class="file-item file-md" data-file-path="freestyle-staff-academy/5. BEGINNER/1. Basic Flow/Full Basic Flow.md">
                                <span class="file-item-icon">📄</span>
                                <span class="file-item-name">Full Basic Flow</span>
                            </li>
                        </ul>
                    </li>
                    <li class="file-folder">
                        <div class="file-folder-header">
                            <span class="file-folder-icon">▶</span>
                            <span class="file-folder-name">5. Neck Wrap</span>
                        </div>
                        <ul class="file-folder-content">
                            <li class="file-item file-mp4" data-file-path="freestyle-staff-academy/5. BEGINNER/5. Neck Wrap/Intro To Wraps.mp4">
                                <span class="file-item-icon">🎬</span>
                                <span class="file-item-name">Intro To Wraps</span>
                            </li>
                        </ul>
                    </li>
                    <li class="file-folder">
                        <div class="file-folder-header">
                            <span class="file-folder-icon">▶</span>
                            <span class="file-folder-name">7. High_Low Whip</span>
                        </div>
                        <ul class="file-folder-content">
                            <li class="file-item file-mp4" data-file-path="freestyle-staff-academy/5. BEGINNER/7. High_Low Whip/High Whip.mp4">
                                <span class="file-item-icon">🎬</span>
                                <span class="file-item-name">High Whip</span>
                            </li>
                            <li class="file-item file-mp4" data-file-path="freestyle-staff-academy/5. BEGINNER/7. High_Low Whip/Low Whip.mp4">
                                <span class="file-item-icon">🎬</span>
                                <span class="file-item-name">Low Whip</span>
                            </li>
                        </ul>
                    </li>
                    <li class="file-folder">
                        <div class="file-folder-header">
                            <span class="file-folder-icon">▶</span>
                            <span class="file-folder-name">11. 2 Hand Spin</span>
                        </div>
                        <ul class="file-folder-content">
                            <li class="file-item file-mp4" data-file-path="freestyle-staff-academy/5. BEGINNER/11. 2 Hand Spin/2 Hand Spin.mp4">
                                <span class="file-item-icon">🎬</span>
                                <span class="file-item-name">2 Hand Spin</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="file-folder">
                <div class="file-folder-header">
                    <span class="file-folder-icon">▶</span>
                    <span class="file-folder-name">6. TOSS & CATCH</span>
                </div>
                <ul class="file-folder-content">
                    <li class="file-folder">
                        <div class="file-folder-header">
                            <span class="file-folder-icon">▶</span>
                            <span class="file-folder-name">0. Backhand Flip</span>
                        </div>
                        <ul class="file-folder-content">
                            <li class="file-item file-mp4" data-file-path="freestyle-staff-academy/6. TOSS & CATCH/0. Backhand Flip/Backhand Flip.mp4">
                                <span class="file-item-icon">🎬</span>
                                <span class="file-item-name">Backhand Flip</span>
                            </li>
                        </ul>
                    </li>
                    <li class="file-folder">
                        <div class="file-folder-header">
                            <span class="file-folder-icon">▶</span>
                            <span class="file-folder-name">2. Thumbflips</span>
                        </div>
                        <ul class="file-folder-content">
                            <li class="file-item file-mp4" data-file-path="freestyle-staff-academy/6. TOSS & CATCH/2. Thumbflips/Intro to Thumbflips & Thumbdrop.mp4">
                                <span class="file-item-icon">🎬</span>
                                <span class="file-item-name">Intro to Thumbflips & Thumbdrop</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="file-folder">
                <div class="file-folder-header">
                    <span class="file-folder-icon">▶</span>
                    <span class="file-folder-name">8. ROLLS</span>
                </div>
                <ul class="file-folder-content">
                    <li class="file-item file-mp4" data-file-path="freestyle-staff-academy/8. ROLLS/Handrolls (Windsheild Wiper).mp4">
                        <span class="file-item-icon">🎬</span>
                        <span class="file-item-name">Handrolls (Windshield Wiper)</span>
                    </li>
                    <li class="file-folder">
                        <div class="file-folder-header">
                            <span class="file-folder-icon">▶</span>
                            <span class="file-folder-name">Elbow Rolls</span>
                        </div>
                        <ul class="file-folder-content">
                            <li class="file-item file-mp4" data-file-path="freestyle-staff-academy/8. ROLLS/Elbow Rolls/Double Elbow Roll.mp4">
                                <span class="file-item-icon">🎬</span>
                                <span class="file-item-name">Double Elbow Roll</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>`;
        
        fileExplorer.innerHTML = html;
    };
    
    // Konfiguracja nasłuchiwania zdarzeń
    const setupEventListeners = function() {
        // Obsługa przycisku zamykania przeglądarki zasobów
        const closeResourceBtn = document.getElementById('closeResourceBtn');
        if (closeResourceBtn) {
            closeResourceBtn.addEventListener('click', () => {
                const resourceViewer = document.getElementById('resourceViewer');
                if (resourceViewer) {
                    resourceViewer.style.display = 'none';
                    
                    // Zatrzymaj wszystkie filmy
                    const videos = resourceViewer.querySelectorAll('video');
                    videos.forEach(video => {
                        video.pause();
                    });
                }
            });
        }
        
        // Obsługa przycisków dodawania do treningu i śledzenia powtórzeń
        const addToTrainingBtn = document.getElementById('addToTrainingBtn');
        if (addToTrainingBtn) {
            addToTrainingBtn.addEventListener('click', () => {
                showToast('Dodano do treningu', 'success');
                
                // Przełącz na zakładkę postępu
                if (window.FreestyleStaffApp && typeof window.FreestyleStaffApp.switchTab === 'function') {
                    window.FreestyleStaffApp.switchTab('progress');
                }
            });
        }
        
        const trackRepsBtn = document.getElementById('trackRepsBtn');
        if (trackRepsBtn) {
            trackRepsBtn.addEventListener('click', () => {
                showToast('Przechodzę do śledzenia powtórzeń', 'success');
                
                // Przełącz na zakładkę umiejętności
                if (window.FreestyleStaffApp && typeof window.FreestyleStaffApp.switchTab === 'function') {
                    window.FreestyleStaffApp.switchTab('skills');
                }
            });
        }
        
        // Dodaj obsługę zdarzeń dla folderów i plików
        setupFolderListeners();
        setupFileListeners();
    };
    
    // Konfiguracja nasłuchiwania dla folderów
    const setupFolderListeners = function() {
        document.querySelectorAll('.file-folder-header').forEach(header => {
            header.addEventListener('click', function() {
                const folder = this.parentElement;
                folder.classList.toggle('open');
                
                // Zmień ikonę rozwijania
                const icon = this.querySelector('.file-folder-icon');
                if (icon) {
                    if (folder.classList.contains('open')) {
                        icon.textContent = '▼';
                    } else {
                        icon.textContent = '▶';
                    }
                }
            });
        });
    };
    
    // Konfiguracja nasłuchiwania dla plików
    const setupFileListeners = function() {
        document.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const filePath = this.dataset.filePath;
                if (filePath) {
                    showFileContent(filePath);
                }
            });
        });
    };
    
    // Wyświetlanie zawartości pliku
    const showFileContent = function(filePath) {
        const resourceViewer = document.getElementById('resourceViewer');
        const resourceTitle = document.querySelector('.resource-viewer-title');
        const resourceContent = document.querySelector('.resource-viewer-content');
        
        if (!resourceViewer || !resourceTitle || !resourceContent) {
            console.error("Brak elementów przeglądarki zasobów");
            return;
        }
        
        // Wyodrębnij nazwę pliku ze ścieżki
        const fileName = filePath.split('/').pop();
        resourceTitle.textContent = fileName;
        
        // Określ typ pliku i wyświetl odpowiednio
        if (filePath.endsWith('.mp4')) {
            resourceContent.innerHTML = `
                <video controls width="100%">
                    <source src="${filePath}" type="video/mp4">
                    Twoja przeglądarka nie obsługuje odtwarzania wideo.
                </video>
                <p class="mb-3">Oglądasz film instruktażowy: ${fileName}</p>
                <p>Wykorzystaj ten materiał, by dokładnie przeanalizować technikę wykonania.</p>
            `;
        } else if (filePath.endsWith('.md')) {
            if (filePath.includes('1000-reps-do-mistrzostwa.md')) {
                // Przykładowa zawartość dla konkretnego pliku
                resourceContent.innerHTML = `
                    <h1>1000 POWTÓRZEŃ DO MISTRZOSTWA</h1>
                    <p>Łącząc zaawansowaną manipulację kijem z elementami sztuk walki i akrobatyki, Freestyle Staff wznosi sztukę kręcenia kijem na nowy poziom. Poprzez systematyczne rozbijanie każdej umiejętności na podstawowe progresje i mechanikę, uczniowie uczą się złożonych technik z zaskakującą szybkością i skutecznością.</p>
                    <h2>CELE WORKBOOKA – PODRĘCZNIKA UCZNIA</h2>
                    <p>Ten podręcznik został stworzony, by pomóc Ci:</p>
                    <ul>
                        <li>Śledzić i monitorować postępy</li>
                        <li>Odpowiadać przed sobą za rozwój</li>
                        <li>Czerpać motywację z drobnych sukcesów</li>
                        <li>Doskonalić i opanować każdą umiejętność</li>
                    </ul>
                    <p>Pamiętaj: Kręcenie kijem to skomplikowana, wymagająca praktyka. Opiera się na cierpliwości, dyscyplinie i zaangażowaniu. Mistrzostwo buduje się na solidnych fundamentach – ciesz się procesem!</p>
                `;
            } else {
                // Domyślna zawartość dla innych plików markdown
                resourceContent.innerHTML = `
                    <p class="mb-3">Plik dokumentacji: ${fileName}</p>
                    <p>Ten dokument zawiera szczegółowe informacje o technice.</p>
                    <div class="markdown-content">
                        <p>Trwają prace nad udostępnieniem tej zawartości. Wkrótce będzie dostępna!</p>
                    </div>
                `;
            }
        } else if (filePath.endsWith('.pdf')) {
            resourceContent.innerHTML = `
                <p class="mb-3">Dokument PDF: ${fileName}</p>
                <p>Ten plik zawiera szczegółowe materiały w formacie PDF.</p>
                <p>Aby otworzyć go, kliknij poniższy przycisk:</p>
                <a href="${filePath}" class="btn btn-primary" target="_blank">Otwórz PDF</a>
            `;
        } else {
            resourceContent.innerHTML = `
                <p>Ten typ pliku nie jest obsługiwany w podglądzie.</p>
                <p>Ścieżka: ${filePath}</p>
            `;
        }
        
        // Pokaż przeglądarkę zasobów
        resourceViewer.style.display = 'block';
    };
    
    // Wyświetlanie powiadomienia
    const showToast = function(message, type = 'success') {
        if (window.FreestyleStaffApp && typeof window.FreestyleStaffApp.showToast === 'function') {
            window.FreestyleStaffApp.showToast(message, type);
        } else {
            // Prosta alternatywa, jeśli FreestyleStaffApp nie jest dostępny
            console.log(`Toast (${type}): ${message}`);
            
            const toastContainer = document.getElementById('toastContainer');
            if (!toastContainer) return;
            
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            
            let icon = '✅';
            if (type === 'error') icon = '❌';
            if (type === 'warning') icon = '⚠️';
            if (type === 'info') icon = 'ℹ️';
            
            toast.innerHTML = `
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${message}</span>
            `;
            
            toastContainer.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => {
                    if (toastContainer.contains(toast)) {
                        toastContainer.removeChild(toast);
                    }
                }, 300);
            }, 3000);
        }
    };
    
    // Publiczny interfejs API
    return {
        initialize: initialize
    };
})();

// Eksportuj moduł