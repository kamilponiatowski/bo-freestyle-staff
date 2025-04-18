/**
 * Freestyle Staff Academy - Serwis danych
 * 
 * Ten moduł obsługuje zarządzanie danymi użytkownika, postępami i stanem aplikacji.
 * Zapewnia jednolity interfejs do operacji CRUD na danych użytkownika.
 */

const DataService = (function() {
    // Klucz localStorage
    const STORAGE_KEY = 'freestyle-staff-user-data';
    
    // Domyślne dane użytkownika
    const DEFAULT_USER_DATA = {
        name: 'Muszka',
        email: 'muszka@example.com',
        avatar: 'https://api.dicebear.com/6.x/adventurer/svg?seed=Mimi',
        progress: {
            totalSkills: 0,
            completedSkills: 0,
            inProgressSkills: 0,
            totalReps: 0
        },
        skills: {},
        badges: [
            {
                id: 'first-steps',
                name: 'Pierwsze kroki',
                description: 'Rozpoczęto naukę Freestyle Staff',
                icon: '🔰',
                color: '#3498db',
                unlocked: false  // Zmieniono na false, aby użytkownik musiał zacząć od zera
            },
            {
                id: 'basic-flow-master',
                name: 'Mistrz Basic Flow',
                description: 'Opanowano Basic Flow',
                icon: '🌊',
                color: '#2ecc71',
                unlocked: false
            },
            {
                id: 'smooth-operator',
                name: 'Smooth Operator',
                description: 'Wykonano 100 powtórzeń Basic Flow',
                icon: '🔄',
                color: '#e74c3c',
                unlocked: false
            },
            {
                id: '1000-reps',
                name: '1000 Powtórzeń',
                description: 'Wykonano 1000 powtórzeń jednej umiejętności',
                icon: '🔢',
                color: '#9b59b6',
                unlocked: false
            },
            {
                id: 'combo-master',
                name: 'Combo Master',
                description: 'Opanowano wszystkie kombinacje dla początkujących',
                icon: '🔄',
                color: '#e67e22',
                unlocked: false
            },
            {
                id: 'warp-speed',
                name: 'Warp Speed',
                description: 'Wykonano 50 powtórzeń w minutę',
                icon: '⚡',
                color: '#f1c40f',
                unlocked: false
            },
            {
                id: 'roll-with-it',
                name: 'Roll With It',
                description: 'Opanowano podstawowe rolki',
                icon: '🔄',
                color: '#16a085',
                unlocked: false
            },
            {
                id: 'high-flyer',
                name: 'High Flyer',
                description: 'Wykonano pierwszy Thumbflip',
                icon: '🚀',
                color: '#d35400',
                unlocked: false
            },
            {
                id: 'safe-hands',
                name: 'Safe Hands',
                description: 'Złapano 10 rzutów z rzędu',
                icon: '👐',
                color: '#27ae60',
                unlocked: false
            },
            {
                id: 'persistent',
                name: 'Persistent',
                description: 'Ćwiczono codziennie przez 7 dni',
                icon: '📆',
                color: '#8e44ad',
                unlocked: false
            },
            {
                id: 'dedicated',
                name: 'Dedicated',
                description: 'Ćwiczono codziennie przez 30 dni',
                icon: '🏆',
                color: '#2980b9',
                unlocked: false
            },
            {
                id: 'improviser',
                name: 'Improviser',
                description: 'Stworzono własne combo',
                icon: '🎭',
                color: '#c0392b',
                unlocked: false
            }
        ],
        trainingHistory: []
    };
    
    // Inicjalizacja umiejętności
    // Inicjalizacja umiejętności
const initializeSkills = (userData) => {
    // Definicje dostępnych umiejętności
    const availableSkills = [
        // Podstawowe umiejętności
        { id: 'basic-flow', name: 'Basic Flow', category: 'beginner', difficulty: 1, goalReps: 1000 },
        { id: 'basic-pass', name: 'Basic Pass', category: 'beginner', difficulty: 2, goalReps: 1000 },
        { id: 'dip-pass', name: 'Dip Pass', category: 'beginner', difficulty: 2, goalReps: 1000 },
        { id: 'simple-combo', name: 'Simple Combo', category: 'beginner', difficulty: 2, goalReps: 1000 },
        { id: 'neck-wrap', name: 'Neck Wrap', category: 'beginner', difficulty: 3, goalReps: 1000 },
        { id: 'shoulder-wrap', name: 'Shoulder Wrap', category: 'beginner', difficulty: 3, goalReps: 1000 },
        { id: 'high-low-whip', name: 'High/Low Whip', category: 'intermediate', difficulty: 3, goalReps: 1000 },
        { id: 'two-hand-spin', name: '2 Hand Spin', category: 'intermediate', difficulty: 3, goalReps: 1000 },
        { id: 'windmill', name: 'Windmill', category: 'intermediate', difficulty: 3, goalReps: 1000 },
        { id: 'continuous-passing', name: 'Continuous Passing', category: 'intermediate', difficulty: 2, goalReps: 1000 },
        
        // Toss & Catch
        { id: 'backhand-flip', name: 'Backhand Flip', category: 'intermediate', difficulty: 4, goalReps: 1000 },
        { id: 'thumbflips', name: 'Thumbflips', category: 'advanced', difficulty: 4, goalReps: 1000 },
        { id: 'backhand-catch', name: 'Backhand Catch', category: 'intermediate', difficulty: 3, goalReps: 1000 },
        { id: 'left-hand-back-catch', name: 'Left Hand Back Catch', category: 'intermediate', difficulty: 4, goalReps: 1000 },
        { id: 'right-hand-back-catch', name: 'Right Hand Back Catch', category: 'intermediate', difficulty: 3, goalReps: 1000 },
        { id: 'left-hand-ground', name: 'Left Hand Ground', category: 'intermediate', difficulty: 4, goalReps: 1000 },
        { id: 'right-hand-ground', name: 'Right Hand Ground', category: 'intermediate', difficulty: 4, goalReps: 1000 },
        { id: 'left-hand-head-catch', name: 'Left Hand Head Catch', category: 'intermediate', difficulty: 4, goalReps: 1000 },
        { id: 'half-turn-blind', name: 'Half Turn Blind', category: 'intermediate', difficulty: 4, goalReps: 1000 },
        { id: 'flip-blind', name: 'Flip Blind', category: 'advanced', difficulty: 4, goalReps: 1000 },
        { id: 'rocket', name: 'Rocket', category: 'advanced', difficulty: 5, goalReps: 1000 },
        { id: 'hug-trick', name: 'Hug Trick', category: 'advanced', difficulty: 4, goalReps: 1000 },
        { id: 'all-4-ways', name: 'All 4 Ways', category: 'advanced', difficulty: 4, goalReps: 1000 },
        { id: 'whip-blind', name: 'Whip Blind', category: 'advanced', difficulty: 4, goalReps: 1000 },
        
        // Rolls
        { id: 'handrolls', name: 'Handrolls', category: 'advanced', difficulty: 5, goalReps: 1000 },
        { id: 'single-arm-roll', name: 'Single Arm Roll', category: 'advanced', difficulty: 4, goalReps: 1000 },
        { id: 'double-arm-roll', name: 'Double Arm Roll', category: 'advanced', difficulty: 5, goalReps: 1000 },
        { id: 'inside-outside-elbow-roll', name: 'Inside to Outside Elbow Roll', category: 'advanced', difficulty: 5, goalReps: 1000 },
        { id: 'outside-inside-elbow-roll', name: 'Outside to Inside Elbow Roll', category: 'advanced', difficulty: 5, goalReps: 1000 },
        { id: 'double-elbow-roll', name: 'Double Elbow Roll', category: 'advanced', difficulty: 5, goalReps: 1000 },
        { id: 'double-elbow-blind', name: 'Double Elbow Blind', category: 'advanced', difficulty: 5, goalReps: 1000 },
        { id: 'elbow-wrist-hybrid', name: 'Elbow Wrist Hybrid', category: 'advanced', difficulty: 5, goalReps: 1000 },
        { id: 'wrist-elbow-hybrid', name: 'Wrist Elbow Hybrid', category: 'advanced', difficulty: 5, goalReps: 1000 },
        { id: 'paddles', name: 'Paddles', category: 'advanced', difficulty: 4, goalReps: 1000 },
        { id: 'conveyer-belt', name: 'Conveyer Belt', category: 'advanced', difficulty: 5, goalReps: 1000 },
        
        // Specjalne
        { id: 'loop-out', name: 'Loop Out', category: 'advanced', difficulty: 5, goalReps: 1000 },
        { id: 'palm-spin', name: 'Palm Spin', category: 'advanced', difficulty: 4, goalReps: 1000 },
        { id: '360-turn', name: '360 Turn', category: 'advanced', difficulty: 4, goalReps: 1000 },
        { id: 'basic-strikes', name: 'Basic Strikes', category: 'intermediate', difficulty: 3, goalReps: 1000 },
        { id: 'roofblock-pattern-change', name: 'RoofBlock Pattern Change', category: 'advanced', difficulty: 4, goalReps: 1000 }
    ];
    
    // Dodaj brakujące umiejętności do danych użytkownika
    availableSkills.forEach(skill => {
        if (!userData.skills[skill.id]) {
            userData.skills[skill.id] = {
                name: skill.name,
                category: skill.category,
                difficulty: skill.difficulty,
                progress: 0,
                status: 'new',
                reps: 0,
                goalReps: skill.goalReps
            };
        }
    });
    
    // Zaktualizuj podsumowanie postępu
    updateProgressSummary(userData);
    
    return userData;
};
    
    // Aktualizacja podsumowania postępu
    const updateProgressSummary = (userData) => {
        const skills = Object.values(userData.skills);
        
        userData.progress.totalSkills = skills.length;
        userData.progress.completedSkills = skills.filter(skill => skill.status === 'completed').length;
        userData.progress.inProgressSkills = skills.filter(skill => skill.status === 'in-progress').length;
        userData.progress.totalReps = skills.reduce((sum, skill) => sum + (skill.reps || 0), 0);
        
        return userData;
    };
    
    // Publiczny interfejs API
    return {
        // Pobierz dane użytkownika
        getUserData: function() {
            try {
                const savedData = localStorage.getItem(STORAGE_KEY);
                let userData;
                
                if (savedData) {
                    userData = JSON.parse(savedData);
                } else {
                    userData = {...DEFAULT_USER_DATA};
                    // Odblokuj pierwszą odznakę przy pierwszym uruchomieniu
                    const firstStepsBadge = userData.badges.find(b => b.id === 'first-steps');
                    if (firstStepsBadge) {
                        firstStepsBadge.unlocked = true;
                    }
                }
                
                // Zawsze inicjalizuj umiejętności, aby upewnić się, że mamy kompletne dane
                userData = initializeSkills(userData);
                this.saveUserData(userData);
                
                return userData;
            } catch (error) {
                console.error('Błąd podczas pobierania danych użytkownika:', error);
                return {...DEFAULT_USER_DATA};
            }
        },
        
        // Zapisz dane użytkownika
        saveUserData: function(userData) {
            try {
                // Zawsze aktualizuj podsumowanie przed zapisem
                userData = updateProgressSummary(userData);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
                return true;
            } catch (error) {
                console.error('Błąd podczas zapisywania danych użytkownika:', error);
                return false;
            }
        },
        
        // Dodaj powtórzenia do umiejętności
        addReps: function(skillId, reps) {
            const userData = this.getUserData();
            
            if (!userData.skills[skillId]) {
                console.error(`Umiejętność o ID ${skillId} nie istnieje`);
                return false;
            }
            
            // Aktualizuj liczbę powtórzeń
            userData.skills[skillId].reps += reps;
            
            // Aktualizuj progress
            const progress = (userData.skills[skillId].reps / userData.skills[skillId].goalReps) * 100;
            userData.skills[skillId].progress = Math.min(100, progress);
            
            // Zaktualizuj status
            if (progress >= 100 && userData.skills[skillId].status !== 'completed') {
                userData.skills[skillId].status = 'completed';
                
                // Sprawdź odznaki
                this.checkBadges(userData, skillId);
            } else if (progress > 0 && userData.skills[skillId].status === 'new') {
                userData.skills[skillId].status = 'in-progress';
            }
            
            // Dodaj do historii treningowej
            const today = new Date().toISOString().split('T')[0];
            userData.trainingHistory.unshift({
                date: today,
                skill: userData.skills[skillId].name,
                reps: reps,
                notes: 'Dodano z aplikacji'
            });
            
            // Zapisz zaktualizowane dane
            this.saveUserData(userData);
            
            return true;
        },
        
        // Sprawdź odznaki
        checkBadges: function(userData, skillId) {
            // Sprawdź odznakę "Mistrz Basic Flow"
            if (skillId === 'basic-flow' && userData.skills[skillId].status === 'completed') {
                const badge = userData.badges.find(b => b.id === 'basic-flow-master');
                if (badge) badge.unlocked = true;
            }
            
            // Sprawdź odznakę "1000 powtórzeń"
            if (userData.skills[skillId].reps >= 1000) {
                const badge = userData.badges.find(b => b.id === '1000-reps');
                if (badge) badge.unlocked = true;
            }
            
            // Sprawdź odznakę "Smooth Operator"
            if (skillId === 'basic-flow' && userData.skills[skillId].reps >= 100) {
                const badge = userData.badges.find(b => b.id === 'smooth-operator');
                if (badge) badge.unlocked = true;
            }
            
            // Sprawdź odznakę "Combo Master"
            const beginnerSkills = Object.values(userData.skills).filter(s => s.category === 'beginner');
            if (beginnerSkills.every(s => s.status === 'completed')) {
                const badge = userData.badges.find(b => b.id === 'combo-master');
                if (badge) badge.unlocked = true;
            }
            
            // Sprawdź odznakę "High Flyer"
            if (skillId === 'thumbflips' && userData.skills[skillId].reps > 0) {
                const badge = userData.badges.find(b => b.id === 'high-flyer');
                if (badge) badge.unlocked = true;
            }
            
            // Sprawdź odznakę "Roll With It"
            const rollSkills = ['handrolls', 'elbow-rolls'];
            if (rollSkills.some(id => userData.skills[id] && userData.skills[id].status === 'completed')) {
                const badge = userData.badges.find(b => b.id === 'roll-with-it');
                if (badge) badge.unlocked = true;
            }
            
            return userData;
        },
        
        // Pobierz kategorie umiejętności
        getCategories: function() {
            return [
                { id: 'beginner', name: 'Podstawowe', color: '#3498db' },
                { id: 'intermediate', name: 'Średniozaawansowane', color: '#e67e22' },
                { id: 'advanced', name: 'Zaawansowane', color: '#e74c3c' }
            ];
        },
        
        // Pobierz szczegóły umiejętności
        getSkillDetails: function(skillId) {
            // Obiekt z opisami umiejętności i wskazówkami
            const skillDetails = {
                'basic-flow': {
                    name: 'Basic Flow',
                    difficulty: 1,
                    description: 'Basic Flow to fundament Freestyle Staff Spinningu. To najważniejsza umiejętność, która pozwala zrozumieć podstawowe mechaniki i przepływ ruchu staffa.',
                    videoPath: 'freestyle-staff-academy/5. BEGINNER/1. Basic Flow/Basic Flow.mp4',
                    tips: [
                        'Zacznij powoli, skupiając się na poprawnej technice',
                        'Utrzymuj łokcie blisko ciała dla lepszej kontroli',
                        'Ćwicz obie strony (prawą i lewą rękę) równomiernie',
                        'Powtarzaj do momentu aż ruch stanie się naturalny i płynny'
                    ]
                },
                'basic-pass': {
                    name: 'Basic Pass',
                    difficulty: 2,
                    description: 'Basic Pass to podstawowe przejście z przepływu do przodu. Jest to szybkie i efektywne przejście, które stanowi fundament bardziej zaawansowanych technik.',
                    videoPath: 'freestyle-staff-academy/5. BEGINNER/2. Basic Pass/Transitional Pass from Forward Figure 8\'s.mp4',
                    tips: [
                        'Skup się na prostych mechanizmach bez dodawania zbędnych elementów',
                        'Wykonuj przejście szybko i efektywnie',
                        'Utrzymuj staff w centralnej pozycji podczas przejścia',
                        'Ćwicz obie strony dla lepszej koordynacji'
                    ]
                },
                'dip-pass': {
                    name: 'Dip Pass',
                    difficulty: 2,
                    description: 'Dip Pass to przejście z przepływu do tyłu. Jest to szybkie i proste przejście, które doskonale komponuje się z Basic Pass.',
                    videoPath: 'freestyle-staff-academy/5. BEGINNER/3. Dip Pass/Transitional Pass from Reverse Figure 8\'s.mp4',
                    tips: [
                        'Staff powinien być prostopadły w centrum ciała przed przejściem',
                        'Trzymaj staff blisko ciała podczas wykonywania przejścia',
                        'Tylna część dłoni podającej powinna dotykać czoła',
                        'Ćwicz płynność ruchu dla lepszego efektu'
                    ]
                },
                'simple-combo': {
                    name: 'Simple Combo',
                    difficulty: 2,
                    description: 'Simple Combo to pierwsze połączenie podstawowych umiejętności. Ta kombinacja pokazuje, jak elementy układanki Staff Spinningu łączą się ze sobą.',
                    videoPath: 'freestyle-staff-academy/5. BEGINNER/4. Simple Combo/Beginner Combo #1 Simple Combo.mp4',
                    tips: [
                        'Ćwicz zarówno prawą jak i lewą ręką (lewa ręka będzie skierowana do tyłu)',
                        'Zachowaj prostotę - używaj tylko mechaniki pokazanej w filmach',
                        'Skup się na płynnych przejściach między technikami',
                        'Zacznij powoli, zwiększając tempo dopiero gdy ruchy będą płynne'
                    ]
                },
                'neck-wrap': {
                    name: 'Neck Wrap',
                    difficulty: 3,
                    description: 'Neck Wrap to pierwszy trik z rodziny technik owijania. Jest to efektowna alternatywa dla prostych podań, która dodaje wizualnego elementu do Twojego flow.',
                    videoPath: 'freestyle-staff-academy/5. BEGINNER/5. Neck Wrap/Intro To Wraps.mp4',
                    tips: [
                        'ZAWSZE zawijaj pałkę tak daleko, jak to tylko możliwe PRZED jej wypuszczeniem!',
                        'Praktykuj najpierw bez ruchu, aby zrozumieć mechanikę',
                        'Utrzymuj pewny chwyt aż do momentu wypuszczenia',
                        'Nie bój się eksperymentować z kątem i kierunkiem'
                    ]
                },
                'shoulder-wrap': {
                    name: 'Shoulder Wrap',
                    difficulty: 3,
                    description: 'Shoulder Wrap to bojowe podanie do przodu i świetna alternatywa dla Neck Wrap. Jest również elementem sztuk walki/kreatywnej walki.',
                    videoPath: 'freestyle-staff-academy/5. BEGINNER/6. Shoulder Wrap/Should Wrap.mp4',
                    tips: [
                        'Pamiętaj o 1. Zasadzie Zawijania - zawijaj tak dużo jak to możliwe PRZED wypuszczeniem',
                        'Ćwicz przed lustrem, aby znaleźć optymalne ułożenie',
                        'Ta umiejętność zawsze pochodzi z Ósemek Do Przodu',
                        'Utrzymuj kontrolę nad staffem podczas całego ruchu'
                    ]
                },
                'high-low-whip': {
                    name: 'High/Low Whip',
                    difficulty: 3,
                    description: 'High/Low Whip to efektowny trik, który łączy ruchy górne i dolne w płynną sekwencję. Znany również jako Obi Ani, jest jednocześnie wizualnie atrakcyjny i bojowo skuteczny.',
                    videoPath: 'freestyle-staff-academy/5. BEGINNER/7. High_Low Whip/High Whip.mp4',
                    tips: [
                        'Upewnij się, że High Whip kończy się na pozycji godziny 12, a nie 1 lub 2',
                        'Podczas Low Whip trzymaj nadgarstki przy pasie - im bardziej zwarte, tym szybciej i łatwiej',
                        'Dla zwiększenia mobilności możesz obrócić biodra podczas Low Whip',
                        'PAMIĘTAJ O ODDECHU! To kluczowe dla utrzymania płynności'
                    ]
                },
                'two-hand-spin': {
                    name: '2 Hand Spin',
                    difficulty: 3,
                    description: '2 Hand Spin to powtarzalne podanie, które jest kluczowym elementem w progresji do bardziej zaawansowanych technik, jak Thumbflips. To wszechstronna technika, którą można wykonać zarówno w kierunku do przodu, jak i do tyłu.',
                    videoPath: 'freestyle-staff-academy/5. BEGINNER/11. 2 Hand Spin/2 Hand Spin.mp4',
                    tips: [
                        'Bądź cierpliwy - poczekaj aż staff całkowicie obróci się do kciuka',
                        'Trzymaj OBIE dłonie skierowane w stronę sufitu podczas tego podania',
                        'Dopasuj podanie tak, aby kciuki się dotykały',
                        'Zacznij powoli - prędkość zwiększy się wraz z opanowaniem techniki'
                    ]
                },
                'windmill': {
                    name: 'Windmill',
                    difficulty: 3,
                    description: 'Windmill to prosta, kwiecista i piękna umiejętność, którą można wykonać przy użyciu praktycznie dowolnej broni lub rekwizytu. Dodaje tekstury przepływowi poprzez zmiany poziomów i płaszczyzn.',
                    videoPath: 'freestyle-staff-academy/5. BEGINNER/9. Windmill/Windmill.mp4',
                    tips: [
                        'Rozpocznij rozgrzewkę od Basic Flow!',
                        'Ustanów swoją bazę i obracaj się tylko z bioder',
                        'Utrzymuj kontrolę nad staffem przez cały czas trwania ruchu',
                        'Pamiętaj o właściwym ułożeniu rąk dla lepszej kontroli'
                    ]
                },
                'continuous-passing': {
                    name: 'Continuous Passing',
                    difficulty: 2,
                    description: 'Continuous Passing to jeden z najlepszych sposobów na pełne zrozumienie, jak różne elementy Freestyle Staff Spinningu łączą się ze sobą. To sztuka dodawania umiejętności do ósemek.',
                    videoPath: 'freestyle-staff-academy/5. BEGINNER/8. Continuous Passing/Forward Continuous Passing.mp4',
                    tips: [
                        'Obracaj ramionami całkowicie w Płaszczyźnie Przedniej i Tylnej',
                        'Upewnij się, że Twój staff jest równoległy do Płaszczyzny Przedniej i Tylnej przed rozpoczęciem przekazania',
                        'W razie potrzeby dodaj dodatkowe Ósemki, aby spowolnić przepływ',
                        'Ćwicz różne warianty dla lepszego zrozumienia techniki'
                    ]
                },
                'backhand-flip': {
                    name: 'Backhand Flip',
                    difficulty: 4,
                    description: 'Backhand Flip to jedna z najbardziej wszechstronnych i prostych metod rzucania. To świetny punkt wyjścia do odkrycia, jak wprowadzać staff do ręki i wyjmować z niej.',
                    videoPath: 'freestyle-staff-academy/6. TOSS & CATCH/0. Backhand Flip/Backhand Flip.mp4',
                    tips: [
                        'Obróć całkowicie rękę przed zwolnieniem',
                        'Jeśli brak Ci mobilności barku/nadgarstka: Lekko obróć biodra i ramiona, aby zapewnić więcej przestrzeni',
                        'Wyciągnij rękę z rotacji po zwolnieniu',
                        'Łap dłonią do góry',
                        'Minimum 1 pełny obrót'
                    ]
                },
                'thumbflips': {
                    name: 'Thumbflips',
                    difficulty: 4,
                    description: 'Thumbflips są głównym sposobem rzucania w Freestyle Staff. Pozwalają na całkowitą kontrolę wysokości, kierunku, umiejscowienia i prędkości obrotu podczas rzutu, przy minimalnym wysiłku.',
                    videoPath: 'freestyle-staff-academy/6. TOSS & CATCH/2. Thumbflips/Intro to Thumbflips & Thumbdrop.mp4',
                    tips: [
                        'Bądź cierpliwy. Pozwól, aby staff w pełni obrócił się wokół kciuka przed zwolnieniem',
                        'Złap dłonią do góry w lewej ręce na start',
                        'Jeśli Thumbflip zaczyna cofać postępy, wróć do postępów 2 Hand Spin i Thumbdrop',
                        'Większość momentu obrotowego i energii generuje się w nadgarstku'
                    ]
                },
                'rocket': {
                    name: 'Rocket',
                    difficulty: 5,
                    description: 'Rocket z zewnątrz wygląda na trudny i nieco niebezpieczny trik. W rzeczywistości jest bardzo prosty mechanicznie i dostępny dla większości Staff Spinnerów, jeśli tylko wykażą się cierpliwością.',
                    videoPath: 'freestyle-staff-academy/6. TOSS & CATCH/3. Catching/Rocket.mp4',
                    tips: [
                        'TRZYMAJ RAMIONA PROSTE! BEZ WZGLĘDU NA WSZYSTKO!',
                        'Skieruj górny koniec w dół tak długo, jak to możliwe',
                        'Miękkie ręce do łapania',
                        'BĘDZIESZ BARDZO DUŻO UPUSZCZAĆ TEN TRIK! I dokładnie o to chodzi!'
                    ]
                },
                'handrolls': {
                    name: 'Handrolls',
                    difficulty: 5,
                    description: 'Handrolls to świetne wprowadzenie do rolek. Jest szybkie, proste i niezwykle wszechstronne. Znane również jako Windshield Wiper (Wycieraczka).',
                    videoPath: 'freestyle-staff-academy/8. ROLLS/Handrolls (Windsheild Wiper).mp4',
                    tips: [
                        'ZWOLNIJ! Rolki poruszają się wolniej niż inne umiejętności',
                        'Skup się na punktach wejścia i wyjścia każdej rolki',
                        'Zakotwicz i ustabilizuj stopy',
                        'Mniej znaczy więcej. Mniej wysiłku, mniej napięcia, mniej energii',
                        'Zawsze rozgrzewaj się z postępowaniami'
                    ]
                },
                'elbow-rolls': {
                    name: 'Elbow Rolls',
                    difficulty: 5,
                    description: 'Elbow Rolls to jedna z najistotniejszych i najbardziej fundamentalnych umiejętności związanych z Rolkami. Będą pojawiać się wielokrotnie w wielu złożonych, zaawansowanych i nakładających się rolkach.',
                    videoPath: 'freestyle-staff-academy/8. ROLLS/Elbow Rolls/Outside to Inside Elbow Roll.mp4',
                    tips: [
                        'ZWOLNIJ! Rolki poruszają się wolniej niż inne umiejętności',
                        'Skup się na punktach wejścia i wyjścia każdej rolki',
                        'Zakotwicz i ustabilizuj stopy',
                        'Mniej znaczy więcej. Mniej wysiłku, mniej napięcia, mniej energii',
                        'Zawsze rozgrzewaj się z postępowaniami'
                    ]
                },
                'double-elbow-roll': {
                    name: 'Double Elbow Roll',
                    difficulty: 5,
                    description: 'Double Elbow Roll to złożona umiejętność rolek, która łączy nasze dwa Single Elbow Rolls. Ta podwójna umiejętność jest tak wszechstronna, że pojawia się jako baza dla wielu umiejętności rolowania górnej części ciała.',
                    videoPath: 'freestyle-staff-academy/8. ROLLS/Elbow Rolls/Double Elbow Roll.mp4',
                    tips: [
                        'ZWOLNIJ! Rolki poruszają się wolniej niż inne umiejętności',
                        'Skup się na punktach wejścia i wyjścia każdej rolki',
                        'Zakotwicz i ustabilizuj stopy',
                        'Mniej znaczy więcej. Mniej wysiłku, mniej napięcia, mniej energii',
                        'Zawsze rozgrzewaj się z postępowaniami'
                    ]
                }
            };
            
            // Domyślny opis dla umiejętności bez szczegółowych informacji
            const defaultDetails = {
                difficulty: 3,
                description: 'Szczegółowy opis tej umiejętności będzie dostępny wkrótce!',
                tips: [
                    'Zacznij powoli, skupiając się na poprawnej technice',
                    'Regularnie ćwicz dla najlepszych efektów',
                    'Pamiętaj o rozgrzewce przed treningiem',
                    'Bądź cierpliwy, każda umiejętność wymaga czasu'
                ]
            };
            
            // Zwróć szczegóły umiejętności lub domyślny opis
            return skillDetails[skillId] || {...defaultDetails, name: skillId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())};
        },
        
        // Dodaj notatkę treningową
        addTrainingNote: function(skillId, note) {
            const userData = this.getUserData();
            
            if (!note.trim()) {
                return false;
            }
            
            const today = new Date().toISOString().split('T')[0];
            const skillName = userData.skills[skillId]?.name || skillId;
            
            userData.trainingHistory.unshift({
                date: today,
                skill: skillName,
                reps: 0,
                notes: note
            });
            
            this.saveUserData(userData);
            return true;
        },
        
        // Oznacz umiejętność jako ukończoną
        markSkillAsCompleted: function(skillId) {
            const userData = this.getUserData();
            
            if (!userData.skills[skillId]) {
                return false;
            }
            
            userData.skills[skillId].status = 'completed';
            userData.skills[skillId].progress = 100;
            userData.skills[skillId].reps = userData.skills[skillId].goalReps;
            
            this.checkBadges(userData, skillId);
            this.saveUserData(userData);
            
            return true;
        },
        
        // Resetuj dane użytkownika
        resetUserData: function() {
            localStorage.removeItem(STORAGE_KEY);
            return this.getUserData();
        }
    };
})();

// Eksportuj moduł
window.DataService = DataService;