// ==========================================
// Quiz Repository — Quiz Veri Katmanı
// ==========================================

import { Quiz, QuizStatus } from '@/lib/types';
import { mockQuizzes } from './mock-data';

let quizzes = [...mockQuizzes];

export const quizRepository = {
  getAll(): Quiz[] {
    return [...quizzes];
  },

  getById(id: string): Quiz | undefined {
    return quizzes.find((q) => q.id === id);
  },

  getByStatus(status: QuizStatus): Quiz[] {
    return quizzes.filter((q) => q.status === status);
  },

  create(quiz: Omit<Quiz, 'id' | 'createdAt' | 'code'>): Quiz {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz${Date.now()}`,
      createdAt: new Date().toISOString(),
      code,
    };
    quizzes.push(newQuiz);
    return newQuiz;
  },

  update(id: string, data: Partial<Quiz>): Quiz | undefined {
    const index = quizzes.findIndex((q) => q.id === id);
    if (index === -1) return undefined;
    quizzes[index] = { ...quizzes[index], ...data };
    return quizzes[index];
  },

  activate(id: string): Quiz | undefined {
    return this.update(id, { status: 'active' });
  },

  close(id: string): Quiz | undefined {
    return this.update(id, { status: 'closed' });
  },

  delete(id: string): boolean {
    const length = quizzes.length;
    quizzes = quizzes.filter((q) => q.id !== id);
    return quizzes.length < length;
  },
};
