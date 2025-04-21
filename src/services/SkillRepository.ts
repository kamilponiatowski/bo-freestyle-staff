/**
 * Serwis SkillRepository - przechowuje i udostępnia informacje o wszystkich umiejętnościach z Freestyle Staff Academy
 */

export interface Video {
    id: string;
    title: string;
    path: string;
    duration: string;
    description?: string;
  }
  
  export interface Skill {
    id: string;
    name: string;
    category: string;
    difficulty: number;
    description: string;
    shortDescription?: string;
    videos: Video[];
    tips?: string[];
    goalReps: number;
    folder?: string; // Ścieżka do folderu w strukturze Freestyle Staff Academy
  }
  
  export interface Category {
    id: string;
    name: string;
    color: string;
  }
  
  class SkillRepository {
    private skills: Skill[] = [
      {
        id: 'basic-flow',
        name: 'Basic Flow',
        category: 'beginner',
        difficulty: 1,
        description: 'Basic Flow to fundament Freestyle Staff Spinningu. To najważniejsza umiejętność, która pozwala zrozumieć podstawowe mechaniki i przepływ ruchu staffa.',
        shortDescription: 'Podstawowa technika będąca fundamentem wszystkich ruchów staffa.',
        folder: '5. BEGINNER/1. Basic Flow',
        videos: [
          { id: 'basic-flow-1', title: 'The Building Blocks of Basic Flow', path: '/videos/basic-flow-1.mp4', duration: '5:24' },
          { id: 'basic-flow-2', title: 'Part 2: Reverse Figure 8', path: '/videos/basic-flow-2.mp4', duration: '3:12' },
          { id: 'basic-flow-3', title: 'Part 3: Forward to Reverse Transition', path: '/videos/basic-flow-3.mp4', duration: '4:05' },
          { id: 'basic-flow-4', title: 'Part 4: Reverse to Forward Transition', path: '/videos/basic-flow-4.mp4', duration: '6:30' },
          { id: 'basic-flow-5', title: 'Part 5: Full Basic Flow', path: '/videos/basic-flow-5.mp4', duration: '4:45' },
          { id: 'grip-tips', title: 'Grip Tips', path: '/videos/grip-tips.mp4', duration: '2:15' }
        ],
        tips: [
          'Zacznij powoli, skupiając się na poprawnej technice',
          'Utrzymuj łokcie blisko ciała dla lepszej kontroli',
          'Ćwicz obie strony (prawą i lewą rękę) równomiernie',
          'Powtarzaj do momentu aż ruch stanie się naturalny i płynny'
        ],
        goalReps: 1000
      },
      {
        id: 'basic-pass',
        name: 'Basic Pass',
        category: 'beginner',
        difficulty: 2,
        description: 'Basic Pass to proste, efektywne przejście z ósemek do przodu. Powinno być wykonywane szybko i efektywnie, bez zbędnych ozdobników.',
        shortDescription: 'Proste przejście między rękami podczas wykonywania ósemek do przodu.',
        folder: '5. BEGINNER/2. Basic Pass',
        videos: [
          { id: 'basic-pass-1', title: 'Transitional Pass from Forward Figure 8\'s', path: '/videos/basic-pass-1.mp4', duration: '3:45' }
        ],
        tips: [
          'Skup się na prostych mechanizmach',
          'Wykonuj szybko i efektywnie',
          'Zachowaj płynność ruchu'
        ],
        goalReps: 1000
      },
      {
        id: 'dip-pass',
        name: 'Dip Pass',
        category: 'beginner',
        difficulty: 2,
        description: 'Dip Pass to przejście wsteczne, pochodzące z ósemek do tyłu. Ma być szybkim i prostym przejściem, stanowiącym podstawę dla bardziej złożonych ruchów.',
        shortDescription: 'Przejście wsteczne wykonywane z ósemek do tyłu.',
        folder: '5. BEGINNER/3. Dip Pass',
        videos: [
          { id: 'dip-pass-1', title: 'Transitional Pass from Reverse Figure 8\'s', path: '/videos/dip-pass-1.mp4', duration: '4:15' }
        ],
        tips: [
          'Staff będzie prostopadły w centrum ciała przed przejściem',
          'Trzymaj staff blisko siebie',
          'Tylna część ręki przechodzącej dotyka czoła'
        ],
        goalReps: 1000
      },
      {
        id: 'simple-combo',
        name: 'Simple Combo',
        category: 'beginner',
        difficulty: 2,
        description: 'Simple Combo to pierwsza kombinacja pokazująca, jak różne elementy Staff Spinningu łączą się ze sobą. Używamy obu rąk i dwóch różnych przejść w jednym płynnym ruchu.',
        shortDescription: 'Pierwsza kombinacja łącząca Basic Flow, Basic Pass i Dip Pass.',
        folder: '5. BEGINNER/4. Simple Combo',
        videos: [
          { id: 'simple-combo-1', title: 'Beginner Combo #1 Simple Combo', path: '/videos/simple-combo-1.mp4', duration: '5:30' }
        ],
        tips: [
          'Ćwicz prawą i lewą ręką',
          'Zachowaj prostotę, używając tylko podstawowych mechanizmów',
          'Dąż do wykonania 10 powtórzeń pod rząd, obu rękami'
        ],
        goalReps: 1000
      },
      {
        id: 'neck-wrap',
        name: 'Neck Wrap',
        category: 'beginner',
        difficulty: 3,
        description: 'Neck Wrap to twoje pierwsze wprowadzenie do technik owijania, stanowiące alternatywę dla Basic Pass. Jest to efektywny sposób na urozmaicenie przepływu i dodanie widowiskowości.',
        shortDescription: 'Pierwszy ruch owijania staffa wokół szyi.',
        folder: '5. BEGINNER/5. Neck Wrap',
        videos: [
          { id: 'neck-wrap-1', title: 'Intro To Wraps', path: '/videos/neck-wrap-1.mp4', duration: '6:10' }
        ],
        tips: [
          'ZAWSZE owijaj staff tak daleko, jak to możliwe, PRZED wypuszczeniem',
          'Zacznij od powolnego ćwiczenia, aby zrozumieć mechanikę',
          'Nie bój się początkowo dotykać szyi staffem - to normalne'
        ],
        goalReps: 1000
      },
      {
        id: 'shoulder-wrap',
        name: 'Shoulder Wrap',
        category: 'beginner',
        difficulty: 3,
        description: 'Shoulder Wrap to alternatywa dla Neck Wrap i wprowadzenie do serii zawijania. Jest świetnym dodatkiem do praktyki walki/ruchu bojowego, będąc szybkim, efektownym i nieoczekiwanym elementem.',
        shortDescription: 'Technika owijania staffa wokół ramienia, idealna do sekwencji bojowych.',
        folder: '5. BEGINNER/6. Shoulder Wrap',
        videos: [
          { id: 'shoulder-wrap-1', title: 'Should Wrap', path: '/videos/shoulder-wrap-1.mp4', duration: '5:20' }
        ],
        tips: [
          'Pamiętaj o 1. Zasadzie Zawijania - zawijaj tak dużo, jak to możliwe PRZED wypuszczeniem',
          'Ćwicz przed lustrem, aby znaleźć optymalne ułożenie',
          'Ta umiejętność zawsze będzie pochodzić z ósemek do przodu'
        ],
        goalReps: 1000
      },
      {
        id: 'high-low-whip',
        name: 'High/Low Whip',
        category: 'intermediate',
        difficulty: 3,
        description: 'High/Low Whip (znany również jako Obi Ani) to prosty, ale niezwykle skuteczny i piękny trik. Może być używany jako element przepływu oraz jako element bojowy. W późniejszych umiejętnościach pomaga budować energię przed rzucaniem.',
        shortDescription: 'Elegancki ruch przypominający bicz, wykonywany na górze i na dole.',
        folder: '5. BEGINNER/7. High_Low Whip',
        videos: [
          { id: 'high-whip-1', title: 'High Whip', path: '/videos/high-whip-1.mp4', duration: '4:30' },
          { id: 'low-whip-1', title: 'Low Whip', path: '/videos/low-whip-1.mp4', duration: '3:55' }
        ],
        tips: [
          'Upewnij się, że High Whip następuje w pozycji godziny 12',
          'Podczas Low Whip trzymaj kostki przy pasie',
          'Dla sztywnych nadgarstków, obróć biodra podczas Low Whip'
        ],
        goalReps: 1000
      },
      {
        id: 'continuous-passing',
        name: 'Continuous Passing',
        category: 'intermediate',
        difficulty: 2,
        description: 'Continuous Passing to jeden z najlepszych sposobów na zrozumienie, jak różne elementy Staff Spinningu łączą się ze sobą. Używamy struktury Basic Flow do wszystkich poznanych technik, tworząc płynny, ciągły ruch.',
        shortDescription: 'Technika ciągłego przepływu i przekazywania staffa z ręki do ręki.',
        folder: '5. BEGINNER/8. Continuous Passing',
        videos: [
          { id: 'continuous-passing-1', title: 'Continuous Passing Description', path: '/videos/continuous-passing-1.mp4', duration: '3:45' },
          { id: 'forward-continuous-passing-1', title: 'Forward Continuous Passing', path: '/videos/forward-continuous-passing-1.mp4', duration: '5:10' },
          { id: 'reverse-continuous-passing-1', title: 'Reverse Continuous Passing', path: '/videos/reverse-continuous-passing-1.mp4', duration: '4:50' }
        ],
        tips: [
          'Obracaj ramionami całkowicie w płaszczyźnie przedniej i tylnej',
          'Upewnij się, że staff jest równoległy do płaszczyzny przed przejściem',
          'W razie potrzeby dodaj dodatkowe ósemki, aby spowolnić przepływ'
        ],
        goalReps: 1000
      },
      {
        id: 'windmill',
        name: 'Windmill',
        category: 'intermediate',
        difficulty: 3,
        description: 'Windmill to prosta, ale elegancka technika, którą można wykonać prawie każdym rekwizytem. Dodaje tekstury do przepływu poprzez zmiany wysokości i płaszczyzn, pomagając w głębszym zrozumieniu pracy w wielu wymiarach.',
        shortDescription: 'Obrotowy ruch staffa przypominający wiatrak, z wykorzystaniem różnych poziomów.',
        folder: '5. BEGINNER/9. Windmill',
        videos: [
          { id: 'windmill-1', title: 'Windmill', path: '/videos/windmill-1.mp4', duration: '5:35' }
        ],
        tips: [
          'Rozpocznij rozgrzewkę od Basic Flow',
          'Ustanów swoją bazę i obracaj się tylko z bioder',
          'Kontroluj wysokość staffa przez cały czas trwania ruchu'
        ],
        goalReps: 1000
      },
      {
        id: 'brain-game-1',
        name: 'Brain Game #1',
        category: 'intermediate',
        difficulty: 3,
        description: 'Brain Game #1 łączy wszystkie poznane dotychczas umiejętności w jeden pełny, ciągły przepływ. Wymaga użycia obu rąk, obracania się w obu kierunkach i korzystania z płaszczyzn przedniej i tylnej. To wyzwanie dla twojego mózgu!',
        shortDescription: 'Wyzwanie łączące podstawowe umiejętności w płynną sekwencję.',
        folder: '5. BEGINNER/10. Brain Game #1',
        videos: [
          { id: 'brain-game-1', title: 'Challenge Combo', path: '/videos/brain-game-1.mp4', duration: '6:20' }
        ],
        tips: [
          'Zawsze zaczynaj ćwiczenie od przednich Ósemek',
          'Skup się na pracy stóp pokazanej w filmie',
          'Dąż do 10 powtórzeń pod rząd, bez zatrzymywania'
        ],
        goalReps: 100
      },
      {
        id: 'two-hand-spin',
        name: '2 Hand Spin',
        category: 'intermediate',
        difficulty: 3,
        description: 'Two Hand Spin to powtarzalne przejście, które może być wykonywane do przodu lub do tyłu. Jest to również ważny postęp w kierunku Thumbflips, które będą jednym z głównych sposobów rzucania staffa.',
        shortDescription: 'Technika obracania staffa obiema rękami, kluczowa dla wielu zaawansowanych ruchów.',
        folder: '5. BEGINNER/11. 2 Hand Spin',
        videos: [
          { id: 'two-hand-spin-1', title: '2 Hand Spin', path: '/videos/two-hand-spin-1.mp4', duration: '6:15' }
        ],
        tips: [
          'Bądź cierpliwy, poczekaj aż staff całkowicie się obróci wokół kciuka',
          'Trzymaj OBE dłonie skierowane w górę podczas przejścia',
          'Dopasuj podanie - kciuki powinny się stykać',
          'Zacznij wolno, prędkość zwiększy się wraz z opanowaniem techniki'
        ],
        goalReps: 1000
      },
      {
        id: 'basic-connection',
        name: 'Basic Connection',
        category: 'intermediate',
        difficulty: 2,
        description: 'Basic Connection łączy Basic Flow z 2 Hand Spin, tworząc płynne przejście. Ta fundamentalna technika będzie pojawiać się wielokrotnie podczas twojej praktyki, nawet w bardziej złożonych umiejętnościach.',
        shortDescription: 'Podstawowe połączenie pomiędzy Basic Flow a 2 Hand Spin.',
        folder: '5. BEGINNER/12. Basic Connection',
        videos: [
          { id: 'basic-connection-1', title: 'Basic Flow to 2 Hand Spin', path: '/videos/basic-connection-1.mp4', duration: '4:25' }
        ],
        tips: [
          'Bądź cierpliwy, poczekaj aż staff całkowicie się obróci',
          'Dopasuj przejście - kciuki powinny się stykać',
          'Zacznij wolno, prędkość przyjdzie z czasem'
        ],
        goalReps: 1000
      },
      {
        id: 'backhand-flip',
        name: 'Backhand Flip',
        category: 'advanced',
        difficulty: 4,
        description: 'Backhand Flip to jeden z najbardziej wszechstronnych i prostych sposobów rzucania staffa. Jest świetnym punktem wyjściowym do nauki, jak wprowadzać i wyprowadzać staff z rąk, wykonując szybkie, efektywne i przewidywalne rzuty.',
        shortDescription: 'Podstawowa technika podrzucania staffa zewnętrzną częścią dłoni.',
        folder: '6. TOSS & CATCH/0. Backhand Flip',
        videos: [
          { id: 'backhand-flip-1', title: 'Intro & Deadstick Backhand Flip', path: '/videos/backhand-flip-1.mp4', duration: '4:30' },
          { id: 'backhand-flip-2', title: 'Backhand Flip', path: '/videos/backhand-flip-2.mp4', duration: '5:50' }
        ],
        tips: [
          'Obróć całkowicie rękę przed wypuszczeniem staffa',
          'Jeśli brakuje Ci mobilności - lekko obróć biodra i ramiona',
          'Wyciągnij rękę z rotacji po wypuszczeniu',
          'Łap dłonią do góry',
          'Staff musi wykonać minimum 1 pełny obrót'
        ],
        goalReps: 1000
      },
      {
        id: 'brain-game-2',
        name: 'Brain Game #2',
        category: 'advanced',
        difficulty: 4,
        description: 'Brain Game #2 łączy Basic Flow, 2 Hand Spin i Backhand Flip w jeden ciągły przepływ, wykorzystujący obie ręce, przednią i tylną płaszczyznę oraz obroty w obu kierunkach. To test pełnego zrozumienia mechaniki i świadomości przestrzennej.',
        shortDescription: 'Zaawansowane wyzwanie łączące Basic Flow, 2 Hand Spin i Backhand Flip.',
        folder: '6. TOSS & CATCH/1. Brain Game #2',
        videos: [
          { id: 'brain-game-2', title: 'Challenge Combo', path: '/videos/brain-game-2.mp4', duration: '7:10' }
        ],
        tips: [
          'Ćwicz każdą umiejętność osobno przed połączeniem',
          'Wykonaj to 10 razy pod rząd, używając obu rąk, bez zatrzymywania',
          'Skup się na płynności ruchów, nie na prędkości'
        ],
        goalReps: 100
      },
      {
        id: 'thumbflips',
        name: 'Thumbflips',
        category: 'advanced',
        difficulty: 4,
        description: 'Thumbflips są głównym sposobem rzucania w Freestyle Staff. Pozwalają na pełną kontrolę wysokości, kierunku, umiejscowienia i prędkości obrotu podczas rzutu, przy minimalnym wysiłku. Większość momentu obrotowego generowana jest w nadgarstku.',
        shortDescription: 'Podstawowa technika podrzucania staffa z wykorzystaniem kciuka jako punktu obrotu.',
        folder: '6. TOSS & CATCH/2. Thumbflips',
        videos: [
          { id: 'thumbflips-1', title: 'Intro to Thumbflips & Thumbdrop', path: '/videos/thumbflips-1.mp4', duration: '5:20' },
          { id: 'thumbflips-2', title: 'Thumbflip c. Left', path: '/videos/thumbflips-2.mp4', duration: '6:10' }
        ],
        tips: [
          'Bądź cierpliwy, pozwól staffowi obrócić się całkowicie wokół kciuka przed wypuszczeniem',
          'Złap dłonią do góry lewą ręką na początek',
          'Jeśli technika się cofa, wróć do ćwiczeń 2 Hand Spin i Thumbdrop'
        ],
        goalReps: 1000
      },
      {
        id: 'all-4-ways',
        name: 'All 4 Ways',
        category: 'advanced',
        difficulty: 4,
        description: 'All 4 Ways to idealny test twojego podstawowego zrozumienia Staff Spinningu. Uczy, jak jednocześnie używać różnych umiejętności, w obu rękach, wchodząc i wychodząc z wielu płaszczyzn, pozostając w całkowitym przepływie.',
        shortDescription: 'Technika łącząca różne umiejętności w płynny przepływ w czterech różnych wariantach.',
        folder: '6. TOSS & CATCH/3. Catching',
        videos: [
          { id: 'all-4-ways-1', title: 'All 4 Ways', path: '/videos/all-4-ways-1.mp4', duration: '6:40' }
        ],
        tips: [
          'Rozgrzej się Thumbflips i Backhand Flips (20-50 powtórzeń każde)',
          'Utrzymuj stopy równo i stabilnie',
          'Ćwicz Thumbflip i Backhand Flip osobno przed połączeniem'
        ],
        goalReps: 1000
      },
      {
        id: 'catching-techniques',
        name: 'Catching Techniques',
        category: 'advanced',
        difficulty: 5,
        description: 'Zbiór różnych technik łapania staffa, takich jak Backhand Catch, Half Turn Blind, Left/Right Hand Back/Ground Catch i inne. Te techniki dodają różnorodności i widowiskowości do twojego repertuaru.',
        shortDescription: 'Zbiór różnych sposobów łapania staffa w różnych pozycjach i płaszczyznach.',
        folder: '6. TOSS & CATCH/3. Catching',
        videos: [
          { id: 'foundations-catching-1', title: 'Foundations of Catching', path: '/videos/foundations-catching-1.mp4', duration: '4:15' },
          { id: 'backhand-catch-1', title: 'Backhand Catch', path: '/videos/backhand-catch-1.mp4', duration: '3:55' },
          { id: 'half-turn-blind-1', title: 'Half Turn Blind', path: '/videos/half-turn-blind-1.mp4', duration: '4:40' },
          { id: 'left-hand-back-catch-1', title: 'Left Hand Back Catch', path: '/videos/left-hand-back-catch-1.mp4', duration: '3:30' },
          { id: 'right-hand-back-catch-1', title: 'Right Hand Back Catch', path: '/videos/right-hand-back-catch-1.mp4', duration: '3:40' },
          { id: 'left-hand-ground-1', title: 'Left Hand Ground', path: '/videos/left-hand-ground-1.mp4', duration: '4:20' },
          { id: 'right-hand-ground-1', title: 'Right Hand Ground', path: '/videos/right-hand-ground-1.mp4', duration: '4:10' },
          { id: 'left-hand-head-catch-1', title: 'Left Hand Head Catch', path: '/videos/left-hand-head-catch-1.mp4', duration: '3:50' },
          { id: 'hug-trick-1', title: 'Hug Trick', path: '/videos/hug-trick-1.mp4', duration: '5:15' }
        ],
        tips: [
          'Ustaw stopy i rękę do łapania PRZED rzutem',
          'Obserwuj staff tak długo, jak to możliwe',
          'Ćwicz każdy chwyt osobno przed łączeniem w sekwencje'
        ],
        goalReps: 1000
      },
      {
        id: 'flip-blind',
        name: 'Flip Blind',
        category: 'advanced',
        difficulty: 5,
        description: 'Flip Blind to technika wymagająca pracy na tylnej płaszczyźnie. Wymaga dobrze opanowanego Thumbflip, świadomości płaszczyzn i głębokiego zrozumienia Blind Catch. Jest to satysfakcjonująca umiejętność, szybka, zwinna i efektowna.',
        shortDescription: 'Zaawansowana technika podrzutu z łapaniem bez patrzenia na staffa.',
        folder: '6. TOSS & CATCH/3. Catching',
        videos: [
          { id: 'flip-blind-1', title: 'Flip Blind', path: '/videos/flip-blind-1.mp4', duration: '5:45' }
        ],
        tips: [
          'Rozgrzej się Thumbflips (20-50 powtórzeń)',
          'Złap Half Turn Blind 10 razy przed próbą Flip Blind',
          'Trzymaj łokieć blisko ciała podczas wypuszczenia',
          'Stabilnie ustaw stopy, unikaj nadmiernego przestępowania'
        ],
        goalReps: 1000
      },
      {
        id: 'rocket',
        name: 'Rocket',
        category: 'advanced',
        difficulty: 5,
        description: 'Rocket może wyglądać na trudny i niebezpieczny trik, ale w rzeczywistości jest dość prosty mechanicznie i dostępny dla większości praktykujących z odrobiną cierpliwości. Jest to pierwsze spojrzenie na wykorzystanie podstawowych umiejętności w różnych poziomach i płaszczyznach.',
        shortDescription: 'Efektowny ruch "wystrzeliwujący" staff pionowo w górę.',
        folder: '6. TOSS & CATCH/3. Catching',
        videos: [
          { id: 'rocket-1', title: 'Rocket', path: '/videos/rocket-1.mp4', duration: '5:30' },
          { id: 'flip-blind-rocket-1', title: 'Flip Blind - Rocket', path: '/videos/flip-blind-rocket-1.mp4', duration: '7:20' }
        ],
        tips: [
          'Rozgrzej się Backhand Flips (20-50 powtórzeń)',
          'Trzymaj ramiona PROSTE przez cały czas!',
          'Skieruj górny koniec w dół tak długo, jak to możliwe',
          'Używaj miękkich rąk do łapania',
          'Upuszczanie jest częścią procesu nauki - nie zniechęcaj się'
        ],
        goalReps: 1000
      },
      {
        id: 'beginner-combo-2',
        name: 'Beginner Combo #2',
        category: 'intermediate',
        difficulty: 3,
        description: 'Beginner Combo #2 łączy wszystkie podstawowe elementy Staff Spinningu. To combo pomoże ci znaleźć drogę w i z Basic Flow, używając różnych przejść, obiema rękami, z przednich i tylnych ósemek bez popadania w monotonię.',
        shortDescription: 'Rozbudowana kombinacja podstawowych ruchów dla początkujących.',
        folder: '7. COMBOS & CONNECTIONS/0. Beginner Combo #2',
        videos: [
          { id: 'beginner-combo-2-1', title: 'Adding To The Puzzle', path: '/videos/beginner-combo-2-1.mp4', duration: '6:15' }
        ],
        tips: [
          'Zacznij wolno, rozkładając każdy element na części',
          'Skup się na płynności, nie na prędkości',
          'Pamiętaj: Wolno = płynnie, płynnie = szybko'
        ],
        goalReps: 100
      },
      {
        id: 'basic-connection-2',
        name: 'Basic Connection #2',
        category: 'intermediate',
        difficulty: 3,
        description: 'Basic Connection #2 łączy 2 Hand Spin i Backhand Flip do Basic Flow. Jest to pierwszy krok w budowaniu prawdziwej złożoności w praktyce Freestyle Staff poprzez łączenie trzech różnych elementów w szybkiej sekwencji: przepływ - przejście - rzut/łapanie.',
        shortDescription: 'Połączenie trzech elementów: Basic Flow, 2 Hand Spin i Backhand Flip.',
        folder: '7. COMBOS & CONNECTIONS/1. Basic Connection #2',
        videos: [
          { id: 'basic-connection-2-1', title: '2 Hand Spin - Backhand Flip', path: '/videos/basic-connection-2-1.mp4', duration: '5:20' }
        ],
        tips: [
          'Zacznij wolno, celując w płynność, nie prędkość',
          'Złap 25 razy każdą umiejętność PRZED dodaniem ich do combo',
          'Rozluźnij rękę podczas Backhand Flip'
        ],
        goalReps: 1000
      },
      {
        id: 'intermediate-combos',
        name: 'Intermediate Combos',
        category: 'advanced',
        difficulty: 4,
        description: 'Zestaw trzech średniozaawansowanych kombinacji, które łączą wszystkie poznane dotychczas umiejętności w płynne sekwencje. Te combos pozwalają na kreatywne wyrażenie się i budowanie własnego stylu.',
        shortDescription: 'Trzy średniozaawansowane kombinacje do kreatywnego wyrażenia się.',
        folder: '7. COMBOS & CONNECTIONS/2. Intermediate Combos',
        videos: [
          { id: 'intermediate-combo-1', title: 'Putting the Pieces Together', path: '/videos/intermediate-combo-1.mp4', duration: '7:30' },
          { id: 'intermediate-combo-2', title: 'Flipping and Catching and More Flipping', path: '/videos/intermediate-combo-2.mp4', duration: '6:45' },
          { id: 'intermediate-combo-3', title: 'So Fancy', path: '/videos/intermediate-combo-3.mp4', duration: '8:10' }
        ],
        tips: [
          'Powtórz każdą umiejętność indywidualnie PRZED połączeniem',
          'Rozłóż combo na małe połączone kawałki',
          'Zacznij wolno - prędkość przyjdzie z czasem'
        ],
        goalReps: 100
      },
      {
        id: 'handrolls',
        name: 'Handrolls',
        category: 'advanced',
        difficulty: 5,
        description: 'Handrolls (Wycieraczka) to świetne wprowadzenie do technik rolowania. Jest to szybki, prosty i niezwykle wszechstronny ruch, będący podstawą dla bardziej zaawansowanych technik rolowania. Wycieraczka to dobry sposób na ćwiczenie obu stron handroll i zmiany kierunku.',
        shortDescription: 'Podstawowa technika rolowania staffa po dłoniach.',
        folder: '8. ROLLS',
        videos: [
          { id: 'handrolls-1', title: 'Handrolls (Windsheild Wiper)', path: '/videos/handrolls-1.mp4', duration: '5:15' },
          { id: 'intro-to-rolls-1', title: 'Intro to Rolls', path: '/videos/intro-to-rolls-1.mp4', duration: '4:40' }
        ],
        tips: [
          'ZWOLNIJ! Rolki poruszają się wolniej niż inne umiejętności',
          'Skup się na punktach wejścia i wyjścia każdej rolki',
          'Zakotwicz i ustabilizuj stopy',
          'Mniej znaczy więcej - mniej wysiłku, napięcia i energii',
          'Zawsze rozgrzewaj się ćwiczeniami postępującymi'
        ],
        goalReps: 1000
      },
      {
        id: 'arm-rolls',
        name: 'Arm Rolls',
        category: 'advanced',
        difficulty: 5,
        description: 'Arm Rolls to podstawowe techniki rolek, które pozwalają na obserwację procesu rolowania przed przejściem do trudniejszych umiejętności. Ze względu na długość i zasięg ramion, są dobrym miejscem do rozpoczęcia przygody z rolkami.',
        shortDescription: 'Techniki rolowania staffa po ramionach, wprowadzające do zaawansowanych rolek.',
        folder: '8. ROLLS/Arm Rolls',
        videos: [
          { id: 'single-arm-rolls-1', title: 'Single Arm Rolls (Part 1)', path: '/videos/single-arm-rolls-1.mp4', duration: '5:40' },
          { id: 'outside-inside-arm-roll-1', title: 'Outside to Inside Arm Roll', path: '/videos/outside-inside-arm-roll-1.mp4', duration: '4:20' },
          { id: 'inside-outside-arm-roll-1', title: 'Inside to Outside Arm Roll', path: '/videos/inside-outside-arm-roll-1.mp4', duration: '4:35' },
          { id: 'double-arm-roll-1', title: 'Double Arm Roll', path: '/videos/double-arm-roll-1.mp4', duration: '6:20' }
        ],
        tips: [
          'ZWOLNIJ! Rolki mają swój własny rytm',
          'Skup się na punktach wejścia i wyjścia',
          'Stabilizuj dolną część ciała',
          'Mniej napięcia przynosi lepsze rezultaty',
          'Używaj postępów, jeśli umiejętność się cofa'
        ],
        goalReps: 1000
      },
      {
        id: 'elbow-rolls',
        name: 'Elbow Rolls',
        category: 'advanced',
        difficulty: 5,
        description: 'Elbow Rolls to jedna z najważniejszych i najbardziej fundamentalnych technik rolowania. Pojawia się wielokrotnie w wielu złożonych, zaawansowanych rolkach. Są podobne do Arm Rolls, ale bliskość twarzy i zwiększony kontakt ze skórą czyni je nieco trudniejszymi.',
        shortDescription: 'Technika rolowania staffa po łokciu, kluczowa dla zaawansowanych ruchów.',
        folder: '8. ROLLS/Elbow Rolls',
        videos: [
          { id: 'intro-to-elbow-rolls-1', title: 'Intro to Elbow Rolls', path: '/videos/intro-to-elbow-rolls-1.mp4', duration: '6:20' },
          { id: 'outside-inside-elbow-roll-1', title: 'Outside to Inside Elbow Roll', path: '/videos/outside-inside-elbow-roll-1.mp4', duration: '4:50' },
          { id: 'inside-outside-elbow-roll-1', title: 'Inside to Outside Elbow Roll', path: '/videos/inside-outside-elbow-roll-1.mp4', duration: '5:10' },
          { id: 'double-elbow-roll-1', title: 'Double Elbow Roll', path: '/videos/double-elbow-roll-1.mp4', duration: '7:30' },
          { id: 'double-elbow-blind-1', title: 'Double Elbow Blind', path: '/videos/double-elbow-blind-1.mp4', duration: '6:45' }
        ],
        tips: [
          'ZWOLNIJ! Rolki mają swój własny rytm i czas',
          'Skup się na punktach wejścia i wyjścia',
          'Ustabilizuj dolną część ciała',
          'Mniej wysiłku daje lepsze rezultaty',
          'Wracaj do ćwiczeń podstawowych, jeśli umiejętność się cofa'
        ],
        goalReps: 1000
      },
      {
        id: 'hybrid-rolls',
        name: 'Hybrid Rolls',
        category: 'advanced',
        difficulty: 5,
        description: 'Hybrid Rolls to zaawansowane techniki łączące różne rodzaje rolek w płynne sekwencje. Obejmują Elbow Wrist Hybrid, Wrist Elbow Hybrid, Paddles i Conveyer Belt. Wymagają skrajnej cierpliwości, wyczucia czasu i świadomości przepływu staffa.',
        shortDescription: 'Zaawansowane techniki łączące różne rodzaje rolek w płynne sekwencje.',
        folder: '8. ROLLS/Hybrids',
        videos: [
          { id: 'elbow-wrist-hybrid-1', title: 'Elbow Wrist Hybrid', path: '/videos/elbow-wrist-hybrid-1.mp4', duration: '5:30' },
          { id: 'wrist-elbow-hybrid-1', title: 'Wrist Elbow Hybrid', path: '/videos/wrist-elbow-hybrid-1.mp4', duration: '5:45' },
          { id: 'paddles-1', title: 'Paddles', path: '/videos/paddles-1.mp4', duration: '4:10' },
          { id: 'conveyer-belt-1', title: 'Conveyer Belt', path: '/videos/conveyer-belt-1.mp4', duration: '6:30' }
        ],
        tips: [
          'ZWOLNIJ do ekstremum! Te techniki wymagają wyjątkowej cierpliwości',
          'Rozgrzej się pojedynczymi rolkami (50+ powtórzeń)',
          'Skup się na punktach przejściowych między technikami',
          'Stabilizuj całe ciało, szczególnie stopy',
          'Wykonuj ruchy z minimalnym wysiłkiem'
        ],
        goalReps: 1000
      },
      {
        id: 'double-elbow-roll',
        name: 'Double Elbow Roll',
        category: 'advanced',
        difficulty: 5,
        description: 'Double Elbow Roll to złożona technika rolowania, łącząca dwa pojedyncze Elbow Rolls. Ta podwójna umiejętność jest tak wszechstronna, że stanowi podstawę dla wielu technik rolowania górnej części ciała. Dzięki niej zaczniesz odkrywać tempo i rytm charakterystyczny dla rolek.',
        shortDescription: 'Zaawansowana technika łącząca dwa rolowania po łokciach w jeden płynny ruch.',
        folder: '8. ROLLS/Elbow Rolls',
        videos: [
          { id: 'double-elbow-roll-1', title: 'Double Elbow Roll', path: '/videos/double-elbow-roll-1.mp4', duration: '6:45' }
        ],
        tips: [
          'Zacznij od 25 pojedynczych Elbow Rolls jako rozgrzewka',
          'Zwolnij - rolki mają swój własny rytm',
          'Skup się na punktach wejścia i wyjścia',
          'Stabilizuj stopy i dolną część ciała',
          'Mniej napięcia daje lepsze wykonanie'
        ],
        goalReps: 1000
      }
    ];
  
    private categories: Category[] = [
      { id: 'beginner', name: 'Podstawowe', color: '#3498db' },
      { id: 'intermediate', name: 'Średniozaawansowane', color: '#e67e22' },
      { id: 'advanced', name: 'Zaawansowane', color: '#e74c3c' }
    ];
  
    public getAllSkills(): Skill[] {
      return this.skills;
    }
  
    public getSkillById(id: string): Skill | undefined {
      return this.skills.find(skill => skill.id === id);
    }
  
    public getCategories(): Category[] {
      return this.categories;
    }
  
    public getSkillsByCategory(categoryId: string): Skill[] {
      return this.skills.filter(skill => skill.category === categoryId);
    }
  
    public searchSkills(query: string): Skill[] {
      const lowerQuery = query.toLowerCase();
      return this.skills.filter(skill => 
        skill.name.toLowerCase().includes(lowerQuery) || 
        skill.description.toLowerCase().includes(lowerQuery) ||
        (skill.shortDescription && skill.shortDescription.toLowerCase().includes(lowerQuery))
      );
    }
  }
  
  export default new SkillRepository();