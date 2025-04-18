/**
 * Freestyle Staff Academy - Główny skrypt aplikacji
 * 
 * Ten plik zawiera logikę aplikacji i obsługę interfejsu użytkownika.
 * Zarządza widokami, obsługuje zdarzenia i aktualizuje UI.
 */

const FreestyleStaffApp = (function () {
    // Prywatne zmienne
    let activeSkill = null;
    let completedSkill = null;
    let activeResource = null;

    // Inicjalizacja aplikacji
    const init = function () {
        console.log('Inicjalizacja Freestyle Staff Academy...');

        // Sprawdź czy wszystkie wymagane usługi są dostępne
        if (!checkServices()) {
            console.error('Nie można uruchomić aplikacji z powodu brakujących usług.');
            showToast('Wystąpił błąd podczas inicjalizacji aplikacji.', 'error');
            return;
        }

        // Pobierz dane użytkownika
        const userData = DataService.getUserData();

        // Inicjalizacja wydarzeń UI
        initEventListeners();

        // Inicjalizacja komponentów
        initializeComponents();

        // Aktualizacja UI
        updateUI();

        console.log('Freestyle Staff Academy została zainicjalizowana pomyślnie!');
    };

    // Sprawdź czy usługi są załadowane
    const checkServices = function () {
        const requiredServices = ['DataService', 'FileService'];
        const missingServices = requiredServices.filter(service => !window[service]);

        if (missingServices.length > 0) {
            console.error(`Brakujące usługi: ${missingServices.join(', ')}`);
            return false;
        }

        return true;
    };

    // Inicjalizacja komponentów
    const initializeComponents = function () {
        // Inicjalizacja komponentów, jeśli istnieją
        if (window.DashboardComponent && typeof window.DashboardComponent.initialize === 'function') {
            DashboardComponent.initialize();
        }

        if (window.SkillsComponent && typeof window.SkillsComponent.initialize === 'function') {
            SkillsComponent.initialize();
        }

        if (window.ResourcesComponent && typeof window.ResourcesComponent.initialize === 'function') {
            ResourcesComponent.initialize();
        }

        if (window.StatsComponent && typeof window.StatsComponent.initialize === 'function') {
            StatsComponent.initialize();
        }

        // Inicjalizacja wykresów, jeśli mamy Chart.js
        if (typeof Chart !== 'undefined') {
            if (document.getElementById('progressChart') && typeof ChartUtils !== 'undefined') {
                ChartUtils.initProgressChart('progressChart');
            }

            if (document.getElementById('categoryChart') && typeof ChartUtils !== 'undefined') {
                ChartUtils.initCategoryChart('categoryChart');
            }
        }
    };

    // Inicjalizacja nasłuchiwania wydarzeń
    const initEventListeners = function () {
        // Przejście z ekranu powitalnego do głównej aplikacji
        const enterAppBtn = document.getElementById('enterApp');
        if (enterAppBtn) {
            // Usuń istniejące nasłuchiwacze
            const newBtn = enterAppBtn.cloneNode(true);
            if (enterAppBtn.parentNode) {
                enterAppBtn.parentNode.replaceChild(newBtn, enterAppBtn);
            }
            
            newBtn.addEventListener('click', function() {
                console.log('Kliknięto przycisk Rozpocznij przygodę');
                switchPage('mainApp');
            });
        }

        // Nawigacja
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            // Usuń istniejące nasłuchiwacze
            const newLink = link.cloneNode(true);
            if (link.parentNode) {
                link.parentNode.replaceChild(newLink, link);
            }
            
            newLink.addEventListener('click', function(e) {
                e.preventDefault();
                const tab = this.dataset.page;
                if (tab) switchTab(tab);
            });
        });

        // Interakcje z umiejętnościami
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            // Usuń istniejące nasłuchiwacze
            const newItem = item.cloneNode(true);
            if (item.parentNode) {
                item.parentNode.replaceChild(newItem, item);
            }
            
            newItem.addEventListener('click', function() {
                const skillId = this.dataset.skillId;
                if (skillId) showSkillDetail(skillId);
            });
        });

        // Eksplorator plików
        setupFolderInteractivity();
        setupFileItemsInteractivity();

        // Przyciski zamykania i interakcji
        setupModalControlButtons();
        setupActionButtons();

        // Resetowanie aplikacji
        const resetAppBtn = document.getElementById('resetAppBtn');
        if (resetAppBtn) {
            resetAppBtn.addEventListener('click', resetApplication);
        }
    };

    // Ustawienie nasłuchiwania dla folderów
    const setupFolderInteractivity = function() {
        const folderHeaders = document.querySelectorAll('.file-folder-header');
        folderHeaders.forEach(header => {
            // Usuń istniejące nasłuchiwacze
            const newHeader = header.cloneNode(true);
            if (header.parentNode) {
                header.parentNode.replaceChild(newHeader, header);
            }
            
            newHeader.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const folder = this.closest('.file-folder');
                if (folder) {
                    folder.classList.toggle('open');
                    
                    // Zmień ikonę rozwijania
                    const icon = this.querySelector('.file-folder-icon');
                    if (icon) {
                        icon.textContent = folder.classList.contains('open') ? '▼' : '▶';
                    }
                }
            });
        });
    };

    // Ustawienie nasłuchiwania dla plików
    const setupFileItemsInteractivity = function() {
        const fileItems = document.querySelectorAll('.file-item');
        fileItems.forEach(item => {
            // Usuń istniejące nasłuchiwacze
            const newItem = item.cloneNode(true);
            if (item.parentNode) {
                item.parentNode.replaceChild(newItem, item);
            }
            
            newItem.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const filePath = this.dataset.filePath;
                if (filePath) {
                    showResourceContent(filePath);
                }
            });
        });
    };

    // Ustawienie przycisków kontroli modali
    const setupModalControlButtons = function() {
        // Przyciski zamykania modali
        const closeButtons = document.querySelectorAll('.modal-close, #closeSkillModal, #closeResourceBtn, #closeCongratsModal');
        closeButtons.forEach(button => {
            if (!button) return;
            
            // Usuń istniejące nasłuchiwacze
            const newButton = button.cloneNode(true);
            if (button.parentNode) {
                button.parentNode.replaceChild(newButton, button);
            }
            
            newButton.addEventListener('click', function() {
                const modal = this.closest('.modal-backdrop');
                if (modal) modal.style.display = 'none';
                
                // Specjalne obsługi dla różnych modali
                if (this.id === 'closeSkillModal' || this.classList.contains('modal-close')) {
                    hideSkillDetail();
                } else if (this.id === 'closeResourceBtn') {
                    hideResourceViewer();
                } else if (this.id === 'closeCongratsModal') {
                    hideCongratsModal();
                }
            });
        });
    };

    // Ustawienie przycisków akcji
    const setupActionButtons = function() {
        // Przycisk dodawania powtórzeń
        const addRepsBtn = document.getElementById('addRepsBtn');
        if (addRepsBtn) {
            // Usuń istniejące nasłuchiwacze
            const newAddRepsBtn = addRepsBtn.cloneNode(true);
            if (addRepsBtn.parentNode) {
                addRepsBtn.parentNode.replaceChild(newAddRepsBtn, addRepsBtn);
            }
            
            newAddRepsBtn.addEventListener('click', addReps);
        }

        // Przycisk oznaczania jako ukończone
        const markCompletedBtn = document.getElementById('markCompletedBtn');
        if (markCompletedBtn) {
            // Usuń istniejące nasłuchiwacze
            const newMarkCompletedBtn = markCompletedBtn.cloneNode(true);
            if (markCompletedBtn.parentNode) {
                markCompletedBtn.parentNode.replaceChild(newMarkCompletedBtn, markCompletedBtn);
            }
            
            newMarkCompletedBtn.addEventListener('click', markSkillCompleted);
        }

        // Przycisk dodawania treningu
        const addTrainingBtn = document.getElementById('addTrainingBtn');
        if (addTrainingBtn) {
            // Usuń istniejące nasłuchiwacze
            const newAddTrainingBtn = addTrainingBtn.cloneNode(true);
            if (addTrainingBtn.parentNode) {
                addTrainingBtn.parentNode.replaceChild(newAddTrainingBtn, addTrainingBtn);
            }
            
            newAddTrainingBtn.addEventListener('click', addTraining);
        }

        // Przycisk rozpoczęcia dzisiejszego treningu
        const startTodayTrainingBtn = document.getElementById('startTodayTraining');
        if (startTodayTrainingBtn) {
            // Usuń istniejące nasłuchiwacze
            const newStartTodayTrainingBtn = startTodayTrainingBtn.cloneNode(true);
            if (startTodayTrainingBtn.parentNode) {
                startTodayTrainingBtn.parentNode.replaceChild(newStartTodayTrainingBtn, startTodayTrainingBtn);
            }
            
            newStartTodayTrainingBtn.addEventListener('click', startTodayTraining);
        }

        // Przycisk zamykania zasobu
        const closeResourceBtn = document.getElementById('closeResourceBtn');
        if (closeResourceBtn) {
            // Usuń istniejące nasłuchiwacze
            const newCloseResourceBtn = closeResourceBtn.cloneNode(true);
            if (closeResourceBtn.parentNode) {
                closeResourceBtn.parentNode.replaceChild(newCloseResourceBtn, closeResourceBtn);
            }
            
            newCloseResourceBtn.addEventListener('click', hideResourceViewer);
        }
    };

    // Przełączanie zakładek w aplikacji
    const switchTab = function (tabId) {
        const navLinks = document.querySelectorAll('nav a');
        const pageContents = document.querySelectorAll('.page-content');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        pageContents.forEach(content => {
            content.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-page="${tabId}"]`);
        if (activeLink) activeLink.classList.add('active');

        const activeContent = document.getElementById(`${tabId}Page`);
        if (activeContent) activeContent.classList.add('active');

        // Inicjalizacja wykresów dla zakładki postępu
        if (tabId === 'progress') {
            setTimeout(() => {
                if (typeof ChartUtils !== 'undefined') {
                    // Zniszcz istniejące wykresy, jeśli istnieją
                    ChartUtils.destroyChart('progressChart');
                    ChartUtils.destroyChart('categoryChart');

                    // Inicjalizuj nowe wykresy
                    if (document.getElementById('progressChart')) {
                        ChartUtils.initProgressChart('progressChart');
                    }

                    if (document.getElementById('categoryChart')) {
                        ChartUtils.initCategoryChart('categoryChart');
                    }
                }

                // Załaduj historię treningów
                loadTrainingHistory();
            }, 100);
        }
    };

    // Wyświetlanie szczegółów umiejętności
    const showSkillDetail = function (skillId) {
        activeSkill = skillId;

        // Użyj komponentu Skills jeśli jest dostępny
        if (window.SkillsComponent && typeof window.SkillsComponent.showSkillDetail === 'function') {
            window.SkillsComponent.showSkillDetail(skillId);
            return;
        }

        const userData = DataService.getUserData();
        const skillData = userData.skills[skillId] || { reps: 0, goalReps: 1000, status: 'new' };
        const skillDetails = DataService.getSkillDetails(skillId);

        // Aktualizacja interfejsu modalu
        const modalTitle = document.querySelector('.modal-title');
        modalTitle.textContent = skillDetails.name;

        const difficultyStars = document.querySelector('.skill-details-difficulty');
        difficultyStars.innerHTML = `<strong>Poziom trudności:</strong> `;
        for (let i = 1; i <= 5; i++) {
            difficultyStars.innerHTML += `<span class="skill-star ${i <= skillDetails.difficulty ? 'filled' : ''}">★</span>`;
        }

        const description = document.querySelector('.skill-details-description');
        description.textContent = skillDetails.description;

        const videoContainer = document.querySelector('.skill-video-container video');
        videoContainer.src = skillDetails.videoPath || '';

        const tipsList = document.querySelector('.skill-tips ul');
        tipsList.innerHTML = '';
        skillDetails.tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });

        const repProgress = document.querySelector('.rep-progress-value');
        const progress = (skillData.reps / skillData.goalReps) * 100;
        repProgress.style.width = `${progress}%`;

        const repCounter = document.querySelector('.skill-rep-tracker h4');
        repCounter.textContent = `Licznik powtórzeń (${skillData.reps}/${skillData.goalReps})`;

        // Ustaw domyślną wartość w inpucie powtórzeń
        const repInput = document.querySelector('.rep-input');
        if (repInput) {
            repInput.value = 10;
        }

        const skillDetailModal = document.getElementById('skillDetailModal');
        skillDetailModal.dataset.skillId = skillId;
        skillDetailModal.style.display = 'flex';
    };

    // Ukrycie szczegółów umiejętności
    const hideSkillDetail = function () {
        const skillDetailModal = document.getElementById('skillDetailModal');
        if (!skillDetailModal) return;
        
        skillDetailModal.style.display = 'none';
        const videoContainer = document.querySelector('.skill-video-container video');
        if (videoContainer) {
            videoContainer.pause();
            videoContainer.src = '';
        }
        activeSkill = null;
    };

    // Pokazywanie zawartości zasobu
    const showResourceContent = function (filePath) {
        activeResource = filePath;

        // Użyj komponentu Resources jeśli jest dostępny
        if (window.ResourcesComponent && typeof window.ResourcesComponent.showResource === 'function') {
            window.ResourcesComponent.showResource(filePath);
            return;
        }

        const resourceViewer = document.getElementById('resourceViewer');
        const resourceTitle = document.querySelector('.resource-viewer-title');
        const resourceContent = document.querySelector('.resource-viewer-content');

        if (!resourceViewer || !resourceTitle || !resourceContent) {
            console.error('Nie znaleziono elementów przeglądarki zasobów');
            return;
        }

        // Wyciągnij nazwę pliku ze ścieżki
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
            // Dla plików markdown próbujemy załadować ich zawartość
            resourceContent.innerHTML = `
                <p class="mb-3">Plik dokumentacji: ${fileName}</p>
                <p>Ten dokument zawiera szczegółowe informacje o technice.</p>
                <div class="markdown-content">
                    <p>Ładowanie treści...</p>
                </div>
            `;

            // Pobierz zawartość pliku markdown
            FileService.loadTextFile(filePath, (error, content) => {
                if (error) {
                    resourceContent.querySelector('.markdown-content').innerHTML = `
                        <p class="text-red-500">Nie udało się załadować treści. Error: ${error.message}</p>
                    `;
                } else {
                    // Prosta konwersja markdown na HTML
                    resourceContent.querySelector('.markdown-content').innerHTML = content
                        .split('\n\n').map(paragraph => `<p>${paragraph}</p>`)
                        .join('')
                        .replace(/# (.*)/g, '<h1>$1</h1>')
                        .replace(/## (.*)/g, '<h2>$1</h2>')
                        .replace(/### (.*)/g, '<h3>$1</h3>')
                        .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*)\*/g, '<em>$1</em>')
                        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
                }
            });
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
            `;
        }

        resourceViewer.style.display = 'block';
    };

    // Ukrycie przeglądarki zasobów
    const hideResourceViewer = function () {
        const resourceViewer = document.getElementById('resourceViewer');
        if (!resourceViewer) return;
        
        resourceViewer.style.display = 'none';
        const videos = resourceViewer.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.src = '';
        });
        activeResource = null;
    };

    // Pokazywanie gratulacji
    const showCongratsModal = function (badgeId) {
        const userData = DataService.getUserData();
        const badge = userData.badges.find(b => b.id === badgeId) || {
            name: 'Nowa odznaka',
            description: 'Gratulacje z zdobycia nowej odznaki!',
            icon: '🏆',
            color: '#f39c12'
        };

        const badgeIcon = document.querySelector('.badge-unlocked');
        badgeIcon.textContent = badge.icon;
        badgeIcon.style.backgroundColor = badge.color || '#f39c12';

        const badgeTitle = document.querySelector('.congrats-title');
        badgeTitle.textContent = `Zdobyłaś nową odznakę!`;

        const badgeText = document.querySelector('.congrats-text');
        badgeText.textContent = `Właśnie odblokowałaś odznakę "${badge.name}" - ${badge.description}! Tak trzymaj!`;

        createConfetti();
        
        const congratsModal = document.getElementById('congratsModal');
        if (congratsModal) congratsModal.style.display = 'flex';
    };

    // Ukrycie gratulacji
    const hideCongratsModal = function () {
        const congratsModal = document.getElementById('congratsModal');
        if (congratsModal) congratsModal.style.display = 'none';
        completedSkill = null;
    };

    // Wyświetlanie powiadomienia
    const showToast = function (message, type = 'success') {
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

        // Dodaj animację wejścia
        setTimeout(() => {
            toast.classList.add('toast-visible');
        }, 10);

        // Ustaw timer usunięcia
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, 3000);
    };

    // Tworzenie efektu konfetti
    const createConfetti = function () {
        const confettiContainer = document.getElementById('confettiContainer');
        if (!confettiContainer) return;
        
        confettiContainer.innerHTML = '';
        const colors = ['#f39c12', '#3498db', '#2ecc71', '#e74c3c', '#9b59b6'];

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 10}px`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            confettiContainer.appendChild(confetti);
        }

        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 5000);
    };

    // Aktualizacja interfejsu użytkownika
    const updateUI = function () {
        const userData = DataService.getUserData();

        // Aktualizuj nazwę użytkownika
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = userData.name;
        }

        // Aktualizuj progress umiejętności
        updateSkillProgress();

        // Aktualizuj odznaki
        updateBadges();

        // Zaktualizuj historię treningów
        loadTrainingHistory();

        if (window.SkillsComponent && typeof window.SkillsComponent.updateCategoryCounters === 'function') {
            window.SkillsComponent.updateCategoryCounters();
        }
    };

    // Aktualizacja postępu umiejętności w UI
    const updateSkillProgress = function () {
        // Użyj komponentu Skills jeśli jest dostępny
        if (window.SkillsComponent && typeof window.SkillsComponent.updateSkillsView === 'function') {
            window.SkillsComponent.updateSkillsView();
            return;
        }

        const userData = DataService.getUserData();

        // Aktualizuj karty umiejętności
        document.querySelectorAll('.skill-item').forEach(item => {
            const skillId = item.dataset.skillId;
            if (!skillId || !userData.skills[skillId]) return;

            const skillData = userData.skills[skillId];
            const progressBar = item.querySelector('.skill-progress-value');

            if (progressBar) {
                const progress = (skillData.reps / skillData.goalReps) * 100;
                progressBar.style.width = `${progress}%`;
            }

            // Aktualizuj status
            const skillName = item.querySelector('.skill-name');
            if (skillName) {
                // Usuń istniejący badge
                const existingBadge = skillName.querySelector('.custom-badge');
                if (existingBadge) {
                    existingBadge.remove();
                }

                // Dodaj badge z aktualnym statusem
                let badge = document.createElement('span');
                badge.className = 'custom-badge';

                if (skillData.status === 'completed') {
                    badge.className += ' badge-completed';
                    badge.textContent = 'Ukończone';
                } else if (skillData.status === 'in-progress') {
                    badge.className += ' badge-in-progress';
                    badge.textContent = 'W trakcie';
                } else {
                    badge.className += ' badge-new';
                    badge.textContent = 'Nowe';
                }

                skillName.appendChild(badge);
            }

            // Aktualizuj checkbox
            const checkbox = item.querySelector('.skill-checkbox');
            if (checkbox) {
                checkbox.checked = skillData.status === 'completed';
            }
        });

        // Aktualizuj podsumowanie na dashboard
        const totalProgress = document.querySelector('.progress-ring-percentage');
        if (totalProgress) {
            const progress = calculateTotalProgress();
            totalProgress.textContent = `${Math.round(progress)}%`;

            // Aktualizuj pierścień postępu
            const circle = document.querySelector('.progress-ring-value');
            if (circle) {
                const radius = parseFloat(circle.getAttribute('r'));
                const circumference = 2 * Math.PI * radius;
                circle.style.strokeDasharray = `${circumference} ${circumference}`;
                circle.style.strokeDashoffset = circumference - (progress / 100) * circumference;
            }
        }

        // Aktualizuj liczniki statystyk
        const completedCounter = document.querySelector('.dashboard-grid .stat-card:nth-child(2) .stat-value');
        if (completedCounter) {
            completedCounter.textContent = userData.progress.completedSkills;
        }

        const inProgressCounter = document.querySelector('.dashboard-grid .stat-card:nth-child(3) .stat-value');
        if (inProgressCounter) {
            inProgressCounter.textContent = userData.progress.inProgressSkills;
        }
    };

    // Aktualizacja odznak w UI
    const updateBadges = function () {
        const userData = DataService.getUserData();

        // Aktualizuj karty odznak
        document.querySelectorAll('.badge-card').forEach(card => {
            const badgeId = card.dataset.badgeId;
            if (!badgeId) return;

            const badge = userData.badges.find(b => b.id === badgeId);
            if (!badge) return;

            const badgeIcon = card.querySelector('.badge-icon');
            if (badgeIcon) {
                if (badge.unlocked) {
                    badgeIcon.classList.remove('badge-locked');
                    badgeIcon.textContent = badge.icon;
                    badgeIcon.style.backgroundColor = badge.color;
                } else {
                    badgeIcon.classList.add('badge-locked');
                    badgeIcon.textContent = '';
                }
            }
        });

        // Aktualizuj postęp odznak na dashboard
        const badgeContainers = document.querySelectorAll('.dashboard-card .progress-container');
        if (badgeContainers && badgeContainers.length > 0) {
            // Znajdź odznaki (zarówno odblokowane jak i zablokowane)
            const badgesToShow = userData.badges.slice(0, 3);

            badgesToShow.forEach((badge, index) => {
                if (index < badgeContainers.length) {
                    const container = badgeContainers[index];
                    const titleElement = container.querySelector('.progress-title');
                    const percentageElement = container.querySelector('.progress-percentage');
                    const progressValue = container.querySelector('.progress-value');

                    if (titleElement) titleElement.textContent = badge.name;
                    if (percentageElement) {
                        percentageElement.textContent = badge.unlocked ? 'Zdobyta!' : '0%';
                    }
                    if (progressValue) {
                        progressValue.style.width = badge.unlocked ? '100%' : '0%';
                    }
                }
            });
        }
    };

    // Obliczanie całkowitego postępu
    const calculateTotalProgress = function () {
        const userData = DataService.getUserData();

        if (Object.keys(userData.skills).length === 0) return 0;

        let completedReps = 0;
        let totalGoal = 0;

        Object.values(userData.skills).forEach(skill => {
            completedReps += skill.reps || 0;
            totalGoal += skill.goalReps;
        });

        return (completedReps / totalGoal) * 100;
    };

    // Ładowanie historii treningowej
    const loadTrainingHistory = function () {
        const historyContainer = document.getElementById('trainingHistory');
        if (!historyContainer) return;

        const userData = DataService.getUserData();
        const history = userData.trainingHistory || [];

        // Wyczyść kontener
        historyContainer.innerHTML = '';

        // Dodaj wpisy historii (maks. 10 ostatnich)
        history.slice(0, 10).forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'training-entry';

            // Formatuj datę
            let formattedDate = entry.date;
            if (entry.date && entry.date.includes('-')) {
                const [year, month, day] = entry.date.split('-');
                formattedDate = `${day}.${month}.${year}`;
            }

            entryElement.innerHTML = `
                <div class="training-date">${formattedDate}</div>
                <div class="training-skill">${entry.skill}</div>
                <div class="training-reps">${entry.reps} powtórzeń</div>
                <div class="training-notes">${entry.notes || 'Brak notatek'}</div>
            `;

            historyContainer.appendChild(entryElement);
        });

        // Jeśli brak historii, wyświetl komunikat
        if (history.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'training-entry';
            emptyMessage.innerHTML = `
                <div class="training-notes">Brak historii treningowej. Dodaj swój pierwszy trening!</div>
            `;
            historyContainer.appendChild(emptyMessage);
        }
    };

    // Dodawanie powtórzeń
    const addReps = function () {
        if (!activeSkill) return;

        const repInput = document.querySelector('.rep-input');
        if (!repInput) return;
        
        const reps = parseInt(repInput.value);

        if (!reps || reps < 1) {
            showToast('Wprowadź liczbę powtórzeń', 'error');
            return;
        }

        // Dodaj powtórzenia
        const success = DataService.addReps(activeSkill, reps);

        if (success) {
            // Sprawdź, czy umiejętność została ukończona
            const userData = DataService.getUserData();
            const skillData = userData.skills[activeSkill];

            if (skillData.status === 'completed') {
                completedSkill = activeSkill;
                hideSkillDetail();

                // Znajdź odznakę, która mogła zostać odblokowana
                const unlockedBadge = userData.badges.find(b => b.unlocked && (
                    (b.id === 'basic-flow-master' && activeSkill === 'basic-flow') ||
                    (b.id === '1000-reps' && skillData.reps >= 1000) ||
                    (b.id === 'smooth-operator' && skillData.reps >= 100)
                ));

                if (unlockedBadge) {
                    showCongratsModal(unlockedBadge.id);
                }
            } else {
                // Aktualizuj UI modalu
                const userData = DataService.getUserData();
                const skillData = userData.skills[activeSkill];

                const repProgress = document.querySelector('.rep-progress-value');
                const progress = (skillData.reps / skillData.goalReps) * 100;
                repProgress.style.width = `${progress}%`;

                const repCounter = document.querySelector('.skill-rep-tracker h4');
                repCounter.textContent = `Licznik powtórzeń (${skillData.reps}/${skillData.goalReps})`;

                // Reset input
                repInput.value = 10;

                showToast(`Dodano ${reps} powtórzeń!`);
            }

            // Aktualizuj UI
            updateUI();

            // Odśwież wykresy, jeśli istnieją
            refreshCharts();

            // Aktualizuj liczniki kategorii jeśli SkillsComponent istnieje
            if (window.SkillsComponent && typeof window.SkillsComponent.updateCategoryCounters === 'function') {
                window.SkillsComponent.updateCategoryCounters();
            }
        } else {
            showToast('Nie udało się dodać powtórzeń', 'error');
        }
    };

    // Dodawanie notatki treningowej
    const addTraining = function () {
        const dateInput = document.getElementById('trainingDate');
        const skillSelect = document.getElementById('trainingSkill');
        const repsInput = document.getElementById('trainingReps');
        const notesInput = document.getElementById('trainingNotes');
        
        if (!dateInput || !skillSelect || !repsInput || !notesInput) {
            showToast('Nie znaleziono wszystkich pól formularza', 'error');
            return;
        }
        
        const date = dateInput.value;
        const skillId = skillSelect.value;
        const reps = parseInt(repsInput.value);
        const notes = notesInput.value;

        if (!skillId || !reps || reps < 1) {
            showToast('Wypełnij wszystkie pola formularza', 'error');
            return;
        }

        // Dodaj powtórzenia
        const success = DataService.addReps(skillId, reps);

        if (success) {
            // Dodaj notatkę, jeśli istnieje
            if (notes.trim()) {
                DataService.addTrainingNote(skillId, notes);
            }

            // Reset formularza
            notesInput.value = '';
            repsInput.value = 10;

            // Sprawdź, czy umiejętność została ukończona
            const userData = DataService.getUserData();
            const skillData = userData.skills[skillId];

            if (skillData.status === 'completed') {
                completedSkill = skillId;

                // Znajdź odznakę, która mogła zostać odblokowana
                const unlockedBadge = userData.badges.find(b => b.unlocked && (
                    (b.id === 'basic-flow-master' && skillId === 'basic-flow') ||
                    (b.id === '1000-reps' && skillData.reps >= 1000) ||
                    (b.id === 'smooth-operator' && skillData.reps >= 100)
                ));

                if (unlockedBadge) {
                    showCongratsModal(unlockedBadge.id);
                }
            }

            // Aktualizuj UI
            updateUI();

            // Odśwież wykresy, jeśli istnieją
            refreshCharts();

            showToast('Trening został dodany pomyślnie!');
        } else {
            showToast('Nie udało się dodać treningu', 'error');
        }
    };

    // Oznaczanie umiejętności jako ukończonej
    const markSkillCompleted = function () {
        if (!activeSkill) return;

        // Oznacz umiejętność jako ukończoną
        const success = DataService.markSkillAsCompleted(activeSkill);

        if (success) {
            completedSkill = activeSkill;
            hideSkillDetail();

            // Znajdź odznakę, która mogła zostać odblokowana
            const userData = DataService.getUserData();
            const unlockedBadge = userData.badges.find(b => b.unlocked && (
                (b.id === 'basic-flow-master' && activeSkill === 'basic-flow') ||
                (b.id === '1000-reps')
            ));

            if (unlockedBadge) {
                showCongratsModal(unlockedBadge.id);
            }

            // Aktualizuj UI
            updateUI();

            // Odśwież wykresy, jeśli istnieją
            refreshCharts();

            // Wyświetl potwierdzenie
            showToast('Umiejętność została oznaczona jako opanowana!');

            // Aktualizuj liczniki kategorii jeśli SkillsComponent istnieje
            if (window.SkillsComponent && typeof window.SkillsComponent.updateCategoryCounters === 'function') {
                window.SkillsComponent.updateCategoryCounters();
            }
        } else {
            showToast('Nie udało się oznaczyć umiejętności jako opanowanej', 'error');
        }
    };

    // Odświeżanie wykresów
    const refreshCharts = function () {
        // Odśwież wykresy, jeśli Chart.js jest dostępny
        if (typeof Chart !== 'undefined' && typeof ChartUtils !== 'undefined') {
            if (document.getElementById('progressChart')) {
                ChartUtils.updateProgressChart('progressChart');
            }

            if (document.getElementById('categoryChart')) {
                ChartUtils.updateCategoryChart('categoryChart');
            }
        }
    };

    // Rozpoczęcie dzisiejszego treningu
    const startTodayTraining = function () {
        // Przełącz na zakładkę umiejętności
        switchTab('skills');
        showToast('Rozpoczęto dzisiejszy trening!');
    };

    // Resetowanie aplikacji
    const resetApplication = function () {
        if (confirm('Czy na pewno chcesz zresetować aplikację? Wszystkie Twoje dane zostaną usunięte.')) {
            try {
                DataService.resetUserData();
                showToast('Aplikacja została zresetowana. Odświeżanie strony...', 'info');

                // Odśwież stronę po krótkim opóźnieniu
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } catch (error) {
                console.error('Błąd podczas resetowania aplikacji:', error);
                showToast('Wystąpił błąd podczas resetowania aplikacji', 'error');
            }
        }
    };

    // Przełączanie stron
    const switchPage = function (pageId) {
        const welcomePage = document.getElementById('welcomePage');
        const mainApp = document.getElementById('mainApp');
        
        if (!welcomePage || !mainApp) return;
        
        if (pageId === 'mainApp') {
            welcomePage.classList.remove('active');
            mainApp.classList.add('active');
        } else if (pageId === 'welcomePage') {
            mainApp.classList.remove('active');
            welcomePage.classList.add('active');
        }
    };

    // Zwraca publiczny interfejs API
    return {
        init: init,
        switchPage: switchPage,
        switchTab: switchTab,
        showSkillDetail: showSkillDetail,
        showResourceContent: showResourceContent,
        addReps: addReps,
        addTraining: addTraining,
        markSkillCompleted: markSkillCompleted,
        updateUI: updateUI,
        showToast: showToast,
        showCongratsModal: showCongratsModal,
        hideCongratsModal: hideCongratsModal,
        hideSkillDetail: hideSkillDetail,
        hideResourceViewer: hideResourceViewer,
        refreshCharts: refreshCharts,
        resetApplication: resetApplication,
        loadTrainingHistory: loadTrainingHistory
    };
})();

// Inicjalizacja aplikacji po załadowaniu dokumentu
document.addEventListener('DOMContentLoaded', function() {
    if (window.FreestyleStaffApp && typeof window.FreestyleStaffApp.init === 'function') {
        FreestyleStaffApp.init();
    }
});