declare module '@/services/LearningListService' {
    const LearningListService: {
      getLearningList: () => string[];
      saveLearningList: (list: string[]) => boolean;
      addToLearningList: (skillId: string) => boolean;
      removeFromLearningList: (skillId: string) => boolean;
      clearLearningList: () => boolean;
      isInLearningList: (skillId: string) => boolean;
    };
    
    export default LearningListService;
  }