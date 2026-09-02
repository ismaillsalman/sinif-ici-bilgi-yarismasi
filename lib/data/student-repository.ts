// ==========================================
// Student Repository — Öğrenci Veri Katmanı
// ==========================================

import { Student } from '@/lib/types';
import { mockStudents } from './mock-data';

const students = [...mockStudents];

export const studentRepository = {
  getAll(): Student[] {
    return [...students];
  },

  getById(id: string): Student | undefined {
    return students.find((s) => s.id === id);
  },

  getByName(name: string): Student | undefined {
    return students.find((s) => s.name.toLowerCase() === name.toLowerCase());
  },
};
