import { BaseStorage, createStorage, StorageType } from "@lib/storages/base";

type Question = {
  question: string;
  answer: string;
  id: string;
};

type QuestionStorage = BaseStorage<Question[]> & {
  addOrUpdateQuestions: (question: Question) => Promise<void>;
  removeQuestion: (id: string) => Promise<void>;
};

const storage = createStorage<Question[]>("question-storage-key", [], {
  storageType: StorageType.Local,
  liveUpdate: true,
});

export const questionStorage: QuestionStorage = {
  ...storage,
  addOrUpdateQuestions: async (question: Question) => {
    await storage.set((currentQuestions) => {
      const index = currentQuestions.findIndex((q) => q.id === question.id);
      if (index === -1) {
        currentQuestions.push(question);
      } else {
        currentQuestions[index] = question;
      }
      return currentQuestions;
    });
  },
  removeQuestion: async (id: string) => {
    await storage.set((currentQuestions) => {
      return currentQuestions.filter((q) => q.id !== id);
    });
  },
};
