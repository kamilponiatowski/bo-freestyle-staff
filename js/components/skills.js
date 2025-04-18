/**
 * Freestyle Staff Academy - Komponent Skills
 * 
 * Ten moduł odpowiada za zarządzanie umiejętnościami i ich wyświetlaniem.
 * Obsługuje kategorie, listę umiejętności, szczegóły i modyfikację postępów.
 */

const SkillsComponent = (function () {
    // Prywatna zmienna przechowująca ID aktualnie wybranej umiejętności
    let activeSkill = null;

    // Inicjalizacja komponentu
    const initialize = function () {
        setupCategoryControls();
        setupSkillItems();
        setupModalControls();
        updateCategoryCounters();
    };

    // Konfiguracja kontrolek kategorii
    const setupCategoryControls = function () {
        // Aktualizuj liczniki umiejętności w kategoriach
        updateCategoryCounters();

        // Obsługa rozwijania/zwijania kategorii
        document.querySelectorAll('.skill-category .category-header').forEach(header => {
            // Usuń istniejące nasłuchiwacze przez bezpośrednie przypisanie funkcji
            header.onclick = function () {
                const category = this.parentElement;
                const skillList = category.querySelector('.skill-list');

                if (skillList.style.display === 'none') {
                    skillList.style.display = 'block';
                    this.querySelector('.file-folder-icon')?.textContent = '▼';
                } else {
                    skillList.style.display = 'none';
                    this.querySelector('.file-folder-icon')?.textContent = '▶';
                }
            };
        });
    };

    // Aktualizacja liczników umiejętności w kategoriach
    const updateCategoryCounters = function () {
        const userData = DataService.getUserData();
        const categories = DataService.getCategories();

        categories.forEach(category => {
            const categoryElements = document.querySelectorAll(`.skill-category .category-header`);

            categoryElements.forEach(element => {
                if (element.textContent.includes(category.name)) {
                    // Znajdź umiejętności w tej kategorii
                    const skillsInCategory = Object.values(userData.skills).filter(skill => skill.category === category.id);
                    const completedCount = skillsInCategory.filter(skill => skill.status === 'completed').length;

                    // Aktualizuj licznik w nagłówku
                    const counterElement = element.querySelector('.category-progress');
                    if (counterElement) {
                        counterElement.textContent = `${completedCount}/${skillsInCategory.length}`;
                    }
                }
            });
        });
    };

    // Konfiguracja elementów umiejętności
    const setupSkillItems = function () {
        document.querySelectorAll('.skill-item').forEach(item => {
            // Bezpośrednio przypisz funkcję obsługi kliknięcia
            item.onclick = function () {
                const skillId = this.dataset.skillId;
                if (skillId) {
                    showSkillDetail(skillId);
                }
            };
        });
    };

    // Konfiguracja kontrolek modalu
    const setupModalControls = function () {
        // Przycisk zamykania - używamy bezpośredniego przypisania funkcji
        const closeSkillModal = document.getElementById('closeSkillModal');
        if (closeSkillModal) {
            closeSkillModal.onclick = hideSkillDetail;
        }

        // Przyciski w modalu
        const addRepsBtn = document.getElementById('addRepsBtn');
        if (addRepsBtn) {
            addRepsBtn.onclick = addReps;
        }

        const markCompletedBtn = document.getElementById('markCompletedBtn');
        if (markCompletedBtn) {
            markCompletedBtn.onclick = markSkillCompleted;
        }

        // Przyciski zamykania
        document.querySelectorAll('.modal-close').forEach(button => {
            button.onclick = hideSkillDetail;
        });
    };

    // Wyświetlanie szczegółów umiejętności
    const showSkillDetail = function (skillId) {
        activeSkill = skillId;

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

        // Ustaw ID umiejętności w modalu dla późniejszego użycia
        const skillDetailModal = document.getElementById('skillDetailModal');
        skillDetailModal.dataset.skillId = skillId;

        // Przygotuj input pola powtórzeń
        const repInput = document.querySelector('.rep-input');
        if (repInput) {
            repInput.value = 10;
        }

        // Wyświetl modal
        skillDetailModal.style.display = 'flex';
    };

    // Ukrycie szczegółów umiejętności
    const hideSkillDetail = function () {
        const modal = document.getElementById('skillDetailModal');
        if (!modal) return;

        // Zatrzymaj odtwarzanie wideo
        const videoContainer = document.querySelector('.skill-video-container video');
        if (videoContainer) {
            videoContainer.pause();
            videoContainer.src = '';
        }

        // Ukryj modal
        modal.style.display = 'none';
        activeSkill = null;
    };

    // Dodawanie powtórzeń
    const addReps = function () {
        if (!activeSkill) return;

        const repsInput = document.querySelector('.rep-input');
        const reps = parseInt(repsInput.value);

        if (!reps || reps < 1) {
            alert('Wprowadź poprawną liczbę powtórzeń');
            return;
        }

        // Dodaj powtórzenia
        const success = DataService.addReps(activeSkill, reps);

        if (success) {
            // Sprawdź, czy umiejętność została ukończona
            const userData = DataService.getUserData();
            const skillData = userData.skills[activeSkill];

            if (skillData.status === 'completed') {
                // Ukryj modal i pokaż gratulacje
                hideSkillDetail();
                showCongratsModal(activeSkill);
            } else {
                // Aktualizuj UI modalu
                const userData = DataService.getUserData();
                const skillData = userData.skills[activeSkill];

                const repProgress = document.querySelector('.rep-progress-value');
                const progress = (skillData.reps / skillData.goalReps) * 100;
                repProgress.style.width = `${progress}%`;

                const repCounter = document.querySelector('.skill-rep-tracker h4');
                repCounter.textContent = `Licznik powtórzeń (${skillData.reps}/${skillData.goalReps})`;

                // Resetuj input
                repsInput.value = 10;

                alert(`Dodano ${reps} powtórzeń!`);
            }

            // Aktualizuj tylko konkretną umiejętność
            updateSpecificSkill(activeSkill);
        } else {
            alert('Nie udało się dodać powtórzeń');
        }
    };

    // Aktualizacja konkretnej umiejętności w UI
    const updateSpecificSkill = function(skillId) {
        const userData = DataService.getUserData();
        const skillData = userData.skills[skillId];
        
        if (!skillData) return;
        
        // Znajdź wszystkie wystąpienia tej umiejętności w UI
        document.querySelectorAll(`.skill-item[data-skill-id="${skillId}"]`).forEach(item => {
            // Aktualizuj pasek postępu
            const progressBar = item.querySelector('.skill-progress-value');
            if (progressBar) {
                const progress = (skillData.reps / skillData.goalReps) * 100;
                progressBar.style.width = `${progress}%`;
            }
            
            // Aktualizuj checkbox
            const checkbox = item.querySelector('.skill-checkbox');
            if (checkbox) {
                checkbox.checked = skillData.status === 'completed';
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
        });
        
        // Aktualizuj liczniki kategorii
        updateCategoryCounters();
    };

    // Oznaczanie umiejętności jako ukończonej
    const markSkillCompleted = function () {
        if (!activeSkill) return;

        // Oznacz umiejętność jako ukończoną
        const success = DataService.markSkillAsCompleted(activeSkill);

        if (success) {
            // Ukryj modal i pokaż gratulacje
            hideSkillDetail();
            showCongratsModal(activeSkill);

            // Aktualizuj tylko konkretną umiejętność
            updateSpecificSkill(activeSkill);
        } else {
            alert('Nie udało się oznaczyć umiejętności jako ukończonej');
        }
    };

    // Wyświetlanie modalu z gratulacjami
    const showCongratsModal = function (skillId) {
        // W rzeczywistej aplikacji wywołalibyśmy funkcję z głównego obiektu aplikacji
        if (window.FreestyleStaffApp && typeof window.FreestyleStaffApp.showCongratsModal === 'function') {
            window.FreestyleStaffApp.showCongratsModal(skillId);
        } else {
            console.log(`Gratulacje za ukończenie umiejętności: ${skillId}`);
        }
    };

    // Wyświetlanie powiadomienia
    const showToast = function (message, type = 'success') {
        if (window.FreestyleStaffApp && typeof window.FreestyleStaffApp.showToast === 'function') {
            window.FreestyleStaffApp.showToast(message, type);
        } else {
            console.log(`Toast (${type}): ${message}`);
        }
    };

    // Publiczny interfejs API
    return {
        initialize: initialize,
        showSkillDetail: showSkillDetail,
        hideSkillDetail: hideSkillDetail,
        updateSpecificSkill: updateSpecificSkill,
        updateCategoryCounters: updateCategoryCounters
    };
})();

// Eksportuj moduł
window.SkillsComponent = SkillsComponent;