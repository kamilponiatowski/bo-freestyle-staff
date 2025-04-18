/**
 * Deklaracje typów dla DataService
 */

// Struktura umiejętności
export interface Skill {
    name: string;
    category: string;
    difficulty: number;
    progress: number;
    status: 'new' | 'in-progress' | 'completed';
    reps: number;
    goalReps: number;
  }
  
  // Struktura odznaki
  export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    unlocked: boolean;
  }
  
  // Struktura wpisu w historii treningowej
  export interface TrainingEntry {
    date: string;
    skill: string;
    reps: number;
    notes: string;
  }
  
  // Struktura postępu użytkownika
  export interface UserProgress {
    totalSkills: number;
    completedSkills: number;
    inProgressSkills: number;
    totalReps: number;
  }
  
  // Główna struktura danych użytkownika
  export interface UserData {
    name: string;
    email: string;
    avatar: string;
    progress: UserProgress;
    skills: Record<string, Skill>;
    badges: Badge[];
    trainingHistory: TrainingEntry[];
  }
  
  // Kategoria umiejętności
  export interface Category {
    id: string;
    name: string;
    color: string;
  }
  
  // Szczegóły umiejętności
  export interface SkillDetails extends Skill {
    description: string;
    videoPath?: string;
    tips: string[];
  }
  
  // Deklaracja typu dla DataService
  declare module '@/services/DataService' {
    const DataService: {
      getUserData: () => UserData;
      saveUserData: (userData: UserData) => boolean;
      addReps: (skillId: string, reps: number) => boolean;
      getCategories: () => Category[];
      getSkillDetails: (skillId: string) => SkillDetails;
      addTrainingNote: (skillId: string, note: string) => boolean;
      markSkillAsCompleted: (skillId: string) => boolean;
      resetUserData: () => UserData;
    };
    
    export default DataService;
  }