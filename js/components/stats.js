/**
 * Freestyle Staff Academy - Komponent Stats
 * 
 * Ten moduł obsługuje statystyki i raportowanie postępów treningowych.
 * Zarządza wykresami, danymi treningowymi i generowaniem raportów.
 */

const StatsComponent = (function() {
    // Prywatne zmienne
    let progressChartInstance = null;
    let categoryChartInstance = null;
    
    // Inicjalizacja komponentu
    const initialize = function() {
        initProgressChart();
        initCategoryChart();
        setupTrainingForms();
        loadTrainingHistory();
    };
    
    // Inicjalizacja wykresu postępów
    const initProgressChart = function() {
        const progressChart = document.getElementById('progressChart');
        if (!progressChart) return;
        
        // Zniszcz istniejący wykres, jeśli istnieje
        if (progressChartInstance) {
            progressChartInstance.destroy();
        }
        
        // Pobierz dane dla wykresu
        const chartData = prepareProgressChartData();
        
        // Utwórz nowy wykres
        progressChartInstance = new Chart(progressChart.getContext('2d'), {
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
    
    // Inicjalizacja wykresu kategorii
    const initCategoryChart = function() {
        const categoryChart = document.getElementById('categoryChart');
        if (!categoryChart) return;
        
        // Zniszcz istniejący wykres, jeśli istnieje
        if (categoryChartInstance) {
            categoryChartInstance.destroy();
        }
        
        // Pobierz dane dla wykresu
        const chartData = prepareCategoryChartData();
        
        // Utwórz nowy wykres
        categoryChartInstance = new Chart(categoryChart.getContext('2d'), {
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
    const prepareProgressChartData = function() {
        const userData = DataService.getUserData();
        
        // Pobierz historię treningową
        const history = userData.trainingHistory || [];
        const dateSet = new Set();
        
        // Zbierz unikalne daty z historii (max. ostatnie 7 dni)
        history.forEach(entry => {
            dateSet.add(entry.date);
            if (dateSet.size >= 7) return;
        });
        
        // Sortuj daty
        const dates = Array.from(dateSet).sort();
        
        // Znajdź umiejętności z powtórzeniami
        const activeSkills = Object.entries(userData.skills)
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
    const prepareCategoryChartData = function() {
        const userData = DataService.getUserData();
        const categories = DataService.getCategories();
        
        // Przygotowanie danych dla każdej kategorii
        const data = categories.map(category => {
            // Znajdź umiejętności w tej kategorii
            const skills = Object.values(userData.skills).filter(skill => skill.category === category.id);
            
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
    
    // Konfiguracja formularzy treningowych
    const setupTrainingForms = function() {
        // Ustaw domyślną datę
        const dateInput = document.getElementById('trainingDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
        
        // Obsługa przycisku dodawania treningu
        const addTrainingBtn = document.getElementById('addTrainingBtn');
        if (addTrainingBtn) {
            addTrainingBtn.addEventListener('click', addTraining);
        }
    };
    
    // Dodawanie treningu
    const addTraining = function() {
        const dateInput = document.getElementById('trainingDate');
        const skillSelect = document.getElementById('trainingSkill');
        const repsInput = document.getElementById('trainingReps');
        const notesInput = document.getElementById('trainingNotes');
        
        if (!dateInput || !skillSelect || !repsInput) {
            showToast('Brak wymaganych pól formularza', 'error');
            return;
        }
        
        const date = dateInput.value;
        const skillId = skillSelect.value;
        const reps = parseInt(repsInput.value);
        const notes = notesInput ? notesInput.value : '';
        
        if (!date || !skillId || !reps || reps < 1) {
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
            
            // Resetuj formularz
            if (notesInput) notesInput.value = '';
            repsInput.value = 10;
            
            // Załaduj ponownie historię treningową
            loadTrainingHistory();
            
            // Odśwież wykresy
            initProgressChart();
            initCategoryChart();
            
            showToast('Trening został dodany pomyślnie!');
            
            // Sprawdź, czy umiejętność została ukończona
            const userData = DataService.getUserData();
            const skillData = userData.skills[skillId];
            
            if (skillData && skillData.status === 'completed') {
                // Wyświetl gratulacje
                showCongratsModal(skillId);
            }
        } else {
            showToast('Nie udało się dodać treningu', 'error');
        }
    };
    
    // Ładowanie historii treningowej
    const loadTrainingHistory = function() {
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
            const formattedDate = formatDate(entry.date);
            
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
    
    // Formatowanie daty
    const formatDate = function(dateStr) {
        if (!dateStr) return 'Brak daty';
        
        try {
            const [year, month, day] = dateStr.split('-');
            return `${day}.${month}.${year}`;
        } catch (e) {
            return dateStr;
        }
    };
    
    // Wyświetlanie modalu z gratulacjami
    const showCongratsModal = function(skillId) {
        // W rzeczywistej aplikacji wywołalibyśmy funkcję z głównego obiektu aplikacji
        if (typeof window.FreestyleStaffApp !== 'undefined' && 
            typeof window.FreestyleStaffApp.showCongratsModal === 'function') {
            window.FreestyleStaffApp.showCongratsModal(skillId);
        } else {
            console.log(`Gratulacje za ukończenie umiejętności: ${skillId}`);
        }
    };
    
    // Wyświetlanie powiadomienia
    const showToast = function(message, type = 'success') {
        if (typeof window.FreestyleStaffApp !== 'undefined' && 
            typeof window.FreestyleStaffApp.showToast === 'function') {
            window.FreestyleStaffApp.showToast(message, type);
        } else {
            console.log(`Toast (${type}): ${message}`);
        }
    };
    
    // Publiczny interfejs API
    return {
        initialize: initialize,
        refreshCharts: function() {
            initProgressChart();
            initCategoryChart();
        },
        loadTrainingHistory: loadTrainingHistory
    };
})();

// Eksportuj moduł
window.StatsComponent = StatsComponent;