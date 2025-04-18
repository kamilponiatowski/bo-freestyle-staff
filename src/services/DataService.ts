/**
 * Freestyle Staff Academy - Serwis danych
 * 
 * Ten moduł obsługuje zarządzanie danymi użytkownika, postępami i stanem aplikacji.
 * Zapewnia jednolity interfejs do operacji CRUD na danych użytkownika.
 */

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
            unlocked: false
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
        { id: 'rocket', name: 'Rocket', category: 'advanced', difficulty: 5, goalReps: 1000 },
        
        // Rolls
        { id: 'handrolls', name: 'Handrolls', category: 'advanced', difficulty: 5, goalReps: 1000 },
        { id: 'elbow-rolls', name: 'Elbow Rolls', category: 'advanced', difficulty: 5, goalReps: 1000 },
        { id: 'double-elbow-roll', name: 'Double Elbow Roll', category: 'advanced', difficulty: 5, goalReps: 1000 },
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
    return updateProgressSummary(userData);
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

// Pobierz dane użytkownika
const getUserData = () => {
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
        saveUserData(userData);
        
        return userData;
    } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
        return {...DEFAULT_USER_DATA};
    }
};

// Zapisz dane użytkownika
const saveUserData = (userData) => {
    try {
        // Zawsze aktualizuj podsumowanie przed zapisem
        userData = updateProgressSummary(userData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        return true;
    } catch (error) {
        console.error('Błąd podczas zapisywania danych użytkownika:', error);
        return false;
    }
};

// Dodaj powtórzenia do umiejętności
const addReps = (skillId, reps) => {
    const userData = getUserData();
    
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
        checkBadges(userData, skillId);
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
    saveUserData(userData);
    
    return true;
};

// Sprawdź odznaki
const checkBadges = (userData, skillId) => {
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
};

// Pobierz kategorie umiejętności
const getCategories = () => {
    return [
        { id: 'beginner', name: 'Podstawowe', color: '#3498db' },
        { id: 'intermediate', name: 'Średniozaawansowane', color: '#e67e22' },
        { id: 'advanced', name: 'Zaawansowane', color: '#e74c3c' }
    ];
};

// Pobierz szczegóły umiejętności
const getSkillDetails = (skillId) => {
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
        // Więcej szczegółów dla innych umiejętności...
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
    
    // Znajdź umiejętność w danych użytkownika
    const userData = getUserData();
    const skill = userData.skills[skillId];
    
    // Zwróć szczegóły umiejętności lub domyślny opis
    return {
        ...defaultDetails,
        ...skillDetails[skillId],
        ...skill,
        name: skill ? skill.name : skillId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
};

// Dodaj notatkę treningową
const addTrainingNote = (skillId, note) => {
    if (!note.trim()) {
        return false;
    }
    
    const userData = getUserData();
    const today = new Date().toISOString().split('T')[0];
    const skillName = userData.skills[skillId]?.name || skillId;
    
    userData.trainingHistory.unshift({
        date: today,
        skill: skillName,
        reps: 0,
        notes: note
    });
    
    saveUserData(userData);
    return true;
};

// Oznacz umiejętność jako ukończoną
const markSkillAsCompleted = (skillId) => {
    const userData = getUserData();
    
    if (!userData.skills[skillId]) {
        return false;
    }
    
    userData.skills[skillId].status = 'completed';
    userData.skills[skillId].progress = 100;
    userData.skills[skillId].reps = userData.skills[skillId].goalReps;
    
    checkBadges(userData, skillId);
    saveUserData(userData);
    
    return true;
};

// Resetuj dane użytkownika
const resetUserData = () => {
    localStorage.removeItem(STORAGE_KEY);
    return getUserData();
};

export default {
    getUserData,
    saveUserData,
    addReps,
    getCategories,
    getSkillDetails,
    addTrainingNote,
    markSkillAsCompleted,
    resetUserData
};