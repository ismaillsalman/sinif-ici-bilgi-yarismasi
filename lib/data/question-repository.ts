// ==========================================
// Question Repository — Soru Bankası Veri Katmanı
// ==========================================

import { Question, Difficulty } from '@/lib/types';
import { mockQuestions } from './mock-data';

let questions = [...mockQuestions];

export const questionRepository = {
  getAll(): Question[] {
    return [...questions];
  },

  getById(id: string): Question | undefined {
    return questions.find((q) => q.id === id);
  },

  create(question: Omit<Question, 'id' | 'createdAt'>): Question {
    const newQuestion: Question = {
      ...question,
      id: `q${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    questions.push(newQuestion);
    return newQuestion;
  },

  update(id: string, data: Partial<Question>): Question | undefined {
    const index = questions.findIndex((q) => q.id === id);
    if (index === -1) return undefined;
    questions[index] = { ...questions[index], ...data };
    return questions[index];
  },

  delete(id: string): boolean {
    const length = questions.length;
    questions = questions.filter((q) => q.id !== id);
    return questions.length < length;
  },

  filter(opts: { unit?: string; difficulty?: Difficulty; search?: string }): Question[] {
    let result = [...questions];
    if (opts.unit) {
      result = result.filter((q) => q.unit === opts.unit);
    }
    if (opts.difficulty) {
      result = result.filter((q) => q.difficulty === opts.difficulty);
    }
    if (opts.search) {
      const s = opts.search.toLowerCase();
      result = result.filter(
        (q) =>
          q.text.toLowerCase().includes(s) ||
          q.topic.toLowerCase().includes(s)
      );
    }
    return result;
  },

  getUnits(): string[] {
    return [...new Set(questions.map((q) => q.unit))];
  },

  getTopics(): string[] {
    return [...new Set(questions.map((q) => q.topic))];
  },
};
