/**
 * Freestyle Staff Academy - Serwis plików
 * 
 * Ten moduł zapewnia dostęp do plików z repozytorium Freestyle Staff Academy.
 * Obsługuje przeglądanie katalogów, ładowanie zawartości plików i zarządzanie ścieżkami.
 */

const FileService = (function() {
    // Bazowy katalog dla materiałów
    const BASE_PATH = 'freestyle-staff-academy';
    
    // Mapowanie rozszerzeń plików na typ MIME
    const FILE_TYPES = {
        'mp4': { type: 'video', icon: '🎬', mimeType: 'video/mp4' },
        'md': { type: 'document', icon: '📄', mimeType: 'text/markdown' },
        'pdf': { type: 'document', icon: '📑', mimeType: 'application/pdf' },
        'png': { type: 'image', icon: '🖼️', mimeType: 'image/png' },
        'jpg': { type: 'image', icon: '🖼️', mimeType: 'image/jpeg' },
        'jpeg': { type: 'image', icon: '🖼️', mimeType: 'image/jpeg' }
    };
    
    // Publiczny interfejs API
    return {
        // Sprawdź, czy plik istnieje
        fileExists: function(path) {
            // W pełnej implementacji należałoby zweryfikować, czy plik istnieje fizycznie
            // Na potrzeby prototypu zawsze zwracamy true
            return true;
        },
        
        // Pobierz typ pliku na podstawie rozszerzenia
        getFileType: function(filename) {
            const extension = filename.split('.').pop().toLowerCase();
            return FILE_TYPES[extension] || { type: 'unknown', icon: '📄', mimeType: 'application/octet-stream' };
        },
        
        // Utwórz pełną ścieżkę do pliku
        getFullPath: function(path) {
            // Usuń ewentualne duplikacje BASE_PATH
            if (path.startsWith(BASE_PATH)) {
                return path;
            }
            return `${BASE_PATH}/${path}`;
        },
        
        // Załaduj zawartość pliku tekstowego
        loadTextFile: function(path, callback) {
            const fullPath = this.getFullPath(path);
            
            // Używamy fetch API do pobrania pliku
            fetch(fullPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Nie udało się załadować pliku: ${fullPath}`);
                    }
                    return response.text();
                })
                .then(content => {
                    callback(null, content);
                })
                .catch(error => {
                    console.error('Błąd podczas ładowania pliku:', error);
                    
                    // W przypadku braku pliku, próbujemy załadować z załączonej zawartości
                    if (window.mockFileContent && window.mockFileContent[path]) {
                        return callback(null, window.mockFileContent[path]);
                    }
                    
                    callback(error, null);
                });
        },
        
        // Pobierz zasoby związane z umiejętnością
        getSkillResources: function(skillId) {
            // Mapowanie ID umiejętności na ścieżki do zasobów
            const resourcePaths = {
                'basic-flow': [
                    { id: 'basic-flow-video', name: 'Basic Flow - Tutorial', type: 'video', path: '5. BEGINNER/1. Basic Flow/Basic Flow.mp4' },
                    { id: 'basic-flow-doc', name: 'Full Basic Flow', type: 'document', path: '5. BEGINNER/1. Basic Flow/Full Basic Flow.md' }
                ],
                'neck-wrap': [
                    { id: 'neck-wrap-video', name: 'Neck Wrap - Intro To Wraps', type: 'video', path: '5. BEGINNER/5. Neck Wrap/Intro To Wraps.mp4' },
                    { id: 'neck-wrap-doc', name: 'Intro To Wraps', type: 'document', path: '5. BEGINNER/5. Neck Wrap/Intro To Wraps.md' }
                ],
                'high-low-whip': [
                    { id: 'high-whip-video', name: 'High Whip', type: 'video', path: '5. BEGINNER/7. High_Low Whip/High Whip.mp4' },
                    { id: 'low-whip-video', name: 'Low Whip', type: 'video', path: '5. BEGINNER/7. High_Low Whip/Low Whip.mp4' },
                    { id: 'high-whip-doc', name: 'High Whip', type: 'document', path: '5. BEGINNER/7. High_Low Whip/High Whip.md' }
                ],
                'two-hand-spin': [
                    { id: 'two-hand-video', name: '2 Hand Spin', type: 'video', path: '5. BEGINNER/11. 2 Hand Spin/2 Hand Spin.mp4' },
                    { id: 'two-hand-doc', name: '2 Hand Spin', type: 'document', path: '5. BEGINNER/11. 2 Hand Spin/2 Hand Spin.md' }
                ],
                'backhand-flip': [
                    { id: 'backhand-flip-video', name: 'Backhand Flip', type: 'video', path: '6. TOSS & CATCH/0. Backhand Flip/Backhand Flip.mp4' },
                    { id: 'backhand-flip-doc', name: 'Intro & Deadstick Backhand Flip', type: 'document', path: '6. TOSS & CATCH/0. Backhand Flip/Intro & Deadstick Backhand Flip.md' }
                ],
                'thumbflips': [
                    { id: 'thumbflips-video', name: 'Thumbflips', type: 'video', path: '6. TOSS & CATCH/2. Thumbflips/Intro to Thumbflips & Thumbdrop.mp4' },
                    { id: 'thumbflips-doc', name: 'Intro to Thumbflips & Thumbdrop', type: 'document', path: '6. TOSS & CATCH/2. Thumbflips/Intro to Thumbflips & Thumbdrop.md' }
                ],
                'handrolls': [
                    { id: 'handrolls-video', name: 'Handrolls', type: 'video', path: '8. ROLLS/Handrolls (Windsheild Wiper).mp4' },
                    { id: 'handrolls-doc', name: 'Handrolls', type: 'document', path: '8. ROLLS/Handrolls (Windsheild Wiper).md' }
                ],
                'elbow-rolls': [
                    { id: 'elbow-rolls-video', name: 'Elbow Rolls', type: 'video', path: '8. ROLLS/Elbow Rolls/Intro to Elbow Rolls.mp4' },
                    { id: 'elbow-rolls-doc', name: 'Intro to Elbow Rolls', type: 'document', path: '8. ROLLS/Elbow Rolls/Intro to Elbow Rolls.md' }
                ],
                'double-elbow-roll': [
                    { id: 'double-elbow-roll-video', name: 'Double Elbow Roll', type: 'video', path: '8. ROLLS/Elbow Rolls/Double Elbow Roll.mp4' },
                    { id: 'double-elbow-roll-doc', name: 'Double Elbow Roll', type: 'document', path: '8. ROLLS/Elbow Rolls/Double Elbow Roll.md' }
                ]
            };
            
            // Zwróć zasoby dla danej umiejętności lub pustą tablicę
            const resources = resourcePaths[skillId] || [];
            
            // Dodaj pełne ścieżki
            return resources.map(resource => ({
                ...resource,
                path: this.getFullPath(resource.path)
            }));
        },
        
        // Pobierz polecane materiały
        getRecommendedResources: function() {
            return [
                { id: 'basic-flow-video', name: 'Basic Flow - Tutorial', type: 'video', path: this.getFullPath('5. BEGINNER/1. Basic Flow/Basic Flow.mp4') },
                { id: '1000-reps', name: '1000 Powtórzeń do Mistrzostwa', type: 'document', path: this.getFullPath('2. DOWNLOADS/e-book/1000-reps-do-mistrzostwa.md') },
                { id: 'rep-tracker', name: 'Licznik Powtórzeń', type: 'document', path: this.getFullPath('2. DOWNLOADS/FSA_Rep_Tracker.pdf') }
            ];
        },
        
        // Funkcja do mockowania zawartości plików dla testowania
        initMockFileContent: function() {
            window.mockFileContent = {};
            
            // Dodaj przykładową zawartość plików
            window.mockFileContent["freestyle-staff-academy/1. START HERE/How to Succeed at Staff Spinning.md"] = 
                "# Jak Odnieść Sukces w Staff Spinningu\n\nStaff Spinning jest zarówno umiejętnością mentalną, jak i fizyczną. Twój układ nerwowy potrzebuje czasu, aby się uczyć i rozwijać, podobnie jak Twoje ciało i mięśnie!\n\nOto kilka wskazówek, trików i podpowiedzi, jak stworzyć najbardziej skuteczną praktykę Freestyle Staff Spinningu właśnie dla CIEBIE!";
                
            window.mockFileContent["freestyle-staff-academy/5. BEGINNER/1. Basic Flow/Full Basic Flow.md"] = 
                "# Część 5: Pełny Podstawowy Przepływ\n\n**WSKAZÓWKI:**\n\nZapoznaj się z terminologią tych umiejętności. 🚨 Podstawowy Przepływ będzie zawarty w każdym pojedynczym filmie w ramach tego kursu w jakiejś formie. 🚨 Dla optymalnych rezultatów, ćwicz Podstawowy Przepływ, aż stanie się bezrefleksyjny i przejdzie do pamięci mięśniowej.";
        }
    };
})();

// Inicjalizacja mockowanych danych
FileService.initMockFileContent();

// Eksportuj moduł
window.FileService = FileService;