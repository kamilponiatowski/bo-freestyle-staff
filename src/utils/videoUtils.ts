/**
 * Utility do obsługi wideo z katalogu Freestyle Staff Academy
 */

/**
 * Sprawdza czy ścieżka wideo istnieje w katalogu akademii
 * Zwraca poprawną ścieżkę lub null jeśli nie znaleziono
 */
export const getVideoPath = (path: string): string | null => {
  // Usuń ewentualny początkowy slash
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Sprawdź czy ścieżka zawiera freestyle-staff-academy
  if (!cleanPath.includes('freestyle-staff-academy')) {
    return null;
  }
  
  // Zwróć poprawną ścieżkę z publicznego folderu
  return `/${cleanPath}`;
};

/**
 * Sprawdza czy plik wideo może być odtworzony
 */
export const canPlayVideo = (path: string): boolean => {
  // Dla uproszczenia zakładamy, że pliki mp4 są dostępne
  return path.endsWith('.mp4') && !!getVideoPath(path);
};

/**
 * Pobiera ścieżkę wideo dla umiejętności na podstawie ID
 */
export const getSkillVideoPath = (skillId: string): string | null => {
  // Mapowanie ID umiejętności na ścieżki wideo
  const videoPathMap: Record<string, string> = {
    // Podstawowe umiejętności
    'basic-flow': 'freestyle-staff-academy/5. BEGINNER/1. Basic Flow/Basic Flow.mp4',
    'basic-pass': 'freestyle-staff-academy/5. BEGINNER/2. Basic Pass/Transitional Pass from Forward Figure 8\'s.mp4',
    'dip-pass': 'freestyle-staff-academy/5. BEGINNER/3. Dip Pass/Transitional Pass from Reverse Figure 8\'s.mp4',
    'simple-combo': 'freestyle-staff-academy/5. BEGINNER/4. Simple Combo/Beginner Combo #1 Simple Combo.mp4',
    'neck-wrap': 'freestyle-staff-academy/5. BEGINNER/5. Neck Wrap/Intro To Wraps.mp4',
    'shoulder-wrap': 'freestyle-staff-academy/5. BEGINNER/6. Shoulder Wrap/Should Wrap.mp4',
    'high-low-whip': 'freestyle-staff-academy/5. BEGINNER/7. High_Low Whip/High Whip.mp4',
    'continuous-passing': 'freestyle-staff-academy/5. BEGINNER/8. Continuous Passing/Continuous Passing Description.mp4',
    'windmill': 'freestyle-staff-academy/5. BEGINNER/9. Windmill/Windmill.mp4',
    'two-hand-spin': 'freestyle-staff-academy/5. BEGINNER/11. 2 Hand Spin/2 Hand Spin.mp4',
    
    // Toss & Catch
    'backhand-flip': 'freestyle-staff-academy/6. TOSS & CATCH/0. Backhand Flip/Backhand Flip.mp4',
    'brain-game-2': 'freestyle-staff-academy/6. TOSS & CATCH/1. Brain Game #2/Challenge Combo.mp4',
    'thumbflips': 'freestyle-staff-academy/6. TOSS & CATCH/2. Thumbflips/Intro to Thumbflips & Thumbdrop.mp4',
    'catching-techniques': 'freestyle-staff-academy/6. TOSS & CATCH/3. Catching/Foundations of Catching.mp4',
    'flip-blind': 'freestyle-staff-academy/6. TOSS & CATCH/3. Catching/Flip Blind.mp4',
    'rocket': 'freestyle-staff-academy/6. TOSS & CATCH/3. Catching/Rocket.mp4',
    
    // Combos & Connections
    'beginner-combo-2': 'freestyle-staff-academy/7. COMBOS & CONNECTIONS/0. Beginner Combo #2/Adding To The Puzzle.mp4',
    'basic-connection-2': 'freestyle-staff-academy/7. COMBOS & CONNECTIONS/1. Basic Connection #2/2 Hand Spin - Backhand Flip.mp4',
    'intermediate-combos': 'freestyle-staff-academy/7. COMBOS & CONNECTIONS/2. Intermediate Combos/Putting the Pieces Together.mp4',
    
    // Rolls
    'handrolls': 'freestyle-staff-academy/8. ROLLS/Handrolls (Windsheild Wiper).mp4',
    'arm-rolls': 'freestyle-staff-academy/8. ROLLS/Arm Rolls/Single Arm Rolls (Part 1).mp4',
    'elbow-rolls': 'freestyle-staff-academy/8. ROLLS/Elbow Rolls/Intro to Elbow Rolls.mp4',
    'double-elbow-roll': 'freestyle-staff-academy/8. ROLLS/Elbow Rolls/Double Elbow Roll.mp4',
    'hybrid-rolls': 'freestyle-staff-academy/8. ROLLS/Hybrids/Conveyer Belt.mp4'
  };
  
  // Zwróć ścieżkę wideo jeśli istnieje, w przeciwnym razie null
  const path = videoPathMap[skillId];
  return path ? getVideoPath(path) : null;
};