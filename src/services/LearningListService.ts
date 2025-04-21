/**
 * Serwis zarządzający listą umiejętności do nauki
 * Umożliwia wymianę informacji między SkillCatalogView i SkillsView
 */

import DataService from './DataService';

// Klucz localStorage
const STORAGE_KEY = 'learningList';

class LearningListService {
  /**
   * Pobierz listę umiejętności do nauki
   */
  getLearningList(): string[] {
    try {
      const savedList = localStorage.getItem(STORAGE_KEY);
      return savedList ? JSON.parse(savedList) : [];
    } catch (error) {
      console.error('Błąd podczas pobierania listy nauki:', error);
      return [];
    }
  }

  /**
   * Zapisz listę umiejętności do nauki
   */
  saveLearningList(list: string[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (error) {
      console.error('Błąd podczas zapisywania listy nauki:', error);
      return false;
    }
  }

  /**
   * Dodaj umiejętność do listy nauki
   */
  addToLearningList(skillId: string): boolean {
    try {
      const list = this.getLearningList();
      if (!list.includes(skillId)) {
        list.push(skillId);
        this.saveLearningList(list);
        
        // Upewnij się, że umiejętność jest w systemie śledzenia
        this.ensureSkillExists(skillId);
      }
      return true;
    } catch (error) {
      console.error('Błąd podczas dodawania do listy nauki:', error);
      return false;
    }
  }

  /**
   * Usuń umiejętność z listy nauki
   */
  removeFromLearningList(skillId: string): boolean {
    try {
      const list = this.getLearningList();
      const index = list.indexOf(skillId);
      if (index !== -1) {
        list.splice(index, 1);
        this.saveLearningList(list);
      }
      return true;
    } catch (error) {
      console.error('Błąd podczas usuwania z listy nauki:', error);
      return false;
    }
  }

  /**
   * Wyczyść listę nauki
   */
  clearLearningList(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Błąd podczas czyszczenia listy nauki:', error);
      return false;
    }
  }

  /**
   * Sprawdź, czy umiejętność jest w liście nauki
   */
  isInLearningList(skillId: string): boolean {
    const list = this.getLearningList();
    return list.includes(skillId);
  }

  /**
   * Upewnij się, że umiejętność istnieje w systemie śledzenia
   */
  private ensureSkillExists(skillId: string): void {
    const userData = DataService.getUserData();
    // Sprawdź, czy umiejętność już istnieje
    if (!userData.skills[skillId]) {
      // Pobierz dane z katalogu umiejętności (symulacja)
      const skillInfo = this.getSkillInfoFromCatalog(skillId);
      
      if (skillInfo) {
        // Dodaj umiejętność do systemu śledzenia
        userData.skills[skillId] = {
          name: skillInfo.name,
          category: skillInfo.category,
          difficulty: skillInfo.difficulty,
          progress: 0,
          status: 'new',
          reps: 0,
          goalReps: skillInfo.goalReps
        };
        
        // Zapisz zaktualizowane dane
        DataService.saveUserData(userData);
      }
    }
  }

  /**
   * Pobierz informacje o umiejętności z katalogu (symulacja)
   */
  private getSkillInfoFromCatalog(skillId: string): any {
    // To jest uproszczona wersja - normalnie pobralibyśmy dane z SkillRepository
    // lub innego źródła danych
    const skillCatalog: Record<string, any> = {
      'basic-flow': { name: 'Basic Flow', category: 'beginner', difficulty: 1, goalReps: 1000 },
      'basic-pass': { name: 'Basic Pass', category: 'beginner', difficulty: 2, goalReps: 1000 },
      'dip-pass': { name: 'Dip Pass', category: 'beginner', difficulty: 2, goalReps: 1000 },
      'simple-combo': { name: 'Simple Combo', category: 'beginner', difficulty: 2, goalReps: 1000 },
      'neck-wrap': { name: 'Neck Wrap', category: 'beginner', difficulty: 3, goalReps: 1000 },
      'shoulder-wrap': { name: 'Shoulder Wrap', category: 'beginner', difficulty: 3, goalReps: 1000 },
      'high-low-whip': { name: 'High/Low Whip', category: 'intermediate', difficulty: 3, goalReps: 1000 },
      'continuous-passing': { name: 'Continuous Passing', category: 'intermediate', difficulty: 2, goalReps: 1000 },
      'windmill': { name: 'Windmill', category: 'intermediate', difficulty: 3, goalReps: 1000 },
      'two-hand-spin': { name: '2 Hand Spin', category: 'intermediate', difficulty: 3, goalReps: 1000 },
      'backhand-flip': { name: 'Backhand Flip', category: 'advanced', difficulty: 4, goalReps: 1000 },
      'thumbflips': { name: 'Thumbflips', category: 'advanced', difficulty: 4, goalReps: 1000 },
      'rocket': { name: 'Rocket', category: 'advanced', difficulty: 5, goalReps: 1000 },
      'handrolls': { name: 'Handrolls', category: 'advanced', difficulty: 5, goalReps: 1000 },
      'elbow-rolls': { name: 'Elbow Rolls', category: 'advanced', difficulty: 5, goalReps: 1000 },
      'double-elbow-roll': { name: 'Double Elbow Roll', category: 'advanced', difficulty: 5, goalReps: 1000 }
    };
    
    return skillCatalog[skillId];
  }
}

const learningListService = new LearningListService();

export default learningListService;