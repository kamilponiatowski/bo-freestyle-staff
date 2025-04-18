/**
 * Freestyle Staff Academy - Komponent Resources
 * 
 * Ten moduł odpowiada za zarządzanie biblioteką materiałów i zasobów.
 * Obsługuje przeglądanie katalogu plików, wyświetlanie materiałów i zarządzanie podglądem.
 */

const ResourcesComponent = (function() {
    // Prywatne zmienne
    let activeResource = null;
    let directoryStructure = null;
    
    // Inicjalizacja komponentu
    const initialize = function() {
        loadDirectoryStructure();
        setupFolderListeners();
        setupFileListeners();
        setupResourceViewer();
    };

    const loadDirectoryStructure = function() {
        const fileExplorer = document.querySelector('.file-explorer-body');
        if (!fileExplorer) return;
        
        // Pokaż loader
        fileExplorer.innerHTML = `
            <div class="text-center p-4">
                <div>Ładowanie struktury katalogów...</div>
                <div class="spinner mt-2"></div>
            </div>
        `;
        
        // Sprawdź, czy mamy dostęp do nowego parsera
        if (typeof DirectoryParser !== 'undefined') {
            DirectoryParser.loadDirectoryStructure((error, structure) => {
                if (error || !structure) {
                    console.error('Błąd podczas ładowania struktury katalogów:', error);
                    fileExplorer.innerHTML = `
                        <div class="text-center p-4">
                            <div>Nie udało się załadować struktury katalogów. Wyświetlam domyślną zawartość.</div>
                        </div>
                    `;
                    setTimeout(() => {
                        fileExplorer.innerHTML = fileExplorer.dataset.originalContent || '';
                        setupFolderListeners();
                        setupFileListeners();
                    }, 1500);
                    return;
                }
                
                // Zachowaj strukturę do późniejszego użytku
                directoryStructure = structure;
                
                // Wygeneruj HTML dla struktury katalogów
                const directoryHTML = DirectoryParser.generateDirectoryHTML(structure);
                fileExplorer.innerHTML = directoryHTML;
                
                // Ponownie ustawienie nasłuchiwania dla nowych elementów
                setupFolderListeners();
                setupFileListeners();
            });
        } else {
            console.warn('Komponent DirectoryParser nie jest dostępny. Używam statycznej struktury.');
            
            // Zachowaj oryginalną zawartość
            if (!fileExplorer.dataset.originalContent) {
                fileExplorer.dataset.originalContent = fileExplorer.innerHTML;
            }
        }
    };
    
    // Ustawienie nasłuchiwania dla folderów
    const setupFolderListeners = function() {
        const folderHeaders = document.querySelectorAll('.file-folder-header');
        
        folderHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const folder = header.parentElement;
                folder.classList.toggle('open');
                
                // Zmiana ikony rozwijania
                const icon = header.querySelector('.file-folder-icon');
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
    
    // Ustawienie nasłuchiwania dla plików
    const setupFileListeners = function() {
        const fileItems = document.querySelectorAll('.file-item');
        
        fileItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation(); // Zapobiega propagacji do rodzica (folderu)
                
                const filePath = item.dataset.filePath;
                if (filePath) {
                    showResourceContent(filePath);
                }
            });
        });
    };
    
    // Konfiguracja przeglądarki zasobów
    const setupResourceViewer = function() {
        const closeBtn = document.getElementById('closeResourceBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', hideResourceViewer);
        }
        
        const addToTrainingBtn = document.getElementById('addToTrainingBtn');
        if (addToTrainingBtn) {
            addToTrainingBtn.addEventListener('click', () => {
                if (activeResource) {
                    addResourceToTraining(activeResource);
                }
            });
        }
        
        const trackRepsBtn = document.getElementById('trackRepsBtn');
        if (trackRepsBtn) {
            trackRepsBtn.addEventListener('click', () => {
                if (activeResource) {
                    const skillId = getSkillIdFromResource(activeResource);
                    if (skillId) {
                        hideResourceViewer();
                        if (window.FreestyleStaffApp && typeof window.FreestyleStaffApp.showSkillDetail === 'function') {
                            window.FreestyleStaffApp.showSkillDetail(skillId);
                        } else if (window.SkillsComponent && typeof window.SkillsComponent.showSkillDetail === 'function') {
                            window.SkillsComponent.showSkillDetail(skillId);
                        } else {
                            showToast('Nie można znaleźć modułu obsługi umiejętności', 'warning');
                        }
                    } else {
                        showToast('Nie można znaleźć powiązanej umiejętności', 'warning');
                    }
                }
            });
        }
    };
    
    // Wyświetlanie zawartości zasobu
    const showResourceContent = function(filePath) {
        activeResource = filePath;
        
        const resourceViewer = document.getElementById('resourceViewer');
        const resourceTitle = document.querySelector('.resource-viewer-title');
        const resourceContent = document.querySelector('.resource-viewer-content');
        
        if (!resourceViewer || !resourceTitle || !resourceContent) {
            console.error('Nie znaleziono elementów przeglądarki zasobów');
            return;
        }
        
        // Wyodrębnij nazwę pliku ze ścieżki
        const fileName = PathUtils.getFileName(filePath);
        resourceTitle.textContent = fileName;
        
        // Określ typ pliku i wyświetl odpowiednio
        const fileExtension = PathUtils.getFileExtension(filePath);
        
        switch (fileExtension) {
            case 'mp4':
                resourceContent.innerHTML = `
                    <video controls width="100%">
                        <source src="${filePath}" type="video/mp4">
                        Twoja przeglądarka nie obsługuje odtwarzania wideo.
                    </video>
                    <p class="mb-3">Oglądasz film instruktażowy: ${fileName}</p>
                    <p>Wykorzystaj ten materiał, by dokładnie przeanalizować technikę wykonania.</p>
                `;
                break;
                
            case 'md':
                // Dla plików markdown próbujemy załadować zawartość
                resourceContent.innerHTML = `
                    <p class="mb-3">Plik dokumentacji: ${fileName}</p>
                    <p>Ten dokument zawiera szczegółowe informacje o technice.</p>
                    <div class="markdown-content">
                        <p>Ładowanie treści...</p>
                    </div>
                `;
                
                // Załaduj zawartość pliku markdown
                FileService.loadTextFile(filePath, (error, content) => {
                    const markdownContent = resourceContent.querySelector('.markdown-content');
                    
                    if (error || !content) {
                        markdownContent.innerHTML = `
                            <p class="text-danger">Nie udało się załadować treści. ${error ? error.message : ''}</p>
                        `;
                        return;
                    }
                    
                    // Prosta konwersja markdown na HTML
                    markdownContent.innerHTML = content
                        .split('\n\n').map(paragraph => `<p>${paragraph}</p>`)
                        .join('')
                        .replace(/# (.*)/g, '<h1>$1</h1>')
                        .replace(/## (.*)/g, '<h2>$1</h2>')
                        .replace(/### (.*)/g, '<h3>$1</h3>')
                        .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*)\*/g, '<em>$1</em>')
                        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
                });
                break;
                
            case 'pdf':
                resourceContent.innerHTML = `
                    <p class="mb-3">Dokument PDF: ${fileName}</p>
                    <p>Ten plik zawiera szczegółowe materiały w formacie PDF.</p>
                    <p>Aby otworzyć go, kliknij poniższy przycisk:</p>
                    <a href="${filePath}" class="btn btn-primary" target="_blank">Otwórz PDF</a>
                `;
                break;
                
            default:
                resourceContent.innerHTML = `
                    <p>Ten typ pliku (${fileExtension}) nie jest obsługiwany w podglądzie.</p>
                    <p>Ścieżka: ${filePath}</p>
                `;
                break;
        }
        
        // Pokaż przeglądarkę zasobów
        resourceViewer.style.display = 'block';
        
        // Dodaj powiązania z umiejętnościami
        updateResourceSkillAssociation(filePath);
    };
    
    // Aktualizacja powiązania zasobu z umiejętnościami
    const updateResourceSkillAssociation = function(filePath) {
        const skillId = getSkillIdFromResource(filePath);
        
        // Aktualizuj przyciski akcji
        const trackRepsBtn = document.getElementById('trackRepsBtn');
        if (trackRepsBtn) {
            if (skillId) {
                trackRepsBtn.disabled = false;
                trackRepsBtn.title = 'Śledź powtórzenia dla tej umiejętności';
            } else {
                trackRepsBtn.disabled = true;
                trackRepsBtn.title = 'Brak powiązanej umiejętności';
            }
        }
    };
    
    // Wyciągnij ID umiejętności z ścieżki zasobu
    const getSkillIdFromResource = function(filePath) {
        // Uproszczona wersja - dopasowuje na podstawie fragmentów ścieżki
        const lowerPath = filePath.toLowerCase();
        
        // Sprawdź powiązania na podstawie ścieżki
        if (lowerPath.includes('basic-flow') || lowerPath.includes('basic flow')) {
            return 'basic-flow';
        } else if (lowerPath.includes('basic-pass') || lowerPath.includes('basic pass')) {
            return 'basic-pass';
        } else if (lowerPath.includes('dip-pass') || lowerPath.includes('dip pass')) {
            return 'dip-pass';
        } else if (lowerPath.includes('neck-wrap') || lowerPath.includes('neck wrap')) {
            return 'neck-wrap';
        } else if (lowerPath.includes('shoulder-wrap') || lowerPath.includes('shoulder wrap')) {
            return 'shoulder-wrap';
        } else if (lowerPath.includes('high-low-whip') || lowerPath.includes('high_low whip')) {
            return 'high-low-whip';
        } else if (lowerPath.includes('2-hand-spin') || lowerPath.includes('2 hand spin')) {
            return 'two-hand-spin';
        } else if (lowerPath.includes('windmill')) {
            return 'windmill';
        } else if (lowerPath.includes('continuous-passing') || lowerPath.includes('continuous passing')) {
            return 'continuous-passing';
        } else if (lowerPath.includes('backhand-flip') || lowerPath.includes('backhand flip')) {
            return 'backhand-flip';
        } else if (lowerPath.includes('thumbflip')) {
            return 'thumbflips';
        } else if (lowerPath.includes('rocket')) {
            return 'rocket';
        } else if (lowerPath.includes('handroll') || lowerPath.includes('windshield wiper')) {
            return 'handrolls';
        } else if (lowerPath.includes('elbow-roll') || lowerPath.includes('elbow roll')) {
            return 'elbow-rolls';
        } else if (lowerPath.includes('double-elbow-roll') || lowerPath.includes('double elbow roll')) {
            return 'double-elbow-roll';
        }
        
        // Brak powiązania
        return null;
    };
    
    // Dodanie zasobu do treningu
    const addResourceToTraining = function(filePath) {
        const skillId = getSkillIdFromResource(filePath);
        
        if (skillId) {
            // Przełącz na zakładkę postępu
            if (window.FreestyleStaffApp && typeof window.FreestyleStaffApp.switchTab === 'function') {
                window.FreestyleStaffApp.switchTab('progress');
            } else {
                // Alternatywna metoda, jeśli FreestyleStaffApp nie jest dostępne
                const progressTab = document.querySelector('nav a[data-page="progress"]');
                if (progressTab) progressTab.click();
            }
            
            // Wybierz odpowiednią umiejętność w formularzu
            const skillSelect = document.getElementById('trainingSkill');
            if (skillSelect) {
                skillSelect.value = skillId;
            }
            
            // Zgłoś sukces
            showToast('Zasób został dodany do treningu', 'success');
        } else {
            showToast('Nie można znaleźć powiązanej umiejętności', 'warning');
        }
    };
    
    // Ukrycie przeglądarki zasobów
    const hideResourceViewer = function() {
        const resourceViewer = document.getElementById('resourceViewer');
        if (!resourceViewer) return;
        
        // Zatrzymaj odtwarzanie wideo
        const videos = resourceViewer.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.src = '';
        });
        
        // Ukryj przeglądarkę
        resourceViewer.style.display = 'none';
        activeResource = null;
    };
    
    // Wyświetlanie powiadomienia toast
    const showToast = function(message, type = 'success') {
        if (window.FreestyleStaffApp && typeof window.FreestyleStaffApp.showToast === 'function') {
            window.FreestyleStaffApp.showToast(message, type);
        } else {
            console.log(`Toast (${type}): ${message}`);
        }
    };
    
    // Publiczny interfejs API
    return {
        initialize: initialize,
        showResource: showResourceContent,
        hideResourceViewer: hideResourceViewer
    };
})();

// Eksportuj moduł
window.ResourcesComponent = ResourcesComponent;