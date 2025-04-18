declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Deklaracje dla serwisów JavaScript
declare module '@/services/DataService' {
  const DataService: {
    getUserData: () => any;
    saveUserData: (userData: any) => boolean;
    addReps: (skillId: string, reps: number) => boolean;
    getCategories: () => any[];
    getSkillDetails: (skillId: string) => any;
    addTrainingNote: (skillId: string, note: string) => boolean;
    markSkillAsCompleted: (skillId: string) => boolean;
    resetUserData: () => any;
  };
  
  export default DataService;
}

declare module '@/services/ToastService' {
  export const showToast: (message: string, type?: string) => void;
  
  const ToastService: {
    showToast: (message: string, type?: string) => void;
  };
  
  export default ToastService;
}