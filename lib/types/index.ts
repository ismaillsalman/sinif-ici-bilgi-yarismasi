// ==========================================
// Sınıf İçi Bilgi Yarışması — Tip Tanımları
// ==========================================

export type Difficulty = 'kolay' | 'orta' | 'zor';
export type QuizStatus = 'draft' | 'active' | 'closed';
export type UserRole = 'teacher' | 'student';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  unit: string;
  topic: string;
  difficulty: Difficulty;
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questionIds: string[];
  createdAt: string;
  status: QuizStatus;
  timePerQuestion: number; // seconds
  code?: string; // lobby code for students to join
}

export interface Student {
  id: string;
  name: string;
  class: string;
  avatarColor: string;
}

export interface Teacher {
  id: string;
  name: string;
}

export interface AnsweredQuestion {
  questionId: string;
  selectedAnswerIndex: number;
  isCorrect: boolean;
  timeSpent: number; // seconds
}

export interface QuizResult {
  id: string;
  studentId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  answeredQuestions: AnsweredQuestion[];
  completedAt: string;
}

export interface TopicPerformance {
  topic: string;
  unit: string;
  totalQuestions: number;
  correctAnswers: number;
  correctRate: number; // 0-100
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  password?: string;
}
