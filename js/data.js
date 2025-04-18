// Sample Data
const userData = {
    name: 'Muszka',
    email: 'muszka@example.com',
    avatar: 'https://api.dicebear.com/6.x/adventurer/svg?seed=Mimi',
    progress: {
        totalSkills: 20,
        completedSkills: 5,
        inProgressSkills: 3
    },
    skills: {
        'basic-flow': {
            name: 'Basic Flow',
            difficulty: 1,
            progress: 100,
            status: 'completed',
            reps: 1000,
            goalReps: 1000
        },
        'basic-pass': {
            name: 'Basic Pass',
            difficulty: 2,
            progress: 100,
            status: 'completed',
            reps: 1000,
            goalReps: 1000
        },
        'dip-pass': {
            name: 'Dip Pass',
            difficulty: 2,
            progress: 100,
            status: 'completed',
            reps: 1000,
            goalReps: 1000
        },
        'simple-combo': {
            name: 'Simple Combo',
            difficulty: 2,
            progress: 100,
            status: 'completed',
            reps: 1000,
            goalReps: 1000
        },
        'neck-wrap': {
            name: 'Neck Wrap',
            difficulty: 3,
            progress: 80,
            status: 'in-progress',
            reps: 800,
            goalReps: 1000
        },
        'high-low-whip': {
            name: 'High/Low Whip',
            difficulty: 3,
            progress: 45,
            status: 'in-progress',
            reps: 450,
            goalReps: 1000
        },
        'two-hand-spin': {
            name: 'Two Hand Spin',
            difficulty: 3,
            progress: 15,
            status: 'in-progress',
            reps: 150,
            goalReps: 1000
        },
        'backhand-flip': {
            name: 'Backhand Flip',
            difficulty: 4,
            progress: 0,
            status: 'new',
            reps: 0,
            goalReps: 1000
        }
    },
    badges: [
        {
            id: 'first-steps',
            name: 'Pierwsze kroki',
            description: 'Rozpoczęto naukę Freestyle Staff',
            icon: '🔰',
            color: '#3498db',
            unlocked: true
        },
        {
            id: 'basic-flow-master',
            name: 'Mistrz Basic Flow',
            description: 'Opanowano Basic Flow',
            icon: '🌊',
            color: '#2ecc71',
            unlocked: true
        },
        {
            id: 'smooth-operator',
            name: 'Smooth Operator',
            description: 'Wykonano 100 powtórzeń Basic Flow',
            icon: '🔄',
            color: '#e74c3c',
            unlocked: true
        },
        {
            id: '1000-reps',
            name: '1000 Powtórzeń',
            description: 'Wykonano 1000 powtórzeń jednej umiejętności',
            icon: '🔢',
            color: '#9b59b6',
            unlocked: false
        }
    ],
    trainingHistory: [
        {
            date: '2025-04-17',
            skill: 'Basic Flow',
            reps: 100,
            notes: 'Świetna sesja! Czuję coraz większą płynność. Jutro spróbuję zwiększyć tempo.'
        },
        {
            date: '2025-04-16',
            skill: 'Neck Wrap',
            reps: 50,
            notes: 'Na początku było trudno, ale po 20 powtórzeniach zaczęło iść lepiej!'
        },
        {
            date: '2025-04-15',
            skill: 'High/Low Whip',
            reps: 30,
            notes: 'Jeszcze nie do końca płynnie, ale robię postępy.'
        }
    ]
};

// Skill details data
const skillDetailsData = {
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
    }
};