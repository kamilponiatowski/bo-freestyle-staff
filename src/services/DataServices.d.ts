declare module '@/services/DataService' {
    interface UserProgress {
      totalSkills: number;
      completedSkills: number;
      inProgressSkills: number;
      totalReps: number;
    }
  
    interface Skill {
      name: string;
      category: string;
      difficulty: number;
      progress: number;
      status: string;
      reps: number;
      goalReps: number;
    }
  
    interface Badge {
      id: string;
      name: string;
      description: string;
      icon: string;
      color: string;
      unlocked: boolean;
    }
  
    interface TrainingEntry {
      date: string;
      skill: string;
      reps: number;
      notes: string;
    }
  
    interface UserData {
      name: string;
      email: string;
      avatar: string;
      progress: UserProgress;
      skills: Record<string, Skill>;
      badges: Badge[];
      trainingHistory: TrainingEntry[];
    }
  
    interface SkillDetails extends Skill {
      description: string;
      videoPath?: string;
      tips: string[];
    }
  
    interface Category {
      id: string;
      name: string;
      color: string;
    }
  
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