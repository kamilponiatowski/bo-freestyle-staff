/**
 * Freestyle Staff Academy - Narzędzia do wykresów
 * 
 * Ten moduł zawiera funkcje do generowania i aktualizacji wykresów w aplikacji.
 * Używa biblioteki Chart.js do renderowania wykresów.
 */

const ChartUtils = (function() {
    // Prywatne referencje do wykresów
    const chartInstances = {};
    
    // Flaga określająca czy wykresy zostały już zainicjalizowane dla zakładki
    let chartsInitialized = false;
    
    // Przygotowanie danych dla wykresu postępów
    const prepareProgressChartData = function() {
        // Pobieramy dane użytkownika
        const userData = DataService.getUserData();
        
        // Pobieramy umiejętności z postępem większym niż 0
        const activeSkills = Object.entries(userData.skills)
            .filter(([_, data]) => data.reps > 0)
            .slice(0, 5); // Ograniczamy do 5 najpopularniejszych umiejętności
        
        // Przygotowujemy dane historii treningowej
        const history = userData.trainingHistory || [];
        const dateSet = new Set();
        
        // Zbieramy unikalne daty z historii (max. ostatnie 7 dni)
        history.forEach(entry => {
            if (entry.date) {
                dateSet.add(entry.date);
            }
            if (dateSet.size >= 7) return;
        });
        
        // Sortujemy daty
        const dates = Array.from(dateSet).sort();
        
        // Przygotowujemy dane dla każdej umiejętności
        const datasets = activeSkills.map(([skillId, skillData], index) => {
            // Wybieramy kolor na podstawie kategorii
            const color = skillData.category === 'beginner' ? '#3498db' : 
                          skillData.category === 'intermediate' ? '#e67e22' : 
                          '#e74c3c';
            
            // Przygotowujemy dane dla każdej daty
            const data = dates.map(date => {
                // Znajdź wpisy dla tej daty i tej umiejętności
                const entriesForDate = history.filter(entry => 
                    entry.date === date && entry.skill === skillData.name
                );
                
                // Sumuj powtórzenia dla danej daty
                return entriesForDate.reduce((sum, entry) => sum + (entry.reps || 0), 0);
            });
            
            return {
                label: skillData.name,
                data: data,
                borderColor: color,
                backgroundColor: color + '1A', // Dodajemy alpha dla przezroczystości
                tension: 0.4
            };
        });
        
        // Jeśli nie ma danych, dodajemy przykładowe
        if (datasets.length === 0 || dates.length === 0) {
            // Przykładowe daty (ostatnie 7 dni)
            if (dates.length === 0) {
                const today = new Date();
                for (let i = 6; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(today.getDate() - i);
                    const formattedDate = date.toISOString().split('T')[0];
                    dates.push(formattedDate);
                }
            }
            
            // Przykładowe dane
            if (datasets.length === 0) {
                datasets.push({
                    label: 'Przykładowy postęp',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#8e44ad',
                    backgroundColor: '#8e44ad1A',
                    tension: 0.4
                });
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
        // Pobieramy dane użytkownika
        const userData = DataService.getUserData();
        const categories = DataService.getCategories();
        
        // Przygotowanie danych dla każdej kategorii
        const data = categories.map(category => {
            // Znajdź umiejętności w tej kategorii
            const skills = Object.values(userData.skills).filter(skill => skill.category === category.id);
            
            // Policz umiejętności według statusu
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
        
        // Przygotowanie danych dla wykresu
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
    
    // Publiczny interfejs API
    return {
        // Inicjalizacja wykresu postępów
        initProgressChart: function(canvasId) {
            // Jeśli wykresy są już zainicjalizowane, nie twórz ich ponownie
            if (chartsInitialized && chartInstances[canvasId]) {
                return chartInstances[canvasId];
            }
            
            const ctx = document.getElementById(canvasId)?.getContext('2d');
            if (!ctx) {
                console.error(`Nie znaleziono elementu canvas o ID: ${canvasId}`);
                return null;
            }
            
            // Przygotowanie danych dla wykresu
            const chartData = prepareProgressChartData();
            
            // Konfiguracja wykresu
            const config = {
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
            };
            
            // Sprawdź czy już istnieje instancja wykresu i zniszcz ją
            this.destroyChart(canvasId);
            
            // Utwórz nową instancję wykresu
            const chart = new Chart(ctx, config);
            chartInstances[canvasId] = chart;
            
            // Oznacz, że wykresy zostały zainicjalizowane
            chartsInitialized = true;
            
            return chart;
        },
        
        // Inicjalizacja wykresu kategorii
        initCategoryChart: function(canvasId) {
            // Jeśli wykresy są już zainicjalizowane, nie twórz ich ponownie
            if (chartsInitialized && chartInstances[canvasId]) {
                return chartInstances[canvasId];
            }
            
            const ctx = document.getElementById(canvasId)?.getContext('2d');
            if (!ctx) {
                console.error(`Nie znaleziono elementu canvas o ID: ${canvasId}`);
                return null;
            }
            
            // Przygotowanie danych dla wykresu
            const chartData = prepareCategoryChartData();
            
            // Konfiguracja wykresu
            const config = {
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
                            title: {
                                display: true,
                                text: 'Liczba umiejętności'
                            },
                            stacked: true
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Kategoria'
                            },
                            stacked: true
                        }
                    }
                }
            };
            
            // Sprawdź czy już istnieje instancja wykresu i zniszcz ją
            this.destroyChart(canvasId);
            
            // Utwórz nową instancję wykresu
            const chart = new Chart(ctx, config);
            chartInstances[canvasId] = chart;
            
            // Oznacz, że wykresy zostały zainicjalizowane
            chartsInitialized = true;
            
            return chart;
        },
        
        // Aktualizacja wykresu postępów
        updateProgressChart: function(canvasId) {
            const chart = chartInstances[canvasId];
            if (!chart) {
                return this.initProgressChart(canvasId);
            }
            
            // Przygotowanie danych dla wykresu
            const chartData = prepareProgressChartData();
            
            // Aktualizacja danych wykresu
            chart.data.labels = chartData.labels;
            chart.data.datasets = chartData.datasets;
            chart.update();
            
            return chart;
        },
        
        // Aktualizacja wykresu kategorii
        updateCategoryChart: function(canvasId) {
            const chart = chartInstances[canvasId];
            if (!chart) {
                return this.initCategoryChart(canvasId);
            }
            
            // Przygotowanie danych dla wykresu
            const chartData = prepareCategoryChartData();
            
            // Aktualizacja danych wykresu
            chart.data.labels = chartData.labels;
            chart.data.datasets = chartData.datasets;
            chart.update();
            
            return chart;
        },
        
        // Zniszczenie wykresu
        destroyChart: function(canvasId) {
            if (chartInstances[canvasId]) {
                chartInstances[canvasId].destroy();
                delete chartInstances[canvasId];
                return true;
            }
            return false;
        },
        
        // Pobierz instancję wykresu
        getChartInstance: function(canvasId) {
            return chartInstances[canvasId] || null;
        },
        
        // Resetowanie flagi inicjalizacji (używane przy zmianie zakładek)
        resetInitFlag: function() {
            chartsInitialized = false;
        }
    };
})();

// Eksportuj moduł
window.ChartUtils = ChartUtils;