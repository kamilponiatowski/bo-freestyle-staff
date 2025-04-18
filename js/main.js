/**
 * Freestyle Staff Tracker - Skrypt główny
 * 
 * Ten plik łączy wszystkie moduły aplikacji i jest odpowiedzialny za jej uruchomienie.
 * Zapewnia inicjalizację aplikacji i obsługę początkowego stanu.
 */

// Inicjalizacja aplikacji
(function() {
    // Kod wykonywany po załadowaniu dokumentu
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Inicjalizacja aplikacji Freestyle Staff Academy...');
        
        // Najpierw sprawdź, czy strona powitalna jest aktywna
        const welcomePage = document.getElementById('welcomePage');
        const mainApp = document.getElementById('mainApp');
        
        // Jeśli nie mamy strony powitalnej lub głównej aplikacji, zatrzymaj się
        if (!welcomePage || !mainApp) {
            console.error('Brakuje głównych elementów aplikacji!');
            return;
        }
        
        // Napraw przycisk wejścia do aplikacji
        const enterAppBtn = document.getElementById('enterApp');
        if (enterAppBtn) {
            console.log('Konfiguracja przycisku wejścia do aplikacji...');
            
            // Usuń istniejące nasłuchiwacze
            const newBtn = enterAppBtn.cloneNode(true);
            if (enterAppBtn.parentNode) {
                enterAppBtn.parentNode.replaceChild(newBtn, enterAppBtn);
            }
            
            // Dodaj nowy nasłuchiwacz
            newBtn.addEventListener('click', function() {
                console.log('Kliknięto przycisk Rozpocznij przygodę');
                
                // Przełącz z ekranu powitalnego na główną aplikację
                welcomePage.classList.remove('active');
                mainApp.classList.add('active');
                
                // Inicjalizuj główną aplikację
                if (window.FreestyleStaffApp && typeof window.FreestyleStaffApp.init === 'function') {
                    window.FreestyleStaffApp.init();
                } else {
                    console.error('Nie znaleziono obiektu FreestyleStaffApp!');
                }
            });
        } else {
            console.warn('Nie znaleziono przycisku wejścia do aplikacji!');
            
            // Jeśli nie ma przycisku wejścia, aplikacja jest już aktywna
            if (window.FreestyleStaffApp && typeof window.FreestyleStaffApp.init === 'function') {
                window.FreestyleStaffApp.init();
            }
        }
        
        console.log('Inicjalizacja zakończona. Aplikacja gotowa do użycia.');
    });
})();