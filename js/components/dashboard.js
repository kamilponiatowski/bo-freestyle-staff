/**
 * Freestyle Staff Academy - Komponent Dashboard
 * 
 * Ten moduł zawiera funkcje odpowiedzialne za interfejs i logikę sekcji dashboard.
 * Zarządza wyświetlaniem podsumowania, statystyk, i rekomendowanych treningów.
 */

const DashboardComponent = (function() {
    // Prywatne zmienne
    let activeSkills = [];
    let latestBadges = [];
    
    // Inicjalizacja komponentu
    const initialize = function() {
        console.log('Inicjalizacja komponentu Dashboard...');
        updateDashboardStats();
        setupRecommendedTraining();
        setupQuickActions();
        updateTricksToMaster();
        
        // Inicjalizacja pierścienia postępu
        initProgressRing();
    };
    
    // Aktualizacja statystyk na dashboardzie
    const updateDashboardStats = function() {
        // Pobierz dane użytkownika
        const userData = DataService.getUserData();
        
        // Aktualizuj pierścień postępu
        updateProgressRing(calculateTotalProgress(userData));
        
        // Aktualizuj karty statystyk
        const completedCounter = document.querySelector('.dashboard-grid .stat-card:nth-child(2) .stat-value');
        if (completedCounter) {
            completedCounter.textContent = userData.progress.completedSkills || 0;
        }
        
        const inProgressCounter = document.querySelector('.dashboard-grid .stat-card:nth-child(3) .stat-value');
        if (inProgressCounter) {
            inProgressCounter.textContent = userData.progress.inProgressSkills || 0;
        }
        
        // Aktualizuj ostatnie odznaki
        updateBadgesProgress(userData.badges);
    };
    
    // Inicjalizacja pierścienia postępu
    const initProgressRing = function() {
        const ring = document.querySelector('.progress-ring');
        if (!ring) return;
        
        const circle = ring.querySelector('.progress-ring-value');
        if (circle) {
            const radius = parseInt(circle.getAttribute('r'), 10);
            const circumference = 2 * Math.PI * radius;
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
        }
    };
    
    // Aktualizacja pierścienia postępu
    const updateProgressRing = function(percentage) {
        const progressPercentage = document.querySelector('.progress-ring-percentage');
        if (progressPercentage) {
            progressPercentage.textContent = `${Math.round(percentage)}%`;
        }
        
        const circle = document.querySelector('.progress-ring-value');
        if (circle) {
            const radius = parseInt(circle.getAttribute('r'), 10);
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percentage / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }
    };
    
    // Obliczanie całkowitego postępu
    const calculateTotalProgress = function(userData) {
        const skills = userData.skills;
        
        if (Object.keys(skills).length === 0) return 0;
        
        let completedReps = 0;
        let totalGoal = 0;
        
        Object.values(skills).forEach(skill => {
            completedReps += skill.reps || 0;
            totalGoal += skill.goalReps || 1000;
        });
        
        return totalGoal > 0 ? (completedReps / totalGoal) * 100 : 0;
    };
    
    // Aktualizacja sekcji odznak
    const updateBadgesProgress = function(badges) {
        const badgeContainers = document.querySelectorAll('.dashboard-card .progress-container');
        if (!badgeContainers || badgeContainers.length === 0) return;
        
        // Znajdź odznaki (zarówno odblokowane jak i zablokowane)
        const badgesToShow = badges.slice(0, 3);
        
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
    };
    
    // Konfiguracja rekomendowanego treningu
    const setupRecommendedTraining = function() {
        const userData = DataService.getUserData();
        const skills = userData.skills;
        
        // Znajdź umiejętności do treningu (w trakcie lub nowe)
        const skillsToTrain = Object.entries(skills)
            .filter(([_, data]) => data.status !== 'completed')
            .sort((a, b) => {
                // Priorytetyzuj umiejętności w trakcie
                const statusPriority = {
                    'in-progress': 0,
                    'new': 1
                };
                return statusPriority[a[1].status] - statusPriority[b[1].status];
            })
            .slice(0, 3)
            .map(([id, _]) => id);
        
        // Zapisz do lokalnej zmiennej
        activeSkills = skillsToTrain;
        
        // Generowanie planu treningowego
        const trainingPlanList = document.querySelector('#dashboardPage .dashboard-card ul');
        if (trainingPlanList) {
            trainingPlanList.innerHTML = '';
            
            skillsToTrain.forEach(skillId => {
                const skill = skills[skillId];
                if (!skill) return;
                
                // Określ liczbę powtórzeń na podstawie statusu
                let repsToSuggest = 0;
                if (skill.status === 'in-progress') {
                    repsToSuggest = Math.min(50, Math.ceil((skill.goalReps - skill.reps) / 20));
                } else {
                    repsToSuggest = 20; // Dla nowych umiejętności
                }
                
                const li = document.createElement('li');
                li.textContent = `${skill.name}: ${repsToSuggest} powtórzeń`;
                trainingPlanList.appendChild(li);
            });
            
            // Jeśli nie ma umiejętności do treningu, dodaj komunikat
            if (skillsToTrain.length === 0) {
                const li = document.createElement('li');
                li.textContent = "Brak umiejętności do treningu. Zacznij od Basic Flow!";
                trainingPlanList.appendChild(li);
            }
        }
    };
    
    // Aktualizacja tricków do opanowania
    const updateTricksToMaster = function() {
        const skillsContainer = document.querySelector('#dashboardPage .skill-list');
        if (!skillsContainer) return;
        
        const userData = DataService.getUserData();
        
        // Pobierz umiejętności do treningu
        const skillIds = activeSkills.length > 0 ? activeSkills : 
            Object.entries(userData.skills)
            .filter(([_, data]) => data.status !== 'completed')
            .slice(0, 4)
            .map(([id, _]) => id);
        
        skillsContainer.innerHTML = '';
        
        skillIds.forEach(skillId => {
            const skill = userData.skills[skillId];
            if (!skill) return;
            
            const skillProgress = Math.min(100, Math.max(0, (skill.reps / skill.goalReps) * 100));
            
            let statusBadge = '';
            if (skill.status === 'completed') {
                statusBadge = '<span class="custom-badge badge-completed">Ukończone</span>';
            } else if (skill.status === 'in-progress') {
                statusBadge = '<span class="custom-badge badge-in-progress">W trakcie</span>';
            } else {
                statusBadge = '<span class="custom-badge badge-new">Nowy</span>';
            }
            
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.dataset.skillId = skillId;
            
            // Renderowanie gwiazdek trudności
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                starsHtml += `<span class="skill-star ${i <= skill.difficulty ? 'filled' : ''}">★</span>`;
            }
            
            skillItem.innerHTML = `
                <input type="checkbox" class="skill-checkbox" ${skill.status === 'completed' ? 'checked' : ''}>
                <div class="skill-info">
                    <div class="skill-name">${skill.name} ${statusBadge}</div>
                    <div class="skill-difficulty">
                        ${starsHtml}
                    </div>
                    <div class="skill-progress">
                        <div class="skill-progress-value" style="width: ${skillProgress}%;"></div>
                    </div>
                </div>
            `;
            
            // Dodaj zdarzenie kliknięcia
            skillItem.addEventListener('click', () => {
                if (window.FreestyleStaffApp && typeof window.FreestyleStaffApp.showSkillDetail === 'function') {
                    window.FreestyleStaffApp.showSkillDetail(skillId);
                } else if (window.SkillsComponent && typeof window.SkillsComponent.showSkillDetail === 'function') {
                    window.SkillsComponent.showSkillDetail(skillId);
                }
            });
            
            skillsContainer.appendChild(skillItem);
        });
    };
    
    // Konfiguracja szybkich akcji
    const setupQuickActions = function() {
        const startTrainingBtn = document.getElementById('startTodayTraining');
        if (startTrainingBtn) {
            startTrainingBtn.addEventListener('click', () => {
                // Jeśli mamy aktywne umiejętności, przełącz na zakładkę umiejętności
                if (activeSkills.length > 0) {
                    if (window.FreestyleStaffApp && typeof window.FreestyleStaffApp.switchTab === 'function') {
                        window.FreestyleStaffApp.switchTab('skills');
                        
                        // Opcjonalnie: otwórz szczegóły pierwszej aktywnej umiejętności
                        setTimeout(() => {
                            if (typeof window.FreestyleStaffApp.showSkillDetail === 'function') {
                                window.FreestyleStaffApp.showSkillDetail(activeSkills[0]);
                            }
                        }, 300);
                    } else {
                        // Alternatywna metoda, jeśli FreestyleStaffApp nie jest dostępny
                        const skillsTab = document.querySelector('nav a[data-page="skills"]');
                        if (skillsTab) skillsTab.click();
                    }
                } else {
                    console.log('Brak aktywnych umiejętności do treningu');
                }
            });
        }
    };
    
    // Publiczny interfejs API
    return {
        initialize: initialize,
        updateStats: updateDashboardStats,
        updateTricksToMaster: updateTricksToMaster
    };
})();

// Eksportuj moduł
window.DashboardComponent = DashboardComponent;