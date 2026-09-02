// ==========================================
// Result Repository — Quiz Sonuç Veri Katmanı
// ==========================================

import { QuizResult, TopicPerformance } from '@/lib/types';
import { mockResults, mockQuestions } from './mock-data';

let results = [...mockResults];

export const resultRepository = {
  getAll(): QuizResult[] {
    return [...results];
  },

  create(result: Omit<QuizResult, 'id'>): QuizResult {
    const newResult: QuizResult = {
      ...result,
      id: `r${Date.now()}`,
    };
    results.push(newResult);
    return newResult;
  },

  getByQuiz(quizId: string): QuizResult[] {
    return results.filter((r) => r.quizId === quizId);
  },

  getByStudent(studentId: string): QuizResult[] {
    return results.filter((r) => r.studentId === studentId);
  },

  getStudentTopicPerformance(studentId: string): TopicPerformance[] {
    const studentResults = this.getByStudent(studentId);
    const topicMap = new Map<string, { unit: string; total: number; correct: number }>();

    studentResults.forEach((result) => {
      result.answeredQuestions.forEach((aq) => {
        const question = mockQuestions.find((q) => q.id === aq.questionId);
        if (!question) return;
        const key = question.topic;
        const existing = topicMap.get(key) || { unit: question.unit, total: 0, correct: 0 };
        existing.total += 1;
        if (aq.isCorrect) existing.correct += 1;
        topicMap.set(key, existing);
      });
    });

    return Array.from(topicMap.entries()).map(([topic, data]) => ({
      topic,
      unit: data.unit,
      totalQuestions: data.total,
      correctAnswers: data.correct,
      correctRate: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }));
  },

  getClassTopicPerformance(): TopicPerformance[] {
    const topicMap = new Map<string, { unit: string; total: number; correct: number }>();

    results.forEach((result) => {
      result.answeredQuestions.forEach((aq) => {
        const question = mockQuestions.find((q) => q.id === aq.questionId);
        if (!question) return;
        const key = question.topic;
        const existing = topicMap.get(key) || { unit: question.unit, total: 0, correct: 0 };
        existing.total += 1;
        if (aq.isCorrect) existing.correct += 1;
        topicMap.set(key, existing);
      });
    });

    return Array.from(topicMap.entries()).map(([topic, data]) => ({
      topic,
      unit: data.unit,
      totalQuestions: data.total,
      correctAnswers: data.correct,
      correctRate: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }));
  },

  getStudentStats(studentId: string) {
    const studentResults = this.getByStudent(studentId);
    const totalQuizzes = studentResults.length;
    const totalScore = studentResults.reduce((sum, r) => sum + r.score, 0);
    const totalQuestions = studentResults.reduce((sum, r) => sum + r.totalQuestions, 0);
    const avgScore = totalQuizzes > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

    return {
      totalQuizzes,
      totalScore,
      totalQuestions,
      avgScore,
    };
  },
};
